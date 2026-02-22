import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  Animated,
  useWindowDimensions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../routes/appRoutes';

const BG = require('../assets/bg_generic.png');
const ICON_BACK = require('../assets/icon_back.png');
const LOGO_TOP = require('../assets/logo.png');

const IMG_LION = require('../assets/lion.png');
const IMG_ELEPHANT = require('../assets/elephant.png');
const IMG_GIRAFFE = require('../assets/giraffe.png');
const IMG_ANTELOPE = require('../assets/antelope.png');

type Props = NativeStackScreenProps<AppStackParamList, 'Puzzles'>;
type AnimalId = 'lion' | 'elephant' | 'giraffe' | 'antelope';
type Mode = 'intro' | 'play' | 'result';

const animalImageMap: Record<AnimalId, any> = {
  lion: IMG_LION,
  elephant: IMG_ELEPHANT,
  giraffe: IMG_GIRAFFE,
  antelope: IMG_ANTELOPE,
};

export default function PuzzlesView({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  const isSE = height < 680;
  const globalDown = isSE ? 15 : 40;

  const panelW = Math.min(340, Math.round(width * 0.9));
  const btnH = isSE ? 48 : 60;
  const tileSize = isSE ? Math.min(130, Math.round(panelW / 2 - 8)) : 150;
  const tileImg = Math.round(tileSize * 0.7);

  const [mode, setMode] = useState<Mode>('intro');
  const [idx, setIdx] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const pageFade = useRef(new Animated.Value(0)).current;
  const pageRise = useRef(new Animated.Value(14)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerRise = useRef(new Animated.Value(12)).current;

  const appearAll = useCallback(() => {
    pageFade.setValue(0);
    pageRise.setValue(14);
    headerFade.setValue(0);
    headerRise.setValue(12);

    Animated.parallel([
      Animated.timing(headerFade, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.timing(headerRise, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(pageFade, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(pageRise, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [headerFade, headerRise, pageFade, pageRise]);

  const allRiddles = useMemo(
    () => [
      { id: 'r1', text: 'I have a mane, I roar loudly,\nIn the savannah I am the leader.', answer: 'lion' as AnimalId },
      { id: 'r2', text: 'I am big and have a trunk,\nI can drink and pour water.', answer: 'elephant' as AnimalId },
    ],
    []
  );

  const current = allRiddles[idx % allRiddles.length];

  useEffect(() => {
    appearAll();
  }, [mode, idx, appearAll]);

  const onPick = (animal: AnimalId) => {
    setIsCorrect(animal === current.answer);
    setMode('result');
  };

  return (
    <ImageBackground source={BG} style={styles.root} resizeMode="cover">
      <Animated.View
        style={[
          styles.topBar,
          {
            marginTop: (isSE ? 25 : 46) + globalDown,
            opacity: headerFade,
            transform: [{ translateY: headerRise }],
          },
        ]}
      >
        <View style={[styles.headerPill, { height: isSE ? 54 : 64 }]}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.backSquare, { width: isSE ? 40 : 46, height: isSE ? 40 : 46 }]}
          >
            <Image source={ICON_BACK} style={styles.backIcon} resizeMode="contain" />
          </Pressable>
          <Text style={[styles.headerText, { fontSize: isSE ? 16 : 18 }]}>{mode === 'result' ? 'Result' : 'Puzzles'}</Text>
          <Image source={LOGO_TOP} style={[styles.headerLogo, { width: isSE ? 36 : 44, height: isSE ? 36 : 44 }]} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            paddingTop: isSE ? 10 : 25,
            opacity: pageFade,
            transform: [{ translateY: pageRise }],
          },
        ]}
      >
        {mode === 'intro' && (
          <View style={styles.center}>
            <View style={[styles.heroWrap, { width: panelW, height: isSE ? 180 : 260 }]}>
              <Image source={IMG_LION} style={styles.heroImg} resizeMode="contain" />
            </View>

            <View style={[styles.greenCard, { width: panelW, marginTop: isSE ? 10 : 20, padding: isSE ? 12 : 20 }]}>
              <Text style={[styles.greenTitle, { fontSize: isSE ? 18 : 20 }]}>Guess the riddle</Text>
              <Text style={[styles.greenBody, { fontSize: isSE ? 12 : 13 }]}>Choose the animal to which this riddle belongs.</Text>
            </View>

            <Pressable onPress={() => setMode('play')} style={[styles.redBtn, { width: panelW, height: btnH, marginTop: isSE ? 10 : 20 }]}>
              <View style={styles.redHighlight} />
              <Text style={styles.redBtnText}>Start</Text>
            </Pressable>
          </View>
        )}

        {mode === 'play' && (
          <View style={styles.center}>
            <View style={[styles.greenBigCard, { width: panelW, padding: isSE ? 12 : 24 }]}>
              <Text style={styles.meta}>Riddle</Text>
              <Text style={[styles.riddleText, { fontSize: isSE ? 16 : 18, lineHeight: isSE ? 20 : 24 }]}>{current.text}</Text>
            </View>

            <View style={{ height: isSE ? 10 : 20 }} />

            <View style={[styles.grid2x2, { width: panelW }]}>
              {(['lion', 'elephant', 'giraffe', 'antelope'] as AnimalId[]).map((id) => (
                <Pressable
                  key={id}
                  onPress={() => onPick(id)}
                  style={[styles.animalTile, { width: tileSize, height: tileSize, marginBottom: isSE ? 8 : 12 }]}
                >
                  <Image source={animalImageMap[id]} style={{ width: tileImg, height: tileImg }} resizeMode="contain" />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {mode === 'result' && (
          <View style={styles.center}>
            <View style={[styles.greenBigCard, { width: panelW, padding: isSE ? 15 : 24 }]}>
              <Text style={styles.meta}>Result</Text>
              <Text style={[styles.riddleText, { fontSize: isSE ? 16 : 18 }]}>{isCorrect ? 'Correct!' : 'Incorrect!'}</Text>
            </View>

            <View style={{ marginTop: isSE ? 15 : 25 }}>
              <Pressable onPress={() => setMode('play')} style={[styles.redBtn, { width: panelW, height: btnH }]}>
                <View style={styles.redHighlight} />
                <Text style={styles.redBtnText}>Try again</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setIdx((v) => v + 1);
                  setMode('play');
                }}
                style={[styles.secondaryBtn, { width: panelW, height: btnH, marginTop: 10 }]}
              >
                <Text style={styles.secondaryText}>Next riddle</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { width: '100%', paddingHorizontal: 16 },
  headerPill: {
    borderRadius: 18,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  backSquare: {
    borderRadius: 12,
    backgroundColor: '#7CD10C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  backIcon: { width: 18, height: 18, tintColor: '#fff' },
  headerText: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '900' },
  headerLogo: { borderRadius: 10 },

  content: { flex: 1 },
  center: { alignItems: 'center' },

  heroWrap: {
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImg: { width: '80%', height: '80%' },

  greenCard: {
    backgroundColor: '#7CD10C',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  greenTitle: { color: '#ff4f7a', fontWeight: '900', marginBottom: 4 },
  greenBody: { color: '#fff', fontWeight: '800', textAlign: 'center' },

  redBtn: {
    backgroundColor: '#E53935',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  redHighlight: { position: 'absolute', top: 0, width: '100%', height: '46%', backgroundColor: 'rgba(255,255,255,0.18)' },
  redBtnText: { color: '#fff', fontWeight: '900', fontSize: 17 },

  greenBigCard: {
    backgroundColor: '#7CD10C',
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  meta: { color: '#ff4f7a', fontWeight: '900', fontSize: 13, marginBottom: 6 },
  riddleText: { color: '#fff', fontWeight: '900', textAlign: 'center' },

  grid2x2: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  animalTile: {
    backgroundColor: '#7CD10C',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryBtn: {
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});