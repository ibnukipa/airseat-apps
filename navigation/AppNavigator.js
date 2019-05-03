import React from 'react'
import {createAppContainer, createStackNavigator} from 'react-navigation'

import HomeScreen from '../screens/HomeScreen'
import {INDIGO} from '../constants/Colors'

export const HomeStack = createStackNavigator({
	Home: {
		screen: HomeScreen
	}
}, {
	headerMode: 'float',
	defaultNavigationOptions: {
		gesturesEnabled: false,
		headerStyle: {
			backgroundColor: INDIGO
		}
	}
})

export default createAppContainer(HomeStack)
