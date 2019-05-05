import React from 'react'
import {
	ScrollView,
	StyleSheet,
	View
} from 'react-native'
import {Text, Image, CardFloat, Container, Button} from '../components'
import {GREY_LIGHT, WHITE, WHITE05, WHITE_CALM} from '../constants/Colors'
import {HP2, HP5, HP80, WP1, WP2, WP4} from '../constants/Sizes'
import {times, map, reduce, forEach} from 'lodash-es'

export default class HomeScreen extends React.Component {
	state = {
		seatChartRules: [
			[2, 5],
			[3, 5],
		],
		passengers: 30
	}
	static navigationOptions = {
		headerTitle: (
			<View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
				<Image aspectRatio={315 / 85} imageStyle={{height: HP5}}
				       source={require('../assets/images/logo_text_invert.png')}/>
			</View>
		)
	}

	_calculateWMASeats = () => {
		const {
			seatChartRules
		} = this.state
		const seatChartLength = seatChartRules.length
		const seatChartLastIndex = seatChartLength - 1

		let wmaSeats = []
		forEach(seatChartRules, (seatChartRules, i) => {
			const seatChartCol = seatChartRules[0]
			const seatChartColLastIndex = seatChartCol - 1
			const seatChartRow = seatChartRules[1]

			let seatChart = new Array(seatChartCol)
			for(let row = 0; row < seatChartRow; row++) {
				let seatInRow = []
				for(let col = 0; col < seatChartCol; col++) {
					let type = 'M'
					if(
						(i === 0 && col === 0) ||
						(i === seatChartLastIndex && col === seatChartColLastIndex)
					) type = 'W'
					else if(
						(i === 0 && col === seatChartColLastIndex) ||
						(i !== 0 && (col === 0 || col === seatChartColLastIndex)) ||
						(i === seatChartColLastIndex && col === 0)
					) type = 'A'
					seatInRow[col] = {type, passengerNumber: 0}
				}
				seatChart[row] = seatInRow
			}
			wmaSeats[i] = seatChart
		})

		return wmaSeats
	}

	_calculateTotalColumn = () => {
		const {
			seatChartRules
		} = this.state
		return reduce(seatChartRules, (result, seat) => result + seat[0], 0)
	}

	render() {
		const {
			seatChartRules,
			passengers
		} = this.state
		const wmaSeats = this._calculateWMASeats()
		const totalColumns = this._calculateTotalColumn()
		const widthOfSeat = (100 - (2 * seatChartRules.length)) / this._calculateTotalColumn()
		return (
			<Container>
				<ScrollView contentContainerStyle={styles.contentContainer}>
					<View style={styles.airplane}>
						<View style={styles.airplaneCabin}>
							<Button text='Cabin Seats'/>
							<View style={styles.airPlaneCabinSeat}>
								{
									map(seatChartRules, (containerSeat, i) => {
										const totalColumnsInBlock = containerSeat[0]
										const totalRowsInBlock = containerSeat[1]
										const dimensionOfSeat = `${(100 / totalColumnsInBlock) - 1}%`
										return (
											<View key={i}
											      style={[styles.airplaneSeatContainer, {width: `${widthOfSeat * totalColumnsInBlock}%`}]}>
												{
													times(totalRowsInBlock , (rowIndex) => {
														return (
															<View key={`${i}${rowIndex}`} style={{justifyContent: 'space-around', width: '100%', flexDirection: 'row'}}>
																{
																	times(totalColumnsInBlock, (colIndex) => {
																		return (
																			<View key={`${i}${colIndex}`}
																			      style={[styles.airplaneSeat, {width: dimensionOfSeat}]}>
																				<View style={styles.square}>
																					<Text size='tiny' centered>{(wmaSeats[i][rowIndex][colIndex]).type}</Text>
																				</View>
																			</View>
																		)
																	})
																}
															</View>
														)
													})
												}
											</View>
										)
									})
								}
							</View>
						</View>
					</View>
				</ScrollView>
				<CardFloat>
					<Text>{totalColumns}</Text>
				</CardFloat>
			</Container>
		)
	}
}

const styles = StyleSheet.create({
	contentContainer: {
		margin: WP1,
		paddingBottom: HP5
	},
	airplane: {
		padding: WP2,
		borderRadius: WP4,
		backgroundColor: WHITE05
	},
	airplaneCabin: {
		minHeight: HP80,
		padding: WP2,
		borderRadius: WP4,
		backgroundColor: WHITE
	},
	airPlaneCabinSeat: {
		paddingTop: HP2,
		paddingBottom: HP5,
		flexDirection: 'row'
	},
	airplaneSeatContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginHorizontal: '1%'
	},
	airplaneSeat: {
		aspectRatio: 1,
		padding: 1
	},
	square: {
		width: '100%',
		aspectRatio: 1,
		borderRadius: 4,
		backgroundColor: WHITE_CALM,
		borderColor: GREY_LIGHT,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
})
