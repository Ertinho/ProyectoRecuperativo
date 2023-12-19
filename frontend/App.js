import React from 'react';

import { AuthProvider } from './src/context/AuthContext';

import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Login from './src/components/Login'; 
import Register from './src/components/Register';
import Home from './src/components/Home';
import Profile from './src/components/Profile';


const Stack = createStackNavigator();

const App = () => {
  
  return (
    <AuthProvider >
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Iniciar Sesión" component={Login} />
          <Stack.Screen name="Registrarse" component={Register} />
          <Stack.Screen name="Home" component={Home} /> 
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
