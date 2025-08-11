import React, { useState } from 'react';
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
import firestore from '@react-native-firebase/firestore';
import { useDispatch } from 'react-redux';
import { fetchUserInfo } from '../../redux/slices/usernameSlice';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../components/Logo';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const userId = userCredential.user.uid;

      await firestore().collection('users').doc(userId).set({
        id: userId,
        email,
        fullName,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      await dispatch(fetchUserInfo());
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Kayıt Hatası', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo />

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons
          name="account-outline"
          size={24}
          color="#00897B"
          style={styles.icon}
        />
        <TextInput
          style={[styles.input, { flexGrow: 1 }]}
          placeholder="Kullanıcı Adı"
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#999"
          multiline={false}
        />
      </View>

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
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.text}>Hesabın var mı?</Text>
        <Text style={styles.text}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#2E2E2E',
    paddingBottom: 95,
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
