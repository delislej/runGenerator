
import React from 'react';

import {ScrollView, Text, TouchableOpacity, View, StyleSheet, Dimensions} from 'react-native';
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
        dispatch({type: 'SELECT_ROUTE', payload: line});
        navigation.navigate('home', {route: line})
        break
        
    }
  }
  

function clearHistoryButton() {
if(state.routes.length > 0){
  return <TouchableOpacity key="clear" onPress={() => {dispatch({type: 'CLEAR_ROUTES', payload: []});}} style={styles.appButtonContainer}>
  <Text style={styles.appButtonText}>Clear History</Text>
  </TouchableOpacity>
}
  
}
  function makeCards() {

    let arr = state.routes;
    if(arr.length < 1){
      return <Text>No History</Text>
    }
    let temp = []
    for(let i = 0; i < arr.length; i++){
      temp.push(<HistoryCard line={arr[i] } key={arr[i]} distance={0} test={cardButtonHandler}/>)
    }
   
    return temp
  }

  return (
    <View>
        <ScrollView style={styles.mapStyle}>
          {makeCards()}
        </ScrollView>
        <View>
          {clearHistoryButton()}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    
    
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height-60
  },
  card: {
    borderRadius: 8,
    width: Dimensions.get('window').width-20,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 20,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 40,
    backgroundColor: '#acacac'
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    paddingVertical: 13,
    paddingHorizontal: 12,
    width: Dimensions.get('window').width
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: 'center',
    textTransform: "uppercase"
  }
  

})






