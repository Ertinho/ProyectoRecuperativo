import React, { createContext, useState, useEffect } from 'react';

import { isTokenExpiring, refreshTokenFunc } from '../authUtils'; // Import the necessary functions

import * as Keychain from 'react-native-keychain';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    
  const logout = async () => {
    // Clear the token from the keychain
    await Keychain.resetGenericPassword();
    // After logging out, set the authentication state to false
    setIsAuthenticated(false);
  };



  const login = async () => {
    // After logging in, set the authentication state to true
    setIsAuthenticated(true);

    // Check if the token is expiring
    const isExpiring = await isTokenExpiring();
    if (isExpiring) {
      // If the token is expiring, refresh it
      await refreshTokenFunc();
    }
  };




  // Function to check credentials before the user makes a request to the backend
  const checkCredentials = async () => {
    // Get the credentials from the keychain
    const credentials = await Keychain.getGenericPassword();
    if (!credentials) {
      return false;
    }
  
    // If the token has expired, refresh it
    const isExpiring = await isTokenExpiring();
    if (isExpiring) {
      await refreshTokenFunc();
    }
    
    return true;
  };






  useEffect(() => {
    // When the app starts, load the tokens from the keychain
    const loadTokens = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();

        if (credentials) {
          await login();
        }
        
      } catch (error) {
      // Handle error
          console.log('Keychain couldn\'t be accessed!', error);
      }
    };

    loadTokens();

    // Set up an interval to check the token expiration every 5 minutes
    const intervalId = setInterval(async () => {
      if (isAuthenticated) {
        const isExpiring = await isTokenExpiring();
        if (isExpiring) {
          await refreshTokenFunc();
        }
      }
    }, 300000); // 300000 milliseconds = 5 minutes

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [isAuthenticated]); // Add isAuthenticated as a dependency
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout, checkCredentials }}>
        {children}
      </AuthContext.Provider>
    );
  };
