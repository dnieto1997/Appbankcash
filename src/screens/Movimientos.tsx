import React, { useState, useEffect } from 'react'
import {
  StyleSheet, View, Image, ImageBackground,ScrollView,FlatList,RefreshControl,TouchableOpacity,Modal,Text
} from 'react-native';

 import AsyncStorage from '@react-native-async-storage/async-storage'; 





const Movimientos = () => {

  const[token,setToken] =useState<string>('')
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const[totalsend,setTotalsend] =useState<string>('')
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  
  useEffect(()=>{
    const obtenerToken =async () =>{
    try {
  const token:any =await AsyncStorage.getItem('token') 

      setToken(token)

      console.log(token)
     
   
    } catch (error) {
      console.log(error)
      
    }
    
    }
    obtenerToken()
    
    },[])

    useEffect(()=>{
      obtenerMovimientos()
    },[token])


    const onRefresh = () => {
      setRefreshing(true); // Start the loading indicator
      obtenerMovimientos().then(() => setRefreshing(false)); // Fetch balance and stop loading when done
    };
  

    const obtenerMovimientos = async () => {
      try {
        const res = await fetch('https://bankcashapi-production.up.railway.app/api/transactions', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data1 = await res.json();
          console.log(data1)
     
          setData(data1);
          const balance = parseFloat(data1[0].totalSent).toFixed(3);
         
          
          setTotalsend(balance)
     
      } catch (err) {
        console.log(err);
      }
    };

 
    const renderItem = ({ item }) => {
    
    
      const toggleModal = (transaction: null) => {
        setSelectedTransaction(transaction);
        setModalVisible(!isModalVisible);
      };

      

      const formatDate = (createdAt) => {
        const dateObj = new Date(createdAt);
      
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
        const seconds = String(dateObj.getSeconds()).padStart(2, "0");
      
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

    
      return (
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
          <View >
            {item.datos.map((dato) => {
              const { taxes } = dato;
              const balance = parseFloat(dato.conversionResultAfterTax).toFixed(2);
              const tax = parseFloat(dato.taxes[0].taxAmountInUSD).toFixed(3);
    
              return (
                <View key={dato.idTransaction} style={{ left:'5%'}} >
                  <TouchableOpacity onPress={() => toggleModal(dato)} >
                    <View style={styles.movimientoContainer} >
                      <Image source={require('../assets/icons/send.png')} style={styles.iconoDolar} />
                      <View style={{ flexDirection: 'row'}} >
                        <View style={{width:'52%'}} >
                        <Text style={styles.nombreUsuario}>
                          {dato.sourceAccount.user.names} {dato.sourceAccount.user.surnames}
                        </Text>
                        </View >
                       <View style={{width:'37%'}}>
                       <Text  style={styles.nombreUsuario2} >${balance} USD </Text>
                       </View>
                        
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View key={taxes.idTax} style={styles.movimientoContainer}>
                    <Image source={require('../assets/icons/payout.png')} style={styles.iconoDolar} />
                    <View style={{ flexDirection: 'row' }}>
                     <View style={{width:'52%'}} >
                     <Text style={styles.nombreUsuario}>Transaction Fee</Text>
                     </View>
                   <View style={{width:'37%'}}>
                   <Text style={styles.nombreUsuario2}>${tax} USD </Text>
                   </View>
                    
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
    
          {/* Modal */}
          <Modal animationType="fade" transparent={true} visible={isModalVisible}>
  <View style={styles.modalContainer}>
    {/* Display the selected transaction details */}
    {selectedTransaction && (
      <View style={styles.innerModal}>
        <ScrollView>
          <Text style={styles.modalTitle}>Movement Details</Text>

          <Text style={styles.modalSubtitle}>Shipment Made</Text>

          <View style={styles.tableRow}>
            <Text style={styles.modalText}>Send To</Text>
            <Text style={styles.modalInfo}>{selectedTransaction.targetAccount.user.names} {selectedTransaction.targetAccount.user.surnames}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.modalText}>Shipment Made From</Text>
            <Text style={styles.modalInfo}>{selectedTransaction.country.name}</Text>
            <Image source={{ uri: selectedTransaction.country.flagPng }} style={styles.countryFlag} />
          </View>

      

          <View style={styles.tableRow}>
            <Text style={styles.modalText}>Amount in currency Local without tax</Text>
            <Text style={styles.modalInfo}>$ {selectedTransaction.amount}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.modalText}>Amount in local currency with taxes</Text>
            <Text style={styles.modalInfo}>$ {selectedTransaction.amountAfterTax}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.modalText}>Amount in USD without tax</Text>
            <Text style={styles.modalInfo}>${parseFloat(selectedTransaction.conversionResult).toFixed(2)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.modalText}>Amount After Tax In USD</Text>
            <Text style={styles.modalInfo}>${parseFloat(selectedTransaction.conversionResultAfterTax).toFixed(2)}</Text>
          </View>


          <View style={styles.tableRow}>
            <Text style={styles.modalText}>Transaction Tax</Text>
            <Text style={styles.modalInfo}>(10 %)</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.modalText}>Tax Amount in COP</Text>
            <Text style={styles.modalInfo}>{parseFloat(selectedTransaction.taxes[0].taxAmount).toFixed(2)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.modalText}>Tax Amount In USD</Text>
            <Text style={styles.modalInfo}>${parseFloat(selectedTransaction.taxes[0].taxAmountInUSD).toFixed(2)}</Text>
          </View>

          

         

          <View style={styles.tableRow}>
            <Text style={styles.modalText}>Date</Text>
            <Text style={styles.modalInfo}>{formatDate(selectedTransaction.createdAt)}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.modalText}>Reference</Text>
            <Text style={styles.modalInfo}>{selectedTransaction.reference}</Text>
          </View>


      

          {/* Add a close button or gesture to close the modal */}
          <TouchableOpacity onPress={() => toggleModal(null)} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )}
  </View>
</Modal>



        </ScrollView>
      );
    };








  return (

    <ImageBackground source={require('../assets/images/bg.jpeg')} style={{flex:1}}> 
  

   <View style={styles.container}>

   {data.length === 0 ? (
          <Text style={styles.titulo}>No tienes movimientos realizados</Text>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item, index) => `${item.fecha}_${index}`}
            renderItem={renderItem}
           
          />
        )}
    </View>

  <View style={styles.container2}>
<Text style={styles.titulo}> Total Send: ${totalsend} USD</Text>
</View>
       </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 7,
    marginTop:'60%',
  
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
   
  },
  movimientoContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    marginBottom: 16,

  },
  iconoDolar: {
    width: 32,
    height: 32,
    marginRight: 8,
    
  }, nombreUsuario: {
    fontSize: 18,
    margin:8,
   textAlign:'left',
    color:'black'
    
  }, nombreUsuario2: {
    fontSize: 18,
    margin:8,
   textAlign:'left',
    color:'black'
    
  },
  detalleMovimiento: {
    fontSize: 16,
  },container2:{
    margin:'10%',
    width:'80%',
    alignSelf:'center',
    height:'10%',
    borderRadius:2,
    alignItems:'center',
    borderColor:'black'
   
  },modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adjust the opacity (0.5) as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerModal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxWidth: '100%',
    maxHeight:'70%'
  },modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  modalInfo: {
    fontSize: 16,
  },
  countryFlag: {
    width: 30,
    height: 20,
    marginLeft: 5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default Movimientos