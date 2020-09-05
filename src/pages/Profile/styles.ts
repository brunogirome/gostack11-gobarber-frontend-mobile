import styled from 'styled-components/native';
import { Platform } from 'react-native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  position: relative;

  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 0;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  width: 186px;
  margin-top: 48px;
  align-self: center;
`;

export const BackButton = styled.TouchableOpacity`
  justify-content: flex-start;
  padding-top: 48px;
`;

export const AvatarContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const AuxCenterAvatarImage = styled.View`
  width: 24px;
`;

export const CameraIconConainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 12px;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: #ff9000;
  position: absolute;
  right: 0;
  bottom: 0;
`;
