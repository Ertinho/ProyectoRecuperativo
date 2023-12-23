import React, { useState, useContext } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  Alert, 
  Text, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import * as Keychain from 'react-native-keychain';
import { AuthContext } from '../context/AuthContext';

import axios from 'axios';
import {URL} from '../helpers/index';
const endpoint = URL;


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const { login } = useContext(AuthContext);


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
        login();
        navigation.navigate('Main');
      } 

    } catch (error) {
      //handle error messages from backend
      let errorMessage = 'Inicio de sesión fallido.';
      // If the error response has data and errors, use it
      if (error.response && error.response.data && error.response.data.errors) {
        errorMessage = Object.values(error.response.data.errors).join('\n');
      }

      // If the error has a status code of 401, it means the user is unauthorized
      // If the user is unauthorized, show a different alert
      if (error.response && error.response.status === 401) {
        errorMessage = 'Correo electrónico o contraseña incorrectos.';
      }

      // If the error has a status code of 500, it means there's a server error
      // If there's a server error, show a different alert
      if (error.response && error.response.status === 500) {
        errorMessage = 'Error del servidor.';
        // The error response from the backend includes a message and error
        let errorMessage1 = error.response.data.message;
        let errorMessage2 = error.response.data.error;
        // If the error response has a message and error, use it
        if (error.response.data.message && error.response.data.error) {
          errorMessage = errorMessage1 + '. ' + errorMessage2;
        }
      }

      Alert.alert(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder={'Ingrese su correo electrónico'}
        inputMode={'email'}
      />
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder={'Ingrese su contraseña'}
        secureTextEntry={hidePassword}
      />
      <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}
        style={styles.iconRow}
      >
        <Icon name={hidePassword ? 'eye-off' : 'eye'} size={24} color="black" />
        <Text style={styles.iconText}>{hidePassword ? 'Mostrar contraseña' : 'Ocultar la contraseña'}</Text>
      </TouchableOpacity>


      <View style={styles.button}>
        <Button
          title={'Iniciar Sesión'}
          onPress={handleLogin}
        />
      </View>
      <View style={styles.button}>
        <Button
          title={'Registrarse'}
          onPress={() => navigation.navigate('Registrarse')}
        />
      </View>
      
      
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
    textAlign: 'center',
    backgroundColor: 'lightgreen',

    borderColor: 'gray', 
    borderWidth: 1, 
    
    padding: 10, 
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    
    paddingLeft: 10,
    backgroundColor: '#f2f2f2', // light gray
  },
  

  button:{
    marginVertical: 10,
  },

  iconText:{
    'fontSize': 15,
    'fontWeight': 'bold',
    'marginHorizontal': 10,
    'marginVertical': 10,    
  },

  iconRow:{
    'flexDirection': 'row',
    'justifyContent': 'center',
    'alignItems': 'center',
    'marginTop': 10,
  },


});



export default Login;