import React from 'react';
import { View, StatusBar } from 'react-native';

// import { Container } from './styles';

const src: React.FC = () => {
  return (
    <>
      <StatusBar backgroundColor="#312e38" barStyle="light-content" />
      <View style={{ backgroundColor: '#312e38', flex: 1 }} />
    </>
  );
};

export default src;
