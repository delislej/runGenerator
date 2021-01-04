
import React, { useState } from 'react';

import {ScrollView, Text, TouchableOpacity, TouchableHighlight, Modal, View, StyleSheet, Dimensions} from 'react-native';
import {Context} from '../../context/Store'
import { useContext } from 'react';
import HistoryCard from '../HistoryCard';



export default function HistoryScreen({navigation}) {
  const [state, dispatch] = useContext(Context);
  const [trash,setTrash] = useState([])
  const [modalVisible,setModalVisible] = useState(false)
  const [buttonsVisible,setButtonsVisible] = useState(true)
  async function cardButtonHandler(task, id, line){
    switch(task) {
      case 'delete':
        let temp = trash;
        temp.push(line);
        setTrash(temp);
        dispatch({type: 'REMOVE_ROUTE', payload: line});
        break
      case 'select':
        dispatch({type: 'SELECT_ROUTE', payload: line});
        navigation.navigate('home', {route: line})
        break
        
    }
  }
  
  function undoDelete() {
    if(trash.length > 0){
      let route = trash;
      dispatch({type: 'ADD_ROUTE', payload: route.pop()});
      setTrash(route)
      }
      
      }

function clearHistoryButton() {
if(state.routes.length > 0 && buttonsVisible){
  let styl = trash.length > 0 ? styles.appButtonContainer : styles.singleButtonContainer
    
      return <TouchableOpacity key="clear" onPress={() => {/*dispatch({type: 'CLEAR_ROUTES', payload: []});*/ setModalVisible(true); setButtonsVisible(false)}} style={styl}>
      <Text style={styles.appButtonText}>Clear History</Text>
      </TouchableOpacity>
  
  }
  
  }

  function undoButton() {
    if(trash.length >= 1 && buttonsVisible){
      let styl = state.routes.length > 0 ? styles.appButtonContainer : styles.singleButtonContainer
        return <TouchableOpacity key="undo" onPress={() => {undoDelete()}} style={styl}>
      <Text style={styles.appButtonText}>Undo</Text>
      </TouchableOpacity>
      }
      
      }


  function makeCards() {

    let arr = state.routes;
    if(arr.length < 1){
      return <View style={{ justifyContent: 'center', marginTop: Dimensions.get('window').height*0.50-40}}><Text style={styles.noHistoryText}>No History</Text><Text style={styles.noHistoryText}>Save some routes</Text></View>
    }
    let temp = []
    for(let i = 0; i < arr.length; i++){
      temp.push(<HistoryCard line={arr[i] } key={arr[i]} distance={0} test={cardButtonHandler}/>)
    }
   
    return <ScrollView style={styles.mapStyle}>{temp}</ScrollView>
  }

  return (
    <View>
      <View style={{height: 40}}></View>
      <Modal 
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false); setButtonsVisible(true)
          }}>
          <View style={styles.modalView}>
          <TouchableOpacity key="cancel" onPress={() => { setModalVisible(false); setButtonsVisible(true)}} style={styles.modalCancelButtonContainer}>
      <Text style={styles.appButtonText}>Cancel</Text>
      </TouchableOpacity>

            <TouchableOpacity key="clear" onPress={() => {dispatch({type: 'CLEAR_ROUTES', payload: []}); setModalVisible(false); setButtonsVisible(true)}} style={styles.modalClearButtonContainer}>
      <Text style={styles.appButtonText}>Clear History</Text>
      </TouchableOpacity>
          </View>
        </Modal>
        
        
          {makeCards()}
          
        
        <View style={{ flexDirection:"row" }}>
        {undoButton()}
        {clearHistoryButton()}
         
          
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    
    
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height-100
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
    width: Dimensions.get('window').width/2
  },
  singleButtonContainer: {
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
  },
  noHistoryText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    textAlign: 'center',
    textTransform: "uppercase"
  }, 
  modalView: {
    backgroundColor: 'white',
    justifyContent: 'center',
    width: Dimensions.get('window').width*.8,
    height: Dimensions.get('window').height*0.25,
    alignSelf: 'center',
    top: Dimensions.get('window').height*0.15,
    borderRadius: Dimensions.get('window').height*0.03,
    alignItems: 'center'
  },
  modalClearButtonContainer: {
    elevation: 8,
    backgroundColor: "#cc0000",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    width: Dimensions.get('window').width/2
  },
  modalCancelButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    width: Dimensions.get('window').width/2
  }
  

})






