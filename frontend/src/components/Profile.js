import React, { useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import AuthContext from '../context/AuthContext'; 
import { isTokenExpiring } from '../authUtils'; // Import the isTokenExpiring function
import { refreshTokenFunc } from '../authUtils';


const Profile = ({ navigation }) => {
  const { token, refreshToken, setToken } = useContext(AuthContext); // Access the token and setToken function from the AuthContext

  useEffect(() => {
    if (isTokenExpiring(token)) {
      Alert.alert(
        'Session Expiring',
        'Your session is about to expire. Do you want to extend it?',
        [
          { text: 'No', onPress: () => setToken(null) }, // If the user says No, clear the token
          { text: 'Yes', onPress: () => refreshTokenFunc(refreshToken, setToken) }, // If the user says Yes, refresh the token
        ],
      );
    }
  }, [token, refreshToken, setToken]);


  return (
    <View>
      <Text>Welcome to the Profile Screen!</Text>
    </View>
  );
};

export default Profile;