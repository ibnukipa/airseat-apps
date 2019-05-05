import React from 'react'
import PropTypes from 'prop-types'
import {SafeAreaView} from 'react-native'
import {LinearGradient} from 'expo'
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
		</SafeAreaView>
	)
}

Container.propTypes = propsType
Container.defaultProps = propsDefault
export default Container
