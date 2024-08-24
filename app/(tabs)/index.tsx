import { Image, StyleSheet, Platform, Alert, View, Text, Button} from 'react-native';
import { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export default function HomeScreen() {
  const [isFaceIDSupported, setIsFaceIDSupported] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      setIsFaceIDSupported(
        compatible && supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
      );
    })();
  }, []);

  const handleBiometricAuth = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Face ID',
      fallbackLabel: 'Use Device Passcode',
      disableDeviceFallback: false,
    });

    if (biometricAuth.success) {
      setAuthenticated(true);
    } else {
      Alert.alert('Authentication failed', 'Please try again');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {authenticated ? (
        <Text>Welcome, you are authenticated!</Text>
      ) : (
        <View>
          <Text>Face ID is {isFaceIDSupported ? 'available' : 'not available'} on this device.</Text>
          <Button title="Authenticate with Face ID" onPress={handleBiometricAuth} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
