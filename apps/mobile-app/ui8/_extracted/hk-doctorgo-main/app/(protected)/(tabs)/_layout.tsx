import TabBarIcon from '@/components/tab-bar-icon';
import {
  IconBellRinging2,
  IconBellRinging2Filled,
  IconCompass,
  IconCompassFilled,
  IconHome,
  IconHomeFilled,
  IconLayout2,
  IconLayout2Filled,
} from '@tabler/icons-react-native';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';

export default function TabLayout() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorScheme === 'light' ? '#514DDF' : colors.white,
        tabBarInactiveTintColor: colorScheme === 'light' ? colors.slate[600] : colors.slate[400],
        tabBarLabelStyle: {
          fontFamily: 'rubik-medium',
          fontSize: 12,
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: colorScheme === 'light' ? colors.white : colors.slate[900],
          borderColor: colorScheme === 'light' ? colors.slate[200] : colors.slate[800],
          height: 80,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <TabBarIcon
                color={color}
                icon={<IconHomeFilled size={24} strokeWidth={0} fill={color} />}
              />
            ) : (
              <IconHome strokeWidth={1.75} size={24} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: t('discover'),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <TabBarIcon
                color={color}
                icon={<IconCompassFilled size={24} strokeWidth={0} fill={color} />}
              />
            ) : (
              <IconCompass strokeWidth={1.75} size={24} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="activity"
        options={{
          title: t('activity'),
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <TabBarIcon
                color={color}
                icon={<IconBellRinging2Filled size={24} strokeWidth={0} fill={color} />}
              />
            ) : (
              <IconBellRinging2 strokeWidth={1.75} size={24} color={color} />
            ),
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: t('more'),
          tabBarBadge: 2,
          tabBarBadgeStyle: {
            backgroundColor: colorScheme === 'light' ? '#514DDF' : colors.indigo[400],
            color: colors.white,
            fontFamily: 'rubik-bold',
            fontSize: 12,
          },
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <TabBarIcon
                color={color}
                icon={<IconLayout2Filled size={24} strokeWidth={0} fill={color} />}
              />
            ) : (
              <IconLayout2 strokeWidth={1.75} size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
