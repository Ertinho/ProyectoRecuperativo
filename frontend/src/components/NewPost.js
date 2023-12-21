
import React, { useState, useEffect } from 'react';
import { Button, Image, TextInput, View, StyleSheet , Text,} from 'react-native';

import * as ImagePicker from 'react-native-image-picker';

const NewPost = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);


  const selectImage = () => {
    const options = {
        noData: true,
    };    
    ImagePicker.launchImageLibrary(options, (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            const source = { uri: response.assets[0].uri };
            setImage(source.uri); // set image state here
            console.log(image)
            
            
        }
        console.log(response);  
    });
  };

  const submitPost = async () => {
    // Fetch the username using the token
    // const username = ...

    // Create the new post
    // await axios.post(`${endpoint}posts`, { title, description, image, username }, { headers: { Authorization: `Bearer ${accessToken}` } });

    // Navigate back to the home screen
    // navigation.goBack();
  };



  useEffect(() => {
    console.log(image);
  }, [image]);








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
});

export default NewPost;