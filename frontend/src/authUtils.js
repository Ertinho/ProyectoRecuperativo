
import * as Keychain from 'react-native-keychain';

import axios from 'axios';
import {URL} from '../helpers/index';
const endpoint = URL;

export async function isTokenExpiring() {
    const credentials = await Keychain.getGenericPassword();
    if (!credentials) {
      return false;
    }
  
    const tokenExpiration = credentials.password;


    // Get the current time
    // Divide by 1000 because JS works in milliseconds instead of seconds
    const currentTime = Date.now() / 1000;
  
    // If the token is expiring in the next 2 hours, return true
    // Otherwise, return false.
    return (tokenExpiration - currentTime < 60 * 1);
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
      console.error(error);
    }
}

