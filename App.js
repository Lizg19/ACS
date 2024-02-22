import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import  Home from './screens/Home';
import  Welcome from './screens/Welcome';
import  Register from './screens/Register';
import  Riddle from './screens/Riddle';
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


const NativeStackNav = createNativeStackNavigator();

const LoginNav = () => {
  return (
    <NativeStackNav.Navigator initialRouteName="inicio">
      <NativeStackNav.Screen
        name="Pantalla Principal"
        // component={Welcome}
        component={Home}
      ></NativeStackNav.Screen>
      <NativeStackNav.Screen name="Welcome" component={Welcome} />
      <NativeStackNav.Screen name="Register" component={Register} />
      <NativeStackNav.Screen name="Acertijo" component={Riddle} />
    </NativeStackNav.Navigator>
  );
};

export default App = () => {
  return (
    <NavigationContainer>
      <LoginNav />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
