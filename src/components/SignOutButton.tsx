import { useClerk } from '@clerk/clerk-expo'
import { router } from 'expo-router'
import { Alert, Text, TouchableOpacity, StyleSheet } from 'react-native'

const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  
  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to home page
      router.replace('/')
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      
      let message = 'An error occurred during sign out'
      if (err?.errors?.[0]?.longMessage) {
        message = err.errors[0].longMessage
      }
      Alert.alert('Sign out error', message)
    }
  }
  
  return (
    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
      <Text style={styles.buttonText}>Sign out</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default SignOutButton