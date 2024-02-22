import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, StyleSheet, Text, View, Image, SafeAreaView, TextInput, Button, Modal, TouchableOpacity } from 'react-native';

import { app } from './../firebase-config';
import { getAuth, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, doc, CollectionReference } from 'firebase/firestore';
import firestore from '../firebase-config';


function WelcomeScreen({ navigation }) {
  const [mostrarEnunciado, setMostrarEnunciado] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarCalificar, setMostrarCalificar] = useState(false);
  const [calificacion, setCalificacion] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const open = () => {
    setMostrarEnunciado(true);
    console.log('mostrarEnunciado', mostrarEnunciado);
    console.log(user.displayName);
    console.log(user.uid);

  };

  const close = () => {
    setMostrarEnunciado(false);
  };

  const openHistory = async () => {
    setMostrarHistorial(true);
    console.log(user.displayName);
    console.log(user.uid);

    try {
      const docRef = collection(firestore, "users", user.uid + "/history");
      const querySnapshot = await getDocs(docRef);
      global.usersData = [];
      querySnapshot.forEach(doc => {
        usersData.push({ id: doc.uid, ...doc.data() });
      });

      setUsers(usersData);
    } catch (error) {
      console.error('Error getting document:', error);
    }

  };
  const closeHistorial = () => {
    setMostrarHistorial(false);
  };

  const play = () => {
    const datos = {
      uid: user.uid,
      name: user.displayName
    }
    navigation.navigate('Acertijo', { datos })
  }

  const handleSignOut = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      Alert.alert('Usuario desconectado');
      navigation.navigate('Pantalla Principal');
    } catch (error) {
      console.error('Error al desconectar:', error.message);
    }
  };

  const openCalificar = () => {
    setMostrarCalificar(true);
    console.log('mostrarEnunciado', mostrarEnunciado);
    console.log(user.displayName);
    console.log(user.uid);

  };

  const closeCalificar = () => {
    setMostrarCalificar(false);
  };

  const calificar = async () => {
    if (calificacion == 1 || calificacion == 2 || calificacion == 3 || calificacion == 4) {
      const variable = {
        'score': calificacion,
        'createAt': new Date()
      }

      try {
        const collectionRef = collection(firestore, '/users/' + user.uid + '/mark');
        const addedDocument = await addDoc(collectionRef, variable);
        // console.log('Documento agregado con ID:', addedDocument.id);
        Alert.alert('Calificación enviada correctamente.')
      } catch (error) {
        console.error('Error al agregar el documento:', error);
      }
    } else {
      Alert.alert('Calificación fuera de rango.')
    }
  };

  return (
    <View style={{ backgroundColor: '#fff', height: '100%' }}>
      <View style={{ backgroundColor: '#c3efd7', borderBottomLeftRadius: 15, borderBottomRightRadius: 15, marginBottom: 20 }}>
        <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff', paddingVertical: 20 }}>ACERTIJO LOBO, CABRA Y COL </Text>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        <Image
          style={styles.stretch}
          source={{
            uri: 'https://res.cloudinary.com/practicaldev/image/fetch/s--nnWSqf_A--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://dev-to-uploads.s3.amazonaws.com/i/3svmkfe76vp5ol816hoi.jpg',
          }}
        />
      </View>

      <View style={{ marginHorizontal: 10 }}>
        <Button
          onPress={open}
          title="Enunciado"
          color="#48B3FF"
        />
      </View>
      <View style={{ marginHorizontal: 10, paddingTop: 15 }}>
        <Button
          onPress={play}
          style={{ borderRadius: 4 }}
          title="Resolver"
          color="#24D274"
        />
      </View>
      <View style={{ marginHorizontal: 10, paddingTop: 15 }}>
        <Button
          onPress={openHistory}
          title="Mi historial"
          color="grey"
        />
      </View>
      <View style={{ marginHorizontal: 10, paddingTop: 15 }}>
        <Button
          onPress={openCalificar}
          title="Calificar"
          color="orange"
        />
      </View>
      <View style={{ marginHorizontal: 10, paddingTop: 15 }}>
        <Button
          onPress={handleSignOut}
          style={{ borderRadius: 4 }}
          title="Cerrar Sesión"
          color="red"
        />
      </View>
      {/* MODAL PARA REVISAR ENUNCIADO */}
      <Modal transparent visible={mostrarEnunciado} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={close}>
              <Text style={styles.close}>&times;</Text>
            </TouchableOpacity>
            <Image
              style={{
                width: 100,
                height: 100, alignSelf: 'center'
              }}
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/4151/4151213.png',
              }}
            />

            <Text style={{ paddingTop: 15, fontSize: 18 }}>Un día, un granjero fue al mercado y compró un lobo, una cabra y una col. Para volver a su casa tenía que cruzar un río. El granjero dispone de una barca para cruzar a la otra orilla, pero en la barca solo caben él y una de sus compras.
              Si el lobo se queda solo con la cabra se la come, si la cabra se queda sola con la col se la come.
              El reto del granjero era cruzar él mismo y dejar sus compras a la otra orilla del río, dejando cada compra intacta. ¿Cómo lo hizo?
            </Text>
          </View>
        </View>
      </Modal>

      {/* MODAL PARA REVISAR MIS PARTIDADS */}
      <Modal transparent visible={mostrarHistorial} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeHistorial}>
              <Text style={styles.close}>&times;</Text>
            </TouchableOpacity>
            {global.usersData != undefined ?
              <ScrollView style={styles.container2}>
                <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold' }}>Mis intentos</Text>
                <View style={styles.container}>
                  {global.usersData.sort((a, b) => new Date(a.createAt.toDate()) - new Date(b.createAt.toDate())).map((objeto, index) => (
                    <View key={index}>
                      <Text>{`Nombre: ${objeto.name}`}</Text>
                      <Text>{`Fecha: ${new Date(objeto.createAt.toDate())}`}</Text>
                      <Text>{`Tiempo: ${objeto.time}`}</Text>
                      <Text>____________________________________________</Text>

                    </View>
                  ))}
                </View>
              </ScrollView> : <Text style={{ fontSize: 12 }}>Cargando información...</Text>}
          </View>
        </View>
      </Modal>

      {/* MODAL PARA REVISAR CALIFICAR */}
      <Modal transparent visible={mostrarCalificar} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeCalificar}>
              <Text style={styles.close}>&times;</Text>
            </TouchableOpacity>
            <View style={{ marginHorizontal: 10, paddingBottom: 20, paddingTop: 20 }}>
              <SafeAreaView style={{ paddingBottom: 20 }}>
                <Text style={{ fontSize: 16 }}>Califique la aplicación rango del 1 al 4</Text>
                <Text style={{ fontSize: 16 }}>1: Muy fácil, 2: Fácil, 3: Difícil, 4: Muy difícil</Text>

                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setCalificacion(text)}
                  placeholder="Ingrese la calificación"
                  placeholderTextColor="black"
                />
              </SafeAreaView>
              <View style={{ marginHorizontal: 10 }}>
                <Button
                  onPress={calificar}
                  title="Enviar"
                  color="#24D274"
                />
              </View>

            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}
const styles = StyleSheet.create({

  stretch: {
    width: 340,
    height: 300,
    resizeMode: 'stretch',
    borderRadius: 85
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#c3efd7',
    padding: 20,
    borderRadius: 10,
    elevation: 20,
    margin: 6
  },
  close: {
    fontSize: 50,
    alignSelf: 'flex-end',
    //marginBottom: 10,
  },
  container: {

    maxHeightheight: 300
  },

  text: { margin: 6 },
  container2: {
    flex: 1,
    padding: 5,
    maxHeight: 290,
  },
  input: {
    color: 'black',
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
});
export default WelcomeScreen;
