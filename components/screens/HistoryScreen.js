
import React from 'react';

import {ScrollView, Text} from 'react-native';
import {Context} from '../../context/Store'
import { useContext } from 'react';
import HistoryCard from '../HistoryCard';



export default function HistoryScreen({navigation}) {
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
    if(arr.length < 1){
      return <Text>No History</Text>
    }
    let temp = []
    for(let i = 0; i < arr.length; i++){
      temp.push(<HistoryCard line={arr[i] } key={i} id={i} distance={0} test={cardButtonHandler}/>)
    }
    return temp
  }

  return (
        <ScrollView>
    {makeCards()}
        </ScrollView>
  );
}






