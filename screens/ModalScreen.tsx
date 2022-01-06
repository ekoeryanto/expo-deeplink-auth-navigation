import { getStateFromPath } from '@react-navigation/native';
import {
  FirebaseRecaptchaBanner,
  FirebaseRecaptchaVerifierModal,
} from 'expo-firebase-recaptcha';
import { StatusBar } from 'expo-status-bar';
import { getApp } from 'firebase/app';
import {
  ApplicationVerifier,
  getAuth,
  PhoneAuthProvider,
  signInAnonymously,
  signInWithCredential,
} from 'firebase/auth';
import { useRef, useState } from 'react';
import {
  Button,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { Text, View } from '../components/Themed';
import { useAuth } from '../providers/Auth';
import { RootStackScreenProps } from '../types';

export default function ModalScreen({
  navigation,
  route,
}: RootStackScreenProps<'Modal'>) {
  const { isAuthenticated } = useAuth();
  const recaptchaVerifier = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('+6285161500699');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, showMessage] = useState<any>();
  const attemptInvisibleVerification = true;
  const firebaseConfig = getApp().options;
  const auth = getAuth();
  const signIn = async () => {
    await signInAnonymously(auth);
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      const { next = '/' } = route.params ?? {};
      const nstate = getStateFromPath(next);

      navigation.reset({
        index: 0,
        routes: nstate?.routes as any[],
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal [ {route.params?.next} ]</Text>
      {isAuthenticated && (
        <Button title="Signout" onPress={() => auth.signOut()} />
      )}
      <FirebaseRecaptchaVerifierModal
        title="Verifikasi"
        cancelLabel="Batal"
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification
      />
      <Text style={{ marginTop: 20 }}>Enter phone number</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        placeholder="+1 999 999 9999"
        autoFocus
        autoCompleteType="tel"
        keyboardType="phone-pad"
        textContentType="telephoneNumber"
        value={phoneNumber}
        onChangeText={(_phoneNumber) => setPhoneNumber(_phoneNumber)}
      />
      <Button
        title="Send Verification Code"
        disabled={!phoneNumber}
        onPress={async () => {
          // The FirebaseRecaptchaVerifierModal ref implements the
          // FirebaseAuthApplicationVerifier interface and can be
          // passed directly to `verifyPhoneNumber`.
          try {
            const phoneProvider = new PhoneAuthProvider(auth);
            const _verificationId = await phoneProvider.verifyPhoneNumber(
              phoneNumber,
              recaptchaVerifier.current as unknown as ApplicationVerifier
            );
            setVerificationId(_verificationId);
            showMessage({
              text: 'Verification code has been sent to your phone.',
            });
          } catch (err: any) {
            showMessage({ text: `Error: ${err.message}`, color: 'red' });
          }
        }}
      />
      <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
      <TextInput
        style={{ marginVertical: 10, fontSize: 17 }}
        editable={!!verificationId}
        placeholder="123456"
        onChangeText={setVerificationCode}
      />
      <Button
        title="Confirm Verification Code"
        disabled={!verificationId}
        onPress={async () => {
          try {
            const credential = PhoneAuthProvider.credential(
              verificationId,
              verificationCode
            );
            await signInWithCredential(auth, credential);
            showMessage({ text: 'Phone authentication successful 👍' });
          } catch (err: any) {
            showMessage({ text: `Error: ${err.message}`, color: 'red' });
          }
        }}
      />
      {message ? (
        <TouchableOpacity
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: '#ffffff', justifyContent: 'center' },
          ]}
          onPress={() => showMessage(undefined)}>
          <Text
            style={{
              color: message.color || 'blue',
              fontSize: 17,
              textAlign: 'center',
              margin: 20,
            }}>
            {message.text}
          </Text>
        </TouchableOpacity>
      ) : undefined}
      {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <Button title="Signin" onPress={signIn} />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
