import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e) => {
    if (e.value && e.value.length > 0) {
      const command = e.value[0].toLowerCase();
      setTranscript(command);
      processCommand(command);
    }
  };

  const startListening = async () => {
    setIsListening(true);
    setTranscript('');
    setResponse('');
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const processCommand = useCallback((command: string) => {
    let response = "I'm sorry, I didn't understand that command.";

    if (command.includes('hello') || command.includes('hi')) {
      response = "Hello! How can I assist you today?";
    } else if (command.includes('how are you')) {
      response = "I'm functioning well, thank you for asking. How can I help you?";
    } else if (command.includes('time')) {
      const now = new Date();
      response = `The current time is ${now.toLocaleTimeString()}.`;
    } else if (command.includes('date')) {
      const now = new Date();
      response = `Today's date is ${now.toLocaleDateString()}.`;
    } else if (command.includes('weather')) {
      response = "I'm sorry, I don't have access to real-time weather data. You might want to check a weather app for that information.";
    }

    setResponse(response);
    speak(response);
  }, []);

  const speak = useCallback((text: string) => {
    Speech.speak(text);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Assistant</Text>
      <TouchableOpacity
        style={[styles.button, isListening && styles.listeningButton]}
        onPress={isListening ? stopListening : startListening}
      >
        <Text style={styles.buttonText}>
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </Text>
      </TouchableOpacity>
      {transcript ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>You said:</Text>
          <Text style={styles.resultText}>{transcript}</Text>
        </View>
      ) : null}
      {response ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Assistant response:</Text>
          <Text style={styles.resultText}>{response}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  listeningButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
  },
});

