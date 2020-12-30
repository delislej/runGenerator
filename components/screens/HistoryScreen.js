
import React from 'react';

import { StyleSheet, Text, View, Dimensions, Button, ScrollView} from 'react-native';
import {Context} from '../../context/Store'
import { useState, useEffect, useContext } from 'react';
import HistoryCard from '../HistoryCard';



export default function HistoryScreen({navigation}) {

  
  const [cards, setCards] = useState([])
  const [state, dispatch] = useContext(Context);
  async function cardButtonHandler(task, id, line){
    switch(task) {
      case 'delete':
        dispatch({type: 'REMOVE_ROUTE', payload: line});
        break
      case 'select':
        console.log("printing: " + id)
        dispatch({type: 'SELECT_ROUTE', payload: line});
        navigation.navigate('home', {route: line})
        break
    }
  }
  

  function makeCards() {
    let arr = state.routes;
    let temp = []
    console.log("updating cards")
    for(let i = 0; i < arr.length; i++){
      temp.push(<HistoryCard line={arr[i] } key={i} id={i} distance={0} test={cardButtonHandler}/>)
    }
    if(temp == cards){
      console.log("no change")
    }
    return temp
  }
  
      
   

  
  

  

  return (
        <ScrollView>
    {makeCards()}
        </ScrollView>
  );
}






