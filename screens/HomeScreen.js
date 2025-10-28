// screens/HomeScreen.js
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColors } from '../constants/theme';
import { useI18n } from '../i18n/i18n';

export default function HomeScreen({ navigation }) {
  const { colors, spacing, radius, font } = useThemeColors();
  const { t } = useI18n();

  const CATEGORIES = useMemo(() => ([
    { key: 'blandet',    label: t('home.categories.blandet') },
    { key: 'avsender',   label: t('home.categories.avsender') },
    { key: 'lenker',     label: t('home.categories.lenker') },
    { key: 'okonomi',    label: t('home.categories.okonomi') },
    { key: 'kjarlighet', label: t('home.categories.kjarlighet') },
    { key: 'passord2fa', label: t('home.categories.passord2fa') },
  ]), [t]);

  const [selected, setSelected] = useState('blandet');
  const [best, setBest] = useState(null);

  const selectedLabel = useMemo(
    () => CATEGORIES.find(c => c.key === selected)?.label ?? '',
    [CATEGORIES, selected]
  );

  async function loadBest(key) {
    const raw = await AsyncStorage.getItem(`phishshield_best_${key}`);
    setBest(raw ? JSON.parse(raw) : null);
  }
  useEffect(() => { loadBest(selected); }, [selected]);

  function startQuiz() {
    navigation.navigate('Quiz', { category: selected });
  }

  const s = {
    screen: { flex: 1, padding: spacing.lg, gap: spacing.md, justifyContent: 'center', backgroundColor: colors.background },
    title:  { fontSize: font.h1, fontWeight: '800', color: colors.tint, textAlign: 'center' },
    sub:    { fontSize: font.body, color: colors.textMuted, textAlign: 'center' },
    catBtn: { borderWidth: 2, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center', borderColor: colors.border, backgroundColor: colors.card },
    catBtnSelected: { backgroundColor: colors.tint, borderColor: colors.tint },
    catText: { fontWeight: '700', color: colors.text, fontSize: font.body },
    catTextSelected: { color: '#fff' },
    best: { textAlign: 'center', color: colors.textMuted, marginVertical: spacing.xs, fontSize: font.sub },
    btnPrimary: { backgroundColor: colors.tint, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.xs },
    btnGhost:   { borderWidth: 2, borderColor: colors.tint, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.sm },
    btnTextPrimary: { color: '#fff', fontWeight: '700', fontSize: font.body },
    btnTextGhost:   { color: colors.tint, fontWeight: '700', fontSize: font.body },
    hint: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.sm },
  };

  return (
    <View style={s.screen}>
      <Text style={s.title}>{t('home.title')}</Text>
      <Text style={s.sub}>{t('home.subtitle')}</Text>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(i) => i.key}
        contentContainerStyle={{ gap: spacing.sm, marginVertical: spacing.sm }}
        renderItem={({ item }) => {
          const selectedNow = selected === item.key;
          return (
            <TouchableOpacity
              style={[s.catBtn, selectedNow && s.catBtnSelected]}
              onPress={() => setSelected(item.key)}
            >
              <Text style={[s.catText, selectedNow && s.catTextSelected]}>{item.label}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {best && (
        <Text style={s.best}>
          {t('home.best', {
            label: selectedLabel,
            score: best.score,
            total: best.total,
            pct: Math.round((best.score / best.total) * 100),
          })}
        </Text>
      )}

      <TouchableOpacity style={s.btnPrimary} onPress={startQuiz}>
        <Text style={s.btnTextPrimary}>{t('home.startQuiz')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={s.btnGhost} onPress={() => navigation.navigate('Checklist')}>
        <Text style={s.btnTextGhost}>{t('home.checklist')}</Text>
      </TouchableOpacity>

      <Text style={s.hint}>{t('home.tip')}</Text>
    </View>
  );
}
