
import React, { useState,useContext } from 'react';
import { 
    Button, 
    Image, 
    TextInput, 
    View, 
    StyleSheet, 
    Text, 
    Alert,  
    Modal, 
    ScrollView, 
    Platform
} from 'react-native';

import ImageResizer from '@bam.tech/react-native-image-resizer';
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
                //const source = { uri: response.assets[0].uri };
                const source = { uri: response.assets[0] };
                //console.log(source);
                console.log(source.uri);
                console.log(response.assets[0].type);
                console.log(response.assets[0].fileName);

                setImage(source.uri); // set image state here
                setFileName(response.assets[0].fileName);
                setFileType(response.assets[0].type);

            }
            
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

        try {
            
            let postFormData = new FormData();
            postFormData.append('title', title);
            postFormData.append('description', description);

            if (image ) {
                ImageResizer.createResizedImage(image.uri, 800, 600, 'JPEG', 90)
                .then((resizedImageUri) => {
                    let imageFile = {
                        uri: resizedImageUri.uri,
                        type: 'JPEG',
                        name: resizedImageUri.name,
                    };
                    postFormData.append('image', imageFile);
                })
                .catch((err) => {
                    console.log(err);
                    return Alert.alert('Unable to resize the photo', 'Check the console for full the error message');
                });

                /*
                let imageFile = {
                    
                    uri: image.uri,
                    type: fileType,
                    name: fileName,
                };
                postFormData.append('image', imageFile);*/
                //postFormData.append('image', image);
            } else {
                Alert.alert('Error', 'No se seleccionó ninguna imágen.');
                return;
            }

            const postResponse = await axios.post(`${endpoint}createPost`, postFormData , {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            if (postResponse.status === 200)
            {
                let successMessage = postResponse.data.message;
                Alert.alert(successMessage);
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


            //Alert.alert( errorMessages.join('\n'));
            setErrors(errorMessages);
            setModalVisible(true);
        }

        // Navigate back to the home screen
        // navigation.goBack();
    };










  return (
    <View style={styles.container}>
        <Text style={styles.title}>Nueva Publicación</Text>

      <Button title="Selecciona una imágen" onPress={selectImage} />
      {/* {image && <Image source={image} style={{ width: 200, height: 200 }} />} */}
    {/* //   {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}
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