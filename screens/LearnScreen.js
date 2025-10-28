// screens/LearnScreen.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, Image } from 'react-native';
import { useThemeColors } from '../constants/theme';
import { useI18n } from '../i18n/i18n';

export default function LearnScreen() {
  const { colors, spacing, radius, font } = useThemeColors();
  const { t } = useI18n();

  const open = async (url) => {
    try {
      const ok = await Linking.canOpenURL(url);
      if (ok) await Linking.openURL(url);
      else Alert.alert('Kunne ikke åpne', url);
    } catch {
      Alert.alert('Kunne ikke åpne', url);
    }
  };

  // Hent oversettelser (med trygg fallback)
  const title = t('learn.title');

  const featuresTitle = t('learn.featuresTitle');
  const features = Array.isArray(t('learn.features')) ? t('learn.features') : [];

  const verifyTitle = t('learn.verifyTitle');
  const verify = Array.isArray(t('learn.verify')) ? t('learn.verify') : [];

  const habitsTitle = t('learn.habitsTitle');
  const habits = Array.isArray(t('learn.habits')) ? t('learn.habits') : [];

  const sourcesTitle = t('learn.sourcesTitle');
  const sources = t('learn.sources') || {}; // objekt med lenker

  const aboutTitle = t('learn.aboutTitle');
  const aboutText = t('learn.aboutText');

  const contactTitle = t('learn.contactTitle');
  const emailLabel = t('learn.emailLabel');

  const privacyTitle = t('learn.privacyTitle');
  const p = t('learn.privacy') || {}; // alle undertekster i et objekt
  const improve = Array.isArray(p.improve) ? p.improve : [];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: spacing.lg }}
    >
      {/* Logo */}
      <View style={{ alignItems: 'center', marginBottom: spacing.md }}>
        <Image
          source={require('../assets/icon.png')}
          style={{ width: 96, height: 96, borderRadius: radius.xl }}
        />
      </View>

      <Text style={{ fontSize: font.h1, fontWeight: '800', color: colors.tint, textAlign: 'center', marginBottom: spacing.sm }}>
        {title}
      </Text>

      <Section title={featuresTitle} colors={colors} font={font} spacing={spacing}>
        <BulletList items={features} colors={colors} font={font} spacing={spacing} />
      </Section>

      <Section title={verifyTitle} colors={colors} font={font} spacing={spacing}>
        <BulletList items={verify} colors={colors} font={font} spacing={spacing} />
      </Section>

      <Section title={habitsTitle} colors={colors} font={font} spacing={spacing}>
        <BulletList items={habits} colors={colors} font={font} spacing={spacing} />
      </Section>

      <Section title={sourcesTitle} colors={colors} font={font} spacing={spacing}>
        <LinkLine label={sources.nettvett} onPress={() => open('https://nettvett.no/')} colors={colors} spacing={spacing} />
        <LinkLine label={sources.politiet} onPress={() => open('https://www.politiet.no/rad/svindel/')} colors={colors} spacing={spacing} />
        <LinkLine label={sources.nsm} onPress={() => open('https://nsm.no/regelverk-og-hjelp/rad-og-anbefalinger/')} colors={colors} spacing={spacing} />
      </Section>

      <Divider colors={colors} spacing={spacing} />

      <Section title={aboutTitle} colors={colors} font={font} spacing={spacing}>
        <Text style={{ fontSize: font.body, color: colors.text, lineHeight: 22 }}>{aboutText}</Text>
      </Section>

      <Section title={contactTitle} colors={colors} font={font} spacing={spacing}>
        <TouchableOpacity onPress={() => open('mailto:fosdahllouise@gmail.com')}>
          <Text style={{ fontSize: font.body, color: colors.link, textDecorationLine: 'underline', marginTop: spacing.xs }}>
            {emailLabel}
          </Text>
        </TouchableOpacity>
      </Section>

      <Divider colors={colors} spacing={spacing} />

      <Text style={{ fontSize: font.h2, fontWeight: '800', color: colors.tint, marginBottom: spacing.sm }}>
        {privacyTitle}
      </Text>

      <SubBlock title={p.noAccountTitle} text={p.noAccountText} colors={colors} font={font} spacing={spacing} />
      <SubBlock title={p.localTitle} text={p.localText} colors={colors} font={font} spacing={spacing} />
      <SubBlock title={p.noNetworkTitle} text={p.noNetworkText} colors={colors} font={font} spacing={spacing} />
      <SubBlock title={p.noTrackingTitle} text={p.noTrackingText} colors={colors} font={font} spacing={spacing} />
      <SubBlock title={p.permissionsTitle} text={p.permissionsText} colors={colors} font={font} spacing={spacing} />
      <SubBlock title={p.howSafeTitle} text={p.howSafeText} colors={colors} font={font} spacing={spacing} />

      <Text style={{ fontWeight: '700', color: colors.heading, marginTop: spacing.sm, marginBottom: spacing.xs }}>
        {p.improveTitle}
      </Text>
      <BulletList items={improve} colors={colors} font={font} spacing={spacing} />
    </ScrollView>
  );
}

/* --- Små hjelpekomponenter --- */

function Section({ title, children, colors, font, spacing }) {
  if (!title) return null;
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={{ fontSize: font.h2, fontWeight: '700', color: colors.heading, marginBottom: spacing.xs }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function BulletList({ items, colors, font, spacing }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <View style={{ gap: spacing.xs }}>
      {list.map((line, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Text style={{ color: colors.tint, fontSize: 18, lineHeight: 22 }}>•</Text>
          <Text style={{ color: colors.text, fontSize: font.body, flex: 1 }}>{line}</Text>
        </View>
      ))}
    </View>
  );
}

function LinkLine({ label, onPress, colors, spacing }) {
  if (!label) return null;
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={{ color: colors.link, textDecorationLine: 'underline', marginTop: spacing.xs }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function Divider({ colors, spacing }) {
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border, marginVertical: spacing.lg }} />
  );
}

function SubBlock({ title, text, colors, font, spacing }) {
  if (!title && !text) return null;
  return (
    <View style={{ marginBottom: spacing.sm }}>
      {title ? <Text style={{ fontWeight: '700', color: colors.heading }}>{title}</Text> : null}
      {text ? <Text style={{ fontSize: font.body, color: colors.text }}>{text}</Text> : null}
    </View>
  );
}
