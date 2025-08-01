import * as React from 'react';
import { requireNativeComponent, StyleProp, ViewStyle } from 'react-native';

const NativeView: React.ComponentType<AirPlayButtonProps> = requireNativeComponent('AirPlayButton');

export interface AirPlayButtonProps {
  style?: StyleProp<ViewStyle>;
  tintColor?: string;
  backgroundColor?: string;
}

export default function AirPlayButton(props: AirPlayButtonProps) {
  return <NativeView {...props} />;
}