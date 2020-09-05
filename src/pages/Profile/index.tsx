import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import ImagePicker from 'react-native-image-picker';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
  AvatarContainer,
  AuxCenterAvatarImage,
  CameraIconConainer,
} from './styles';

interface UpdateProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const SignUp: React.FC = () => {
  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);

  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(
    async (data: UpdateProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          email: Yup.string()
            .required('Email is required')
            .email('Use a valid mail'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('New password required'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('New password confirmation required'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('password'), undefined],
              'The new password must match',
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? { old_password, password, password_confirmation }
            : null),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        navigation.goBack();

        Alert.alert('Profile update sucess!');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Profile update error',
          'Could not update your data, check the credentials',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleUpdateVatar = useCallback(() => {
    ImagePicker.showImagePicker(
      {
        title: 'Select your avatar',
        cancelButtonTitle: 'Cancel',
        takePhotoButtonTitle: 'Use camera',
        chooseFromLibraryButtonTitle: 'Pick from gallery',
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.error) {
          Alert.alert('Error while updating avatar');
          return;
        }

        const data = new FormData();

        data.append('avatar', {
          type: 'image/jpeg',
          name: `${user.id}jpg`,
          uri: response.uri,
        });

        api.patch('/users/avatar', data).then(updateResponse => {
          updateUser(updateResponse.data);
        });
      },
    );
  }, [updateUser, user.id]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Container>
              <AvatarContainer>
                <BackButton onPress={handleGoBack}>
                  <Icon name="chevron-left" size={24} color="#999591" />
                </BackButton>

                <UserAvatarButton onPress={handleUpdateVatar}>
                  <UserAvatar source={{ uri: user.avatar_url }} />
                  <CameraIconConainer>
                    <Icon name="camera" size={24} color="#312e38" />
                  </CameraIconConainer>
                </UserAvatarButton>

                <AuxCenterAvatarImage />
              </AvatarContainer>

              <View>
                <Title>My profile</Title>
              </View>
              <Form
                initialData={user}
                ref={formRef}
                onSubmit={handleSignUp}
                style={{ width: '100%' }}
              >
                <Input
                  autoCapitalize="words"
                  name="name"
                  icon="user"
                  placeholder="Your name"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    formRef.current?.submitForm();
                    emailInputRef.current?.focus();
                  }}
                />
                <Input
                  ref={emailInputRef}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  name="email"
                  icon="mail"
                  placeholder="E-mail"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    formRef.current?.submitForm();
                    oldPasswordInputRef.current?.focus();
                  }}
                />
                <Input
                  ref={oldPasswordInputRef}
                  secureTextEntry
                  containerStyle={{ marginTop: 16 }}
                  textContentType="newPassword"
                  name="old_password"
                  icon="lock"
                  placeholder="Current password"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                />

                <Input
                  ref={passwordInputRef}
                  secureTextEntry
                  textContentType="newPassword"
                  name="password"
                  icon="lock"
                  placeholder="New password"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    confirmPasswordInputRef.current?.focus()
                  }
                />

                <Input
                  ref={confirmPasswordInputRef}
                  secureTextEntry
                  textContentType="newPassword"
                  name="password_confirmation"
                  icon="lock"
                  placeholder="Confirm new password"
                  returnKeyType="send"
                  onSubmitEditing={() => formRef.current?.submitForm()}
                />

                <Button onPress={() => formRef.current?.submitForm()}>
                  Confirm changes
                </Button>
              </Form>
            </Container>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
