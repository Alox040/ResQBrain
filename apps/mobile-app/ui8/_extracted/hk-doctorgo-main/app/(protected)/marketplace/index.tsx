import { productsData } from '@/data/common';
import { IconCategory, IconHearts, IconSearch } from '@tabler/icons-react-native';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInUp } from 'react-native-reanimated';
import colors from 'tailwindcss/colors';
import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Container from '@/components/container';
import Header from '@/components/header';
import BottomSheet from '@/components/bottom-sheet';
import CardMarketplace from '@/components/card-marketplace';
import Tag from '@/components/tag';
import InputText from '@/components/input-text';
import NoData from '@/components/no-data';
import images from '@/data/images';
import useProductStore from '@/store/product';
import ButtonPrimary from '@/components/button-primary';
import { useColorScheme } from 'nativewind';
import Label from '@/components/label';

export default function Marketplace() {
  const { t } = useTranslation();
  const router = useRouter();
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [sortType, setSortType] = useState<'latest' | 'high-low' | 'low-high'>('latest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { type } = useLocalSearchParams<{ type: string }>();
  const [selectedType, setSelectedType] = useState<string>(type || 'all');
  const [availability, setAvailability] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');
  const [favorited, setFavorited] = useState<boolean>(false);
  const { colorScheme } = useColorScheme();

  const sortedData = useMemo(() => {
    let filtered = [...productsData];

    if (favorited) {
      filtered = filtered.filter((item) => useProductStore.getState().isFavorite(item.slug));
    }

    if (availability === 'in_stock') {
      filtered = filtered.filter((item) => item.inStock);
    } else if (availability === 'out_of_stock') {
      filtered = filtered.filter((item) => !item.inStock);
    }

    if (type && type !== 'all') {
      filtered = filtered.filter((item) => item.type === type);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(query));
    }

    switch (sortType) {
      case 'high-low':
        return filtered
          .sort((a, b) => Number(a.price.replace('$', '')) - Number(b.price.replace('$', '')))
          .reverse();
      case 'low-high':
        return filtered.sort(
          (a, b) => Number(a.price.replace('$', '')) - Number(b.price.replace('$', '')),
        );
      case 'latest':
        return filtered.sort((a, b) => {
          const dateA = new Date(a.date.split('-').reverse().join('-'));
          const dateB = new Date(b.date.split('-').reverse().join('-'));
          return dateB.getTime() - dateA.getTime();
        });
      default:
        return filtered;
    }
  }, [sortType, searchQuery, type, availability, favorited]);

  const handleSort = (type: 'latest' | 'high-low' | 'low-high') => {
    setSortType(type);
  };

  const sortOptions = [
    { id: 'latest', label: t('latest') },
    { id: 'high-low', label: t('price_high_low') },
    { id: 'low-high', label: t('price_low_high') },
  ];

  const typeOptions = [
    { id: 'all', label: t('all_products') },
    { id: 'otc', label: t('otc_medication') },
    { id: 'health-wellness', label: t('health_and_wellness') },
  ];

  return (
    <Container className="gap-4">
      <Header
        name={t('marketplace')}
        className="justify-between"
        postfixIcon={
          <View className="flex-row gap-4">
            <TouchableOpacity activeOpacity={0.8} onPress={() => setFavorited(!favorited)}>
              <IconHearts
                size={22}
                color={
                  favorited
                    ? '#514DDF'
                    : colorScheme === 'light'
                      ? colors.slate[800]
                      : colors.slate[200]
                }
              />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={() => setShowFilter(!showFilter)}>
              <IconCategory
                size={22}
                color={
                  sortType
                    ? '#514DDF'
                    : colorScheme === 'light'
                      ? colors.slate[800]
                      : colors.slate[200]
                }
              />
            </TouchableOpacity>
          </View>
        }
      />

      <InputText
        placeholder={t('search_product')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        prefixIcon={<IconSearch size={20} color={colors.slate[400]} />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-row flex-wrap justify-between pb-6"
        contentContainerStyle={{ gap: 12 }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => console.log('refreshing')} />
        }>
        {sortedData.map((product, index) => (
          <Animated.View
            entering={FadeInUp.duration(400).delay(index * 100)}
            key={index}
            className="w-[48%]">
            <CardMarketplace
              product={product}
              className="w-full"
              onPress={() =>
                router.push({
                  pathname: '/marketplace/[slug]',
                  params: { slug: product.slug },
                })
              }
            />
          </Animated.View>
        ))}

        <NoData
          message={t('products_not_available')}
          image={images.empty}
          when={sortedData.length === 0}
        />
      </ScrollView>

      <BottomSheet title={t('filter')} isVisible={showFilter} onClose={() => setShowFilter(false)}>
        <View className="gap-6">
          <View className="gap-2">
            <Label text={t('availability')} />

            <View className="flex-row flex-wrap gap-2">
              <Tag
                label={t('all_products')}
                isSelected={availability === 'all'}
                onPress={() => setAvailability('all')}
              />

              <Tag
                label={t('in_stock_only')}
                isSelected={availability === 'in_stock'}
                onPress={() => setAvailability('in_stock')}
              />

              <Tag
                label={t('out_of_stock')}
                isSelected={availability === 'out_of_stock'}
                onPress={() => setAvailability('out_of_stock')}
              />
            </View>
          </View>

          <View className="gap-2">
            <Label text={t('product_type')} />

            <View className="flex-row flex-wrap gap-2">
              {typeOptions.map((option) => (
                <Tag
                  key={option.id}
                  label={option.label}
                  isSelected={selectedType === option.id}
                  onPress={() => {
                    setSelectedType(option.id);
                    router.setParams({ type: option.id });
                  }}
                />
              ))}
            </View>
          </View>

          <View className="gap-2">
            <Label text={t('sort_by')} />

            <View className="flex-row flex-wrap gap-2">
              {sortOptions.map((option) => (
                <Tag
                  key={option.id}
                  label={option.label}
                  isSelected={sortType === option.id}
                  onPress={() => handleSort(option.id as 'latest' | 'high-low' | 'low-high')}
                />
              ))}
            </View>
          </View>
        </View>

        <ButtonPrimary
          text={t('reset')}
          className="mt-6"
          onPress={() => {
            setAvailability('all');
            setSelectedType('all');
            setSortType('latest');
            router.setParams({ type: 'all' });
          }}
        />
      </BottomSheet>
    </Container>
  );
}
