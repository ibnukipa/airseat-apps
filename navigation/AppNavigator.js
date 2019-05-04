import React from 'react'
import {View} from 'react-native'
import {createAppContainer, createStackNavigator} from 'react-navigation'
import { fromRight } from 'react-navigation-transitions'
import HomeScreen from '../screens/HomeScreen'
import GenerateScreen from '../screens/GenerateScreen'
import {DEEP_BLUE, DEEP_BLUE_DARK, INDIGO, PRIMARY, WHITE} from '../constants/Colors'
import {Image, Text} from '../components'
import {HP5, WP4} from '../constants/Sizes'

export const HomeStack = createStackNavigator({
	Home: {
		screen: HomeScreen
	},
	Generate: {
		screen: GenerateScreen
	}
}, {
	headerMode: 'float',
	animationEnabled: true,
	transitionConfig: () => fromRight(),
	defaultNavigationOptions: {
		gesturesEnabled: true,
		headerStyle: {
			elevation: 0,
			backgroundColor: PRIMARY,
			borderBottomWidth: 0,
		},
		headerBackTitle: null,
		headerTintColor: WHITE,
	}
})

export default createAppContainer(HomeStack)
