import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getHistory() {
    try {
      const jsonValue = await AsyncStorage.getItem('@history')
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch(e) {
      // error reading value
      console.log(e)
    }
  }

export async function storeHistory (value) {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@history', jsonValue)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }