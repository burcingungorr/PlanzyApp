import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import auth from '@react-native-firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchUserInfo } from '../../redux/slices/usernameSlice';
import Logo from '../../components/Logo';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const requestPermissionAndSubscribe = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('🚀 Push notification izin verildi.');

        messaging()
          .subscribeToTopic('highScores')
          .then(() => console.log('highScores topicine abone olundu'))
          .catch(err => console.error('Topic aboneliği hatası:', err));

        const fcmToken = await messaging().getToken();
        if (fcmToken && auth().currentUser) {
          await firestore()
            .collection('users')
            .doc(auth().currentUser.uid)
            .set({ fcmToken }, { merge: true });
          console.log("FCM Token Firestore'a kaydedildi.");
        }
      } else {
        console.log('Push notification izni reddedildi.');
      }
    };
    requestPermissionAndSubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password,
      );
      const userId = userCredential.user.uid;

      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await firestore()
          .collection('users')
          .doc(userId)
          .set({ fcmToken }, { merge: true });
      }

      await dispatch(fetchUserInfo());
      navigation.goBack();
    } catch (error) {
      Alert.alert('Giriş Hatası', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="email-outline"
          size={24}
          color="#00897B"
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { flexGrow: 1 }]}
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor="#999"
          multiline={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="lock-outline"
          size={24}
          color="#00897B"
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { flexGrow: 1 }]}
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          placeholderTextColor="#999"
          multiline={false}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <MaterialCommunityIcons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color="#00897B"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Giriş Yap</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.text}>Hesabın yok mu?</Text>
        <Text style={styles.text}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#2E2E2E',
    paddingTop: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00897B',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 60,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    fontSize: 18,
    color: '#000',
  },
  eyeIcon: {
    padding: 4,
  },
  button: {
    backgroundColor: '#00897B',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    marginTop: 15,
    color: '#00897B',
    textAlign: 'center',
    fontSize: 16,
  },
});
