import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '@/components/header';
import { IconCircleXFilled, IconMinus, IconPlus } from '@tabler/icons-react-native';
import { useState } from 'react';
import InputText from '@/components/input-text';
import ButtonPrimary from '@/components/button-primary';
import ButtonSecondary from '@/components/button-secondary';
import Checkbox from '@/components/checkbox';
import ButtonOutline from '@/components/button-outline';
import colors from 'tailwindcss/colors';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Modal from '@/components/modal';
import StepItem from '@/components/step-item';
import clsx from 'clsx';
import images from '@/data/images';
import NoData from '@/components/no-data';
import { useTranslation } from 'react-i18next';
import useCartStore from '@/store/cart';
import { productsData } from '@/data/common';
import { Product } from '@/types/common';
import Container from '@/components/container';
import { useColorScheme } from 'nativewind';
import Label from '@/components/label';

export default function Cart() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'cart' | 'delivery' | 'payment'>('cart');
  const [promoCode, setPromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isRemoveAllModalVisible, setRemoveAllModalVisible] = useState<boolean>(false);
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express' | null>(null);
  const cartStore = useCartStore();
  const { colorScheme } = useColorScheme();
  const [cartItems, setCartItems] = useState(
    cartStore.items.map((item) => {
      const product = productsData.find((product: Product) => product.slug === item.id);

      return {
        ...item,
        selected: false,
        image: product?.image || images.notFound,
      };
    }),
  );

  const handleStepChange = (step: 'cart' | 'delivery' | 'payment') => {
    setCurrentStep(step);
  };

  const selectedItems = cartItems.filter((item) => item.selected).length;

  return (
    <Container>
      <Header name={t('my_cart')} className="justify-between" />

      <View className="flex-row justify-between my-6">
        <View className="m-4 h-[2px] bg-slate-200 dark:bg-slate-800 w-[90%] absolute" />

        <StepItem
          step={1}
          title={t('cart')}
          isActive={currentStep === 'cart'}
          onPress={() => handleStepChange('cart')}
        />

        <StepItem
          step={2}
          title={t('delivery')}
          isActive={currentStep === 'delivery'}
          onPress={() => handleStepChange('delivery')}
        />

        <StepItem
          step={3}
          title={t('payment')}
          isActive={currentStep === 'payment'}
          onPress={() => handleStepChange('payment')}
        />
      </View>

      {currentStep === 'cart' && (
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-6"
            showsVerticalScrollIndicator={false}>
            {cartItems.length > 0 && (
              <View className="flex-row items-center justify-between gap-2">
                <Checkbox
                  size={18}
                  label={t('select_all')}
                  checked={cartItems.length > 0 && cartItems.every((item) => item.selected)}
                  onChange={(checked) => {
                    if (cartItems.length === 0) {
                      return;
                    }

                    setCartItems((items) => items.map((item) => ({ ...item, selected: checked })));
                  }}
                />

                <TouchableOpacity onPress={() => setRemoveAllModalVisible(true)}>
                  <Text className="text-red-500 dark:text-red-500/80 font-medium">
                    {t('remove_all')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View className="gap-4">
              {cartItems.map((item) => (
                <View
                  key={item.id}
                  className="gap-4 p-4 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 rounded-xl">
                  <View className="flex-row items-center gap-4">
                    <BouncyCheckbox
                      isChecked={item.selected}
                      disableText
                      useBuiltInState={false}
                      fillColor="#514DDF"
                      unFillColor={
                        colorScheme === 'light'
                          ? colorScheme === 'light'
                            ? colors.white
                            : colors.slate[800]
                          : colors.slate[800]
                      }
                      onPress={() => {
                        setCartItems((items) =>
                          items.map((i) =>
                            i.id === item.id ? { ...i, selected: !i.selected } : i,
                          ),
                        );
                      }}
                      size={18}
                    />

                    <Image
                      source={item.image}
                      className="w-[50px] h-[50px] rounded-lg"
                      resizeMode="contain"
                    />

                    <View className="flex-1 gap-4">
                      <Text className="flex-1 text-base font-medium text-slate-800 dark:text-white">
                        {item.name}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="ml-8 text-primary dark:text-indigo-400 font-medium">
                      S${item.price.toFixed(2)}
                    </Text>

                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center gap-2">
                        <ButtonOutline
                          prefixIcon={
                            <IconMinus
                              size={16}
                              color={colorScheme === 'light' ? colors.slate[800] : colors.white}
                            />
                          }
                          square
                          onPress={() => {
                            if (item.quantity === 1) {
                              setItemToRemove(item.id);
                            } else {
                              setCartItems((items) =>
                                items.map((i) =>
                                  i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i,
                                ),
                              );

                              cartStore.updateItemQuantity(item.id, item.quantity - 1);
                            }
                          }}
                        />

                        <Text className="text-lg font-sans text-slate-800 dark:text-white">
                          {item.quantity}
                        </Text>

                        <ButtonOutline
                          prefixIcon={<IconPlus size={16} color={colors.white} />}
                          square
                          className="bg-primary border-primary"
                          onPress={() => {
                            setCartItems((items) =>
                              items.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
                              ),
                            );
                            cartStore.updateItemQuantity(item.id, item.quantity + 1);
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              <NoData
                message={t('cart_is_empty')}
                image={images.empty}
                when={cartItems.length === 0}
                action={
                  <ButtonPrimary
                    className="px-6"
                    text={t('browse_products')}
                    onPress={() => router.push('/marketplace')}
                  />
                }
              />
            </View>
          </ScrollView>

          <View className="pt-4 android:mb-2">
            <ButtonPrimary
              disabled={selectedItems === 0}
              text={t('checkout', { count: selectedItems })}
              onPress={() => handleStepChange('delivery')}
            />
          </View>
        </View>
      )}

      {currentStep === 'delivery' && (
        <View className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-6"
            showsVerticalScrollIndicator={false}>
            <View className="gap-4">
              <Header name={t('delivery_address_and_contact_info')} goBack={false} />

              <View className="p-4 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-800 rounded-xl gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="font-semibold text-lg text-slate-800 dark:text-white">
                    John Doe
                  </Text>

                  <TouchableOpacity onPress={() => router.push('/user/address')}>
                    <Text className="text-primary dark:text-indigo-400 font-medium">
                      {t('edit')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="gap-1">
                  <Text className="text-slate-600 dark:text-slate-400 font-sans">Singapore</Text>

                  <Text className="text-slate-600 dark:text-slate-400 font-sans">
                    johndoe@example.com
                  </Text>
                </View>
              </View>
            </View>

            <View className="gap-4">
              <Header name={t('choose_delivery_option')} goBack={false} />

              <View
                className={clsx(
                  'p-4 border rounded-xl bg-white dark:bg-slate-800',
                  deliveryOption === 'standard'
                    ? 'border-primary dark:border-indigo-400'
                    : 'border-slate-200 dark:border-slate-800',
                )}>
                <Checkbox
                  size={18}
                  label={t('standard_delivery')}
                  checked={deliveryOption === 'standard'}
                  onChange={(checked) => {
                    if (checked) {
                      setDeliveryOption('standard');
                    }
                  }}
                />
              </View>

              <View
                className={clsx(
                  'p-4 border rounded-xl bg-white dark:bg-slate-800',
                  deliveryOption === 'express'
                    ? 'border-primary dark:border-indigo-400'
                    : 'border-slate-200 dark:border-slate-800',
                )}>
                <Checkbox
                  size={18}
                  label={t('express_delivery')}
                  checked={deliveryOption === 'express'}
                  onChange={(checked) => {
                    if (checked) {
                      setDeliveryOption('express');
                    }
                  }}
                />
              </View>
            </View>

            <View className="mt-6 gap-3">
              <Header name={t('order_summary')} goBack={false} />

              <Label text={t('use_promo_code')} />

              <View className="flex-row items-center gap-3">
                <View className="w-2/3 flex-1">
                  <InputText
                    placeholder={t('enter_promo_code')}
                    value={promoCode}
                    onChangeText={setPromoCode}
                  />
                </View>

                <ButtonSecondary
                  className="w-1/3"
                  text={t('apply')}
                  onPress={() => {
                    if (promoCode.toUpperCase() === 'PROMO') {
                      setPromoApplied(true);
                    }
                  }}
                />
              </View>
            </View>

            <View className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 my-6">
              <View className="gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-slate-600 dark:text-slate-400 font-sans">
                    {t('subtotal')}
                  </Text>

                  <Text className="font-medium text-slate-800 dark:text-white">
                    S${getSubtotal(cartStore, deliveryOption).toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-600 dark:text-slate-400 font-sans">
                    {t('delivery_fee')}
                  </Text>

                  <Text className="font-medium text-slate-800 dark:text-white">
                    S${getDeliveryFee(deliveryOption).toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-slate-600 dark:text-slate-400 font-sans">{t('promo')}</Text>

                  <Text className="font-medium text-slate-800 dark:text-white">
                    -S${getPromoDiscount(promoApplied).toFixed(2)}
                  </Text>
                </View>

                <View className="h-[1px] bg-slate-200 dark:bg-slate-900 my-2" />

                <View className="flex-row justify-between">
                  <Text className="font-bold text-slate-800 dark:text-white">
                    {t('total_price')}
                  </Text>

                  <Text className="font-bold text-slate-800 dark:text-white">
                    S${getTotalPrice(cartStore, deliveryOption, promoApplied).toFixed(2)}
                  </Text>
                </View>

                <Text className="text-slate-500 dark:text-slate-300 text-sm">
                  {t('sst_included')}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View className="pt-4 android:mb-2">
            <ButtonPrimary
              text={t('proceed_to_payment')}
              disabled={!deliveryOption}
              onPress={() => handleStepChange('payment')}
            />
          </View>
        </View>
      )}

      {currentStep === 'payment' && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-slate-800 dark:text-white font-medium">
            {t('payment_screen')}
          </Text>
        </View>
      )}

      <Modal
        isVisible={isRemoveAllModalVisible}
        title={t('remove_all_items_from_cart')}
        primaryButtonText={t('remove_all')}
        icon={
          <IconCircleXFilled
            strokeWidth={0}
            size={64}
            stroke={colors.red[500]}
            fill={colors.red[500]}
          />
        }
        onClose={() => setRemoveAllModalVisible(false)}
        onPrimaryButtonPress={() => {
          setCartItems([]);
          cartStore.clearCart();
          setRemoveAllModalVisible(false);
        }}
      />

      <Modal
        isVisible={!!itemToRemove}
        title={t('remove_item_from_cart')}
        primaryButtonText={t('remove')}
        icon={
          <IconCircleXFilled
            strokeWidth={0}
            size={64}
            stroke={colors.red[500]}
            fill={colors.red[500]}
          />
        }
        onClose={() => setItemToRemove(null)}
        onPrimaryButtonPress={() => {
          if (itemToRemove) {
            setCartItems((items) => items.filter((item) => item.id !== itemToRemove));
            cartStore.removeItem(itemToRemove); // Add this line to remove from cart store
            setItemToRemove(null);
          }
        }}
      />
    </Container>
  );
}

const getDeliveryFee = (deliveryOption) => {
  switch (deliveryOption) {
    case 'standard':
      return 5;
    case 'express':
      return 12;
    default:
      return 0;
  }
};

const getSubtotal = (cartStore) => {
  return cartStore.getTotalPrice();
};

const getPromoDiscount = (promoApplied) => {
  return promoApplied ? 5 : 0;
};

const getTotalPrice = (cartStore, deliveryOption, promoApplied) => {
  return getSubtotal(cartStore) + getDeliveryFee(deliveryOption) - getPromoDiscount(promoApplied);
};
