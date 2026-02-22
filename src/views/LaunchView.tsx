import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Image,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../routes/appRoutes';

const BG = require('../assets/bg_generic.png');
const LOGO = require('../assets/logo.png');

type Props = NativeStackScreenProps<AppStackParamList, 'Launch'>;

export default function LaunchView({ navigation }: Props) {
  const { height } = useWindowDimensions();
  const isSmall = height < 740;
  const isVerySmall = height < 680;

  const appear = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.92)).current;
  const floatY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(appear, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.back(1.05)),
        useNativeDriver: true,
      }),
      Animated.timing(floatY, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => {
      navigation.replace('Intro');
    }, 900);

    return () => clearTimeout(t);
  }, [navigation, appear, scale, floatY]);

  const logoSize = isVerySmall ? 120 : isSmall ? 150 : 180;

  return (
    <ImageBackground source={BG} style={styles.root} resizeMode="cover">
      <View style={styles.centerWrap}>
        <Animated.View
          style={[
            styles.logoWrap,
            {
              opacity: appear,
              transform: [{ translateY: floatY }, { scale }],
            },
          ]}
        >
          <Image source={LOGO} style={{ width: logoSize, height: logoSize }} resizeMode="contain" />
        </Animated.View>

        <Animated.View style={{ opacity: appear }}>
          <Text style={[styles.title, { marginTop: isVerySmall ? 10 : 14 }]}>Loading…</Text>
          <ActivityIndicator />
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoWrap: { alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 18,
    marginBottom: 12,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
});