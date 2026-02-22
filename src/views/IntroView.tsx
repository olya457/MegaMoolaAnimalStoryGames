import React, { useMemo, useRef, useState, useEffect } from 'react';
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../routes/appRoutes';

const BG = require('../assets/bg_generic.png');
const LION_1 = require('../assets/onboard1.png');
const LION_2 = require('../assets/onboard2.png');
const LION_3 = require('../assets/onboard3.png');

type Props = NativeStackScreenProps<AppStackParamList, 'Intro'>;

type Slide = {
  key: string;
  title: string;
  body: string;
  lion: any;
  button: string;
};

export default function IntroView({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isSmall = height < 740;
  const isVerySmall = height < 680 || width < 360;

  const slides: Slide[] = useMemo(
    () => [
      {
        key: '1',
        title: "Hello! I'm Mega Moola the Lion",
        body:
          "I'm the king of animals and your guide in the world of stories.\n\nTogether we will read, think and play!",
        lion: LION_1,
        button: 'Next',
      },
      {
        key: '2',
        title: 'Listen and answer',
        body: 'Each animal will tell you its story.\nHave time to read it on time and answer\nthe questions!',
        lion: LION_2,
        button: 'Okay',
      },
      {
        key: '3',
        title: 'Play and collect rewards',
        body: 'Solve riddles, count animals\nand discover collectible wallpapers for\nyour phone!',
        lion: LION_3,
        button: 'Start',
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const appear = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(10)).current;
  const lionY = useRef(new Animated.Value(12)).current;
  const lionScale = useRef(new Animated.Value(0.96)).current;
  const btnY = useRef(new Animated.Value(10)).current;

  const runAppear = () => {
    appear.setValue(0);
    cardY.setValue(10);
    lionY.setValue(12);
    lionScale.setValue(0.96);
    btnY.setValue(10);

    Animated.parallel([
      Animated.timing(appear, {
        toValue: 1,
        duration: 360,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardY, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(80),
        Animated.parallel([
          Animated.timing(lionY, {
            toValue: 0,
            duration: 520,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(lionScale, {
            toValue: 1,
            duration: 520,
            easing: Easing.out(Easing.back(1.05)),
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(140),
        Animated.timing(btnY, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  useEffect(() => {
    runAppear();
  }, [index]);

  const cardW = Math.min(320, Math.round(width * 0.84));
  const cardTop = isVerySmall ? 62 : isSmall ? 74 : 84;

  const lionW = Math.min(340, Math.round(width * 0.86));
  const lionH = Math.min(420, Math.round(height * (isVerySmall ? 0.45 : 0.5)));

  const btnW = Math.min(300, Math.round(width * 0.78));
  const btnH = isVerySmall ? 54 : 62;

  const s = slides[index];

  const onPressMain = () => {
    if (index >= slides.length - 1) {
      navigation.replace('MainMenu');
      return;
    }
    setIndex((v) => v + 1);
  };

  return (
    <ImageBackground source={BG} style={styles.root} resizeMode="cover">
      <View style={styles.page}>
        <Animated.View
          style={[
            styles.greenCard,
            {
              width: cardW,
              marginTop: cardTop,
              paddingVertical: isVerySmall ? 14 : 18,
              paddingHorizontal: isVerySmall ? 14 : 16,
              opacity: appear,
              transform: [{ translateY: cardY }],
            },
          ]}
        >
          <Text style={[styles.cardTitle, { fontSize: isVerySmall ? 16 : 18 }]} numberOfLines={2}>
            {s.title}
          </Text>

          <Text
            style={[
              styles.cardBody,
              {
                fontSize: isVerySmall ? 12.5 : 13.5,
                lineHeight: isVerySmall ? 18 : 20,
              },
            ]}
          >
            {s.body}
          </Text>
        </Animated.View>

        <View style={styles.lionWrap} pointerEvents="none">
          <Animated.View
            style={{
              opacity: appear,
              transform: [{ translateY: lionY }, { scale: lionScale }],
            }}
          >
            <Image source={s.lion} style={{ width: lionW, height: lionH }} resizeMode="contain" />
          </Animated.View>
        </View>

        <View style={[styles.bottomArea, { paddingBottom: 24 + 40 }]}>
          <Animated.View
            style={{
              opacity: appear,
              transform: [{ translateY: btnY }],
            }}
          >
            <Pressable
              onPress={onPressMain}
              style={({ pressed }) => [
                styles.redBtn,
                {
                  width: btnW,
                  height: btnH,
                  opacity: pressed ? 0.92 : 1,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                },
              ]}
            >
              <View style={styles.redHighlight} />
              <Text style={[styles.btnText, { fontSize: isVerySmall ? 18 : 20 }]}>{s.button}</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  page: { flex: 1, alignItems: 'center' },

  greenCard: {
    borderRadius: 16,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  cardTitle: {
    textAlign: 'center',
    fontWeight: '800',
    color: '#ff4f7a',
    marginBottom: 10,
  },

  cardBody: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.95,
  },

  lionWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 64,
  },

  bottomArea: { width: '100%', alignItems: 'center' },

  redBtn: {
    borderRadius: 16,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  redHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '48%',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  btnText: { color: '#fff', fontWeight: '800' },
});