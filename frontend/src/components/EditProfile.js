import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Modal, 
  Alert, 
  ScrollView, 
  StyleSheet
} from 'react-native';

import BouncyCheckbox from "react-native-bouncy-checkbox";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import { AuthContext } from '../context/AuthContext'; 
import * as Keychain from 'react-native-keychain';


import axios from 'axios';
import {URL} from '../helpers/index';
const endpoint = URL;


const EditProfile = ({ navigation }) => {
  const { checkCredentials } = useContext(AuthContext); // Access the checkCredentials function from the AuthContext


  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState([]);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthDate] = useState('');


  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const languages = ['JavaScript', 'Python', 'Java', 'C++', 'Ruby'];
  
  const handleLanguageSelect = (value) => {
    if (selectedLanguages.includes(value)) {
      setSelectedLanguages(selectedLanguages.filter(lang => lang !== value));
    } else {
      setSelectedLanguages([...selectedLanguages, value]);
    }
  };

  const [selectedTransversalSkills, setSelectedTransversalSkills] = useState([]);
  const transversalSkills = ['Proactividad', 'Creatividad', 'Tolerancia a cambios', 'Comunicación', 'Trabajo en equipo', 'Resolución de problemas', 'Gestión del tiempo', 'Adaptabilidad'];
  
  const handleTransversalSkillSelect = (value) => {
    if (selectedTransversalSkills.includes(value)) {
      setSelectedTransversalSkills(selectedTransversalSkills.filter(transversalSkill => transversalSkill !== value));
    } else {
      setSelectedTransversalSkills([...selectedTransversalSkills, value]);
    }
  };

  const [selectedGeneralSkills, setSelectedGeneralSkills] = useState([]);
  const generalSkills = ['Desarrollo de aplicaciones móviles', 'Desarrollador Front-End', 'Desarrollador Back-End', 'Diseñador UI/UX', 'Desarrollador de videojuegos', 'Desarrollador de sistemas integrados', 'Diseñador web', 'Analizador de sistemas', 'Arquitecto de software' , 'Ingeniero de Aseguramiento de Calidad (QA)'];
  const handleGeneralSkillSelect = (value) => {
    if (selectedGeneralSkills.includes(value)) {
      setSelectedGeneralSkills(selectedGeneralSkills.filter(skill => skill !== value));
    } else {
      setSelectedGeneralSkills([...selectedGeneralSkills, value]);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      // Check credentials before making the request to the backend
      const credentialsAreValid = await checkCredentials();
      if (!credentialsAreValid) {
        return;
      }

      // Get the credentials from the keychain
      const credentials = await Keychain.getGenericPassword();
      const accessToken = credentials.username;
      
      try {
        const response = await axios.get(`${endpoint}profile`, {
          headers: {
              Authorization: `Bearer ${accessToken}`
          }
        });
        const user = response.data;

        setName(user.name);
        setLastName(user.lastName);
        setBirthDate(user.birthDate);
        setSelectedLanguages(user.programming_languages.map(lang => lang.name));
        setSelectedTransversalSkills(user.transversal_skills.map(skill => skill.name));
        setSelectedGeneralSkills(user.skills.map(skill => skill.name));

        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);





  // Function to handle the update of the profile
  const handleUpdate = async () => {  
    // Check credentials before making the request to the backend
    const credentialsAreValid = await checkCredentials();
    if (!credentialsAreValid) {
      return;
    }

    // Get the credentials from the keychain
    const credentials = await Keychain.getGenericPassword();
    const accessToken = credentials.username;

    try {
      const response = await axios.put(`${endpoint}profile`,  {
        name: name,
        lastName: lastName,
        birthDate: birthdate,
        programming_languages: selectedLanguages,
        transversal_skills: selectedTransversalSkills,
        skills: selectedGeneralSkills,
      }, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
      });
      if (response.status === 200)
      {
        //obtain the response message from the backend
        let successMessage = response.data.message;
        Alert.alert( successMessage);
        navigation.navigate('Perfil');
      }
    } catch (error) {
      // ... error handling code remains the same ...
      let errorMessages = [];
      // If the error response has data and errors, use it
      if (error.response && error.response.data && error.response.data.errors) {
        errorMessages = Object.values(error.response.data.errors);
      }
      
      // If the error has a status code of 500, it means there's a server error
      // If there's a server error, show a different alert
      if (error.response && error.response.status === 500) {
        // The error response from the backend includes a message and error
        let errorMessage1 = error.response.data.message;
        let errorMessage2 = error.response.data.error;
        // If the error response has a message and error, use it
        if (error.response.data.message && error.response.data.error) {
          errorMessages = [errorMessage1, errorMessage2];
        }
      }

      setErrors(errorMessages);
      setModalVisible(true);
    }
  };


  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const formatDate = (date) => {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let year = date.getFullYear();

    if (month.length < 2) 
    month = '0' + month;
    if (day.length < 2) 
    day = '0' + day;

    return [year, month, day].join('-');
  };
  const handleConfirm = (date) => {
    setBirthDate(formatDate(date));
    hideDatePicker();
  };


    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
            style={styles.input}
            placeholder=""
            onChangeText={(text) => setName(text)}
            value={name}
            />
            <Text style={styles.label}>Apellido</Text>
            <TextInput
            style={styles.input}
            placeholder=""
            onChangeText={(text) => setLastName(text)}
            value={lastName}
            />
            
            <Text style={styles.label}>Fecha de nacimiento</Text>
            <Button title="Selecciona tu fecha de nacimiento" onPress={showDatePicker} />
            <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            />
            <TextInput
            style={styles.input}  
            placeholder=""
            value={birthdate}
            editable={false} // The user cannot edit this field manually
            
            />
            
            <Text style={styles.label}>Lenguajes de programación</Text>
            <View>
            {!isLoading && languages.map((language, index) => (
                <BouncyCheckbox
                    key={index}
                    text={language}
                    fillColor="red"
                    unfillColor="#FFFFFF"
                    iconStyle={{ borderColor: "red" }}
                    isChecked={selectedLanguages.includes(language)}
                    onPress={() => handleLanguageSelect(language)}
                    textStyle={{
                        textDecorationLine: "none",
                    }}
                />
            ))}
            </View>

            <Text style={styles.label}>Habilidades transversales</Text>
            <View>
            {!isLoading && transversalSkills.map((transversalSkills, index) => (
                <BouncyCheckbox
                key={index}
                text={transversalSkills}
                fillColor="red"
                unfillColor="#FFFFFF"
                iconStyle={{ borderColor: "red" }}
                isChecked={selectedTransversalSkills.includes(transversalSkills)}
                onPress={() => handleTransversalSkillSelect(transversalSkills)}
                textStyle={{
                    textDecorationLine: "none",
                }}
                />
            ))}
            </View>

            <Text style={styles.label}>Habilidades</Text>
            <View>
            {!isLoading && generalSkills.map((skill, index) => (
                <BouncyCheckbox
                key={index}
                text={skill}
                fillColor="red"
                unfillColor="#FFFFFF"
                iconStyle={{ borderColor: "red" }}
                isChecked={selectedGeneralSkills.includes(skill)}
                onPress={() => handleGeneralSkillSelect(skill)}
                textStyle={{
                    textDecorationLine: "none",
                }}
                />
            ))}
            </View>


            <View style={styles.button}>
                <Button title="Guardar" onPress={handleUpdate} />
            </View>

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
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#b2d8d8', // light blue
      
    },
    label: {
      fontSize: 18,
      color: '#333',
      textAlign: 'center',
      backgroundColor: 'lightgreen',
  
      borderColor: 'gray', 
      borderWidth: 1, 
      
      padding: 10, 
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      
      paddingLeft: 10,
      backgroundColor: '#f2f2f2', // light gray
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
  
  
    button:{
      marginTop: 20,
    },
  
    iconText:{
      'fontSize': 15,
      'fontWeight': 'bold',
      'marginHorizontal': 10,
      'marginVertical': 10,    
    },
  
    iconRow:{
      'flexDirection': 'row',
      'justifyContent': 'center',
      'alignItems': 'center',
    },
  
  });
export default EditProfile;