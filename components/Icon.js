import React from 'react'
import PropTypes from 'prop-types'
import {TouchableOpacity} from 'react-native'
import {keys, isFunction} from 'lodash-es'
import {
	Ionicons,
	AntDesign,
	Feather,
	FontAwesome,
	MaterialIcons,
	Entypo,
	EvilIcons,
	MaterialCommunityIcons
} from '@expo/vector-icons'
import {GREY} from '../constants/Colors'
import {ICON_SIZE, WP2, WP4} from '../constants/Sizes'
import {TOUCH_OPACITY} from '../constants/Styles'

const icons = {Ionicons, AntDesign, Feather, FontAwesome, MaterialIcons, Entypo, EvilIcons, MaterialCommunityIcons}

const propsType = {
	key: PropTypes.any,
	type: PropTypes.oneOf(['AntDesign', 'Feather', 'FontAwesome', 'MaterialIcons', 'Entypo', 'EvilIcons', 'MaterialCommunityIcons', 'Ionicons']),
	name: PropTypes.string.isRequired,
	size: PropTypes.oneOf(keys(ICON_SIZE)),
	centered: PropTypes.bool,
	color: PropTypes.string,
	onPress: PropTypes.func,
	onLongPress: PropTypes.func,
	style: PropTypes.object
}

const propsDefault = {
	key: undefined,
	type: 'AntDesign',
	size: 'small',
	color: GREY,
	centered: false
}

const Icon = (props) => {
	const {
		type,
		name,
		color,
		size,
		centered,
		onPress,
		onLongPress,
		style
	} = props
	const CurrentIcon = icons[type]
	const currentSize = ICON_SIZE[size]
	return (
		<TouchableOpacity
			activeOpacity={TOUCH_OPACITY}
			onPress={onPress}
			onLongPress={onLongPress}
			disabled={!isFunction(onPress) && !isFunction(onLongPress)}
			style={[{
				width: currentSize + WP4, height: currentSize + WP4,
				justifyContent: 'center',
				alignItems: 'center',
				padding: WP2,
				alignSelf: centered ? 'center' : 'flex-start'
			}, style]}
		>
			<CurrentIcon name={name} color={color} size={currentSize}/>
		</TouchableOpacity>
	)
}

Icon.propTypes = propsType
Icon.defaultProps = propsDefault
export default Icon
