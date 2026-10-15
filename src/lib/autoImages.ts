// src/lib/autoImages.ts - FINAL - Views per your spec
import type { Product, ProductCategory } from '../types';

export type Category = 'sneakers' | 'phones' | 'phone-accessories' | 'football-kits' | 'tablets';
export type ProductImageView = 'top' | 'side' | 'back' | 'front';
type GeneratedImageView = ProductImageView;

const getSlug = (name: string) =>
  name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

export function getUnsplashProductImage(name: string, category: Category, view: GeneratedImageView) {
  const lock = getSlug(name).length + view.length * 3;
  const base = category === 'sneakers'? 'sneaker' : category === 'phones'? 'iphone' : category === 'football-kits'? 'football,jersey' : category === 'phone-accessories'? 'phone,cover' : 'tablet';
  return `https://loremflickr.com/600/600/${base}?lock=${lock + (view === 'front'? 1 : view === 'back'? 2 : view === 'side'? 3 : 4)}`;
}

export function getProductImages(name: string, category: Category) {
  const slug = getSlug(name);

  // FOOTBALL-KITS = FRONT + BACK ONLY as you requested
  if (category === 'football-kits') {
    return {
      front: getUnsplashProductImage(name, category, 'front'),
      back: getUnsplashProductImage(name, category, 'back'),
      side: getUnsplashProductImage(name, category, 'front'), // no side, use front
      top: getUnsplashProductImage(name, category, 'front'),
      fallbackTop: getUnsplashProductImage(name, category, 'front'),
      fallbackSide: getUnsplashProductImage(name, category, 'front'),
      fallbackBack: getUnsplashProductImage(name, category, 'back'),
    } as any;
  }

  // PHONE-ACCESSORIES = FRONT + BACK ONLY
  if (category === 'phone-accessories') {
    return {
      front: getUnsplashProductImage(name, category, 'front'),
      back: getUnsplashProductImage(name, category, 'back'),
      side: getUnsplashProductImage(name, category, 'front'),
      top: getUnsplashProductImage(name, category, 'front'),
      fallbackTop: getUnsplashProductImage(name, category, 'front'),
      fallbackSide: getUnsplashProductImage(name, category, 'front'),
      fallbackBack: getUnsplashProductImage(name, category, 'back'),
    } as any;
  }

  // PHONES = FRONT + BACK + SIDE
  if (category === 'phones' || category === 'tablets') {
    return {
      front: getUnsplashProductImage(name, category, 'front'),
      back: getUnsplashProductImage(name, category, 'back'),
      side: getUnsplashProductImage(name, category, 'side'),
      top: getUnsplashProductImage(name, category, 'side'),
      fallbackTop: getUnsplashProductImage(name, category, 'front'),
      fallbackSide: getUnsplashProductImage(name, category, 'side'),
      fallbackBack: getUnsplashProductImage(name, category, 'back'),
    } as any;
  }

  // SNEAKERS = ALL ANGLES - top / side / back / front all different
  return {
    front: `https://images.stockx.com/images/${slug}-Product.jpg`,
    side: `https://images.stockx.com/images/${slug}-Product.jpg`,
    back: `https://images.stockx.com/images/${slug}-Product.jpg`,
    top: `https://images.stockx.com/images/${slug}-Product.jpg`,
    fallbackFront: getUnsplashProductImage(name, category, 'front'),
    fallbackTop: getUnsplashProductImage(name, category, 'top'),
    fallbackSide: getUnsplashProductImage(name, category, 'side'),
    fallbackBack: getUnsplashProductImage(name, category, 'back'),
  } as any;
}

export function getProductImageCategory(category: ProductCategory): Category | null {
  switch (category) {
    case 'sneakers':
    case 'phones':
      return category;
    case 'accessories':
      return 'phone-accessories';
    case 'football':
      return 'football-kits';
    case 'tablets' as any:
      return 'tablets';
    default:
      if ((category as string) === 'tablets') return 'tablets';
      if ((category as string) === 'football-kits') return 'football-kits';
      if ((category as string) === 'phone-accessories') return 'phone-accessories';
      if ((category as string) === 'accessories') return 'phone-accessories';
      return null;
  }
}

export function getProductImage(product: Product, view: ProductImageView = 'side'): string {
  const category = getProductImageCategory(product.category);
  if (category) {
    const imgs = getProductImages(product.name, category);
    // Now we support front properly
    return (imgs as any)[view] || (imgs as any)[`fallback${view.charAt(0).toUpperCase() + view.slice(1)}`] || (imgs as any).front || (imgs as any).fallbackSide;
  }
  return product.views?.[view] || product.image || '';
}

export function getProductImageFallback(name: string, productCategory: ProductCategory, view: ProductImageView): string | null {
  const category = getProductImageCategory(productCategory);
  return category? getUnsplashProductImage(name, category, view) : null;
}