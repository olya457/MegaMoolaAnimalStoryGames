import React, { useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../routes/appRoutes';

const BG = require('../assets/bg_generic.png');
const LOGO = require('../assets/logo.png');
const ICON_GALLERY = require('../assets/icon_gallery.png');

type Props = NativeStackScreenProps<AppStackParamList, 'MainMenu'>;
type BtnKey = 'Read' | 'Puzzles' | 'Math' | 'Library' | null;

export default function MainMenuView({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isVerySmall = height < 680;

  const [active, setActive] = useState<BtnKey>(null);

  const logoA = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(14)).current;
  const b1A = useRef(new Animated.Value(0)).current;
  const b2A = useRef(new Animated.Value(0)).current;
  const b3A = useRef(new Animated.Value(0)).current;
  const b4A = useRef(new Animated.Value(0)).current;
  const b1Y = useRef(new Animated.Value(14)).current;
  const b2Y = useRef(new Animated.Value(14)).current;
  const b3Y = useRef(new Animated.Value(14)).current;
  const b4Y = useRef(new Animated.Value(14)).current;

  const runIntro = useCallback(() => {
    [logoA, b1A, b2A, b3A, b4A].forEach(v => v.setValue(0));
    [logoY, b1Y, b2Y, b3Y, b4Y].forEach(v => v.setValue(14));

    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoA, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(logoY, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.stagger(90, [
        Animated.parallel([
          Animated.timing(b1A, { toValue: 1, duration: 320, useNativeDriver: true }),
          Animated.timing(b1Y, { toValue: 0, duration: 360, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(b2A, { toValue: 1, duration: 320, useNativeDriver: true }),
          Animated.timing(b2Y, { toValue: 0, duration: 360, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(b3A, { toValue: 1, duration: 320, useNativeDriver: true }),
          Animated.timing(b3Y, { toValue: 0, duration: 360, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(b4A, { toValue: 1, duration: 320, useNativeDriver: true }),
          Animated.timing(b4Y, { toValue: 0, duration: 360, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, [logoA, logoY, b1A, b2A, b3A, b4A, b1Y, b2Y, b3Y, b4Y]);

  useFocusEffect(
    useCallback(() => {
      setActive(null);
      runIntro();
    }, [runIntro])
  );

  const sizes = useMemo(() => {
    const logoSize = Math.min(320, Math.round(width * (isVerySmall ? 0.7 : 0.82)));
    const btnW = Math.min(320, Math.round(width * 0.8));
    const btnH = isVerySmall ? 54 : 62;
    const gap = isVerySmall ? 8 : 12;

    const logoMarginTop = isVerySmall ? 50 : 80;
    const buttonsMarginTop = isVerySmall ? 15 : 30;

    return { logoSize, btnW, btnH, gap, logoMarginTop, buttonsMarginTop };
  }, [width, height, isVerySmall]);

  const go = (key: BtnKey, route: keyof AppStackParamList) => {
    setActive(key);
    setTimeout(() => navigation.navigate(route), 120);
  };

  return (
    <ImageBackground source={BG} style={styles.root} resizeMode="cover">
      <Text style={[styles.menuLabel, { top: isVerySmall ? 20 : 30 }]}>menu</Text>

      <View style={{ alignItems: 'center' }}>
        <Animated.View
          style={[
            styles.logoWrap,
            {
              marginTop: sizes.logoMarginTop,
              opacity: logoA,
              transform: [{ translateY: logoY }],
            },
          ]}
        >
          <View style={styles.logoFrame}>
            <Image source={LOGO} style={{ width: sizes.logoSize, height: sizes.logoSize }} resizeMode="contain" />
          </View>
        </Animated.View>

        <View style={[styles.buttons, { gap: sizes.gap, marginTop: sizes.buttonsMarginTop }]}>
          <Animated.View style={{ opacity: b1A, transform: [{ translateY: b1Y }] }}>
            <MainBtn title="Read" width={sizes.btnW} height={sizes.btnH} forceRed={active === 'Read'} onPress={() => go('Read', 'Read')} />
          </Animated.View>

          <Animated.View style={{ opacity: b2A, transform: [{ translateY: b2Y }] }}>
            <MainBtn
              title="Puzzles"
              width={sizes.btnW}
              height={sizes.btnH}
              forceRed={active === 'Puzzles'}
              onPress={() => go('Puzzles', 'Puzzles')}
            />
          </Animated.View>

          <Animated.View style={{ opacity: b3A, transform: [{ translateY: b3Y }] }}>
            <MainBtn title="Math" width={sizes.btnW} height={sizes.btnH} forceRed={active === 'Math'} onPress={() => go('Math', 'Math')} />
          </Animated.View>

          <Animated.View style={{ opacity: b4A, transform: [{ translateY: b4Y }] }}>
            <Pressable
              onPress={() => go('Library', 'Library')}
              style={({ pressed }) => [
                styles.galleryBtn,
                {
                  width: sizes.btnH,
                  height: sizes.btnH,
                  backgroundColor: active === 'Library' ? '#E53935' : '#7CD10C',
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <View style={styles.galleryHighlight} />
              <Image source={ICON_GALLERY} style={styles.galleryIcon} resizeMode="contain" />
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </ImageBackground>
  );
}

function MainBtn({ title, onPress, width, height, forceRed }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          width,
          height,
          backgroundColor: forceRed ? '#E53935' : '#7CD10C',
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
    >
      <View style={styles.btnHighlight} />
      <Text style={styles.btnText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center' },
  menuLabel: {
    position: 'absolute',
    left: 20,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '600',
  },
  logoWrap: { alignItems: 'center' },
  logoFrame: {
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  buttons: { alignItems: 'center' },
  btn: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  btnHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  galleryBtn: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  galleryHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    backgroundColor: 'rgba(255,255,255,0.20)',
  },
  galleryIcon: { width: 26, height: 26, tintColor: '#fff' },
});