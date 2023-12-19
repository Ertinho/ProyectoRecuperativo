import React, { createContext, useState, useEffect } from 'react';
import * as Keychain from 'react-native-keychain';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);

    useEffect(() => {
      // When the app starts, load the tokens from the keychain
      const loadTokens = async () => {
        try {
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            setToken(credentials.username);
            setRefreshToken(credentials.password);
          } else {
            setToken(null);
            setRefreshToken(null);
          }
        } catch (error) {
        // Handle error
            console.log('Keychain couldn\'t be accessed!', error);
        }
      };
  
      loadTokens();

    }, []);
  
    return (
      <AuthContext.Provider value={{ token, refreshToken, setToken, setRefreshToken, isAuthenticated, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
