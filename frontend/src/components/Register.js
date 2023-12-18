import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

import {URL} from './src/helpers/index';
const endpoint = URL;



const Register = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    // Here you can handle the registration logic (e.g., validation, API calls, etc.)
    Alert.alert(`Username: ${username}, Password: ${password}`);
  };

  return (
    <View>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder={'Username'}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={'Password'}
        secureTextEntry={true}
      />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder={'Confirm Password'}
        secureTextEntry={true}
      />
      <Button
        title={'Register'}
        onPress={handleRegister}
      />
      <Button
        title={'Go to Login'}
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default Register;