import React from 'react'
import PropTypes from 'prop-types'
import {TouchableOpacity, Image as RNImage} from 'react-native'
import {isFunction} from 'lodash-es'
import {IMAGE_SIZE} from '../constants/Sizes'
import {TOUCH_OPACITY} from '../constants/Styles'

const propsType = {
	onPress: PropTypes.func,
	centered: PropTypes.bool,
	aspectRatio: PropTypes.number,
	source: PropTypes.any,
	style: PropTypes.any,
	imageStyle: PropTypes.any,
	defaultImage: PropTypes.any
}

const propsDefault = {
	size: 'small',
	centered: true,
	aspectRatio: 1,
	source: require('../assets/images/icon.png')
}

const Image = (props) => {
	const {
		onPress,
		centered,
		aspectRatio,
		source,
		style,
		size,
		imageStyle
	} = props
	const currentSize = IMAGE_SIZE[size] || size
	return (
		<TouchableOpacity
			activeOpacity={TOUCH_OPACITY}
			onPress={onPress}
			disabled={!isFunction(onPress)}
			style={[{
				alignSelf: centered ? 'center' : 'flex-start',
				justifyContent: 'center'
			}, style]}
		>
			<RNImage
				{...this.props}
				style={[{width: currentSize, height: undefined, aspectRatio}, imageStyle]}
				source={source}
			/>
		</TouchableOpacity>
	)
}

Image.propTypes = propsType
Image.defaultProps = propsDefault
export default Image
