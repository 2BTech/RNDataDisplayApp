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

const formatTime = (time: number) : string => {
  // Calculate msecs in time
  let msecs: number = time % 1000;
  // Remove msecs from time
  time = (time - msecs) / 1000;

  // Calculate secs in time
  let secs: number = time % 60;
  // Remove secs from time
  time = (time - secs) / 60;

  // Calculate mins in time
  let mins: number = time % 60;
  // Remove mins from time
  time = (time - mins) / 60;

  // Calculate hours in time
  let hours: number = time % 24;
  // Remove hours from time
  time = (time - hours) / 24;

  // Calculate days in time
  let days: number = time;

  // Return formatted time where each field is two characters long
  return `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${msecs.toString().padStart(3, '0')}`;
}

const taskRandom = async (taskData: any) => {
  if (Platform.OS === 'ios') {
    console.warn(
      'This task will not keep your app alive in the background by itself, use other library like react-native-track-player that use audio,',
      'geolocalization, etc. to keep your app alive in the background while you execute the JS from this library.'
    );
  }
  await new Promise(async (resolve) => {
    // Store the time that the task started
    const startTime: number = Date.now();

    // Update the background notification
    await BackgroundJob.updateNotification({ taskDesc: 'Running' });

    // Log message that the task has started
    console.log('Task has started at ', new Date().setTime(startTime), ' with data ', taskData);

    // For loop with a delay
    const { delay } = taskData;
    for (let i = 0; BackgroundJob.isRunning(); i++) {
      // Get the total elapsed time since the task was started
      const elapsedTime: number = Date.now() - startTime;

      // Update the notification with the elapsed time
      await BackgroundJob.updateNotification({ taskDesc: `Ran for ${formatTime(elapsedTime)}` });

      // // Log message that the task is running
      // console.log(`Ran for ${formatTime(elapsedTime)}`);
      
      // Wait for the delay
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

  // Start the background service if on android
  if (Platform.OS === 'android') {
    useEffect(() => {
      startBackgroundService();
  
      return () => {
        BackgroundService.stop();
      }
    }, []);
  }

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