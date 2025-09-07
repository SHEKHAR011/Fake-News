import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
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
      <View style={[
        styles.inputWrapper,
        { 
          borderColor: theme.INPUT_BORDER, 
          backgroundColor: theme.INPUT_BACKGROUND,
        }
      ]}>
        <TextInput
          style={[
            styles.textInput, 
            { 
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
            { backgroundColor: (!inputText.trim() || isLoading) ? theme.DISABLED : theme.ACCENT }
          ]}
          onPress={handleSendPress}
          disabled={!inputText.trim() || isLoading}
        >
          <MaterialIcons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
    // Add some extra padding for better touch handling
    padding: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
    // Ensure proper touch handling
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    // Ensure proper touch handling
    zIndex: 1,
    // Add hitSlop for better touch target
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  },
});

export default InputArea;