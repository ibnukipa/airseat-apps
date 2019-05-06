import React from 'react'
import {createAppContainer, createStackNavigator} from 'react-navigation'
import {fromRight} from 'react-navigation-transitions'
import AirplaneScreen from '../screens/AirplaneScreen'
import AirplaneSeatMapScreen from '../screens/AirplaneSeatMapScreen'
import {PRIMARY, WHITE} from '../constants/Colors'

export const HomeStack = createStackNavigator({
	Airplane: AirplaneScreen,
	AirplaneSeatMap: AirplaneSeatMapScreen
}, {
	initialRouteName: 'Airplane',
	headerMode: 'float',
	animationEnabled: true,
	transitionConfig: () => fromRight(),
	defaultNavigationOptions: {
		gesturesEnabled: true,
		headerStyle: {
			elevation: 0,
			backgroundColor: PRIMARY,
			borderBottomWidth: 0
		},
		headerBackTitle: null,
		headerTintColor: WHITE
	}
})

export default createAppContainer(HomeStack)
