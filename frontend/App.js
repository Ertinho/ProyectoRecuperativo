import React from 'react';

import { AuthProvider } from './src/context/AuthContext';

import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';


import Login from './src/components/Login'; 
import Register from './src/components/Register';



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
          <Stack.Screen name="Main" component={BottomTabNavigator} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
