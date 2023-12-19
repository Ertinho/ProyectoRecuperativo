import React, { useState } from 'react';
import { View, TextInput, Button, Alert , ScrollView, Text, StyleSheet} from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";

import axios from 'axios';
import {URL} from '../helpers/index';
const endpoint = URL;



const Register = ({ navigation }) => {

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
  const transversalSkills = ['Communication', 'Teamwork', 'Problem solving', 'Time management', 'Adaptability'];
  const handleTransversalSkillSelect = (value) => {
    if (selectedTransversalSkills.includes(value)) {
      setSelectedTransversalSkills(selectedTransversalSkills.filter(transversalSkill => transversalSkill !== value));
    } else {
      setSelectedTransversalSkills([...selectedTransversalSkills, value]);
    }
  };
  
  const [selectedGeneralSkills, setSelectedGeneralSkills] = useState([]);
  const generalSkills = ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5'];
  const handleGeneralSkillSelect = (value) => {
    if (selectedGeneralSkills.includes(value)) {
      setSelectedGeneralSkills(selectedGeneralSkills.filter(skill => skill !== value));
    } else {
      setSelectedGeneralSkills([...selectedGeneralSkills, value]);
    }
  };
  

  const handleRegister = async () => {
    
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
    })
    .then(res => {
      // Handle the response here
      Alert.alert('Registro exitoso');
    })
    .catch(error => {
      // Handle the error here
      let errorMessage = 'Registro fallido';
      
      
      // If the error response has data and errors, use it
      if (error.response && error.response.data && error.response.data.errors) {
        errorMessage = Object.values(error.response.data.errors).join('\n');
      }
      
      Alert.alert(errorMessage);
    });


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
        style={styles.input}
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder={'Ingrese su nombre de usuario'}
      />
      <Text style={styles.label}>Cumpleaños</Text>
      <TextInput
        style={styles.input}  
        placeholder="Ingrese su cumpleaños"
        onChangeText={(text) => setBirthdate(text)}
        value={birthdate}
      />
      <Text style={styles.label}>Correo electrónico</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese su correo electrónico"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <Text style={styles.label}>Contraseña</Text>
      <TextInput
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
          />
        ))}
      </View>

      <Text style={styles.label}>Habilidades generales</Text>
      <View>
        {generalSkills.map((skill, index) => (
          <BouncyCheckbox
            key={index}
            text={skill}
            fillColor="red"
            unfillColor="#FFFFFF"
            iconStyle={{ borderColor: "red" }}
            onPress={() => handleGeneralSkillSelect(skill)}
          />
        ))}
      </View>

      <Button
        title={'Registrar'}
        onPress={handleRegister}
        
      />
      
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
  
});

export default Register;