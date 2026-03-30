import { productsData } from '@/data/common';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import CardMarketplace from './card-marketplace';
import { Product } from '@/types/common';

type MarketplaceBestsellersProps = {
  navigationReplace?: boolean;
};

export default function MarketplaceBestsellers({
  navigationReplace = true,
}: MarketplaceBestsellersProps) {
  const router = useRouter();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12 }}>
      {productsData.map((product: Product) => (
        <CardMarketplace
          product={product}
          key={product.slug}
          onPress={() =>
            navigationReplace
              ? router.replace({
                  pathname: '/marketplace/[slug]',
                  params: { slug: product.slug },
                })
              : router.push({
                  pathname: '/marketplace/[slug]',
                  params: { slug: product.slug },
                })
          }
        />
      ))}
    </ScrollView>
  );
}
