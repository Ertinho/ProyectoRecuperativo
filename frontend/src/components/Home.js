import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useContext(AuthContext); // Access the isAuthenticated value
    
    useEffect(() => {
        // If the user is not authenticated, navigate to the Login screen
        if (!isAuthenticated) {
          navigation.navigate('Iniciar Sesión');
        }
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