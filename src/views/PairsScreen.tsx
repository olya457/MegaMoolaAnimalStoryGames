import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../routes/appRoutes';

const BG = require('../assets/bg_generic.png');

const ICON_BACK = require('../assets/icon_back.png');
const LOGO_TOP = require('../assets/logo.png');

const IMG_LION = require('../assets/lion.png');
const IMG_ELEPHANT = require('../assets/elephant.png');
const IMG_GIRAFFE = require('../assets/giraffe.png');
const IMG_ANTELOPE = require('../assets/antelope.png');
const IMG_ZEBRA = require('../assets/zebra.png');

const REWARD_1 = require('../assets/reward_1.png');
const REWARD_2 = require('../assets/reward_2.png');
const REWARD_3 = require('../assets/reward_3.png');
const REWARD_4 = require('../assets/reward_4.png');
const REWARD_5 = require('../assets/reward_5.png');
const REWARD_6 = require('../assets/reward_6.png');

const REWARD_POOL = [
  { id: 'reward_1', src: REWARD_1 },
  { id: 'reward_2', src: REWARD_2 },
  { id: 'reward_3', src: REWARD_3 },
  { id: 'reward_4', src: REWARD_4 },
  { id: 'reward_5', src: REWARD_5 },
  { id: 'reward_6', src: REWARD_6 },
] as const;

const STORAGE_RESULTS = 'pairs_results_v1';
const STORAGE_REWARDS = 'pairs_rewards_v1';

type Props = NativeStackScreenProps<AppStackParamList, 'Pairs'>;

type AnimalId = 'lion' | 'elephant' | 'giraffe' | 'antelope' | 'zebra';

type Card = {
  id: string;
  face: AnimalId;
  isOpen: boolean;
  isMatched: boolean;
};

type SavedResult = {
  id: string;
  ts: number;
  level: number;
  pairsFound: number;
  totalPairs: number;
  grid: { rows: number; cols: number };
  earnedRewardId?: string;
  passed: boolean;
  seconds: number;
};

const animalImageMap: Record<AnimalId, any> = {
  lion: IMG_LION,
  elephant: IMG_ELEPHANT,
  giraffe: IMG_GIRAFFE,
  antelope: IMG_ANTELOPE,
  zebra: IMG_ZEBRA,
};

const LEVELS = [
  { level: 1, rows: 3, cols: 4 },
  { level: 2, rows: 4, cols: 4 },
  { level: 3, rows: 4, cols: 5 },
  { level: 4, rows: 4, cols: 6 },
  { level: 5, rows: 5, cols: 6 },
  { level: 6, rows: 6, cols: 6 },
  { level: 7, rows: 6, cols: 7 },
  { level: 8, rows: 6, cols: 8 },
  { level: 9, rows: 7, cols: 8 },
  { level: 10, rows: 8, cols: 8 },
] as const;

function cfgFor(level: number) {
  return LEVELS.find((x) => x.level === level) ?? LEVELS[0];
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function secondsForLevel(level: number) {
  const max = 30;
  const min = 15;
  const t = (level - 1) / 9;
  const raw = max - (max - min) * t;
  const sec = Math.round(raw);
  return Math.max(min, Math.min(max, sec));
}

function buildDeck(level: number): Card[] {
  const { rows, cols } = cfgFor(level);
  const total = rows * cols;
  const pairs = total / 2;

  const faces: AnimalId[] = ['lion', 'elephant', 'giraffe', 'antelope', 'zebra'];

  const cards: Card[] = [];
  for (let i = 0; i < pairs; i++) {
    const face = faces[Math.floor(Math.random() * faces.length)];
    cards.push(
      { id: `L${level}_P${i}_A`, face, isOpen: false, isMatched: false },
      { id: `L${level}_P${i}_B`, face, isOpen: false, isMatched: false }
    );
  }

  return shuffle(cards.map((c) => ({ ...c, isOpen: false, isMatched: false })));
}

type Mode = 'idle' | 'play' | 'result';

export default function PairsView({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  const isSmall = height < 760;
  const isVerySmall = height < 700 || width < 360;

  const [mode, setMode] = useState<Mode>('idle');
  const [level, setLevel] = useState(1);

  const [deck, setDeck] = useState<Card[]>(() => buildDeck(1));
  const [selected, setSelected] = useState<number[]>([]);
  const [pairsFound, setPairsFound] = useState(0);

  const [timeLeft, setTimeLeft] = useState(secondsForLevel(1));
  const [earnedRewardId, setEarnedRewardId] = useState<string | undefined>(undefined);
  const [passedLevel, setPassedLevel] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resolveRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoNextRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(18)).current;

  const cfg = useMemo(() => cfgFor(level), [level]);

  const topOffset = 70;
  const contentOffset = 70;

  const gridMaxW = Math.min(380, Math.round(width * 0.92));
  const gap = isVerySmall ? 10 : isSmall ? 12 : 16;

  const tileSize = useMemo(() => {
    const inner = gridMaxW - gap * (cfg.cols - 1);
    return Math.max(isVerySmall ? 30 : 34, Math.floor(inner / cfg.cols));
  }, [gridMaxW, gap, cfg.cols, isVerySmall]);

  const imgSize = Math.floor(tileSize * 0.62);
  const totalPairs = useMemo(() => (cfg.rows * cfg.cols) / 2, [cfg.rows, cfg.cols]);
  const levelSeconds = useMemo(() => secondsForLevel(level), [level]);

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;

    if (resolveRef.current) clearTimeout(resolveRef.current);
    resolveRef.current = null;

    if (autoNextRef.current) clearTimeout(autoNextRef.current);
    autoNextRef.current = null;
  }, []);

  useEffect(() => {
    fade.setValue(0);
    rise.setValue(18);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    return () => clearTimers();
  }, [fade, rise, clearTimers]);

  const rewardForLevel = useCallback((lvl: number) => {
    const idx = (lvl - 1) % REWARD_POOL.length;
    return REWARD_POOL[idx];
  }, []);

  const saveResultAndRewards = useCallback(async (result: SavedResult, rewardId?: string) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_RESULTS);
      const prev: SavedResult[] = raw ? JSON.parse(raw) : [];
      const next = [result, ...prev].slice(0, 50);
      await AsyncStorage.setItem(STORAGE_RESULTS, JSON.stringify(next));
    } catch {}

    if (rewardId) {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_REWARDS);
        const prev: string[] = raw ? JSON.parse(raw) : [];
        const set = new Set(prev);
        set.add(rewardId);
        await AsyncStorage.setItem(STORAGE_REWARDS, JSON.stringify(Array.from(set)));
      } catch {}
    }
  }, []);

  const computePass = useCallback(() => {
    const allMatched = deck.length > 0 && deck.every((c) => c.isMatched);
    if (allMatched) return true;
    const need = Math.max(2, Math.floor(totalPairs * 0.25));
    return pairsFound >= need;
  }, [deck, pairsFound, totalPairs]);

  const finish = useCallback(async () => {
    clearTimers();

    const passed = computePass();
    setPassedLevel(passed);
    setMode('result');
    setTimeLeft(0);

    const reward = passed ? rewardForLevel(level) : undefined;
    setEarnedRewardId(reward?.id);

    const res: SavedResult = {
      id: `res_${Date.now()}`,
      ts: Date.now(),
      level,
      pairsFound,
      totalPairs,
      grid: { rows: cfg.rows, cols: cfg.cols },
      earnedRewardId: reward?.id,
      passed,
      seconds: levelSeconds,
    };

    await saveResultAndRewards(res, reward?.id);

    if (passed) {
      autoNextRef.current = setTimeout(() => {
        if (level < 10) startLevel(level + 1);
      }, 900);
    }
  }, [clearTimers, computePass, rewardForLevel, level, pairsFound, totalPairs, cfg.rows, cfg.cols, levelSeconds, saveResultAndRewards]);

  const startLevel = useCallback(
    (lvl: number) => {
      clearTimers();

      setPassedLevel(false);
      setEarnedRewardId(undefined);

      setLevel(lvl);
      setDeck(buildDeck(lvl));
      setSelected([]);
      setPairsFound(0);

      const sec = secondsForLevel(lvl);
      setTimeLeft(sec);
      setMode('play');

      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearTimers();
            setTimeout(() => finish(), 0);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    },
    [clearTimers, finish]
  );

  useEffect(() => {
    if (mode !== 'play') return;
    if (deck.length === 0) return;
    if (deck.every((c) => c.isMatched)) finish();
  }, [deck, mode, finish]);

  const onPressCard = useCallback(
    (idx: number) => {
      if (mode !== 'play') return;
      if (timeLeft <= 0) return;

      setDeck((prev) => {
        const c = prev[idx];
        if (!c) return prev;
        if (c.isMatched) return prev;
        if (c.isOpen) return prev;
        if (selected.length >= 2) return prev;

        const next = [...prev];
        next[idx] = { ...c, isOpen: true };
        return next;
      });

      setSelected((prevSel) => {
        if (prevSel.includes(idx)) return prevSel;
        if (prevSel.length >= 2) return prevSel;
        return [...prevSel, idx];
      });
    },
    [mode, timeLeft, selected.length]
  );

  useEffect(() => {
    if (mode !== 'play') return;
    if (selected.length !== 2) return;

    const [a, b] = selected;
    const A = deck[a];
    const B = deck[b];
    if (!A || !B) return;

    const isMatch = A.face === B.face;

    resolveRef.current = setTimeout(() => {
      setDeck((prev) => {
        const next = [...prev];
        const AA = next[a];
        const BB = next[b];
        if (!AA || !BB) return prev;

        if (isMatch) {
          next[a] = { ...AA, isMatched: true, isOpen: true };
          next[b] = { ...BB, isMatched: true, isOpen: true };
        } else {
          next[a] = { ...AA, isOpen: false };
          next[b] = { ...BB, isOpen: false };
        }
        return next;
      });

      if (isMatch) setPairsFound((p) => p + 1);
      setSelected([]);
      resolveRef.current = null;
    }, isMatch ? 140 : 650);

    return () => {
      if (resolveRef.current) {
        clearTimeout(resolveRef.current);
        resolveRef.current = null;
      }
    };
  }, [selected, deck, mode]);

  const restart = () => startLevel(level);

  const earnedReward = earnedRewardId ? REWARD_POOL.find((x) => x.id === earnedRewardId) : undefined;

  return (
    <ImageBackground source={BG} style={styles.root} resizeMode="cover">
      <View style={[styles.topBar, { marginTop: topOffset }]}>
        <View style={styles.headerPill}>
          <Pressable
            onPress={() => {
              clearTimers();
              navigation.goBack();
            }}
            style={({ pressed }) => [styles.backSquare, { opacity: pressed ? 0.9 : 1 }]}
            hitSlop={10}
          >
            <Image source={ICON_BACK} style={styles.backIcon} resizeMode="contain" />
          </Pressable>

          <Text style={styles.headerText}>Pairs</Text>

          <Image source={LOGO_TOP} style={styles.headerLogo} resizeMode="cover" />
        </View>
      </View>

      <Animated.View style={[styles.content, { paddingTop: contentOffset, opacity: fade, transform: [{ translateY: rise }] }]}>
        {mode === 'idle' && (
          <View style={styles.center}>
            <View style={[styles.redInfo, { width: Math.min(380, Math.round(0.92 * width)) }]}>
              <Text style={styles.redInfoText}>
                Find pairs in {secondsForLevel(level)} seconds{'\n'}
                Level {level}/10 • Grid {cfg.rows}×{cfg.cols}
              </Text>
            </View>

            <View style={{ height: isVerySmall ? 14 : 18 }} />

            <Pressable
              onPress={() => startLevel(level)}
              style={({ pressed }) => [
                styles.redBtn,
                {
                  width: Math.min(300, Math.round(width * 0.78)),
                  height: isVerySmall ? 54 : 62,
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

        {mode === 'play' && (
          <View style={styles.center}>
            <View style={[styles.redInfo, { width: Math.min(380, Math.round(0.92 * width)) }]}>
              <Text style={styles.redInfoText}>
                Time: {timeLeft}s • Pairs: {pairsFound}/{totalPairs} • Level {level}/10
              </Text>
            </View>

            <View style={{ height: isVerySmall ? 14 : 18 }} />

            <View style={{ width: gridMaxW, alignItems: 'center' }}>
              <View style={[styles.grid, { gap }]}>
                {deck.map((c, idx) => {
                  const show = c.isOpen || c.isMatched;
                  return (
                    <Pressable
                      key={c.id}
                      onPress={() => onPressCard(idx)}
                      disabled={c.isMatched || selected.length >= 2}
                      style={({ pressed }) => [
                        styles.tile,
                        {
                          width: tileSize,
                          height: tileSize,
                          opacity: pressed ? 0.96 : 1,
                          transform: [{ scale: pressed ? 0.99 : 1 }],
                        },
                      ]}
                    >
                      {show ? (
                        <Image source={animalImageMap[c.face]} style={{ width: imgSize, height: imgSize }} resizeMode="contain" />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {mode === 'result' && (
          <View style={styles.center}>
            <View style={[styles.greenCard, { width: Math.min(380, Math.round(width * 0.92)) }]}>
              <Text style={styles.meta}>{passedLevel ? 'Level Passed!' : 'Try again'}</Text>

              {passedLevel && earnedReward ? (
                <View style={{ alignItems: 'center', marginBottom: 10 }}>
                  <Image source={earnedReward.src} style={styles.rewardImg} resizeMode="contain" />
                  <Text style={styles.rewardText}>Reward added to Library</Text>
                </View>
              ) : (
                <Text style={styles.rewardTextMuted}>{passedLevel ? '...' : 'No reward — you need more pairs'}</Text>
              )}

              <Text style={styles.resultText}>Pairs found:</Text>
              <Text style={styles.bigScore}>{pairsFound}</Text>

              <Text style={styles.subText}>
                Level {level}/10 • Time {levelSeconds}s • Grid {cfg.rows}×{cfg.cols}
              </Text>

              {passedLevel && level < 10 ? <Text style={styles.autoNext}>Next level is starting...</Text> : null}
            </View>

            <View style={{ height: 12 }} />

            {!passedLevel ? (
              <Pressable
                onPress={restart}
                style={({ pressed }) => [
                  styles.redBtn,
                  {
                    width: Math.min(300, Math.round(width * 0.78)),
                    height: isVerySmall ? 54 : 62,
                    opacity: pressed ? 0.92 : 1,
                    transform: [{ scale: pressed ? 0.985 : 1 }],
                  },
                ]}
              >
                <View style={styles.redHighlight} />
                <Text style={styles.redBtnText}>Try again</Text>
              </Pressable>
            ) : null}

            <View style={{ height: 12 }} />

            <Pressable
              onPress={() => navigation.navigate('Library')}
              style={({ pressed }) => [styles.secondaryBtn, { width: Math.min(300, Math.round(width * 0.78)), opacity: pressed ? 0.9 : 1 }]}
            >
              <Text style={styles.secondaryText}>Open Library</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: { width: '100%', paddingHorizontal: 14 },

  headerPill: {
    height: 64,
    borderRadius: 16,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  backSquare: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { width: 18, height: 18, tintColor: '#fff' },
  headerText: { flex: 1, textAlign: 'center', color: '#fff', fontWeight: '900', fontSize: 18 },
  headerLogo: { width: 44, height: 44, borderRadius: 12 },

  content: { flex: 1 },
  center: { flex: 1, alignItems: 'center', paddingHorizontal: 18 },

  redInfo: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  redInfoText: { color: '#fff', fontWeight: '900', fontSize: 14.5, textAlign: 'center' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },

  tile: {
    borderRadius: 18,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  redBtn: {
    borderRadius: 18,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  redHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '46%',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  redBtnText: { color: '#fff', fontWeight: '900', fontSize: 18 },

  greenCard: {
    borderRadius: 18,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  meta: { color: '#ff4f7a', fontWeight: '900', fontSize: 14, marginBottom: 8 },
  resultText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  bigScore: { marginTop: 6, color: '#fff', fontWeight: '900', fontSize: 46, lineHeight: 52 },
  subText: { marginTop: 8, color: '#fff', fontWeight: '800', fontSize: 13, textAlign: 'center', opacity: 0.95 },

  rewardImg: { width: 86, height: 86 },
  rewardText: { color: '#fff', fontWeight: '900', fontSize: 14, marginTop: 6 },
  rewardTextMuted: { color: '#fff', fontWeight: '900', fontSize: 13, opacity: 0.9, marginBottom: 10 },

  autoNext: { marginTop: 10, color: '#fff', fontWeight: '900', fontSize: 13, opacity: 0.95 },

  secondaryBtn: {
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});