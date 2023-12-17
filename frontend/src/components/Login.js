import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Here you can handle the login logic (e.g., validation, API calls, etc.)
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
      <Button
        title={'Login'}
        onPress={handleLogin}
      />
      <Button
        title={'Go to Register'}
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
};

export default Login;