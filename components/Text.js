import React from 'react'
import PropTypes from 'prop-types'
import {Text as RNText} from 'react-native'
import {keys} from 'lodash-es'
import {FONT_SIZE} from '../constants/Sizes'
import {GREY} from '../constants/Colors'
import {FONTS} from '../constants/Fonts'

const propsType = {
	size: PropTypes.oneOf(keys(FONT_SIZE)),
	color: PropTypes.string,
	type: PropTypes.oneOf(keys(FONTS)),
	weight: PropTypes.number,
	centered: PropTypes.bool,
	onPress: PropTypes.func,
	style: PropTypes.any,
}

const propsDefault = {
	size: 'small',
	color: GREY,
	type: 'Raleway',
	weight: 300,
	centered: false,
	onPress: null,
}

const Text = (props) => {
	const {
		size,
		color,
		type,
		weight,
		centered,
		style,
		children
	} = props
	return (
		<RNText
			{...props}
			style={[
				{
					textAlign: centered ? 'center' : 'left',
					color: color,
					fontSize: FONT_SIZE[size] || FONT_SIZE[propsDefault.size],
					fontFamily: FONTS[type][weight] || FONTS[propsDefault.type][propsDefault.weight]
				},
				style
			]}>
			{children}
		</RNText>
	)
}

Text.propTypes = propsType
Text.defaultProps = propsDefault
export default Text
