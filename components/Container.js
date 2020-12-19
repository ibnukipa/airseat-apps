import React from 'react'
import PropTypes from 'prop-types'
import {SafeAreaView, KeyboardAvoidingView, Platform} from 'react-native'
import {isIphoneX} from 'react-native-iphone-x-helper'
import { LinearGradient } from 'expo-linear-gradient';
import {PRIMARY, PRIMARY_TINT, WHITE_CALM} from '../constants/Colors'

const propsType = {
	colors: PropTypes.array,
	safeAreaBackgroundColor: PropTypes.string
}

const propsDefault = {
	start: [0, 0],
	end: [0, 1],
	colors: [PRIMARY, PRIMARY_TINT],
	safeAreaBackgroundColor: WHITE_CALM
}

const Container = (props) => {
	const {
		start,
		end,
		colors,
		style,
		children,
		safeAreaBackgroundColor
	} = props
	return (
		<SafeAreaView style={{flex: 1, backgroundColor: safeAreaBackgroundColor}}>
			<KeyboardAvoidingView
				style={{flex: 1}}
				behavior={Platform.OS === 'ios' ? 'padding' : null}
				enabled
			>
				<LinearGradient
					start={start}
					end={end}
					colors={colors}
					style={[
						{flex: 1},
						style
					]}
				>
					{children}
				</LinearGradient>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

Container.propTypes = propsType
Container.defaultProps = propsDefault
export default Container
