import React, { useContext , useState, useEffect} from 'react';
import { View, Text,  Button, Alert } from 'react-native';

import { AuthContext } from '../context/AuthContext'; 
import * as Keychain from 'react-native-keychain';

import axios from 'axios';
import {URL} from '../helpers/index';
const endpoint = URL;



const Profile = ({ navigation }) => {
  const {  logout  } = useContext(AuthContext); // Access the isAuthenticated value
  
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        return;
      }
      const accessToken = credentials.username;

      try {
        const response = await axios.get(`${endpoint}profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setUser(response.data);
      } catch (error) {
        //handle error messages from backend
        let errorMessage = 'No se pudieron recuperar los datos del usuario.';
        
        // If the error has a status code of 401, it means the user is unauthorized
        // If the user is unauthorized, show a different alert
        if (error.response && error.response.status === 401) {
          errorMessage = 'No autorizado.';
        }

        // If the error has a status code of 500, it means there's a server error
        // If there's a server error, show a different alert
        if (error.response && error.response.status === 500) {
          errorMessage = 'Error del servidor.';
          // The error response from the backend includes a message and error
          let errorMessage2 = error.response.data.error;
          if ( errorMessage2) {
            errorMessage = `\n${errorMessage2}`;
          }
        }

        Alert.alert('Error', errorMessage);
      }
    };

    fetchUserData();
  }, []);
  


  return (
    <View>
        <Text>¡Bienvenido, {user.userName}!</Text>

        <Text>Nombre: {user.name}</Text>
        <Text>Apellido:  {user.lastName} </Text>
        <Text>Habilidades: {user.skills?.map(skill => skill.name).join(', ')}</Text>
        <Text>Lenguajes de programación: {user.programming_languages?.map(lang => lang.name).join(', ')}</Text>
        <Text>Habilidades transversales: {user.transversal_skills?.map(skill => skill.name).join(', ')}</Text>
        <Text>Número de publicaciones: {user.posts?.length}</Text>

        <Button
          title="Editar perfil"
          onPress={() => navigation.navigate('EditProfile')} // Navigate to the EditProfile screen when the button is pressed
        />




        <Button
        title="Cerrar sesión"
        onPress={logout}
        />

    </View>
  );
};

export default Profile;