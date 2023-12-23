
import * as Keychain from 'react-native-keychain';

import axios from 'axios';
import {URL} from './helpers/index';
const endpoint = URL;

export async function isTokenExpiring() {
    const credentials = await Keychain.getGenericPassword();
    if (!credentials) {
      return false;
    }
  
    const tokenExpiration = Number(credentials.password); // Convert to number

    // Get the current time
    const currentTime = Date.now() / 1000;
  
    // If the token is expiring in the next 10 minutes, return true
    // Otherwise, return false.
    if (tokenExpiration - currentTime <= 600) {
      console.log('Token is expiring soon. Refresh it!');
      return true;
    } else {
      console.log('Token is still valid.');
      return false;
    }
}




export async function refreshTokenFunc() {
    const credentials = await Keychain.getGenericPassword();
    if (!credentials) {
      return;
    }
  
    const accessToken = credentials.username;
  
    try {
      const response = await axios.get(`${endpoint}refresh`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
      });
  
      if (response.status === 200) {
        const { access_token, expires_in } = response.data;
        const expirationTime = (Date.now() / 1000 + expires_in).toString();
  
        // Store the new token and expiration time in the keychain
        await Keychain.setGenericPassword(access_token, expirationTime);
      }
    } catch (error) {
      // Handle the error here
      // If the error is due to an invalid token, we log the user out.
      if (error.response.status === 400) {
        // Show an alert to the user
        Alert.alert('Error', 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.');

        await logout();
      }

      // if the error is due to server being down, show the error message
      if (error.response.status === 500) {
        //console.error(error.response.data.message);
        // if the error has a message and error, show it
        if (error.response.data.error && error.response.data.message) {
          console.error(error.response.data.error);
          console.error(error.response.data.message);
        }else{
          console.error(error.response.data);
        }

      }

      // show an error message
      console.error(error);
    }
}

