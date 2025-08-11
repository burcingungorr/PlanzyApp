import React, { useEffect, useState, useRef } from 'react';
import {
  PermissionsAndroid,
  Platform,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import EventDetailModal from './EventDetailModal';
import geoData from '../../data/geo.json';

const normalizeText = text =>
  text
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const GeoLocationMap = () => {
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  const getCoordinates = (cityName, districtName) => {
    if (!cityName || !districtName) return null;

    const normalizedCity = normalizeText(cityName);
    const normalizedDistrict = normalizeText(districtName);

    const city = geoData.find(c => normalizeText(c.il) === normalizedCity);
    if (!city) return null;

    const district = city.ilceler.find(
      d => normalizeText(d.ilce) === normalizedDistrict,
    );
    if (!district) return null;

    return {
      latitude: district.latitude,
      longitude: district.longitude,
    };
  };

  const fetchFutureEvents = async () => {
    try {
      const now = new Date();
      const snapshot = await firestore().collection('activities').get();

      const futureEvents = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(event => event.date && event.date.toDate() > now);

      setEvents(futureEvents);
    } catch (e) {
      setError('Etkinlikler yüklenirken hata oluştu.');
      console.warn(e);
    }
  };

  const requestLocationPermissionAndWatch = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Konum Erişimi',
            message: 'Konumunuzu gösterebilmek için izin gerekli.',
            buttonPositive: 'İzin Ver',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setError('Konum izni reddedildi.');
          return;
        }
      }

      watchIdRef.current = Geolocation.watchPosition(
        position => {
          const newRegion = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };
          setUserLocation(newRegion);
          if (!region) setRegion(newRegion);
          setError('');
        },
        err => setError('Konum alınamadı: ' + err.message),
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 5000,
          distanceFilter: 10,
          interval: 5000,
          fastestInterval: 2000,
        },
      );
    } catch (err) {
      setError('Konum izni isteğinde hata oluştu.');
      console.warn(err);
    }
  };

  useEffect(() => {
    fetchFutureEvents();
    requestLocationPermissionAndWatch();
  }, []);

  const zoomMap = factor => {
    if (!region || !mapRef.current) return;

    const newRegion = {
      ...region,
      latitudeDelta: Math.min(
        Math.max(region.latitudeDelta * factor, 0.001),
        1,
      ),
      longitudeDelta: Math.min(
        Math.max(region.longitudeDelta * factor, 0.001),
        1,
      ),
    };

    mapRef.current.animateToRegion(newRegion, 500);
    setRegion(newRegion);
  };

  const goToUserLocation = () => {
    if (userLocation && mapRef.current) {
      const newRegion = {
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      mapRef.current.animateToRegion(newRegion, 1000);
      setRegion(newRegion);
    }
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!region || !userLocation) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00897B" />
        <Text style={styles.loadingText}>Konum alınıyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={false}
      >
        <Marker coordinate={userLocation} title="Buradasınız" pinColor="blue" />

        {events.map(event => {
          const coord = getCoordinates(event.city, event.district);
          if (!coord) {
            console.warn('Etkinlik koordinatı bulunamadı:', event);
            return null;
          }

          return (
            <Marker
              key={event.id}
              coordinate={coord}
              title={event.title}
              description={event.description}
              onPress={() => {
                setSelectedEvent(event);
                setModalVisible(true);
              }}
            />
          );
        })}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => zoomMap(0.5)} style={styles.button}>
          <Text style={styles.icon}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => zoomMap(2)} style={styles.button}>
          <Text style={styles.icon}>−</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToUserLocation} style={styles.button}>
          <Text style={styles.icon}>✈</Text>
        </TouchableOpacity>
      </View>

      <EventDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        event={selectedEvent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E2E2E',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  controls: {
    position: 'absolute',
    right: 20,
    top: 40,
    backgroundColor: '#2E2E2E',
    borderRadius: 10,
    padding: 6,
  },
  button: {
    padding: 6,
    alignItems: 'center',
  },
  icon: {
    color: '#00897B',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default GeoLocationMap;
