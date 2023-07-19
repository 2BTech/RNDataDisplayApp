import React, { FC, useEffect, useState, useRef, } from "react";
import { Linking, Alert, Platform, PermissionsAndroid, ToastAndroid, } from 'react-native';
import Geolocation, { GeoPosition, } from 'react-native-geolocation-service';
import { GPSCoordinate, updateGPSCoords } from "../redux/slices/gpsSlice";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { RootState } from "../redux/store";
import { Action } from "redux";

interface LocationProviderProps {
  updateCoords: (coords: GPSCoordinate) => Promise<void>;
}

const LocationProvider: FC<LocationProviderProps> = ({updateCoords}) => {
    const [location, setLocation] = useState<GeoPosition | null>(null);
    const [highAccuracy, setHighAccuracy] = useState(true);
    const [forceLocation, setForceLocation] = useState(true);
    const [useLocationManager, setUseLocationManager] = useState(false);
    const [locationDialog, setLocationDialog] = useState(true);
    const [significantChanges, setSignificantChanges] = useState(false);
    const [observing, setObserving] = useState(false);

    const watchId = useRef<number | null>(null);

    useEffect(() => {
        initLocationManager();
    }, []);

    // Initialize the location manager to start collection the location on an interval
    const initLocationManager = async () => {
        // getLocation();
        getLocationUpdates();
    }

    const hasPermissionIOS = async () => {
        const openSetting = () => {
          Linking.openSettings().catch(() => {
            Alert.alert('Unable to open settings');
          });
        };
        const status = await Geolocation.requestAuthorization('whenInUse');
    
        if (status === 'granted') {
          return true;
        }
    
        if (status === 'denied') {
          Alert.alert('Location permission denied');
        }
    
        if (status === 'disabled') {
          Alert.alert(
            `Turn on Location Services to allow 2B Connect to determine your location.`,
            '',
            [
              { text: 'Go to Settings', onPress: openSetting },
              { text: "Don't Use Location", onPress: () => {} },
            ],
          );
        }
    
        return false;
    };

    const hasLocationPermission = async () => {
        if (Platform.OS === 'ios') {
          const hasPermission = await hasPermissionIOS();
          return hasPermission;
        }
    
        if (Platform.OS === 'android' && Platform.Version < 23) {
          return true;
        }
    
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
    
        if (hasPermission) {
          return true;
        }
    
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
    
        if (status === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        }
    
        if (status === PermissionsAndroid.RESULTS.DENIED) {
          ToastAndroid.show(
            'Location permission denied by user.',
            ToastAndroid.LONG,
          );
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          ToastAndroid.show(
            'Location permission revoked by user.',
            ToastAndroid.LONG,
          );
        }
    
        return false;
    };

    const getLocation = async () => {
        const hasPermission = await hasLocationPermission();
    
        if (!hasPermission) {
          return;
        }
    
        Geolocation.getCurrentPosition(
          position => {
            const coords: GPSCoordinate = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude || 0,
            }
            updateCoords(coords);

            // setLocation(position);
            // console.log(position);
          },
          error => {
            Alert.alert(`Code ${error.code}`, error.message);
            setLocation(null);
            console.log(error);
          },
          {
            accuracy: {
              android: 'high',
              ios: 'best',
            },
            enableHighAccuracy: highAccuracy,
            timeout: 15000,
            maximumAge: 10000,
            distanceFilter: 0,
            forceRequestLocation: forceLocation,
            forceLocationManager: useLocationManager,
            showLocationDialog: locationDialog,
          },
        );
    };

    const getLocationUpdates = async () => {
        const hasPermission = await hasLocationPermission();
    
        if (!hasPermission) {
          return;
        }
    
        setObserving(true);
    
        watchId.current = Geolocation.watchPosition(
          position => {
            const coords: GPSCoordinate = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude || 0,
            }
            updateCoords(coords);

            // console.log('Found position: ', position);
            // setLocation(position);
          },
          error => {
            setLocation(null);
            console.log(error);
          },
          {
            accuracy: {
              android: 'high',
              ios: 'best',
            },
            enableHighAccuracy: highAccuracy,
            distanceFilter: 0,
            interval: 5000,
            fastestInterval: 2000,
            forceRequestLocation: forceLocation,
            forceLocationManager: useLocationManager,
            showLocationDialog: locationDialog,
            useSignificantChanges: significantChanges,
          },
        );
    };

    return (
      <></>
    );
}

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => {
  return {
      updateCoords: (coords: GPSCoordinate) => dispatch(updateGPSCoords(coords)),
  };
}

export default connect(undefined, mapDispatchToProps)(LocationProvider);