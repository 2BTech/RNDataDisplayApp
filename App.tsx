import React, { FC, useEffect, useState, } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import PageHandler from "./src/Pages/PageHandler";
import DeviceTester from "./src/Testing/Devices/DeviceTesting";
import LocationProvider from "./src/Providers/LocationProvider";
import BluetoothProvider from "./src/Providers/Bluetooth/BluetoothProvider";
import AsyncStorage, { useAsyncStorage, } from '@react-native-async-storage/async-storage';

interface AppProps {

};

const App: FC<AppProps> = ({}) => {
  const {getItem, setItem} = useAsyncStorage('isFirstStart');
  const [isFirstStart, setIsFirstStart] = useState<boolean>(false);

  const readItemFromStorage = async () => {
    const item = await getItem();
    
    if (item == "null") {
      console.log('Is the first launch');
      setItem('0');
      setIsFirstStart(true);
    } else {
      console.log('Is not the fist launch. Number of launches: ', String(Number(item) + 1));
      setItem(String(Number(item) + 1));
    }
  }

  useEffect(() => {
    readItemFromStorage();
  }, []);

  return (
    <Provider store={store}>
      {/* <DeviceTester /> */}
      <LocationProvider />
      <BluetoothProvider />
      <SafeAreaProvider style={{backgroundColor: 'white',}}>
        <SafeAreaView style={styles.container}>
          <PageHandler />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
})

export default App;