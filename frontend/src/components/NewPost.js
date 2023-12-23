
import React, { useState,useContext } from 'react';
import { Button, Image, TextInput, View, StyleSheet , Text, Alert,  Modal, ScrollView} from 'react-native';

import * as ImagePicker from 'react-native-image-picker';
import * as Keychain from 'react-native-keychain';
import { AuthContext } from '../context/AuthContext'; 

import axios from 'axios';
import {URL} from '../helpers/index';
const endpoint = URL;



const NewPost = ({ navigation }) => {
  const { checkCredentials } = useContext(AuthContext); // Access the checkCredentials function from the AuthContext

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState();
  const [fileType, setFileType] = useState();



  const [imageSelected, setImageSelected] = useState(false);

  const [errors, setErrors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const selectImage = () => {
    const options = {
        noData: true,
    };    
    ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            //display alert if user cancels
            Alert.alert('', 'No se seleccionó ninguna imágen.');
        } else if (response.error) {
            //display alert if there's an error
            Alert.alert('Error', 'Hubo un error al seleccionar la imágen.');
        } else {
            const source = { uri: response.assets[0].uri };
            
            setImage(source.uri); // set image state here
            setFileName(response.assets[0].fileName);
            setFileType(response.assets[0].type);

            

            setImageSelected(true);

        }
        setImageSelected(false);
    });
  };



  
  const submitPost = async () => {
    // Check credentials before making the request to the backend
    const credentialsAreValid = await checkCredentials();
    if (!credentialsAreValid) {
      return;
    }

    // Get the credentials from the keychain
    const credentials = await Keychain.getGenericPassword();
    const accessToken = credentials.username;

    let imageResponse = null;
    // Create the new post
    try {
        let imageFormData = new FormData();
        if (image && image.uri) {
            let imageFile = {
                uri: Platform.OS === 'android' ? image.uri.replace('file://', '') : image.uri, //quitar el prefijo file:// en android
                type: fileType, // or image/png, etc.
                name: fileName, // or .png, etc.
            };
            imageFormData.append('image', imageFile);
        } else {
            // Handle the case where image or image.uri is undefined
            // You might want to show an error message to the user here
            Alert.alert('Error', 'No se seleccionó ninguna imágen.');
            return;
        }


        imageResponse = await axios.post(`${endpoint}upload`, imageFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (imageResponse.status === 200)
        {
            Alert.alert( 'Imagen subida correctamente');
        }

        let postFormData = new FormData();
        postFormData.append('title', title);
        postFormData.append('description', description);




        if (imageResponse && imageResponse.data && imageResponse.data.url) {
            postFormData.append('pathPhoto', imageResponse.data.url);
        } else {
            // Handle the case where imageResponse or imageResponse.data or imageResponse.data.url is undefined
            // If there's no image, send an empty string
            postFormData.append('pathPhoto', '');
        }

        const postResponse = await axios.post(`${endpoint}createPost`, postFormData , {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`,
            }
        });
        if (postResponse.status === 200)
        {
            //obtain the response message from the backend
            let successMessage = postResponse.data.message;
            Alert.alert( successMessage);
            // If the post was created successfully, navigate to the home screen
            navigation.navigate('Home');
        }
    } catch (error) {
        console.log(error); // Add this line
        
        let errorMessages = [];
        // If the error response has data and errors, use it

        // If the error response has data and errors, use it
        if (error.response && error.response.data && error.response.data.errors) {
            errorMessages = Object.values(error.response.data.errors).flat();
        }


        // If the error has a status code of 401, it means the user is unauthorized
        // If the user is unauthorized, show a different alert
        if (error.response && error.response.status === 401) {
            errorMessages.push('No autorizado.');
        }


         // If the error has a status code of 500, it means there's a server error
        // If there's a server error, show a different alert
        if (error.response && error.response.status === 500) {
            // The error response from the backend includes a message and error
            let errorMessage1 = error.response.data.message;
            let errorMessage2 = error.response.data.error;
            // If the error response has a message and error, use it
            if (errorMessage1 && errorMessage2) {
                errorMessages.push(errorMessage1, errorMessage2);
            }
        }

        // If no error messages were set, add a general error message
        if (errorMessages.length === 0) {
            errorMessages.push('An error occurred. Please try again.');
        }


        Alert.alert( errorMessages.join('\n'));
        //setErrors(errorMessages);
        //setModalVisible(true);
    }

    // Navigate back to the home screen
    // navigation.goBack();
  };










  return (
    <View style={styles.container}>
        <Text style={styles.title}>Nueva Publicación</Text>

      <Button title="Selecciona una imágen" onPress={selectImage} />
      {/* {image && <Image source={image} style={{ width: 200, height: 200 }} />} */}
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      {/* {image && <Image source={{ uri: image }} style={styles.image} />} */}
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} multiline />
      <Button title="Submit Post" onPress={submitPost} />


      <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
            >
                <View >
                    <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Tienes los siguientes mensajes:</Text>
                    <ScrollView>
                        {errors.map((error, index) => (
                        <Text key={index}>{error}</Text>
                        ))}
                    </ScrollView>
                    <Button
                        title="Cerrar"
                        onPress={() => setModalVisible(!modalVisible)}
                    />
                    </View>
                </View>
            </Modal>





    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center"
  },





});

export default NewPost;