import React, { FC, useEffect, useState, } from "react";
import { PermissionsAndroid, StyleSheet, NativeModules, Platform, Linking, } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import PageHandler from "./src/Pages/PageHandler";
import DeviceTester from "./src/Testing/Devices/DeviceTesting";
import LocationProvider from "./src/Providers/LocationProvider";
import BluetoothProvider from "./src/Providers/Bluetooth/BluetoothProvider";
import AsyncStorage, { useAsyncStorage, } from '@react-native-async-storage/async-storage';
import InfoComponent from "./src/Pages/InfoComponent/InfoComponent";
import { WithSplashScreen } from "./src/Splash/Splash";
import Orientation from 'react-native-orientation-locker';
import BackgroundService from 'react-native-background-actions';
import BackgroundJob from 'react-native-background-actions';

const sleep = (time: any) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

BackgroundJob.on('expiration', () => {
  console.log('iOS: I am being closed!');
});

const taskRandom = async (taskData: any) => {
  console.log('Hello from a background task');

  if (Platform.OS === 'ios') {
    console.warn(
      'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
      'geolocalization, etc. to keep your app alive in the background while you execute the JS from this library.'
    );
  }
  await new Promise(async (resolve) => {
    // For loop with a delay
    const { delay } = taskData;
    console.log(BackgroundJob.isRunning(), delay)
    for (let i = 0; BackgroundJob.isRunning(); i++) {
      console.log('Ran -> ', i);
      await BackgroundJob.updateNotification({ taskDesc: 'Ran -> ' + i });
      await sleep(delay);
    }
  });
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask desc',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  // linkingURI: 'exampleScheme://chat/jane',
  linkingURI: undefined,
  parameters: {
    delay: 1000,
  },
};

function handleOpenURL(evt: any) {
  console.log(evt.url);
  // do something with the url
}

Linking.addEventListener('url', handleOpenURL);

interface AppProps {

};

async function RequestBackgroundLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      {
        title: "2B Connect Background Location Permission",
        message:
          "2B Connect needs access to your location " +
          "so you can collect data in the background.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Background location permission granted');
    } else {
      console.log('Background location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

const startBackgroundService = async () => {
  const usingHermes = typeof HermesInternal === 'object' && HermesInternal !== null;
  
  console.log('Using Hermes: ', usingHermes);

  try {
    console.log('Trying to start background service');
    await BackgroundService.start(taskRandom, options);
    console.log('Background service has been started');
  } catch (e) {
    console.log('Cannot start the background service', e);
  }
}

const App: FC<AppProps> = ({}) => {
  const {getItem, setItem} = useAsyncStorage('isFirstStart');
  const [isFirstStart, setIsFirstStart] = useState<boolean>(false);

  Orientation.lockToPortrait();

  // For the splash screen
  const [isAppReady, setIsAppReady] = useState(false);

  const readItemFromStorage = async () => {
    const item: (string | null) = await getItem();
    
    console.log('Is the first launch: ', item);
    if (item == "null" || item == null) {
      console.log('Is the first launch');
      setItem('0');
      setIsFirstStart(true);
    } else {
      console.log('Is not the fist launch. Number of launches: ', String(Number(item) + 1));
      setItem(String(Number(item) + 1));
    }
  }

  useEffect(() => {
    RequestBackgroundLocationPermission();

    const interval = setInterval(() => {
      console.log('Still alive');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderTutorial = () => {
    if (isFirstStart) {
      return (
        <InfoComponent finishCallback={() => setIsFirstStart(false)} />
      );
    } else {
      return (
        <></>
      )
    }
  }

  useEffect(() => {
    readItemFromStorage();

    setTimeout(() => {
      setIsAppReady(true)
    }, 2000);
  }, []);

  // Start the background service
  useEffect(() => {
    startBackgroundService();

    return () => {
      BackgroundService.stop();
    }
  }, []);

  return (
    <WithSplashScreen isAppReady={isAppReady}>
      <Provider store={store}>
        {/* <DeviceTester /> */}
        {
          renderTutorial()
        }
        <LocationProvider />
        <BluetoothProvider />
        <SafeAreaProvider style={{backgroundColor: 'white',}}>
          <SafeAreaView style={styles.container}>
            <PageHandler />
          </SafeAreaView>
        </SafeAreaProvider>
      </Provider>
    </WithSplashScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
})

export default App;