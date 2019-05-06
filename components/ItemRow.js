import React from 'react'
import {StyleSheet, View} from 'react-native'
import {INDIGO_DARK, WHITE} from '../constants/Colors'
import {WP1, WP2} from '../constants/Sizes'
import Icon from './Icon'

export default class ItemRow extends React.Component {
	render() {
		const {children} = this.props
		return (
			<View style={[
				styles.row
			]}>
				<Icon centered name='drag' type='MaterialCommunityIcons'/>
				{children}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: WHITE,
		marginBottom: WP1,
		padding: WP2,
		borderRadius: WP2,
		shadowColor: INDIGO_DARK,
		shadowOffset: {
			width: 0,
			height: 1
		},
		shadowOpacity: 0.20,
		shadowRadius: 1.41,
		elevation: 2
	}
})
