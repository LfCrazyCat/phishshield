import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useI18n } from '../i18n/i18n';

export default function LanguageSwitch({ compact = false }) {
  const { lang, setLang } = useI18n();

  const Btn = ({ code, label }) => {
    const active = lang === code;
    return (
      <TouchableOpacity
        onPress={() => setLang(code)}
        style={{
          paddingVertical: compact ? 4 : 6,
          paddingHorizontal: compact ? 8 : 10,
          borderRadius: 999,
          backgroundColor: active ? 'rgba(255,255,255,0.25)' : 'transparent',
        }}
        accessibilityRole="button"
        accessibilityLabel={`Bytt språk til ${label}`}
      >
        <Text style={{ color: '#fff', fontWeight: active ? '800' : '600' }}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
        padding: compact ? 2 : 3,
        borderRadius: 999,
        alignItems: 'center',
      }}
    >
      <Btn code="no" label="NO" />
      <Btn code="en" label="EN" />
    </View>
  );
}
