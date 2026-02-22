import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
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
  ScrollView,
  Share,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../routes/appRoutes';
import { STORIES_DATA, type AnimalStories } from '../data/storiesData';

const BG = require('../assets/bg_generic.png');

const ICON_BACK = require('../assets/icon_back.png');
const LOGO_TOP = require('../assets/logo.png');
const ICON_NEXT = require('../assets/icon_next.png');

const IMG_LION = require('../assets/lion.png');
const IMG_ELEPHANT = require('../assets/elephant.png');
const IMG_GIRAFFE = require('../assets/giraffe.png');
const IMG_ANTELOPE = require('../assets/antelope.png');
const IMG_ZEBRA = require('../assets/zebra.png');

const IMG_WIN = require('../assets/result_win.png');
const IMG_LOSE = require('../assets/result_lose.png');

type Props = NativeStackScreenProps<AppStackParamList, 'Read'>;
type Mode = 'list' | 'story' | 'quiz' | 'feedback' | 'result';

const animalImageMap: Record<string, any> = {
  lion: IMG_LION,
  elephant: IMG_ELEPHANT,
  giraffe: IMG_GIRAFFE,
  antelope: IMG_ANTELOPE,
  zebra: IMG_ZEBRA,
};

const QUIZ_SECONDS = 15;

export default function ReadView({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const isSmall = height < 740;
  const isVerySmall = height < 680 || width < 360;

  const animals = useMemo(() => STORIES_DATA, []);
  const [selected, setSelected] = useState<AnimalStories>(animals[0]);
  const [storyIndex, setStoryIndex] = useState(0);
  const [mode, setMode] = useState<Mode>('list');

  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUIZ_SECONDS);
  const quizTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockAnswerRef = useRef(false);

  const story = selected.stories[storyIndex];
  const questions = story.questions;
  const currentQ = questions[qIndex];

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(16)).current;
  const scale = useRef(new Animated.Value(0.985)).current;

  const playAppear = useCallback(() => {
    fade.setValue(0);
    rise.setValue(16);
    scale.setValue(0.985);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 330,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 330,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise, scale]);

  useEffect(() => {
    playAppear();
  }, [mode, selected.animalId, storyIndex, qIndex, playAppear]);

  const wrapW = Math.min(340, Math.round(width * 0.88));
  const pillW = Math.min(300, Math.round(width * 0.78));
  const btnW = Math.min(320, Math.round(width * 0.84));
  const btnH = isVerySmall ? 56 : 62;

  const storyCardH = Math.min(320, Math.round(height * (isVerySmall ? 0.34 : isSmall ? 0.38 : 0.42)));

  const safeTopPad = isVerySmall ? 18 : 22;
  const topOffset = isVerySmall ? 28 : 52;
  const contentShift = isVerySmall ? 78 : 50;

  const animalThumbSize = isVerySmall ? 54 : 58;
  const nextIconSize = isVerySmall ? 14 : 16;
  const nextBoxW = isVerySmall ? 44 : 46;

  const heroAnimalH = isVerySmall ? 120 : isSmall ? 140 : 160;

  const resetToStory = () => {
    setMode('story');
    setQIndex(0);
    setCorrect(0);
    setLastCorrect(null);
    setTimeLeft(QUIZ_SECONDS);
  };

  const onTopBack = () => {
    if (mode === 'list') return navigation.goBack();
    if (mode === 'story') return setMode('list');
    resetToStory();
  };

  const pickAnimal = (a: AnimalStories) => {
    setSelected(a);
    setStoryIndex(0);
    setMode('story');
    setQIndex(0);
    setCorrect(0);
    setLastCorrect(null);
    setTimeLeft(QUIZ_SECONDS);
  };

  const startQuiz = () => {
    setMode('quiz');
    setQIndex(0);
    setCorrect(0);
    setLastCorrect(null);
    setTimeLeft(QUIZ_SECONDS);
  };

  const stopQuizTimer = useCallback(() => {
    if (quizTimerRef.current) {
      clearInterval(quizTimerRef.current);
      quizTimerRef.current = null;
    }
  }, []);

  const startQuizTimer = useCallback(() => {
    stopQuizTimer();
    lockAnswerRef.current = false;
    setTimeLeft(QUIZ_SECONDS);

    quizTimerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopQuizTimer();
          if (lockAnswerRef.current) return 0;
          lockAnswerRef.current = true;
          setLastCorrect(false);
          setMode('feedback');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [stopQuizTimer]);

  useEffect(() => {
    if (mode === 'quiz') {
      startQuizTimer();
      return;
    }
    stopQuizTimer();
    lockAnswerRef.current = false;
  }, [mode, qIndex, selected.animalId, storyIndex, startQuizTimer, stopQuizTimer]);

  useEffect(() => {
    return () => {
      stopQuizTimer();
    };
  }, [stopQuizTimer]);

  const answer = (pickIdx: number) => {
    if (lockAnswerRef.current) return;
    lockAnswerRef.current = true;

    stopQuizTimer();

    const ok = pickIdx === currentQ.correctIndex;
    setLastCorrect(ok);
    if (ok) setCorrect((v) => v + 1);
    setMode('feedback');
  };

  const next = () => {
    if (qIndex < questions.length - 1) {
      setQIndex((v) => v + 1);
      setMode('quiz');
    } else {
      setMode('result');
      stopQuizTimer();
    }
  };

  const restartQuiz = () => {
    stopQuizTimer();
    lockAnswerRef.current = false;

    setQIndex(0);
    setCorrect(0);
    setLastCorrect(null);
    setTimeLeft(QUIZ_SECONDS);
    setMode('quiz');
  };

  const win = correct >= Math.max(1, Math.ceil(questions.length * 0.67));
  const animalImage = animalImageMap[selected.animalId] ?? (selected as any).image;

  const formatMMSS = (sec: number) => {
    const s = Math.max(0, sec);
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    const mmStr = String(mm).padStart(2, '0');
    const ssStr = String(ss).padStart(2, '0');
    return `${mmStr}:${ssStr}`;
  };

  const shareResult = async () => {
    const title = `${selected.name} — ${story.title}`;
    const msg =
      `${title}\n\n` +
      `Score: ${correct}/${questions.length}\n` +
      `Result: ${win ? 'WIN' : 'LOSE'}\n\n` +
      `Story:\n${story.text}`;

    try {
      await Share.share({ message: msg, title }, { dialogTitle: 'Share' });
    } catch {}
  };

  return (
    <ImageBackground source={BG} style={styles.root} resizeMode="cover">
      <View style={[styles.topBar, { paddingTop: safeTopPad, marginTop: topOffset }]}>
        <Pressable onPress={onTopBack} style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.9 : 1 }]} hitSlop={10}>
          <Image source={ICON_BACK} style={styles.backIcon} resizeMode="contain" />
        </Pressable>
        <Image source={LOGO_TOP} style={styles.topLogo} resizeMode="contain" />
      </View>

      <Animated.View
        style={[
          styles.contentWrap,
          {
            paddingTop: contentShift,
            opacity: fade,
            transform: [{ translateY: rise }, { scale }],
          },
        ]}
      >
        {mode === 'list' && (
          <View style={styles.center}>
            <View style={[styles.redPill, { width: pillW }]}>
              <Text style={styles.redPillText}>Choose an animal</Text>
            </View>

            <View style={{ height: isVerySmall ? 12 : 14 }} />

            <View style={{ gap: isVerySmall ? 10 : 12 }}>
              {animals.map((a) => (
                <Pressable
                  key={a.animalId}
                  onPress={() => pickAnimal(a)}
                  style={({ pressed }) => [
                    styles.animalRow,
                    { width: btnW, opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
                  ]}
                >
                  <Image
                    source={animalImageMap[a.animalId] ?? (a as any).image}
                    style={{ width: animalThumbSize, height: animalThumbSize, marginLeft: 10 }}
                    resizeMode="contain"
                  />
                  <Text style={styles.animalName}>{a.name}</Text>
                  <View style={[styles.animalNextBox, { width: nextBoxW }]}>
                    <Image source={ICON_NEXT} style={{ width: nextIconSize, height: nextIconSize, tintColor: '#fff' }} resizeMode="contain" />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {mode === 'story' && (
          <View style={styles.center}>
            <View style={[styles.heroAnimalWrap, { width: wrapW, height: heroAnimalH }]}>
              <Image source={animalImage} style={styles.heroAnimal} resizeMode="contain" />
            </View>

            <View style={{ height: isVerySmall ? 10 : 12 }} />

            <View style={[styles.greenTitle, { width: wrapW }]}>
              <Text style={styles.greenTitleText}>A story from a {selected.name}</Text>
            </View>

            <View style={{ height: isVerySmall ? 10 : 12 }} />

            <View style={[styles.storyCard, { width: wrapW, height: storyCardH }]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyText}>{story.text}</Text>
              </ScrollView>
            </View>

            <View style={{ height: isVerySmall ? 12 : 14 }} />

            <Pressable
              onPress={startQuiz}
              style={({ pressed }) => [
                styles.redBtn,
                {
                  width: pillW,
                  height: btnH,
                  opacity: pressed ? 0.92 : 1,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                },
              ]}
            >
              <View style={styles.redHighlight} />
              <Text style={styles.redBtnText}>Start</Text>
            </Pressable>
          </View>
        )}

        {mode === 'quiz' && (
          <View style={styles.center}>
            <View style={[styles.timerPill, { width: Math.min(120, Math.round(width * 0.3)) }]}>
              <Text style={styles.timerText}>{formatMMSS(timeLeft)}</Text>
            </View>

            <View style={{ height: isVerySmall ? 10 : 12 }} />

            <View style={[styles.greenQuestion, { width: wrapW }]}>
              <Text style={styles.qMeta}>
                Question {qIndex + 1}/{questions.length}
              </Text>
              <Text style={styles.qText}>{currentQ.question}</Text>
            </View>

            <View style={{ height: isVerySmall ? 12 : 14 }} />

            <View style={{ gap: isVerySmall ? 10 : 12 }}>
              {currentQ.options.map((opt, i) => (
                <Pressable
                  key={`${story.id}-q${qIndex}-o${i}`}
                  onPress={() => answer(i)}
                  style={({ pressed }) => [
                    styles.greenOption,
                    { width: pillW, opacity: pressed ? 0.92 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
                  ]}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {mode === 'feedback' && (
          <View style={styles.center}>
            <View style={[styles.greenQuestion, { width: wrapW }]}>
              <Text style={styles.qMeta}>
                Question {qIndex + 1}/{questions.length}
              </Text>
              <Text style={styles.qText}>{lastCorrect ? 'This answer is correct!' : 'This answer is incorrect!'}</Text>
            </View>

            <View style={{ height: isVerySmall ? 14 : 16 }} />

            <Pressable
              onPress={next}
              style={({ pressed }) => [
                styles.redBtn,
                {
                  width: pillW,
                  height: btnH,
                  opacity: pressed ? 0.92 : 1,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                },
              ]}
            >
              <View style={styles.redHighlight} />
              <Text style={styles.redBtnText}>{qIndex < questions.length - 1 ? 'Next question' : 'Result'}</Text>
            </Pressable>
          </View>
        )}

        {mode === 'result' && (
          <View style={styles.center}>
            <View style={[styles.resultImageWrap, { width: wrapW }]}>
              <Image source={win ? IMG_WIN : IMG_LOSE} style={styles.resultImage} resizeMode="contain" />
            </View>

            <View style={{ height: isVerySmall ? 10 : 12 }} />

            <View style={[styles.greenResult, { width: wrapW }]}>
              <Text style={styles.resultTitle}>Result</Text>
              <Text style={styles.resultText}>
                You answered {correct} out of {questions.length} questions correctly.
                {'\n\n'}
                {win
                  ? 'Great job! You can continue and collect wallpapers. You can download them in the "Library" section.'
                  : 'Unfortunately, you will not receive the wallpaper. Try again, I’m sure you will succeed!'}
              </Text>
            </View>

            <View style={{ height: isVerySmall ? 14 : 16 }} />

            <Pressable
              onPress={shareResult}
              style={({ pressed }) => [
                styles.redBtn,
                {
                  width: pillW,
                  height: btnH,
                  opacity: pressed ? 0.92 : 1,
                  transform: [{ scale: pressed ? 0.985 : 1 }],
                },
              ]}
            >
              <View style={styles.redHighlight} />
              <Text style={styles.redBtnText}>Share</Text>
            </Pressable>

            <View style={{ height: 10 }} />

            <Pressable
              onPress={restartQuiz}
              style={({ pressed }) => [
                styles.tryAgain,
                { width: pillW, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] },
              ]}
            >
              <Text style={styles.tryAgainText}>Try again</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  topBar: {
    width: '100%',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 46,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backIcon: { width: 18, height: 18, tintColor: '#fff' },
  topLogo: { width: 110, height: 36 },

  contentWrap: { flex: 1 },

  center: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 18,
  },

  redPill: {
    height: 36,
    borderRadius: 12,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  redPillText: { color: '#fff', fontWeight: '900', fontSize: 13 },

  animalRow: {
    height: 70,
    borderRadius: 14,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  animalName: { marginLeft: 12, color: '#fff', fontWeight: '900', fontSize: 16, flex: 1 },

  animalNextBox: {
    height: '100%',
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(255,255,255,0.35)',
  },

  heroAnimalWrap: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: 'rgba(0,0,0,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroAnimal: { width: '92%', height: '92%' },

  greenTitle: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 12,
  },
  greenTitleText: { color: '#ff4f7a', fontWeight: '900', fontSize: 14, textAlign: 'center' },

  storyCard: {
    borderRadius: 14,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    padding: 14,
  },
  storyTitle: { color: '#ff4f7a', fontWeight: '900', fontSize: 14, textAlign: 'center', marginBottom: 10 },
  storyText: { color: '#fff', fontWeight: '700', fontSize: 12.5, lineHeight: 18, textAlign: 'left' },

  timerPill: {
    height: 34,
    borderRadius: 12,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  timerText: { color: '#fff', fontWeight: '900', fontSize: 13 },

  greenQuestion: {
    borderRadius: 14,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    padding: 14,
    alignItems: 'center',
  },
  qMeta: { color: '#ff4f7a', fontWeight: '900', fontSize: 12, marginBottom: 8 },
  qText: { color: '#fff', fontWeight: '900', fontSize: 14, textAlign: 'center' },

  greenOption: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  optionText: { color: '#fff', fontWeight: '900', fontSize: 12 },

  resultImageWrap: {
    height: 210,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: 'rgba(0,0,0,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  resultImage: { width: '86%', height: '86%' },

  greenResult: {
    borderRadius: 14,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    padding: 14,
  },
  resultTitle: { color: '#ff4f7a', fontWeight: '900', fontSize: 12, textAlign: 'center', marginBottom: 8 },
  resultText: { color: '#fff', fontWeight: '800', fontSize: 12, lineHeight: 18, textAlign: 'center' },

  redBtn: {
    borderRadius: 16,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  redHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  redBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },

  tryAgain: {
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tryAgainText: { color: '#fff', fontWeight: '900', fontSize: 13 },
});