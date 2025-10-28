// App.js
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { navLight, navDark } from './constants/theme';
import { I18nProvider, useI18n } from './i18n/i18n';
import LanguageSwitch from './components/LanguageSwitch';

import HomeScreen from './screens/HomeScreen';
import ChecklistScreen from './screens/ChecklistScreen';
import QuizScreen from './screens/QuizScreen';
import LearnScreen from './screens/LearnScreen';
import OnboardingScreen from './screens/OnboardingScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function RootTabs() {
  const { t } = useI18n();

  return (
    <Tabs.Navigator
      screenOptions={({ route, navigation }) => {
        let iconName = 'home-outline';
        let activeColor = '#003399';
        let headerColor = '#003399';
        let headerIcon = 'home-outline';
        let title = t('tabs.home');

        if (route.name === 'Home') {
          iconName = 'home-outline'; activeColor = '#003399'; headerColor = '#003399'; headerIcon = 'shield-checkmark-outline'; title = t('tabs.home');
        } else if (route.name === 'Checklist') {
          iconName = 'checkmark-done-outline'; activeColor = '#009933'; headerColor = '#009933'; headerIcon = 'list-outline'; title = t('tabs.checklist');
        } else if (route.name === 'Quiz') {
          iconName = 'help-circle-outline'; activeColor = '#FF6600'; headerColor = '#FF6600'; headerIcon = 'help-buoy-outline'; title = t('tabs.quiz');
        } else if (route.name === 'Learn') {
          iconName = 'book-outline'; activeColor = '#6A00FF'; headerColor = '#6A00FF'; headerIcon = 'book-outline'; title = t('tabs.learn');
        }

        return {
          headerStyle: { backgroundColor: headerColor },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          headerTitleAlign: 'center',
          headerTitle: title,
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <Ionicons name={headerIcon} size={24} color="#fff" />
            </View>
          ),
          headerRight: () => (
            <View style={{ marginRight: 10 }}>
              <LanguageSwitch compact />
            </View>
          ),
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: '#7a7a7a',
          tabBarIcon: ({ color, size }) => <Ionicons name={iconName} size={size} color={color} />,
          tabBarLabel: title,
          tabBarStyle: Platform.select({ android: { paddingBottom: 4, height: 58 }, default: {} }),
        };
      }}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Checklist" component={ChecklistScreen} />
      <Tabs.Screen
        name="Quiz"
        component={QuizScreen}
        options={({ navigation }) => ({
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}
              accessibilityRole="button"
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600', marginLeft: 2 }}>{/* i18n */}Tilbake</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Tabs.Screen name="Learn" component={LearnScreen} options={{ headerTitleAlign: 'center' }} />
    </Tabs.Navigator>
  );
}

// Deep linking (valgfritt – behold hvis du bruker det)
const linking = {
  prefixes: ['phishshield://', 'https://phishshield.local'],
  config: {
    screens: {
      Root: {
        screens: { Quiz: 'quiz/:category', Home: 'home', Checklist: 'checklist', Learn: 'learn' },
      },
    },
  },
};

function AppRoot() {
  const [ready, setReady] = React.useState(false);
  const [firstRun, setFirstRun] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const onboarded = await AsyncStorage.getItem('phishshield_onboarded');
      setFirstRun(!onboarded);
      setReady(true);
    })();
  }, []);

  if (!ready) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={firstRun ? 'Onboarding' : 'Root'}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Root" component={RootTabs} />
    </Stack.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <I18nProvider defaultLang="no">
        <NavigationContainer linking={linking} theme={scheme === 'dark' ? navDark : navLight}>
          <AppRoot />
        </NavigationContainer>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
