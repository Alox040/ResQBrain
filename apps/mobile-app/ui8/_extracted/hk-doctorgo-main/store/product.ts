import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
  title: string;
  slug: string;
  image: any;
  price: string;
  date: string;
  type: string;
  by: string;
  inStock: boolean;
  freeDelivery: boolean;
};

type ProductStore = {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productSlug: string) => void;
  isFavorite: (productSlug: string | undefined) => boolean; // Updated parameter type
  clearFavorites: () => void;
  toggleFavorite: (product: Product | null | undefined) => void;
};

const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      addToFavorites: (product: Product) => {
        set((state) => ({
          favorites: [...state.favorites, product],
        }));
      },

      removeFromFavorites: (productSlug: string) => {
        set((state) => ({
          favorites: state.favorites.filter((product) => product.slug !== productSlug),
        }));
      },

      isFavorite: (productSlug: string | undefined) => {
        const state = get();

        if (!productSlug) return false;

        return state.favorites.some((product) => product?.slug === productSlug);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      toggleFavorite: (product: Product | null | undefined) => {
        if (!product) return;

        const state = get();
        const isFavorited = state.isFavorite(product.slug);

        if (isFavorited) {
          set((state) => ({
            favorites: state.favorites.filter((p) => p.slug !== product.slug),
          }));
        } else {
          set((state) => ({
            favorites: [...state.favorites, product],
          }));
        }
      },
    }),
    {
      name: 'product-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useProductStore;
