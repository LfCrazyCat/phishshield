// screens/OnboardingScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColors } from '../constants/theme';

const { width } = Dimensions.get('window');
const slides = [
  { title: 'Velkommen 👋', body: 'Lær å avsløre phishing med quiz, sjekklister og tips.' },
  { title: 'Sjekk lenker 🔗', body: 'Hold over lenker og se toppdomenet. Ikke logg inn via ukjente domener.' },
  { title: 'Bruk 2FA 🔐', body: 'Aktiver tofaktor og bruk passordmanager for unike passord.' },
];

export default function OnboardingScreen({ navigation }) {
  const { colors, spacing, radius, font } = useThemeColors();
  const [index, setIndex] = useState(0);

  async function done() {
    await AsyncStorage.setItem('phishshield_onboarded', '1');
    navigation.replace('Root');
  }

  return (
    <View style={{ flex:1, backgroundColor: colors.background }}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(i, idx) => String(idx)}
        onMomentumScrollEnd={e => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }) => (
          <View style={{ width, padding: spacing.lg, justifyContent: 'center', alignItems: 'center', gap: 14 }}>
            <Text style={{ fontSize: font.h1, fontWeight: '800', color: colors.tint, textAlign: 'center' }}>{item.title}</Text>
            <Text style={{ fontSize: font.body, color: colors.text, textAlign: 'center' }}>{item.body}</Text>
          </View>
        )}
      />

      <View style={{ flexDirection:'row', justifyContent:'center', gap:6, marginBottom: spacing.md }}>
        {slides.map((_,i)=>(
          <View key={i} style={{
            width:8, height:8, borderRadius:4,
            backgroundColor: i===index ? colors.tint : colors.border
          }}/>
        ))}
      </View>

      <View style={{ padding: spacing.lg }}>
        <TouchableOpacity onPress={index===slides.length-1?done:()=>setIndex(index+1)} style={{
          backgroundColor: colors.tint, padding: spacing.md, borderRadius: radius.md, alignItems:'center'
        }}>
          <Text style={{ color:'#fff', fontWeight:'700' }}>{index===slides.length-1?'Kom i gang':'Neste'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
