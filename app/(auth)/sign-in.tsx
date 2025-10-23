import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import React from 'react'
import { useTheme } from '../../src/contexts/ThemeContext';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const { theme } = useTheme();

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded || loading) return

    setLoading(true)
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
        Alert.alert('Error', 'Sign in unsuccessful. Please check your credentials.')
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      
      let message = 'An error occurred during sign in'
      if (err?.errors?.[0]?.longMessage) {
        message = err.errors[0].longMessage
      }
      Alert.alert('Sign in error', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
      <View style={styles.header}>
        <Text style={[styles.appTitle, { color: theme.DEFAULT_TEXT }]}>Fake News</Text>
        <Text style={[styles.appSubtitle, { color: theme.ACCENT }]}>Detector</Text>
      </View>
      <Text style={[styles.title, { color: theme.DEFAULT_TEXT }]}>Welcome back</Text>
      <Text style={[styles.subtitle, { color: theme.TIMESTAMP }]}>Sign in to continue fact-checking</Text>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.INPUT_BACKGROUND,
          borderColor: theme.INPUT_BORDER,
          color: theme.DEFAULT_TEXT
        }]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor={theme.INPUT_PLACEHOLDER}
        keyboardType="email-address"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
      />
      <TextInput
        style={[styles.input, { 
          backgroundColor: theme.INPUT_BACKGROUND,
          borderColor: theme.INPUT_BORDER,
          color: theme.DEFAULT_TEXT
        }]}
        value={password}
        placeholder="Enter password"
        placeholderTextColor={theme.INPUT_PLACEHOLDER}
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled, { backgroundColor: loading ? theme.DISABLED : theme.ACCENT }]} 
        onPress={onSignInPress}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign in'}</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={{ color: theme.DEFAULT_TEXT }}>Don't have an account? </Text>
        <Link href="/(auth)/sign-up" style={[styles.link, { color: theme.ACCENT }]}>
          <Text style={{ color: theme.ACCENT }}>Sign up</Text>
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginTop: -8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    height: 56,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  link: {
    textDecorationLine: 'underline',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
})