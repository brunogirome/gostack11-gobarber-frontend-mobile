import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import enUS, { format } from 'date-fns';

import {
  Container,
  Title,
  Description,
  OkButtonText,
  OkButton,
} from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();

  const { date } = params as RouteParams;

  const handleOkPresse = useCallback(() => {
    reset({
      routes: [{ name: 'Dashboard' }],
      index: 0,
    });
  }, [reset]);

  const formattedDate = useMemo(() => {
    return format(date, "EEEE, MMMM 'the' do, yyyy 'at' h:mm a'.'", {
      locale: enUS,
    });
  }, [date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />
      <Title>Nice, appointment booked!</Title>
      <Description>{formattedDate}</Description>

      <OkButton onPress={handleOkPresse}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
