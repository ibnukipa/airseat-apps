import React from 'react'
import SortableList from 'react-native-sortable-list'
import {StyleSheet, View} from 'react-native'
import {reduce} from 'lodash-es'
import {connect} from 'react-redux'
import {Text, CardFloat, Container, Button, InputText, ItemRow} from '../components'
import {INDIGO_DARK, RED_DARK, WHITE, WHITE05, WHITE80} from '../constants/Colors'
import {WP1, WP10, WP2, WP4, WP8} from '../constants/Sizes'
import {REDUCER_KEY_SEAT_MAP} from '../constants/Keys'
import Icon from '../components/Icon'

class AirplaneSeatMapScreen extends React.Component {
	state = {
		seatBlocks: this.props.seatMap || [],
		seatRow: null,
		seatCol: null
	}

	static navigationOptions = {
		headerTitle: (
			<Text weight={500} size='large' color={WHITE}>SEAT MAP</Text>
		)
	}

	_applySeatMap = () => {
		const {
			seatBlocks
		} = this.state
		this.props.setSeatMap(seatBlocks)
		this.props.navigation.goBack()
	}

	_renderRow = ({data, active, index}) => {
		return (
			data && (
				<ItemRow>
					<Text style={{flex: 1}} weight={500} type='Graduate' size='huge'>{`[${data[0]}, ${data[1]}]`}</Text>
					<Icon
						onPress={() => {
							const {
								seatBlocks
							} = this.state
							const newSeatBlocks = seatBlocks
							newSeatBlocks.splice(index, 1)
							this.setState({seatBlocks: newSeatBlocks})
						}}
						color={RED_DARK}
						size='huge' centered name='delete-forever' type='MaterialCommunityIcons'
					/>
				</ItemRow>
			)
		)
	}

	render() {
		const {
			seatBlocks,
			seatCol,
			seatRow
		} = this.state
		return (
			<Container>
				<View style={styles.cardContainer}>
					<View style={styles.seatFormContainer}>
						<View style={styles.seatInputContainer}>
							<InputText
								label='Seat Column'
								keyboardType='number-pad'
								onChangeText={(seatCol) => this.setState({seatCol})}
								placeholder='0'
								size='massive'
								value={seatCol}
								inputStyle={{textAlign: 'center'}}
								style={styles.seatInput}
							/>
							<InputText
								label='Seat Row'
								keyboardType='number-pad'
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
								disabled={!(Number(seatCol) > 0 && Number(seatRow) > 0)}
								compact centered
								text='Add to Seat Map'
								icon={{name: 'md-add-circle', type: 'Ionicons', size: 'huge'}}
								onPress={() => {
									if (Number(seatCol) > 0 && Number(seatRow) > 0) {
										const newSeatBlocks = [
											...seatBlocks,
											[Number(seatCol), Number(seatRow)]
										]
										this.setState({seatBlocks: newSeatBlocks})
									}
								}}
							/>
						</View>
					</View>
					<View style={styles.seatMap}>
						{
							seatBlocks.length > 0 ? (
								<SortableList
									keyboardShouldPersistTaps='handled'
									contentContainerStyle={{
										padding: WP4
									}}
									style={{
										flex: 1,
										width: '100%'
									}}
									onReleaseRow={(key, newKeys) => {
										const newSeatBlocks = reduce(newKeys, (result, newKey, i) => {
											result[i] = seatBlocks[newKey]
											return result
										}, [])
										this.setState({seatBlocks: newSeatBlocks})
									}}
									data={seatBlocks}
									renderRow={this._renderRow}
								/>
							) : (
								<View style={{flex: 1, justifyContent: 'center'}}>
									<Text weight={500} color={WHITE80}>Please add seat map!</Text>
								</View>
							)
						}
					</View>
				</View>
				<CardFloat>
					<Button
						disabled={seatBlocks.length < 1}
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
		flex: 1,
		padding: WP2,
		paddingBottom: 0,
		borderTopRightRadius: WP10,
		borderTopLeftRadius: WP10,
		backgroundColor: WHITE05,
		shadowColor: INDIGO_DARK,
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6
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
		flex: 1,
		alignItems: 'center',
		backgroundColor: WHITE05
	}
})
