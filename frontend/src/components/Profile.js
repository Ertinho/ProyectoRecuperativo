import React, { useContext , useState} from 'react';
import { View, Text,  Button, Alert, StyleSheet , ScrollView} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


import { AuthContext } from '../context/AuthContext'; 
import * as Keychain from 'react-native-keychain';

import axios from 'axios';
import {URL} from '../helpers/index';
const endpoint = URL;



const Profile = ({ navigation }) => {
  const {  logout  } = useContext(AuthContext); // Access the isAuthenticated value
  
  const [user, setUser] = useState({});

  useFocusEffect(
    React.useCallback(() => {
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

      return () => {};
    }, [])
  );


  return (
    <ScrollView style={styles.container}>
        <Text style={styles.title}>¡Bienvenido, {user.userName}!</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Nombre:</Text>
          <Text style={styles.info}>{user.name}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Apellido:</Text>
          <Text style={styles.info}>{user.lastName}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Habilidades:</Text>
          <Text style={styles.info}>{user.skills?.map(skill => skill.name).join(', ')}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Lenguajes de programación:</Text>
          <Text style={styles.info}>{user.programming_languages?.map(lang => lang.name).join(', ')}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Habilidades transversales:</Text>
          <Text style={styles.info}>{user.transversal_skills?.map(skill => skill.name).join(', ')}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Número de publicaciones:</Text>
          <Text style={styles.info}>{user.posts?.length}</Text>
        </View>


        <View style={styles.button}>
          <Button
            title="Editar perfil"
            onPress={() => navigation.navigate('EditProfile')} // Navigate to the EditProfile screen when the button is pressed
          />
        </View>

        <View style={styles.button}>
          <Button
          title="Cerrar sesión"
          onPress={logout}
          />
        </View>


    </ScrollView>
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
  

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center"
  },


  button:{
    marginTop: 20,
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
  },
  
  


  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',

    textAlign: 'center',
    backgroundColor: 'lightgreen',

    borderColor: 'gray', 
    borderWidth: 1,
    padding: 5, 

  },
  infoContainer: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
  },



});

export default Profile;