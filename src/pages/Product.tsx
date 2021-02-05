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
  SafeAreaView,
} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';
import {Data, DataSizes} from '../types/types';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEY} from '../utils';

const Product: React.FC = ({navigation, route}) => {
  const [product, setProduct] = useState<Data[]>();
  const [sizeColorSet, setSizecolorSet] = useState('');
  const dimensions = Dimensions.get('window');

  const imageHeight = Math.round((dimensions.height * 9) / 16);

  useEffect(() => {
    async function init() {
      if (route.params.item) {
        setProduct(Array(route.params.item));
      }
    }
    init();
    // Atualiza o titulo do documento usando a API do browser
  }, []);

  //const selectedSize = (event: React.ChangeEvent) => {
  const selectedSize = (size: DataSizes) => {
    setSizecolorSet(size.size);
  };

  const addItemCart = async () => {
    if (!product) {
      return;
    }

    if (sizeColorSet.length === 0) {
      Alert.alert(
        'Tamanho não selecionado',
        'Selecione o tamanho para confirmar a compra',
        [{text: 'OK'}, ,],
        {cancelable: false},
      );
      return;
    }

    product.forEach((element: any) => {
      element.sizeChozen = sizeColorSet;
    });

    //pega todos os items
    const getListProcut = await AsyncStorage.getItem(STORAGE_KEY);
    const getProduct = JSON.parse(getListProcut || '[]');

    const arrFinal = getProduct.concat(product);

    const stringifiedArray = JSON.stringify(arrFinal);
    await AsyncStorage.setItem(STORAGE_KEY, stringifiedArray);

    Alert.alert(
      'Sucesso',
      'Produto adicionado ao carrinho',
      [{text: 'OK'}, ,],
      {cancelable: false},
    );

    return;
  };

  return (
    <View style={styles.container}>
      {product && product?.length > 0 ? (
        <SafeAreaView>
          <ScrollView>
            <Image
              style={{
                width: '100%',
                height: imageHeight,
                borderWidth: 1,
                borderColor: '#d1d1d1',
              }}
              source={{
                uri: `${product && product[0]?.image}`,
              }}
            />
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 25,
                paddingTop: 10,
                paddingBottom: 10,
                textAlign: 'center',
              }}>
              {product && product[0]?.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  textAlign: 'center',
                  margin: 3,
                  color: 'gray',
                }}>
                {product && product[0]?.regular_price}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  margin: 3,
                }}>
                {product && product[0]?.actual_price}
              </Text>

              {product && product[0]?.discount_percentage ? (
                <Text style={{margin: 3, color: 'red'}}>
                  ({product && product[0]?.discount_percentage} off)
                </Text>
              ) : null}

              <Text
                style={{
                  textAlign: 'center',
                  margin: 3,
                }}>
                {product && product[0]?.installments}
              </Text>
            </View>
            <Text
              style={{
                textAlign: 'center',
                paddingTop: 10,
                paddingBottom: 10,
                fontSize: 15,
              }}>
              Tamanho
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
              }}>
              {product &&
                product[0].sizes.map((size, index: number) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => selectedSize(size)}>
                      <View
                        style={{
                          backgroundColor: `${
                            sizeColorSet === size.size ? 'red' : 'whitesmoke'
                          }`,
                          width: 44,
                          height: 44,
                          borderRadius: 44 / 2,
                          borderColor: 'gray',
                          borderWidth: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            borderColor: 'gray',
                          }}>
                          {size.size}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
            <TouchableOpacity>
              <View style={{paddingTop: 20}}>
                <Button
                  onPress={addItemCart}
                  title="Aidicionar ao carrinho"
                  color="black"
                />
              </View>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    flex: 1,
  },
  items: {
    flex: 1,
    justifyContent: 'center',
  },

  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
    height: '100%',
  },
});

export default Product;
