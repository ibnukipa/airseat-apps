import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

export const
	HP5 = hp('5%'),
	HP80 = hp('80%'),
	WP301 = wp('3.1%'),
	WP308 = wp('3.8%'),
	WP1 = wp('1%'),
	WP2 = wp('2%'),
	WP4 = wp('4%'),
	WP405 = wp('4.5%'),
	WP408 = wp('4.8%'),
	WP502 = wp('5.2%'),
	WP509 = wp('5.9%'),
	WP6 = wp('6%'),
	WP8 = wp('8%'),
	WP10 = wp('10%'),
	WP12 = wp('12%'),
	WP16 = wp('16%'),
	WP20 = wp('20%'),
	WP25 = wp('25%'),
	WP30 = wp('30%'),
	WP35 = wp('35%'),
	WP50 = wp('50%'),
	WP100 = wp('100%')

export const FONT_SIZE = {
	tiny: WP301, //10
	mini: WP308, //12
	small: WP405, //14
	medium: WP408, //15
	large: WP502,  //16
	huge: WP509, //18
	massive: WP8 //20
}

export const ICON_SIZE = {
	tiny: WP301,
	mini: WP308,
	small: WP405,
	large: WP502,
	huge: WP509,
	massive: WP8
}

export const IMAGE_SIZE = {
	tiny: WP6,
	mini: WP8,
	small: WP12,
	large: WP16,
	huge: WP20,
	massive: WP25
}
