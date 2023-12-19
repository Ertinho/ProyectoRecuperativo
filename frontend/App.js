import React from 'react';
import {
  View,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Login from './src/components/Login'; 
import Register from './src/components/Register';
import Home from './src/components/Home';


const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Iniciar Sesión" component={Login} />
        <Stack.Screen name="Registrarse" component={Register} />
        <Stack.Screen name="Home" component={Home} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};




export default App;
