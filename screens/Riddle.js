import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Button, Alert, KeyboardAvoidingView, ImageBackground } from 'react-native';
import firestore from '../firebase-config';
import { collection, addDoc, setDoc, doc, CollectionReference } from 'firebase/firestore';
import { app } from './../firebase-config';
import { getAuth } from 'firebase/auth';
import { useRoute } from '@react-navigation/native';


function RiddleScreen({ navigation }) {
  const route = useRoute();
  const { datos } = route.params;

  const [posicionLobo, setPosicionLobo] = useState('derecha');
  const [posicionCabra, setPosicionCabra] = useState('derecha');
  const [posicionCol, setPosicionCol] = useState('derecha');
  const [loser, setLoser] = useState(false);

  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(true);

  const [user, setUser] = useState(null);
  const [info, setInfo] = React.useState({
    uid: '',
    name: '',
    time: null,
    createAt: null
  });


  useEffect(() => {
    let interval;

    if (corriendo) {
      interval = setInterval(() => {
        setSegundos((prevSegundos) => prevSegundos + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);

  }, [corriendo]);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    if (loser == true) {
      setLoser(false)
      setPosicionLobo('derecha')
      setPosicionCabra('derecha')
      setPosicionCol('derecha')
    } else if (posicionCol == 'izquierda' && posicionLobo == 'izquierda' && posicionCabra == 'izquierda') {
      setCorriendo(false)
      console.log('---', segundos);
      if (segundos > 0) {
        guardarTiempo();

      }
      Alert.alert(
        'GANADOR',
        'Muy bien lograste pasar a los personajes.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              setPosicionLobo('derecha')
              setPosicionCabra('derecha')
              setPosicionCol('derecha')
              setSegundos(0)
              setCorriendo(true)

            },
          },
        ],
        { cancelable: false }
      );

    }

  });



  const moverLobo = () => {
    setPosicionLobo('izquierda');

    if (posicionLobo == 'izquierda') {
      setPosicionLobo('derecha');
    }
    if (posicionCol == 'derecha' && posicionCabra == 'derecha') {
      Alert.alert('Perdiste, La cabra se comió la col.')
      setLoser(true)

    } else if (posicionCol == 'izquierda' && posicionCabra == 'izquierda') {
      Alert.alert('Perdiste, La cabra se comió la col.')
      setLoser(true)
    }

  };

  const moverCabra = () => {
    setPosicionCabra('izquierda');
    if (posicionCabra == 'izquierda') {
      setPosicionCabra('derecha');
    }
  };

  const moverCol = () => {
    setPosicionCol('izquierda');
    if (posicionCol == 'izquierda') {
      setPosicionCol('derecha');
    }
    if (posicionLobo == 'derecha' && posicionCabra == 'derecha') {
      Alert.alert('Perdiste, El lobo se comió la cabra.')
      setLoser(true)

    } else if (posicionLobo == 'izquierda' && posicionCabra == 'izquierda') {
      Alert.alert('Perdiste, El lobo se comió la cabra.')
      setLoser(true)
    }
  };

  const formatoTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
  };

  const guardarTiempo = async () => {
    console.log('///', user)
    const variable = {
      'uid': user.uid,
      'name': user.displayName,
      'time': formatoTiempo(segundos),
      'createAt': new Date()
    }
    console.log('info', variable);
    try {
      const collectionRef = collection(firestore, '/users/' + user.uid + '/history');
      const addedDocument = await addDoc(collectionRef, variable);
      console.log('Documento agregado con ID:', addedDocument.id);
      setSegundos(0);
    } catch (error) {
      console.error('Error al agregar el documento:', error);
    }
    console.log('*****', segundos)

  };

  return (
    <ImageBackground
      source={{
        uri: 'https://img.freepik.com/vector-premium/dibujos-animados-rio-medio-hermoso-paisaje-natural_43633-5055.jpg',
      }}
      style={styles.back}
      resizeMode="stretch"
    >

      <View style={{ flexDirection: 'column', }} >
        <View style={{ height: '50%', }}>
          <Text style={{ fontSize: 24, textAlign: 'center', color: '#fff', paddingVertical: 20 }}> Selecciona un personaje {"\n"} para que cruce el río.</Text>
          <View style={styles.container}>
            <Text style={styles.cronometro}>{formatoTiempo(segundos)}</Text>
            {/* <View style={styles.botonesContainer}>
                        <TouchableOpacity style={styles.boton} onPress={reiniciarCronometro}>
                        <Text>Reiniciar</Text>
                        </TouchableOpacity>
                    </View> */}
          </View>
        </View>
        <View style={{ height: '50%', flexDirection: 'row' }}>
          <View style={styles.spacePer2}>
            {posicionLobo == 'izquierda' ?
              <TouchableOpacity activeOpacity={0.5} onPress={moverLobo}>
                <Image
                  source={{
                    uri: 'https://images.vexels.com/media/users/3/201524/isolated/preview/2e32d39f782f431d516a405a32e702b5-dibujo-de-lobo-aullando.png',
                  }}
                  style={styles.icons}

                />
              </TouchableOpacity> : null}
            {posicionCabra == 'izquierda' ?
              <TouchableOpacity activeOpacity={0.5} onPress={moverCabra}>
                <Image
                  source={{
                    uri: 'https://png.pngtree.com/png-clipart/20230413/original/pngtree-goat-cartoon-eating-grass-png-image_9050189.png',
                  }}
                  style={styles.icons}

                />
              </TouchableOpacity> : null}
            {posicionCol == 'izquierda' ?
              <TouchableOpacity activeOpacity={0.5} onPress={moverCol}>
                <Image
                  source={{
                    uri: 'https://images.vexels.com/media/users/3/271460/isolated/preview/a5f1241f7704388bba0a6e3df6780190-icono-de-comida-de-lechuga.png',
                  }}
                  style={styles.icons}

                />
              </TouchableOpacity> : null}
          </View>
          <View style={styles.spacePer}>
            {posicionLobo == 'derecha' ?
              <TouchableOpacity activeOpacity={0.5} onPress={moverLobo}>
                <Image
                  source={{
                    uri: 'https://images.vexels.com/media/users/3/201524/isolated/preview/2e32d39f782f431d516a405a32e702b5-dibujo-de-lobo-aullando.png',
                  }}
                  style={styles.icons}

                />
              </TouchableOpacity> : null}

            {posicionCabra == 'derecha' ?
              <TouchableOpacity activeOpacity={0.5} onPress={moverCabra}>
                <Image
                  source={{
                    uri: 'https://png.pngtree.com/png-clipart/20230413/original/pngtree-goat-cartoon-eating-grass-png-image_9050189.png',
                  }}
                  style={styles.icons}

                />
              </TouchableOpacity> : null}

            {posicionCol == 'derecha' ?
              <TouchableOpacity activeOpacity={0.5} onPress={moverCol}>
                <Image
                  source={{
                    uri: 'https://images.vexels.com/media/users/3/271460/isolated/preview/a5f1241f7704388bba0a6e3df6780190-icono-de-comida-de-lechuga.png',
                  }}
                  style={styles.icons}

                />
              </TouchableOpacity> : null}
          </View>
        </View>
      </View>


    </ImageBackground>

  );
};

const styles = StyleSheet.create({
  container: {

    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  spacePer: {
    width: '50%', flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end', paddingBottom: 60, paddingRight: 35
  },
  spacePer2: {
    width: '50%', flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start', paddingBottom: 10
  },
  animalsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  animal: {
    alignItems: 'center',
  },
  positionsContainer: {
    alignItems: 'center',
  },
  back: {
    flex: 1
  },
  icons: {
    width: 90,
    height: 90,
    resizeMode: 'stretch'
  },
  cronometro: {
    color: '#fff',
    fontSize: 40,
    marginBottom: 20,
  },
  botonesContainer: {
    flexDirection: 'row',
  },
  boton: {
    backgroundColor: '#24D274',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
});
export default RiddleScreen;
