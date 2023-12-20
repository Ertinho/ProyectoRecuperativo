import React, { useContext, useEffect } from 'react';
import { View, Text, Alert, Button } from 'react-native';

import { AuthContext } from '../context/AuthContext'; 
import { isTokenExpiring } from '../authUtils'; // Import the isTokenExpiring function
import { refreshTokenFunc } from '../authUtils';


const Profile = ({ navigation }) => {
    const { isAuthenticated, logout  } = useContext(AuthContext); // Access the isAuthenticated value
    

    useEffect(() => {
        // If the user is not authenticated, navigate to the Login screen
        if (!isAuthenticated) {
          logout();
          navigation.navigate('Iniciar Sesión');
        }
    }, [isAuthenticated, navigation]);

  useEffect(() => {
    if (isTokenExpiring()) {
      Alert.alert(
        'Sesión vencida',
        'Su sesión está a punto de caducar. ¿Quieres ampliarlo?',
        [
          { text: 'No', onPress: () => logout() }, // If the user says No, log them out
          { text: 'Sí', onPress: () => refreshTokenFunc() }, // If the user says Yes, refresh the token
        ],
      );
    }
  }, []);


  return (
    <View>
        <Text>Welcome to the Profile Screen!</Text>

        <Button
        title="Cerrar sesión"
        onPress={logout}
        />

    </View>
  );
};

export default Profile;