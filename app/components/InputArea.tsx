import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../src/contexts/ThemeContext';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const { theme } = useTheme();
  const [inputText, setInputText] = useState('');

  const handleSendPress = () => {
    if (inputText.trim()) {
      onSend(inputText);
      setInputText('');
    }
  };

  return (
    <View style={[styles.inputContainer, { backgroundColor: theme.BACKGROUND, borderTopColor: theme.BORDER }]}>
      <TextInput
        style={[
          styles.textInput, 
          { 
            borderColor: theme.INPUT_BORDER, 
            backgroundColor: theme.INPUT_BACKGROUND,
            color: theme.DEFAULT_TEXT
          }
        ]}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Paste news content or type a message..."
        placeholderTextColor={theme.INPUT_PLACEHOLDER}
        multiline
        maxLength={1000}
        editable={!isLoading}
      />
      <TouchableOpacity
        style={[
          styles.sendButton, 
          { backgroundColor: (!inputText.trim() || isLoading) ? theme.DISABLED : theme.REAL }
        ]}
        onPress={handleSendPress}
        disabled={!inputText.trim() || isLoading}
      >
        <MaterialIcons name="send" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 30,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 120,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default InputArea;