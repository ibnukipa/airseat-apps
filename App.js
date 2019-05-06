import React from 'react'
import {StatusBar, StyleSheet, View} from 'react-native'
import {AppLoading, Asset, Font, Icon} from 'expo'
import {Provider} from 'react-redux'
import AppNavigator from './navigation/AppNavigator'
import stores from './storage/reduxStore'
import {PRIMARY} from './constants/Colors'

export default class App extends React.Component {
	state = {
		isLoadingComplete: false
	}

	render() {
		if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
			return (
				<AppLoading
					startAsync={this._loadResourcesAsync}
					onError={this._handleLoadingError}
					onFinish={this._handleFinishLoading}
				/>
			)
		} else {
			return (
				<Provider store={stores}>
					<View style={styles.container}>
						<StatusBar
							animated
							backgroundColor={PRIMARY}
							barStyle='light-content'
						/>
						<AppNavigator/>
					</View>
				</Provider>
			)
		}
	}

	_loadResourcesAsync = async () => {
		return Promise.all([
			Asset.loadAsync([
				require('./assets/images/icon.png'),
				require('./assets/images/logo.png'),
				require('./assets/images/logo_text_invert.png')
			]),
			Font.loadAsync({
				...Icon.Ionicons.font,
				'RalewayExtraLight': require('./assets/fonts/Raleway-ExtraLight.ttf'),
				'RalewayLight': require('./assets/fonts/Raleway-Light.ttf'),
				'RalewayRegular': require('./assets/fonts/Raleway-Regular.ttf'),
				'RalewayMedium': require('./assets/fonts/Raleway-Medium.ttf'),
				'RalewaySemiBold': require('./assets/fonts/Raleway-SemiBold.ttf'),
				'RalewayBold': require('./assets/fonts/Raleway-Bold.ttf'),
				'RalewayExtraBold': require('./assets/fonts/Raleway-ExtraBold.ttf'),
				'GraduateRegular': require('./assets/fonts/Graduate-Regular.ttf')
			})
		])
	}

	_handleLoadingError = error => {
		console.warn(error)
	}

	_handleFinishLoading = () => {
		this.setState({isLoadingComplete: true})
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
})
