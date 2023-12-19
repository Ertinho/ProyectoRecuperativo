import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated } = useContext(AuthContext); // Access the isAuthenticated value
    // If the user is not authenticated, return null or redirect to the login screen
    if (!isAuthenticated) {
        return null; // Or navigation.navigate('Login');
    }
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