import React from 'react'
import {
	ScrollView,
	StyleSheet,
	View
} from 'react-native'
import {map} from 'lodash-es'
import {connect} from 'react-redux'
import {Text, CardFloat, Container, Button, InputText} from '../components'
import {WHITE, WHITE05} from '../constants/Colors'
import {WP1, WP10, WP2, WP4, WP8} from '../constants/Sizes'
import {REDUCER_KEY_SEAT_MAP} from '../constants/Keys'

class AirplaneSeatMapScreen extends React.Component {
	state = {
		seatBlocks: this.props.seatMap || [],
		seatRow: null,
		seatCol: null
	}
	static navigationOptions = {
		headerTitle: (
			<Text color={WHITE}>Seating</Text>
		)
	}

	_applySeatMap = () => {
		const {
			seatBlocks
		} = this.state
		this.props.setSeatMap(seatBlocks)
		this.props.navigation.goBack()
	}

	render() {
		const {
			seatBlocks,
			seatCol,
			seatRow
		} = this.state
		return (
			<Container>
				<ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.contentContainer}>
					<View style={styles.cardContainer}>
						<View style={styles.seatFormContainer}>
							<View style={styles.seatInputContainer}>
								<InputText
									label='Seat Column'
									keyboardType='numeric'
									onChangeText={(seatCol) => this.setState({seatCol})}
									placeholder='0'
									size='massive'
									value={seatCol}
									inputStyle={{textAlign: 'center'}}
									style={styles.seatInput}
								/>
								<InputText
									label='Seat Row'
									keyboardType='numeric'
									onChangeText={(seatRow) => this.setState({seatRow})}
									placeholder='0'
									size='massive'
									value={seatRow}
									inputStyle={{textAlign: 'center'}}
									style={styles.seatInput}
								/>
							</View>
							<View style={styles.seatInputButton}>
								<Button
									compact centered
									text='Add to Seat Map'
									icon={{name: 'md-add-circle', type: 'Ionicons', size: 'huge'}}
									onPress={() => {
										const newSeatBlocks = [
											...seatBlocks,
											[Number(seatCol), Number(seatRow)]
										]
										this.setState({seatBlocks: newSeatBlocks})
									}}
								/>
							</View>
						</View>
						<View style={styles.seatMap}>
							<Text type='Graduate'>
								{
									map(seatBlocks, (seatBlock, i) => `[${seatBlock[0]}, ${seatBlock[1]}] `)
								}
							</Text>
						</View>
					</View>
				</ScrollView>
				<CardFloat>
					<Button
						onPress={this._applySeatMap}
						style={{width: '100%'}} colors={['#ff9966', '#ff5e62']}
						centered big
						text='Apply'
					/>
				</CardFloat>
			</Container>
		)
	}
}

export default connect(
	({seat}) => ({seatMap: seat.seatMap}),
	{
		setSeatMap: (seatMap) => ({type: `${REDUCER_KEY_SEAT_MAP}_SETTER`, data: {seatMap}})
	}
)(AirplaneSeatMapScreen)

const styles = StyleSheet.create({
	contentContainer: {
		padding: WP1
	},
	cardContainer: {
		padding: WP2,
		borderTopRightRadius: WP10,
		borderTopLeftRadius: WP10,
		backgroundColor: WHITE05
	},
	seatFormContainer: {
		backgroundColor: WHITE,
		borderTopRightRadius: WP10,
		borderTopLeftRadius: WP10,
		paddingTop: WP8,
		paddingHorizontal: WP4
	},
	seatInputContainer: {
		flexDirection: 'row'
	},
	seatInput: {
		width: '50%',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	seatInputButton: {
		marginVertical: WP4,
		justifyContent: 'center',
		flexDirection: 'row'
	},
	seatMap: {
		alignItems: 'center',
		backgroundColor: WHITE,
		padding: WP4
	}
})
