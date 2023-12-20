import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Modal, Alert , ScrollView, Text, StyleSheet} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import * as Keychain from 'react-native-keychain';
import { AuthContext } from '../context/AuthContext';


import axios from 'axios';
import {URL} from '../helpers/index';
const endpoint = URL;

const Register = ({ navigation }) => {
  const { login } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState([]);


  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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
  

  const handleRegister = async () => {

    try {
      const response = await axios.post(`${endpoint}register`, {
        userName: username,
        password: password,
        name: name,
        lastName: lastName,
        birthDate: birthdate,
        email: email,
  
        programmingLanguages: selectedLanguages,
        transversalSkills: selectedTransversalSkills,
        skills: selectedGeneralSkills,
      });

      if (response.status === 200)
      {
        const { access_token, expires_in } = response.data;
        const expirationTime = (Date.now() / 1000 + expires_in).toString();
    
        // Store the token and expiration time in the keychain
        await Keychain.setGenericPassword(access_token, expirationTime);

        // If register is successful, navigate to the Home screen
        login();
        Alert.alert('Registro exitoso');
        navigation.navigate('Home');
      }
    } catch (error) {
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
    setBirthdate(formatDate(date));
    hideDatePicker();
  };




  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su nombre"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <Text style={styles.label}>Apellido</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su apellido"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
      />
      <Text style={styles.label}>Nombre de usuario</Text>
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder={'Ingrese su nombre de usuario'}
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
        placeholderTextColor = {'black'}
      />
      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        placeholder="Ingrese su correo electrónico"
        onChangeText={(text) => setEmail(text)}
        value={email}
        inputMode={'email'}
      />
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        autoCapitalize="none"
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder={'Ingrese su contraseña'}
        secureTextEntry={true}
      />
      

      <Text style={styles.label}>Lenguajes de programación</Text>
      <View>
        {languages.map((language, index) => (
          <BouncyCheckbox
            key={index}
            text={language}
            fillColor="red"
            unfillColor="#FFFFFF"
            iconStyle={{ borderColor: "red" }}
            onPress={() => handleLanguageSelect(language)}
            textStyle={{
              textDecorationLine: "none",
            }}
          />
        ))}
      </View>

      <Text style={styles.label}>Habilidades transversales</Text>
      <View>
        {transversalSkills.map((transversalSkills, index) => (
          <BouncyCheckbox
            key={index}
            text={transversalSkills}
            fillColor="red"
            unfillColor="#FFFFFF"
            iconStyle={{ borderColor: "red" }}
            onPress={() => handleTransversalSkillSelect(transversalSkills)}
            textStyle={{
              textDecorationLine: "none",
            }}
          />
        ))}
      </View>

      <Text style={styles.label}>Habilidades</Text>
      <View>
        {generalSkills.map((skill, index) => (
          <BouncyCheckbox
            key={index}
            text={skill}
            fillColor="red"
            unfillColor="#FFFFFF"
            iconStyle={{ borderColor: "red" }}
            onPress={() => handleGeneralSkillSelect(skill)}
            textStyle={{
              textDecorationLine: "none",
            }}
          />
        ))}
      </View>

      <Button
        title={'Registrar'}
        onPress={handleRegister}
        
      />
      
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
    //marginBottom: 10,
    //marginTop: 10,
    textAlign: 'center',
    backgroundColor: 'lightgreen',

    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 5, 
    padding: 5, 
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    //marginBottom: 10,
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


});

export default Register;