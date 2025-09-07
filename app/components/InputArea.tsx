import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../src/constants/AppConstants';

interface InputAreaProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleSendPress = () => {
    if (inputText.trim()) {
      onSend(inputText);
      setInputText('');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Paste news content or type a message..."
        placeholderTextColor="#9ca3af"
        multiline
        maxLength={1000}
        editable={!isLoading}
      />
      <TouchableOpacity
        style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
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
    backgroundColor: COLORS.BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: SIZES.INPUT_BORDER_RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 120,
    backgroundColor: COLORS.AI_BUBBLE,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  sendButton: {
    width: SIZES.SEND_BUTTON_SIZE,
    height: SIZES.SEND_BUTTON_SIZE,
    borderRadius: SIZES.BORDER_RADIUS,
    backgroundColor: COLORS.REAL,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.MARGIN,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.DISABLED,
  },
});

export default InputArea;