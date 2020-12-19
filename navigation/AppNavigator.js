import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {fromRight} from 'react-navigation-transitions'
import AirplaneScreen from '../screens/AirplaneScreen'
import AirplaneSeatMapScreen from '../screens/AirplaneSeatMapScreen'
import {PRIMARY, WHITE} from '../constants/Colors'

const Stack = createStackNavigator();

export default function () {
  return (
    <NavigationContainer>
      <Stack.Navigator
				animationEnabled
        initialRouteName={'Airplane'}
				headerMode={'float'}
        screenOptions={{
          gesturesEnabled: true,
          headerStyle: {
            elevation: 0,
            backgroundColor: PRIMARY,
            borderBottomWidth: 0
          },
          headerBackTitle: null,
          headerTintColor: WHITE
        }}
        transitionSpec={() => fromRight()}
			>
        <Stack.Screen name="Airplane" component={AirplaneScreen}/>
        <Stack.Screen name="AirplaneSeatMap" component={AirplaneSeatMapScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

