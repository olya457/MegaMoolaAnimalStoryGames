import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppStackParamList } from './appRoutes';

import LaunchView from '../views/LaunchView';
import IntroView from '../views/IntroView';
import MainMenuView from '../views/MainMenuView';

import ReadView from '../views/ReadView';
import PuzzlesView from '../views/PuzzlesView';
import PairsScreen from '../views/PairsScreen';
import LibraryScreen from '../views/LibraryScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="Launch" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Launch" component={LaunchView} />
      <Stack.Screen name="Intro" component={IntroView} />
      <Stack.Screen name="MainMenu" component={MainMenuView} />

      <Stack.Screen name="Read" component={ReadView} />
      <Stack.Screen name="Puzzles" component={PuzzlesView} />
      <Stack.Screen name="Pairs" component={PairsScreen} />
      <Stack.Screen name="Library" component={LibraryScreen} />
    </Stack.Navigator>
  );
}