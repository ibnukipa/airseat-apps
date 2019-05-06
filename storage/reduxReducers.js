import {combineReducers} from 'redux'
import {REDUCER_KEY_SEAT_MAP} from '../constants/Keys'

const initialSeatMap = [
	[3, 2],
	[4, 5],
	[2, 5],
	[3, 4]
]

const seatReducer = (currentState = {seatMap: initialSeatMap}, {type, data}) => {
	if (type === `${REDUCER_KEY_SEAT_MAP}_SETTER`) {
		return {
			...currentState,
			seatMap: data.seatMap
		}
	} else {
		return {
			...currentState
		}
	}
}

export default combineReducers({
	seat: seatReducer
})
