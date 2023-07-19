import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import PageHandler from "./src/Pages/PageHandler";
import DeviceTester from "./src/Testing/Devices/DeviceTesting";
import LocationProvider from "./src/Providers/LocationProvider";
import BluetoothProvider from "./src/Providers/Bluetooth/BluetoothProvider";

interface AppProps {

};

const App: FC<AppProps> = ({}) => {
  return (
    <Provider store={store}>
      <DeviceTester />
      <LocationProvider />
      <BluetoothProvider />
      <SafeAreaProvider>
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