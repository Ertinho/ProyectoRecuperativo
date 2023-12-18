import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

import axios from 'axios';
import {URL} from './src/helpers/index';
const endpoint = URL;



const Register = ({ navigation }) => {

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const languages = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'c++' },
    { label: 'Ruby', value: 'ruby' },
  ];


  const handleRegister = async () => {
    
    const response = await axios.post(`${endpoint}/register`, {
      userName: username,
      password: password,
      name: name,
      lastName: lastName,
      birthDate: birthdate,
      email: email,

    })
    .then(res => {
      // Handle the response here
      Alert.alert('Registro exitoso');
    })
    .catch(error => {
      // Handle the error here
      let errorMessage = 'Registro fallido';
      
      // If the error response has data and a message, use it
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }

      Alert.alert(errorMessage);
    });


  };

  return (
    <View>
      
      <TextInput
        placeholder="Nombre"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        placeholder="Apellido"
        onChangeText={setLastName}
        value={lastName}
      />
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder={'Nombre de usuario'}
      />
      <TextInput
        placeholder="Cumpleaños"
        onChangeText={setBirthdate}
        value={birthdate}
      />
      <TextInput
        placeholder="Correo electrónico"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={'Contraseña'}
        secureTextEntry={true}
      />
      
      <Button
        title={'Registrar'}
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