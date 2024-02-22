import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TextInput, Button, Alert, KeyboardAvoidingView } from 'react-native';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { app } from './../firebase-config';

function LoginScreen({ navigation }) {
  const [emailUser, setEmailUser] = React.useState('');
  const [password, setPassword] = React.useState('');

  //inicializar firebase

  const auth = getAuth(app);

  const handleNewccount = () => {
    navigation.navigate('Register');
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, emailUser, password)
      .then((userCredential) => {
        console.log('Cuenta iniciada correctamente')
        const user = userCredential.user;
        console.log(user)
        navigation.navigate('Welcome');
      })
      .catch(error => {
        console.log('--', error)
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Correo electrónico no válido.');
        } else if (error.code === 'auth/invalid-credential') {
          Alert.alert('Contraseña incorrecta.');
        }
      })
  }

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={styles.container}
    >
      <View style={{ backgroundColor: '#fff', height: '100%' }}>
        <Text style={{ paddingTop: 60, fontSize: 20, textAlign: 'center' }}>¡BIENVENIDOS!</Text>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            style={styles.stretch}
            source={{
              uri: 'https://static.vecteezy.com/system/resources/previews/004/985/297/non_2x/riddle-solving-process-color-icon-mental-exercise-jigsaw-puzzle-challenge-mystery-question-ingenuity-knowledge-intelligence-test-brain-teaser-solution-finding-isolated-illustration-vector.jpg',
            }}
          />
        </View>
        <Text style={{ paddingTop: 5, paddingBottom: 20, fontSize: 20, textAlign: 'center' }}>Al mejor acertijo.</Text>
        <View style={{ borderWidth: 1, borderColor: '#48B3FF', backgroundColor: '#48B3FF', borderRadius: 15, marginHorizontal: 10, paddingBottom: 20, paddingTop: 20 }}>
          <SafeAreaView style={{ paddingBottom: 20 }}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setEmailUser(text)}
              placeholder="Ingrese su correo electrónico"
              placeholderTextColor="#fff"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              placeholder="Ingrese su contraseña"
              placeholderTextColor="#fff"
              secureTextEntry={true}
            />
          </SafeAreaView>
          <View style={{ marginHorizontal: 10 }}>
            <Button
              onPress={handleSignIn}
              title="Iniciar Sesión"
              color="#24D274"
            />
          </View>
          <View style={{ marginHorizontal: 10, paddingTop: 15 }}>
            <Button
              onPress={handleNewccount}
              title="Crear cuenta"
              color="grey"
            />
          </View>
        </View>
        <StatusBar style="auto" />
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  stretch: {
    width: 200,
    height: 200,
    resizeMode: 'stretch',

  },
  input: {
    color: 'white',
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 10,
  },
});
export default LoginScreen;
