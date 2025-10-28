// screens/PrivacyScreen.js
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '../constants/theme';

export default function PrivacyScreen() {
  const { colors, spacing, font } = useThemeColors();
  const P = (props) => (
    <Text style={{ fontSize: font.body, color: colors.text, marginBottom: spacing.sm }} {...props} />
  );

  return (
    <ScrollView style={{ flex:1, backgroundColor: colors.background, padding: spacing.lg }}>
      <Text style={{ fontSize: font.h1, fontWeight:'800', color: colors.tint, marginBottom: spacing.md }}>
        Personvern & sikkerhet
      </Text>

      <P><Text style={{ fontWeight:'700' }}>Ingen konto. Ingen database.</Text> Appen lagrer ikke data i skyen og krever ingen innlogging.</P>
      <P><Text style={{ fontWeight:'700' }}>Lokal lagring kun for funksjon.</Text> Beste quiz-score lagres lokalt (AsyncStorage) og deles ikke.</P>
      <P><Text style={{ fontWeight:'700' }}>Ingen nettverkskall.</Text> Eksterne ressurser åpnes kun når du trykker på dem.</P>
      <P><Text style={{ fontWeight:'700' }}>Ingen sporing.</Text> Ingen analytics/annonser.</P>
      <P><Text style={{ fontWeight:'700' }}>Tillatelser.</Text> Appen ber ikke om kamera/mikrofon/posisjon/kontakter.</P>
      <P><Text style={{ fontWeight:'700' }}>Sikkerhet.</Text> Personvernet er sterkt fordi ingenting sendes til oss.</P>
      <View style={{ borderBottomWidth:1, borderBottomColor: colors.border, marginVertical: spacing.md }} />
      <P style={{ color: colors.text }}>
        Tips: Hold enheten oppdatert, bruk skjermlås, og vær varsom med lenker – også fra kjente.
      </P>
    </ScrollView>
  );
}