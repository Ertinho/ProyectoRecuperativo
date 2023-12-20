import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const Home = ({ navigation }) => {
    const { isAuthenticated , logout} = useContext(AuthContext); // Access the isAuthenticated value
    
    useEffect(() => {
      // If the user is not authenticated, navigate to the Login screen
      if (!isAuthenticated) {
        navigation.navigate('Iniciar Sesión');
      }

      // Add listener for beforeRemove event
      return navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert("¡Espera!", "¿Estás seguro de que quieres cerrar sesión?", [
          {
            text: "Cancelar",
            onPress: () => null,
            style: "cancel"
          },
          { text: "SÍ", onPress: () => {
            logout();
            navigation.dispatch(e.data.action);
          }}
        ]);
      });
    }, [isAuthenticated, navigation]);

    

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to the Home Screen!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
});

export default Home;