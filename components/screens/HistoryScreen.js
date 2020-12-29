
import React from 'react';

import { StyleSheet, Text, View, Dimensions, Button, ScrollView} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {storeHistory, getHistory} from '../../Utils/dataManagement'
import { useState, useEffect } from 'react';
import HistoryCard from '../HistoryCard';



export default function HistoryScreen() {

  const [history, setHistory] = useState([])
  const [cards, setCards] = useState([])
  

  useFocusEffect(() => {
    (async () => {
      let lines = []
      lines = await getHistory()
      let temp = []
  for(let i = 0; i < lines.length; i++){
    temp.push(<HistoryCard line={lines[i] } key={i} distance={0}/>)
  }
  setCards(temp);
    })();
  }, []);
  

  

  return (
        <ScrollView>
        
    {cards}
        
        </ScrollView>
  );
}






