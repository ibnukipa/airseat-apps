import React from 'react'
import PropTypes from 'prop-types'
import {LinearGradient} from 'expo'
import {WHITE} from '../constants/Colors'

const propsType = {
	colors: PropTypes.array
}

const propsDefault = {
	start: [0, 0],
	end: [0, 1],
	colors: [WHITE, WHITE],
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
	)
}

Container.propTypes = propsType
Container.defaultProps = propsDefault
export default Container
