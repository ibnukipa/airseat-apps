import React from 'react'
import PropTypes from 'prop-types'
import {Platform, View} from 'react-native'
import {noop} from 'lodash-es'
import {TouchableOpacity} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import {PRIMARY, PRIMARY_TINT, WHITE, WHITE_CALM} from '../constants/Colors'
import {WP1, WP2, WP30, WP4} from '../constants/Sizes'
import {DISABLED_OPACITY, TOUCH_OPACITY} from '../constants/Styles'
import Text from './Text'
import Icon from './Icon'

const propsType = {
	colors: PropTypes.array,
	backgroundColor: PropTypes.string,
	text: PropTypes.string,
	icon: PropTypes.object,
	centered: PropTypes.bool,
	disabled: PropTypes.bool,
	compact: PropTypes.bool,
	big: PropTypes.bool,
	onPress: PropTypes.func
}

const propsDefault = {
	start: [0, 0],
	end: [1, 0],
	colors: [PRIMARY, PRIMARY_TINT],
	backgroundColor: WHITE_CALM,
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
		centered,
		compact,
		big,
		disabled,
		onPress
	} = props
	return (
		<TouchableOpacity disabled={disabled} activeOpacity={TOUCH_OPACITY} onPress={onPress} style={[{
			minWidth: compact ? 0 : WP30,
			opacity: disabled ? DISABLED_OPACITY : 1,
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
			})
		}, style]}>
			<LinearGradient
				start={start}
				end={end}
				colors={colors}
				style={[
					{
						backgroundColor, paddingHorizontal: compact ? 0 : WP2, paddingVertical: compact ? 0 : big ? WP4 : WP1,
						justifyContent: centered ? 'center' : 'space-between', borderRadius: 8,
						flexDirection: 'row'
					}
				]}
			>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					{
						icon && (
							<Icon size={icon.size} centered color={WHITE} name={icon.name} type={icon.type}/>
						)
					}
					{
						text && (
							<Text
								color={WHITE} weight={big ? 500 : null} size={big ? 'large' : compact ? 'mini' : null}
								style={{
									marginVertical: icon ? compact ? WP1 : WP2 : 0,
									marginRight: WP2,
									marginLeft: icon ? compact ? 0 : WP1 : 0
								}}
							>
								{text}
							</Text>
						)
					}
				</View>
			</LinearGradient>
		</TouchableOpacity>
	)
}

Button.propTypes = propsType
Button.defaultProps = propsDefault
export default Button
