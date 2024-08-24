import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import 'react-native-reanimated'
import * as LocalAuthentication from 'expo-local-authentication'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { useColorScheme } from '@/hooks/useColorScheme'
import { UserProvider } from '@/src/context/UserContext'
import Toast from 'react-native-toast-message'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [unlocked, setUnlocked] = useState(false)
  const [isFaceIDSupported, setIsFaceIDSupported] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  useEffect(() => {
    ;(async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync()
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync()
      setIsFaceIDSupported(
        compatible &&
          supportedTypes.includes(
            LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
          )
      )
    })()
  }, [])

  if (!loaded) {
    return null
  }
  const handleBiometricAuth = async () => {
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate with Face ID',
      fallbackLabel: 'Use Device Passcode',
      disableDeviceFallback: false,
    })

    if (biometricAuth.success) {
      setAuthenticated(true)
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Authentication failed, please try again',
        position: 'bottom',
      })
    }
  }

  if (!unlocked) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{'Welcome to SecureVox'}</Text>
        <Text style={styles.description}>
          {'Please authenticate to access the app'}
        </Text>
        <Image
          source={require('../assets/images/appIcon.png')}
          style={styles.logo}
        />
        <TouchableOpacity style={styles.button} onPress={handleBiometricAuth}>
          <Text style={styles.buttonText}>{'Access'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </UserProvider>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#304FFE',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
