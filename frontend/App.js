import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from './src/context/AuthContext';

import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Login from './src/components/Login'; 
import Register from './src/components/Register';
import Home from './src/components/Home';


const Stack = createStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async () => {
    // After logging in, set the authentication state to true
    setIsAuthenticated(true);
    // Also store the authentication state in AsyncStorage
    await AsyncStorage.setItem('isAuthenticated', 'true');
  };

  const logout = async () => {
    // After logging out, set the authentication state to false
    setIsAuthenticated(false);
    // Also remove the authentication state from AsyncStorage
    await AsyncStorage.removeItem('isAuthenticated');
  };

  useEffect(() => {
    // On app startup, check if the user is already authenticated
    const checkAuthentication = async () => {
      const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');
      setIsAuthenticated(isAuthenticated === 'true');
    };

    checkAuthentication();
  }, []);

  return (



    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Iniciar Sesión" component={Login} />
          <Stack.Screen name="Registrarse" component={Register} />
          <Stack.Screen name="Home" component={Home} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
