// screens/QuizScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import questionsNO from '../data/questions.no.json';
import questionsEN from '../data/questions.en.json';
import { useThemeColors } from '../constants/theme';
import { useI18n } from '../i18n/i18n';

// Enkel shuffle-funksjon
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizScreen({ route, navigation }) {
  const { colors, spacing, radius, font, scheme } = useThemeColors();
  const { t, lang } = useI18n();
  const category = route?.params?.category ?? 'blandet';

  // Velg spørsmålsbank etter språk
  const dict = lang === 'en' ? questionsEN : questionsNO;

  // Fallback per kategori – bruker norsk hvis engelsk kategori mangler
  const merged = useMemo(() => {
    const out = { ...dict };
    for (const key of Object.keys(questionsNO)) {
      if (!out[key] || !Array.isArray(out[key])) out[key] = questionsNO[key];
    }
    return out;
  }, [dict]);

  // Sett opp spørsmålslisten for valgt kategori
  const questions = useMemo(() => {
    if (category === 'blandet') {
      const all = Object.values(merged).flat();
      return shuffle(all);
    }
    const selected = merged[category] ?? [];
    return shuffle(selected);
  }, [merged, category]);

  // Filtrer bort introduksjonskort (id som starter med "intro_")
  const realQuestions = questions.filter(q => !q.id.startsWith('intro_'));
  const introCard = questions.find(q => q.id.startsWith('intro_'));
  const total = realQuestions.length;

  // State
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [best, setBest] = useState(null);

  const q = realQuestions[idx];
  const bestKey = `phishshield_best_${category}`;

  // Hent beste-score for valgt kategori
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(bestKey);
      setBest(raw ? JSON.parse(raw) : null);
    })();
  }, [bestKey]);

  // Håndter svar
  function answer(userThinksPhish) {
    if (answered || !q) return;
    if (userThinksPhish === q.isPhish) setScore(s => s + 1);
    setAnswered(true);
  }

  // Neste spørsmål
  function next() {
    if (idx + 1 < total) {
      setIdx(i => i + 1);
      setAnswered(false);
    } else {
      setShowResult(true);
    }
  }

  // Lagre ny beste-score
  useEffect(() => {
    if (!showResult) return;
    (async () => {
      const cur = { score, total };
      const raw = await AsyncStorage.getItem(bestKey);
      if (!raw) {
        await AsyncStorage.setItem(bestKey, JSON.stringify(cur));
        setBest(cur);
        return;
      }
      const prev = JSON.parse(raw);
      const prevPct = Math.round((prev.score / prev.total) * 100);
      const curPct = Math.round((score / total) * 100);
      if (curPct > prevPct) {
        await AsyncStorage.setItem(bestKey, JSON.stringify(cur));
        setBest(cur);
      }
    })();
  }, [showResult, score, total, bestKey]);

  // Del resultat
  async function shareResult() {
    const pct = Math.round((score / total) * 100);
    const msg = t('quiz.shareMsg', { category, score, total, pct });
    try {
      await Share.share({ message: msg });
    } catch {}
  }

  // Start på nytt
  function restart() {
    setIdx(0);
    setScore(0);
    setAnswered(false);
    setShowResult(false);
  }

  // Styles
  const s = {
    container: {
      flex: 1,
      padding: spacing.lg,
      gap: spacing.md,
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    progress: { color: colors.textMuted, marginBottom: spacing.xs },
    title: { fontSize: font.h1, fontWeight: '800', color: colors.tint, textAlign: 'center' },
    prompt: { fontSize: font.body, lineHeight: 26, color: colors.text },
    choice: { borderWidth: 2, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
    choiceText: { fontSize: font.body, fontWeight: '700' },
    feedback: {
      margin: spacing.md,
      padding: spacing.md,
      backgroundColor: colors.warning + '20',
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.warning + '60',
      gap: spacing.xs,
    },
    btnPrimary: {
      backgroundColor: colors.tint,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    btnGhost: {
      borderWidth: 2,
      borderColor: colors.tint,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      alignItems: 'center',
      marginTop: spacing.xs,
    },
    btnPrimaryText: { color: '#fff', fontWeight: '700' },
    btnGhostText: { color: colors.tint, fontWeight: '700' },
    score: { fontSize: 28, fontWeight: '900', marginVertical: spacing.sm, textAlign: 'center' },
    explainer: { color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
    bestText: { color: colors.text, textAlign: 'center' },
  };

  // Ingen spørsmål
  if (!q) {
    return (
      <View style={s.container}>
        <Text style={s.title}>—</Text>
        <TouchableOpacity style={s.btnPrimary} onPress={() => navigation.goBack()}>
          <Text style={s.btnPrimaryText}>{t('quiz.backHome')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Resultatskjerm
  if (showResult) {
    const pct = Math.round((score / total) * 100);
    const color = pct >= 80 ? colors.success : pct >= 50 ? colors.warning : '#cc0000';
    const bestText = best
      ? t('quiz.bestText', { score: best.score, total: best.total, pct: Math.round((best.score / best.total) * 100) })
      : t('quiz.bestNone');

    return (
      <View style={s.container}>
        <Text style={s.title}>{t('quiz.resultTitle')}</Text>
        <Text style={[s.score, { color }]}>{score} / {total} ({pct}%)</Text>
        <Text style={s.bestText}>{bestText}</Text>
        <Text style={s.explainer}>{t('quiz.explainer')}</Text>

        <TouchableOpacity style={s.btnPrimary} onPress={restart}>
          <Text style={s.btnPrimaryText}>{t('quiz.replay')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnGhost} onPress={shareResult}>
          <Text style={s.btnGhostText}>{t('quiz.share')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.btnGhost} onPress={() => navigation.navigate('Home')}>
          <Text style={s.btnGhostText}>{t('quiz.backHome')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Spørsmålsvisning + intro-kort
  return (
    <View style={s.container}>
      {/* 💡 Intro-kort vises øverst */}
      {introCard && (
        <View
          style={{
            backgroundColor: scheme === 'dark' ? '#1E293B' : '#F1F5F9',
            borderColor: scheme === 'dark' ? '#334155' : '#CBD5E1',
            borderWidth: 1,
            borderRadius: 14,
            padding: 16,
            marginBottom: 18,
          }}
        >
          <Text
            style={{
              fontSize: font.h2,
              fontWeight: '700',
              color: colors.tint,
              marginBottom: 6,
            }}
          >
            {scheme === 'dark' ? 'ℹ️' : '🧠'} {introCard.prompt}
          </Text>
          <Text
            style={{
              fontSize: font.body,
              color: colors.text,
              lineHeight: 22,
            }}
          >
            {introCard.why}
          </Text>
        </View>
      )}

      {/* Progresjon og spørsmål */}
      <Text style={s.progress}>{t('quiz.progress', { i: idx + 1, total })}</Text>
      <Text style={s.prompt}>{q.prompt}</Text>

      <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
        <TouchableOpacity
          style={[s.choice, { borderColor: colors.warning }]}
          onPress={() => answer(true)}
          disabled={answered}
        >
          <Text style={[s.choiceText, { color: colors.warning }]}>{t('quiz.choicePhish')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.choice, { borderColor: colors.success }]}
          onPress={() => answer(false)}
          disabled={answered}
        >
          <Text style={[s.choiceText, { color: colors.success }]}>{t('quiz.choiceSafe')}</Text>
        </TouchableOpacity>
      </View>

      {answered && (
        <View style={s.feedback}>
          <Text style={{ fontWeight: '700', marginBottom: 6 }}>
            {q.isPhish ? t('quiz.feedbackPhish') : t('quiz.feedbackSafe')}
          </Text>
          <Text style={{ color: colors.text }}>{q.why}</Text>
          <TouchableOpacity style={s.btnPrimary} onPress={next}>
            <Text style={s.btnPrimaryText}>
              {idx + 1 < total ? t('quiz.next') : t('quiz.seeResult')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
