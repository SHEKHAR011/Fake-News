import { useSignUp } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/contexts/ThemeContext';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const { theme } = useTheme();

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded || loading) return

    setLoading(true)
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      
      let message = 'An error occurred during sign up'
      if (err?.errors?.[0]?.longMessage) {
        message = err.errors[0].longMessage
      }
      Alert.alert('Sign up error', message)
    } finally {
      setLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded || loading) return

    setLoading(true)
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
        Alert.alert('Verification error', 'Verification unsuccessful. Please try again.')
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      
      let message = 'An error occurred during verification'
      if (err?.errors?.[0]?.longMessage) {
        message = err.errors[0].longMessage
      }
      Alert.alert('Verification error', message)
    } finally {
      setLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
        <View style={styles.header}>
          <Text style={[styles.appTitle, { color: theme.DEFAULT_TEXT }]}>Fake News</Text>
          <Text style={[styles.appSubtitle, { color: theme.ACCENT }]}>Detector</Text>
        </View>
        <Text style={[styles.title, { color: theme.DEFAULT_TEXT }]}>Verify your email</Text>
        <Text style={[styles.subtitle, { color: theme.TIMESTAMP }]}>{"We've sent a verification code to your email"}</Text>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.INPUT_BACKGROUND,
            borderColor: theme.INPUT_BORDER,
            color: theme.DEFAULT_TEXT
          }]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor={theme.INPUT_PLACEHOLDER}
          keyboardType="numeric"
          onChangeText={(code) => setCode(code)}
        />
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled, { backgroundColor: loading ? theme.DISABLED : theme.ACCENT }]} 
          onPress={onVerifyPress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify'}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.BACKGROUND }]}>
      <View style={styles.header}>
        <Text style={[styles.appTitle, { color: theme.DEFAULT_TEXT }]}>Fake News</Text>
        <Text style={[styles.appSubtitle, { color: theme.ACCENT }]}>Detector</Text>
      </View>
      <Text style={[styles.title, { color: theme.DEFAULT_TEXT }]}>Create account</Text>
      <Text style={[styles.subtitle, { color: theme.TIMESTAMP }]}>Join our fact-checking community</Text>
      
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
        onChangeText={(email) => setEmailAddress(email)}
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
        onPress={onSignUpPress}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Sign up'}</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text style={{ color: theme.DEFAULT_TEXT }}>Already have an account? </Text>
        <Link href="/(auth)/sign-in" style={[styles.link, { color: theme.ACCENT }]}>
          <Text style={{ color: theme.ACCENT }}>Sign in</Text>
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
    // Simple spinner animation would be added here in a real implementation
    // For now, using a static representation
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
})