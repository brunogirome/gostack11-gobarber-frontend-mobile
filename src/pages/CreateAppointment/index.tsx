import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { format } from 'date-fns';
import { useRoute, useNavigation } from '@react-navigation/native';

import DateTimePicker from '@react-native-community/datetimepicker';

import api from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickButton,
  OpenDatePickButtonText,
  Schedule,
  Section,
  SectionTitle,
  HourText,
  Hour,
  SectionContent,
  Content,
} from './styles';

import { useAuth } from '../../hooks/auth';

interface RouteParams {
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
}

interface AvailabilityItem {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();

  const routeParams = route.params as RouteParams;

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHour, setSelectedHour] = useState(0);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
      });
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
      if (date) setSelectedDate(date);
      setSelectedHour(0);
    },
    [],
  );

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormattaed: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  const afaternoonAvailabilty = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormattaed: format(new Date().setHours(hour), 'HH:00'),
        };
      });
  }, [availability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Barbers</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>
      <Content>
        <ProvidersListContainer>
          <ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(provider.id)}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar source={{ uri: provider.avatar_url }} />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Select date</Title>
          <OpenDatePickButton onPress={handleToggleDatePicker}>
            <OpenDatePickButtonText>Select other date</OpenDatePickButtonText>
          </OpenDatePickButton>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              value={selectedDate}
              onChange={handleDateChanged}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Pick a time</Title>

          <Section>
            <SectionTitle>Morning</SectionTitle>
            <SectionContent>
              {morningAvailability.map(
                ({ hour, hourFormattaed, available }) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour}
                    available={available}
                    key={hourFormattaed}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText selected={selectedHour === hour}>
                      {hourFormattaed}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>

            <SectionTitle>Afternoon</SectionTitle>
            <SectionContent>
              {afaternoonAvailabilty.map(
                ({ hour, hourFormattaed, available }) => (
                  <Hour
                    enabled={available}
                    selected={selectedHour === hour}
                    available={available}
                    key={hourFormattaed}
                    onPress={() => handleSelectHour(hour)}
                  >
                    <HourText selected={selectedHour === hour}>
                      {hourFormattaed}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
