import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View ,Image,SafeAreaView, TextInput,Button, Alert,KeyboardAvoidingView, Platform} from 'react-native';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { app } from './../firebase-config';

function RegisterScreen({navigation}) {
  const [emailUser, setEmailUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');

  //inicializar firebase
  //const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const  handleCreateAccount = () => {
    if(emailUser=='' || password =='' ||name == '' || phone == '' ) {
      Alert.alert('Los campos no pueden estar en blanco.')
    }else{
      createUserWithEmailAndPassword(auth, emailUser, password)
      .then(async (userCredential) => {
        
        const user = userCredential.user;
        await updateProfile(user, {
            displayName: name,
            phoneNumber: phone
          });
        Alert.alert('Cuenta creada correctamente.')
        navigation.navigate('Pantalla Principal');
        console.log('Información Usuario: ',user)
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Correo electrónico ya registrado.');
        }
    
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Coorreo electrónico no válido.');
        }
        Alert.alert(error);
      })
    }
    
  }


  return (
    <KeyboardAvoidingView
      behavior="position"
      style={styles.container}
    >
        <View style={styles.content}>
            <Text style={{paddingTop:60, fontSize:20, textAlign: 'center'}}>¡BIENVENIDOS!</Text>
            <View style={{justifyContent:'center',alignItems: 'center'}}>
                <Image
                style={styles.stretch}
                source={{
                    uri: 'https://static.vecteezy.com/system/resources/previews/004/985/297/non_2x/riddle-solving-process-color-icon-mental-exercise-jigsaw-puzzle-challenge-mystery-question-ingenuity-knowledge-intelligence-test-brain-teaser-solution-finding-isolated-illustration-vector.jpg',
                }}
                />
            </View>
            <Text style={{paddingTop:5,paddingBottom:20, fontSize:20, textAlign: 'center'}}>Al mejor acertijo.</Text>
            <View style={{ borderWidth: 1,borderColor:'#48B3FF',backgroundColor:'#48B3FF',borderRadius:15,marginHorizontal:10,paddingBottom:20, paddingTop:20}}>
                <SafeAreaView style={{paddingBottom:20}}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setName(text)}
                    placeholder="Ingrese su nombre"
                    placeholderTextColor="#fff" 
                    keyboardType="default"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPhone(text)}
                    placeholder="Ingrese su número de teléfono"
                    placeholderTextColor="#fff" 
                    keyboardType="phone-pad"  
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setEmailUser(text)}
                    placeholder="Ingrese su correo electrónico"
                    placeholderTextColor="#fff" 
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                    placeholder="Ingrese su contraseña"
                    placeholderTextColor="#fff" 
                    secureTextEntry={true}
                />
                
                </SafeAreaView>
                
                <View style={{ marginHorizontal:10, paddingTop:15}}>
                <Button
                    onPress={handleCreateAccount}
                    title="Registrar"
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
    borderColor:'#fff',
    padding: 10,
  },
  content: {
    width: '100%',
    backgroundColor: '#fff'
  },
});
export default RegisterScreen;
