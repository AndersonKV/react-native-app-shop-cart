import React from 'react';

import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

declare const global: {HermesInternal: null | {}};

const Stack = createStackNavigator();

import Home from './pages/Home';
import Product from './pages/Product';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'red',
  },
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerStyle: {
              backgroundColor: 'black',
              /*  */
            },
            headerTitleStyle: {
              color: 'white',
            },
          }}
        />
        <Stack.Screen name="Produto" component={Product} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// options={{
//   headerTransparent: true,
// }}
export default App;
