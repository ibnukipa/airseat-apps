import React from 'react'
import {Platform, StyleSheet, View} from 'react-native'
import {GREY_LIGHT, WHITE_CALM} from '../constants/Colors'

export default class CardFloat extends React.Component {
	render() {
		const {
			children
		} = this.props
		return (
			<View style={styles.tabBarInfoContainer}>
				{children}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	tabBarInfoContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
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
		alignItems: 'center',
		backgroundColor: WHITE_CALM,
		paddingVertical: 20
	},
})
