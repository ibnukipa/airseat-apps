import React from 'react'
import PropTypes from 'prop-types'
import {Platform, View} from 'react-native'
import {noop} from 'lodash-es'
import {TouchableOpacity} from 'react-native'
import {LinearGradient} from 'expo'
import {GREY_LIGHT, PRIMARY, PRIMARY_TINT, WHITE, WHITE_CALM} from '../constants/Colors'
import {WP2, WP4} from '../constants/Sizes'
import {TOUCH_OPACITY} from '../constants/Styles'
import Text from './Text'
import Icon from './Icon'

const propsType = {
	colors: PropTypes.array,
	backgroundColor: PropTypes.string,
	text: PropTypes.string,
	icon: PropTypes.object,
	onPress: PropTypes.func,
}

const propsDefault = {
	start: [0, 0],
	end: [1, 0],
	colors: [PRIMARY, PRIMARY_TINT],
	backgroundColor: WHITE_CALM,
	text: 'Button',
	onPress: noop
}

const Button = (props) => {
	const {
		start,
		end,
		colors,
		style,
		backgroundColor,
		text,
		icon,
		onPress
	} = props
	return (
		<TouchableOpacity activeOpacity={TOUCH_OPACITY} onPress={onPress} style={[{
			...Platform.select({
				ios: {
					shadowColor: 'black',
					shadowOffset: {height: -3},
					shadowOpacity: 0.1,
					shadowRadius: 3
				},
				android: {
					elevation: 20
				}
			}),
		}, style]}>
			<LinearGradient
				start={start}
				end={end}
				colors={colors}
				style={[
					{
						backgroundColor, paddingHorizontal: WP4, paddingVertical: WP2,
						justifyContent: 'space-between', borderRadius: 8,
						flexDirection: 'row'
					}
				]}
			>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					{
						icon && (
							<Icon centered color={WHITE} name={icon.name} type={icon.type}/>
						)
					}
					<Text color={WHITE} style={{marginLeft: icon ? WP4 : 0}}>{text}</Text>
				</View>
			</LinearGradient>
		</TouchableOpacity>
	)
}

Button.propTypes = propsType
Button.defaultProps = propsDefault
export default Button
