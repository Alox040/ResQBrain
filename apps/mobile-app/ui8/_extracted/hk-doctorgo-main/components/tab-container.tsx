import { ScrollView, Dimensions, View } from 'react-native';
import { ReactNode, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import TabItem from './tab-item';

const { width } = Dimensions.get('window');

export type TabContainerProps<T extends string> = {
  tabs: readonly T[];
  tabLabel: readonly string[];
  initialTab?: T;
  onTabChange?: (tab: T) => void;
  renderContent: (tab: T) => ReactNode;
  containerWidth?: number;
  className?: string;
};

export function TabContainer<T extends string>({
  tabs,
  tabLabel,
  initialTab,
  onTabChange,
  renderContent,
  containerWidth = width - 42,
  className,
}: TabContainerProps<T>) {
  const [activeTab, setActiveTab] = useState<T>(initialTab || tabs[0]);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / containerWidth);
    const newTab = tabs[index];

    if (newTab !== activeTab) {
      setActiveTab(newTab);
      onTabChange?.(newTab);
    }
  };

  const handleTabPress = (tab: T) => {
    const index = tabs.indexOf(tab);

    scrollViewRef.current?.scrollTo({
      x: index * containerWidth,
      animated: true,
    });
  };

  return (
    <View className={`flex-1 ${className}`}>
      <View className="flex-row border-b border-slate-100 dark:border-slate-600">
        {tabs.map((tab, i) => (
          <TabItem
            key={tab}
            label={tabLabel[i]}
            isActive={tab === activeTab}
            onPress={() => handleTabPress(tab)}
          />
        ))}
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1 mt-6">
        {tabs.map((tab) => (
          <ScrollView
            showsVerticalScrollIndicator={false}
            key={tab}
            style={{ width: containerWidth }}>
            {renderContent(tab)}
          </ScrollView>
        ))}
      </ScrollView>
    </View>
  );
}
