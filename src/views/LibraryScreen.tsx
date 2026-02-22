import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ImageBackground,
  Image,
  FlatList,
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

const STORAGE_REWARDS = 'pairs_rewards_v1';

type Props = NativeStackScreenProps<AppStackParamList, 'Library'>;

type RewardItem = {
  id: string;
  src: any;
};

export default function LibraryScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();

  const isSmall = height < 760;
  const isVerySmall = height < 680 || width < 360;

  const topOffset = isVerySmall ? 40 : 70;
  const contentOffset = isVerySmall ? 36 : 70;

  const [rewardIds, setRewardIds] = useState<string[]>([]);

  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(14)).current;

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_REWARDS);
      setRewardIds(raw ? JSON.parse(raw) : []);
    } catch {
      setRewardIds([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    fade.setValue(0);
    rise.setValue(14);
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise]);

  const unlockedSet = useMemo(() => new Set(rewardIds), [rewardIds]);

  const unlockedRewards: RewardItem[] = useMemo(() => {
    return REWARD_POOL.filter((x) => unlockedSet.has(x.id));
  }, [unlockedSet]);

  const containerW = Math.min(420, width * 0.92);
  const gap = isVerySmall ? 10 : 14;

  const cardW = Math.floor((containerW - gap) / 2);
  const aspect = isVerySmall ? 1.05 : isSmall ? 1.16 : 1.24;
  const cardH = Math.floor(cardW * aspect);
  const innerPad = isVerySmall ? 8 : 10;

  const renderEmpty = () => (
    <View style={[styles.emptyPill, { width: containerW, height: isVerySmall ? 62 : 76 }]}>
      <Text style={[styles.emptyText, { fontSize: isVerySmall ? 18 : 22 }]}>It’s empty here...</Text>
    </View>
  );

  const renderReward = ({ item, index }: { item: RewardItem; index: number }) => {
    const isLeft = index % 2 === 0;
    return (
      <View
        style={[
          styles.rewardCard,
          {
            width: cardW,
            height: cardH,
            marginRight: isLeft ? gap : 0,
            marginBottom: gap,
            padding: innerPad,
          },
        ]}
      >
        <Image source={item.src} style={styles.rewardImg} resizeMode="contain" />
      </View>
    );
  };

  return (
    <ImageBackground source={BG} style={styles.root} resizeMode="cover">
      <View style={[styles.topBar, { marginTop: topOffset }]}>
        <View style={styles.headerPill}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backSquare} hitSlop={10}>
            <Image source={ICON_BACK} style={styles.backIcon} resizeMode="contain" />
          </Pressable>

          <Text style={styles.headerText}>Library</Text>

          <Image source={LOGO_TOP} style={styles.headerLogo} resizeMode="cover" />
        </View>
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            paddingTop: contentOffset,
            opacity: fade,
            transform: [{ translateY: rise }],
          },
        ]}
      >
        <View style={{ width: containerW }}>
          {unlockedRewards.length === 0 ? (
            renderEmpty()
          ) : (
            <FlatList
              data={unlockedRewards}
              keyExtractor={(x) => x.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={renderReward}
            />
          )}
        </View>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  topBar: { width: '100%', paddingHorizontal: 14 },

  headerPill: {
    height: 60,
    borderRadius: 16,
    backgroundColor: '#E53935',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backSquare: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#7CD10C',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { width: 18, height: 18, tintColor: '#fff' },

  headerText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '900',
    fontSize: 17,
  },
  headerLogo: { width: 40, height: 40, borderRadius: 12 },

  content: { flex: 1, alignItems: 'center' },

  emptyPill: {
    borderRadius: 18,
    backgroundColor: '#E53935',
    borderWidth: 3,
    borderColor: 'rgba(255,215,120,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: { color: '#fff', fontWeight: '900' },

  rewardCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,215,120,0.95)',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  rewardImg: { width: '100%', height: '100%' },
});