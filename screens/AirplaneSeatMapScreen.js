import React from 'react'
import {
	ScrollView,
	StyleSheet,
	View
} from 'react-native'
import {Text, CardFloat} from '../components'
import {WHITE} from '../constants/Colors'
import {WP4} from '../constants/Sizes'

export default class AirplaneSeatMapScreen extends React.Component {
	static navigationOptions = {
		headerTitle: (
			<Text color={WHITE}>Seating</Text>
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
					<Text>Content</Text>
				</ScrollView>

				<CardFloat>
					<Text>This is a tab bar. You can edit it in:</Text>
				</CardFloat>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: WHITE
	},
	contentContainer: {
		padding: WP4
	},
})
