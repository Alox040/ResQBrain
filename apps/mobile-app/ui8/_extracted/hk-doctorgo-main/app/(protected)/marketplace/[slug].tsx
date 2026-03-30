import ButtonOutline from '@/components/button-outline';
import ButtonPrimary from '@/components/button-primary';
import Container from '@/components/container';
import Header from '@/components/header';
import MarketplaceBestsellers from '@/components/marketplace-bestsellers';
import QuickFavorite from '@/components/quick-favorite';
import {
  IconBasket,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconMinus,
  IconPlus,
  IconTruckDelivery,
} from '@tabler/icons-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PanResponder } from 'react-native';
import colors from 'tailwindcss/colors';
import Rating from '@/components/rating';
import { IconCheck } from '@tabler/icons-react-native';
import InputText from '@/components/input-text';
import ButtonSecondary from '@/components/button-secondary';
import { useTranslation } from 'react-i18next';
import { productsData } from '@/data/common';
import ModalComingSoon from '@/components/modal-coming-soon';
import clsx from 'clsx';
import useCartStore from '@/store/cart';
import useProductStore from '@/store/product';
import { Product } from '@/types/common';
import { useColorScheme } from 'nativewind';

export default function MarketplaceItem() {
  const { t } = useTranslation();
  const router = useRouter();
  const [quantity, setQuantity] = useState<number>(1);
  const [myRating, setMyRating] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { slug } = useLocalSearchParams();
  const product = productsData.find((product: Product) => product.slug === slug);
  const [imagePreview, setImagePreview] = useState(product?.image);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const cartStore = useCartStore();
  const productStore = useProductStore();
  const { colorScheme } = useColorScheme();

  const handleSwipe = (gestureState: { dx: number }) => {
    if (Math.abs(gestureState.dx) > 50) {
      if (gestureState.dx > 0 && currentImageIndex > 0) {
        setCurrentImageIndex((prev) => prev - 1);
        setImagePreview(product?.images[currentImageIndex - 1]);
      } else if (gestureState.dx < 0 && currentImageIndex < product?.images.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
        setImagePreview(product?.images[currentImageIndex + 1]);
      }
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderRelease: (_, gestureState) => handleSwipe(gestureState),
  });

  return (
    <Container>
      <Header
        name={`${product?.title.substring(0, 20)}...`}
        className="justify-between"
        onPress={() => router.push('/cart')}
        postfixIcon={
          <View className="flex-row items-center gap-2">
            <QuickFavorite
              isFavorite={productStore.isFavorite(product?.slug)}
              onPress={() => productStore.toggleFavorite(product)}
            />

            <View className="relative">
              <IconBasket
                size={24}
                color={colorScheme === 'light' ? colors.slate[800] : colors.slate[200]}
              />

              <View className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary dark:bg-indigo-400 items-center justify-center">
                <Text className="text-[10px] text-white font-bold">
                  {cartStore.getTotalItems()}
                </Text>
              </View>
            </View>
          </View>
        }
      />

      <ScrollView
        className="flex-1 mb-6"
        contentContainerClassName="gap-4"
        showsVerticalScrollIndicator={false}>
        <View className="relative bg-white rounded-3xl mt-4" {...panResponder.panHandlers}>
          <Image source={imagePreview} className="w-full h-[300]" resizeMode="contain" />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row gap-3">
          {product?.images.map((image, i) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setImagePreview(product.images[i]);
                setCurrentImageIndex(i);
              }}
              key={i}
              className={clsx(
                'border overflow-hidden rounded-2xl',
                i === currentImageIndex
                  ? 'border-primary'
                  : 'border-slate-200 dark:border-slate-800',
              )}>
              <Image source={image} className="w-14 h-14 p-0.5 rounded-xl" resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="gap-4">
          <View className="gap-2">
            <Text
              className="text-2xl font-semibold leading-normal text-slate-800 dark:text-white"
              numberOfLines={2}>
              {product?.title}
            </Text>

            <View className="flex-row items-center gap-2">
              <Text className="text-slate-800 dark:text-slate-400">{t('by')}:</Text>

              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Text className="text-primary dark:text-indigo-400 font-sans">{product?.by}</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-2xl font-bold text-slate-800 dark:text-white">
              {product?.price}
            </Text>
          </View>

          {(product?.inStock || product?.freeDelivery) && (
            <View className="flex-row items-center gap-4">
              {product?.inStock ? (
                <View className="flex-row items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                  <IconCircleCheckFilled
                    width={24}
                    height={24}
                    strokeWidth={0}
                    fill={colors.green[600]}
                  />

                  <Text className="font-sans text-green-600 dark:text-green-400">
                    {t('in_stock')}
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-2 bg-slate-100 px-2 py-1 rounded-full">
                  <IconCircleXFilled
                    width={24}
                    height={24}
                    strokeWidth={0}
                    fill={colors.slate[600]}
                  />

                  <Text className="font-sans text-slate-600 dark:text-white">
                    {t('out_of_stock')}
                  </Text>
                </View>
              )}

              {product?.freeDelivery && (
                <View className="flex-row items-center gap-2">
                  <IconTruckDelivery
                    width={24}
                    height={24}
                    color={colorScheme === 'light' ? colors.slate[600] : colors.slate[200]}
                  />

                  <Text className="font-sans text-slate-600 dark:text-white">
                    {t('free_delivery')}
                  </Text>
                </View>
              )}
            </View>
          )}

          {product?.inStock && (
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-slate-800 dark:text-white">
                {t('quantity')}
              </Text>

              <View className="flex-row items-center gap-2">
                <ButtonOutline
                  prefixIcon={
                    <IconMinus
                      size={20}
                      color={colorScheme === 'light' ? colors.slate[800] : colors.white}
                    />
                  }
                  square
                  onPress={() => quantity > 1 && setQuantity((q) => q - 1)}
                />

                <Text className="text-lg font-sans text-slate-800 dark:text-white">{quantity}</Text>

                <ButtonOutline
                  prefixIcon={
                    <IconPlus
                      size={20}
                      color={colorScheme === 'light' ? colors.white : colors.white}
                    />
                  }
                  className="bg-primary border-primary"
                  square
                  onPress={() => setQuantity((q) => q + 1)}
                />
              </View>
            </View>
          )}

          <View>
            <Text className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
              {t('product_overview')}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              {product?.overview && t(product.overview)}
            </Text>
          </View>

          <View>
            <Text className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
              {t('product_description')}
            </Text>
            <Text className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
              {product?.description && t(product.description)}
            </Text>
          </View>

          <View>
            <Text className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
              {t('benefits')}
            </Text>

            <View className="gap-2">
              {product?.benefits.map((benefit, i) => (
                <Text className="font-sans text-slate-600 dark:text-slate-400" key={i}>
                  • {benefit}
                </Text>
              ))}
            </View>
          </View>

          <View className="gap-6 mt-6">
            <Text className="text-xl font-bold text-slate-800 dark:text-white">
              {t('ratings_and_reviews')}
            </Text>

            <View className="flex-row items-start gap-6">
              {product?.reviews?.average && (
                <View>
                  <Text className="text-4xl font-bold text-slate-800 dark:text-white">
                    {product?.reviews?.average}
                  </Text>
                  <Rating value={product?.reviews?.average} size="md" />

                  <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {product?.reviews?.total > 1000
                      ? `${(product.reviews.total / 1000).toFixed(1)}K`
                      : product?.reviews?.total}{' '}
                    {t('ratings')}
                  </Text>
                </View>
              )}

              <View className="flex-1 gap-1">
                {product?.reviews?.distribution.map((item) => (
                  <View key={item.stars} className="flex-row items-center gap-2">
                    <Text className="w-3 text-sm text-slate-600 dark:text-slate-400">
                      {item.stars}
                    </Text>

                    <View className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-amber-400"
                        style={{ width: `${(item.count / product?.reviews?.total) * 100}%` }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {product?.reviews && product?.reviews?.highlights?.length > 0 && (
              <View>
                <Text className="text-base font-medium mb-3 text-slate-800 dark:text-white">
                  {t('highly_rated_for')}...
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {product?.reviews?.highlights.map((item) => (
                    <View
                      key={item}
                      className="flex-row items-center gap-1 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                      <IconCheck
                        size={16}
                        color={colorScheme === 'light' ? colors.slate[600] : colors.white}
                      />
                      <Text className="text-sm text-slate-600 dark:text-white font-sans">
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {product?.reviews?.comments?.length ? (
              <View>
                <Text className="text-base font-medium mb-3 text-slate-800 dark:text-white">
                  {t('what_buyers_are_saying')}
                </Text>

                {product?.reviews?.comments?.map((review, index) => (
                  <View
                    key={index}
                    className="mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <Rating value={review.rating} />

                    <View className="flex-row items-center gap-2 mt-2">
                      <Text className="text-base font-medium text-slate-800 dark:text-white">
                        {review.name}
                      </Text>

                      {review.verified && (
                        <IconCircleCheckFilled
                          size={16}
                          strokeWidth={0}
                          fill={'#514DDF'}
                          stroke={colors.white}
                        />
                      )}
                    </View>

                    <Text className="text-sm text-slate-500 dark:text-slate-400 font-sans mb-1">
                      {review.date}
                    </Text>

                    <Text className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                      {review.comment}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View>
                <Text className="font-sans text-slate-500 dark:text-slate-400">
                  {t('no_reviews_available')}
                </Text>
              </View>
            )}

            <View className="gap-4">
              <Header name={t('write_a_review')} className="justify-between" goBack={false} />

              <InputText
                className="rounded-xl h-[80px]"
                placeholder={`${t('summarize_review')}...`}
                multiline
              />

              <View className="flex-row justify-between items-center">
                <Rating
                  value={myRating}
                  readonly={false}
                  size="lg"
                  className="justify-center"
                  onChange={(newRating) => {
                    console.log('New rating:', newRating);
                    setMyRating(newRating);
                  }}
                />

                <ButtonSecondary text={t('review')} onPress={() => console.log('Review')} />
              </View>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-xl font-bold mb-4 text-slate-800 dark:text-white">
              {t('you_may_also_like')}
            </Text>

            <MarketplaceBestsellers />
          </View>
        </View>
      </ScrollView>

      {product?.inStock ? (
        <ButtonPrimary
          text={t('add_to_cart')}
          className="android:mb-2"
          onPress={() => {
            if (product) {
              cartStore.addItem({
                id: product.slug,
                name: product.title,
                price: parseFloat(product.price.replace('$', '')),
                quantity: quantity,
              });
              router.push('/cart');
            }
          }}
        />
      ) : (
        <ButtonPrimary
          disabled
          text={t('add_to_cart')}
          className="android:mb-2"
          onPress={() => router.push('/cart')}
        />
      )}

      <ModalComingSoon isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </Container>
  );
}
