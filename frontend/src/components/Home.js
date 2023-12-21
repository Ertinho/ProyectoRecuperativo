import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, FlatList , Image} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

import * as Keychain from 'react-native-keychain';


import axios from 'axios';
import {URL} from '../helpers/index';
const endpoint = URL;




const Home = ({ navigation }) => {
    const { isAuthenticated , logout} = useContext(AuthContext); // Access the isAuthenticated value
    
    useEffect(() => {
      // If the user is not authenticated, navigate to the Login screen
      if (!isAuthenticated) {
        navigation.navigate('Iniciar Sesión');
      }

      // Add listener for beforeRemove event
      return navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert("¡Espera!", "¿Estás seguro de que quieres cerrar sesión?", [
          {
            text: "Cancelar",
            onPress: () => null,
            style: "cancel"
          },
          { text: "SÍ", onPress: () => {
            logout();
            navigation.dispatch(e.data.action);
          }}
        ]);
      });
    }, [isAuthenticated, navigation]);

    

    const [posts, setPosts] = useState([]);

    useFocusEffect(
      React.useCallback(() => {
        const fetchPosts = async () => {
          const credentials = await Keychain.getGenericPassword();
          if (!credentials) {
              return;
          }
          const accessToken = credentials.username;

          try {
            const response = await axios.get(`${endpoint}posts`, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
            setPosts(response.data);
          } catch (error) {
            //handle error messages from backend
            let errorMessage = 'No se pudieron recuperar los datos del usuario.';
            
            // If the error has a status code of 401, it means the user is unauthorized
            // If the user is unauthorized, show a different alert
            if (error.response && error.response.status === 401) {
              errorMessage = 'No autorizado.';
            }

            // If the error has a status code of 500, it means there's a server error
            // If there's a server error, show a different alert
            if (error.response && error.response.status === 500) {
              errorMessage = 'Error del servidor.';
              // The error response from the backend includes a message and error
              let errorMessage2 = error.response.data.error;
              if ( errorMessage2) {
                errorMessage = `\n${errorMessage2}`;
              }
            }
            Alert.alert('Error', errorMessage);
          }
        };
    
        fetchPosts();
      }, [])
    );



    const likePost = async (postId) => {
      // Implement the logic for liking a post here
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
        return;
      }

      try {
        const response = await axios.post(`${endpoint}posts/${postId}/like`,  {
          liked: true,
          post_id: postId,
        },  {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
    
        if (response.status === 200) {
          // Post was liked successfully
          // You might want to update your local state here to include the new like
        }
      } catch (error) {
        console.error('Failed to like post:', error);
      }

    };
    
    const viewComments = (postId) => {
      // Implement the logic for viewing comments here
    };
    


    const addComment = async (postId, text) => {
      const credentials = await Keychain.getGenericPassword();
      if (!credentials) {
          return;
      }
      const accessToken = credentials.username;

      // Implement the logic for adding a comment here
      try {
        const response = await axios.post(`${endpoint}posts/${postId}/comments`, {
          text: text,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
    
        if (response.status === 200) {
          // Comment was added successfully
          // You might want to update your local state here to include the new comment
        }
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    };






    return (
        <View style={styles.container}>

            <FlatList
              data={posts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.post}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Image source={{ uri: item.image }} style={styles.image} />
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.author}>Publicado por {item.username}</Text>


                  <View style={styles.interactions}>
                    <Button title={`Like (${item.likesCount})`} onPress={() => likePost(item.id)} />
                    <Button title={`Comments (${item.commentsCount})`} onPress={() => viewComments(item.id)} />
                  </View>
                  <TextInput placeholder="Leave a comment" onSubmitEditing={({ text }) => addComment(item.id, text)} />

                </View>
              )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  post: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
  },
  author: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },

  interactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },


});

export default Home;