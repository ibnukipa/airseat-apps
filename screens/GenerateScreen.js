import React from 'react'
import {
	Platform,
	ScrollView,
	StyleSheet,
	View
} from 'react-native'
import {Text, Image, CardFloat, Icon} from '../components'
import {WHITE} from '../constants/Colors'
import {HP5, WP10, WP4} from '../constants/Sizes'

export default class GenerateScreen extends React.Component {
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
