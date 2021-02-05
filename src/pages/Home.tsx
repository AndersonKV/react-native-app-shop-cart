import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  FlatList,
  Image,
  Dimensions,
  Modal,
  TouchableHighlight,
  Alert,
} from 'react-native';

import data from '../assets/products.json';

import {faSearch, faShoppingBag} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import {Data} from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY} from '../utils';

const Home: React.FC = ({navigation, route}) => {
  const [products, setProducts] = useState<Data[]>();
  const [item, setItem] = useState<Data[]>();
  const [modalVisible, setModalVisible] = useState(false);
  const [positionHide, setPositionHide] = useState('100%');
  const dimensions = Dimensions.get('window');
  const imageHeight = Math.round((dimensions.width * 9) / 16);
  const imageWidth = Math.round((dimensions.width * 9) / 16);

  useEffect(() => {
    async function init() {
      //adiciona id ao array
      data.forEach((element: Data, index: number) => {
        element.id = index;

        if (!element.image) {
          element.image =
            'https://image.freepik.com/free-vector/404-error-sign_23-2147508325.jpg';
        }
      });

      setProducts(data);

      navigation.addListener('focus', async () => {
        const getListProduct = await AsyncStorage.getItem(STORAGE_KEY);
        const getProducts = JSON.parse(getListProduct || '[]');

        setItem(getProducts);
      });

      //await AsyncStorage.clear();
    }
    init();
  }, []);

  const getErrorImage = () => {
    console.log('error');
    // const img =
    //   'https://image.freepik.com/free-vector/404-error-sign_23-2147508325.jpg';
    // this.src = img;
  };

  const openCart = () => {
    setModalVisible(!modalVisible);
  };

  const deleteItem = async (itemReceive: Data) => {
    const arr: any = [];

    item &&
      item.forEach((element) => {
        if (element.id !== itemReceive.id) {
          arr.push(element);
        }
      });

    const stringifiedArray = JSON.stringify(arr);
    await AsyncStorage.setItem(STORAGE_KEY, stringifiedArray);

    setItem(arr);
  };

  const HeaderComponent = () => {
    return (
      <View
        style={{
          borderBottomColor: '#d3d3d3',
          padding: 10,
          borderBottomWidth: 1,
        }}>
        <View
          style={{
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'flex-end',
          }}>
          <TouchableOpacity onPress={openCart}>
            <FontAwesomeIcon
              style={{
                alignSelf: 'flex-end',
              }}
              icon={faShoppingBag}
              size={40}
              color="silver"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CartComponent = () => {
    return (
      <View
        style={{
          backgroundColor: '#d3d3d3',
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 5,
        }}>
        <View
          style={{
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={openCart}>
            <Text
              style={{
                textAlign: 'left',
                fontSize: 20,
                padding: 10,
              }}>
              X
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              textAlign: 'center',
              flex: 1,
            }}>
            SACOLA ({item && item.length})
          </Text>
        </View>

        {item?.length !== 0 ? (
          <View>
            <Text style={{textAlign: 'center', padding: 10}}>
              Valor: R$:{calculatePrice()}
            </Text>
            <FlatList
              keyExtractor={(item) => item.id.toString()}
              data={item}
              style={{backgroundColor: 'red'}}
              numColumns={1}
              renderItem={({item}) => (
                <View
                  style={{
                    backgroundColor: 'yellow',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 20,
                  }}>
                  <Text>
                    {item.name} ({item?.sizeChozen})
                  </Text>
                  <Text>{item.actual_price}</Text>
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderWidth: 1,
                      borderColor: '#d1d1d1',
                    }}
                    source={{
                      uri: `${item.image}`,
                    }}
                  />
                  <TouchableOpacity>
                    <Button
                      title="X"
                      onPress={() => deleteItem(item)}
                      color="red"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        ) : (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <View
              style={{
                alignItems: 'center',
              }}>
              <FontAwesomeIcon icon={faShoppingBag} size={40} color="black" />
              <Text style={{marginTop: 10}}>Sua sacola está vazia</Text>
              <Text style={{marginBottom: 10}}>
                Navegue pelos nossos produtos e adicione no carrinho.
              </Text>
              <Button onPress={openCart} title="Comprar mais" color="black" />
            </View>
          </View>
        )}
      </View>
    );
  };

  const calculatePrice = () => {
    const arr: any = [];

    item &&
      item.forEach((element) => {
        const removeCipher = element.actual_price.replace('R$', '').trim();
        const value = parseFloat(removeCipher.replace(',', '.'));
        console.log(value + ' - ' + element.id);
        arr.push(value);
      });

    return eval(arr.join('+')).toFixed(2);
    //console.log(eval(arr.join('+')).toFixed(2));
    // console.log(arr.reduce((a, b) => a + b, 0));
  };
  return (
    <View style={styles.container}>
      <HeaderComponent />
      {modalVisible === true ? <CartComponent /> : null}

      <FlatList
        keyExtractor={(item) => item.id.toString()}
        data={products}
        numColumns={2}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Produto', {item})}>
            <View style={styles.items}>
              <Image
                onError={getErrorImage}
                style={{
                  width: '100%',
                  height: imageHeight,
                  borderWidth: 1,
                  borderColor: '#d1d1d1',
                }}
                source={{
                  uri: `${item.image}`,
                }}
              />
              <Text style={{fontWeight: '600'}}>{item.name}</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  width: '100%',
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}>
                  {item.actual_price}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    color: 'gray',
                    textAlign: 'center',
                  }}>
                  {item.installments}
                </Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text
                  style={{
                    color: 'gray',
                    flex: 1,
                    textAlign: 'center',
                    textDecorationLine: 'line-through',
                  }}>
                  {item.regular_price}
                </Text>
                {item.discount_percentage ? (
                  <Text
                    style={{
                      flex: 1,
                      color: '#A52A2A',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}>
                    ({item.discount_percentage} off)
                  </Text>
                ) : null}
              </View>

              {item.discount_percentage ? (
                <View
                  style={{
                    backgroundColor: 'black',
                    padding: 10,
                    flexDirection: 'column',
                    position: 'absolute',
                    left: 0,
                  }}>
                  <Text style={{color: 'white', textAlign: 'center'}}>
                    {item.discount_percentage}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      borderBottomColor: 'white',
                      borderWidth: 1,
                      textAlign: 'center',
                    }}>
                    Off
                  </Text>
                </View>
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    width: '100%',
  },
  items: {
    width: 190,
    margin: '1%',
    alignItems: 'center',
    marginTop: 20,
  },
  bg: {
    backgroundColor: 'red',
  },
  grid: {
    padding: 20,
    backgroundColor: 'red',
  },
  image: {
    width: '100%',
    height: 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Home;
