import React, { createContext, useState, useEffect } from 'react';

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
    };


    useEffect(() => {
      // When the app starts, load the tokens from the keychain
      const loadTokens = async () => {
        try {
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            login();
          }
        } catch (error) {
        // Handle error
            console.log('Keychain couldn\'t be accessed!', error);
        }
      };
  
      loadTokens();
    }, []);
  
    return (
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
