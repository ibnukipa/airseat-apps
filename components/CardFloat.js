import React from 'react'
import {Platform, StyleSheet, View} from 'react-native'
import {WHITE_CALM} from '../constants/Colors'
import {WP4} from '../constants/Sizes'

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
		paddingVertical: 10,
		paddingHorizontal: WP4
	},
})
