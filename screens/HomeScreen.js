import React from 'react'
import {
	Platform,
	ScrollView,
	StyleSheet,
	View
} from 'react-native'
import {Text, Image, CardFloat, Container} from '../components'
import {DEEP_BLUE, DEEP_BLUE_DARK, PRIMARY, PRIMARY_TINT, WHITE} from '../constants/Colors'
import {HP5, WP4} from '../constants/Sizes'

export default class HomeScreen extends React.Component {
	static navigationOptions = {
		headerTitle: (
			<View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
				<Image aspectRatio={315 / 85} imageStyle={{height: HP5}} source={require('../assets/images/logo_text_invert.png')}/>
			</View>
		)
	}

	render() {
		return (
			<Container colors={[PRIMARY, PRIMARY_TINT]}>
				<ScrollView contentContainerStyle={styles.contentContainer}>
					<Text color={WHITE} onPress={() => this.props.navigation.navigate('Result')}>Content</Text>
				</ScrollView>

				<CardFloat>
					<Text>This is a tab bar. You can edit it in:</Text>
				</CardFloat>
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	contentContainer: {
		padding: WP4
	},
})
