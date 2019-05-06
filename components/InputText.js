import React from 'react'
import PropTypes from 'prop-types'
import {TextInput, View} from 'react-native'
import {FONT_SIZE, WP2} from '../constants/Sizes'
import {GREY, GREY_CALM} from '../constants/Colors'
import {FONTS} from '../constants/Fonts'
import Text from './Text'

const propsType = {
	placeholder: PropTypes.string,
	value: PropTypes.any,
	onChangeText: PropTypes.func
}

const propsDefault = {
	size: 'large',
	color: GREY,
	type: 'Graduate',
	weight: 300,
	placeholder: '...'
}

class InputText extends React.PureComponent {
	render() {
		const {
			size,
			weight,
			type,
			onChangeText,
			value,
			label,
			placeholder,
			keyboardType,
			style,
			inputStyle
		} = this.props
		return (
			<View style={[
				{
					justifyContent: 'center'
				}, style]}>
				{
					label && <Text weight={600} size='tiny' color={GREY_CALM}>{label}</Text>
				}
				<TextInput
					multiline
					numberOfLines={1}
					keyboardType={keyboardType}
					onChangeText={onChangeText}
					value={value}
					placeholder={placeholder}
					style={[
						{
							paddingVertical: WP2,
							fontSize: FONT_SIZE[size] || FONT_SIZE[propsDefault.size],
							fontFamily: FONTS[type][weight] || FONTS[propsDefault.type][propsDefault.weight]
						}, inputStyle
					]}
				/>
			</View>
		)
	}
}

InputText.propTypes = propsType
InputText.defaultProps = propsDefault
export default InputText
