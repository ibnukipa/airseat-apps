import React from 'react'
import PropTypes from 'prop-types'
import {Platform, View} from 'react-native'
import {noop} from 'lodash-es'
import {TouchableOpacity} from 'react-native'
import {LinearGradient} from 'expo'
import {PRIMARY, PRIMARY_TINT, WHITE, WHITE_CALM} from '../constants/Colors'
import {WP1, WP2, WP30, WP4} from '../constants/Sizes'
import {TOUCH_OPACITY} from '../constants/Styles'
import Text from './Text'
import Icon from './Icon'

const propsType = {
	colors: PropTypes.array,
	backgroundColor: PropTypes.string,
	text: PropTypes.string,
	icon: PropTypes.object,
	centered: PropTypes.bool,
	compact: PropTypes.bool,
	big: PropTypes.bool,
	onPress: PropTypes.func,
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
		onPress
	} = props
	return (
		<TouchableOpacity activeOpacity={TOUCH_OPACITY} onPress={onPress} style={[{
			minWidth: compact ? 0 : WP30,
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
						backgroundColor, paddingHorizontal: compact ? WP2 : WP4, paddingVertical: compact ? WP1 : big ? WP4 : WP2,
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
								style={{marginLeft: icon ? compact ? WP1 : WP4 : 0}}
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
