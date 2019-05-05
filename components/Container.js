import React from 'react'
import PropTypes from 'prop-types'
import {Header}from 'react-navigation'
import {SafeAreaView, KeyboardAvoidingView, Platform} from 'react-native'
import {isIphoneX} from 'react-native-iphone-x-helper'
import {LinearGradient, Constants} from 'expo'
import {PRIMARY, PRIMARY_TINT, WHITE_CALM} from '../constants/Colors'

const propsType = {
	colors: PropTypes.array
}

const propsDefault = {
	start: [0, 0],
	end: [0, 1],
	colors: [PRIMARY, PRIMARY_TINT],
}

const Container = (props) => {
	const {
		start,
		end,
		colors,
		style,
		children,
	} = props
	return (
		<SafeAreaView style={{flex: 1, backgroundColor: WHITE_CALM}}>
			<KeyboardAvoidingView
				style={{flex: 1}}
				keyboardVerticalOffset={Platform.OS === 'ios' ? Header.HEIGHT + (isIphoneX() ? 20 : 0) : 0}
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
