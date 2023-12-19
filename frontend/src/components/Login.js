import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet} from 'react-native';

import * as Keychain from 'react-native-keychain';


import axios from 'axios';
import {URL} from '../helpers/index';
const endpoint = URL;


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${endpoint}login`, {
        email: email,
        password: password,
      });
  
      if (response.status === 200) {
        const { access_token, expires_in } = response.data;
        const expirationTime = (Date.now() / 1000 + expires_in).toString();
  
        // Store the token and expiration time in the keychain
        await Keychain.setGenericPassword(access_token, expirationTime);
  
        // If login is successful, navigate to the Home screen
        navigation.navigate('Home');
      } else {
        // If login is unsuccessful, alert the error message
        Alert.alert(response.data.message);
      }
    } catch (error) {
      // Handle the error here
      let errorMessage = 'Hubo un error al iniciar sesión';
      
      // If the error response has data and a message, use it
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
  
      Alert.alert(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder={'Ingrese su correo electrónico'}
      />
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder={'Ingrese su contraseña'}
        secureTextEntry={true}
      />
      <Button
        title={'Iniciar Sesión'}
        onPress={handleLogin}
      />
      <Button
        title={'Registrarse'}
        onPress={() => navigation.navigate('Registrarse')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b2d8d8', // light blue
    
  },
  label: {
    fontSize: 18,
    color: '#333',
    //marginBottom: 10,
    //marginTop: 10,
    textAlign: 'center',
    backgroundColor: 'lightgreen',

    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 5, 
    padding: 5, 
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    //marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: '#f2f2f2', // light gray
  },
  
});






export default Login;