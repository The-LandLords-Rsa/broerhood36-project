import type { Product, ProductCategory } from '../types';

export type Category = 'sneakers' | 'phones' | 'phone-accessories' | 'football-kits' | 'tablets';
export type ProductImageView = 'top' | 'side' | 'back' | 'front';
type GeneratedImageView = ProductImageView;
type UnsplashCategory = Exclude<Category, 'football-kits'>;

const footballJerseyAssets = import.meta.glob(
  '../../Assets/Football Jersey/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default', query: '?url' }
) as Record<string, string>;

const sneakerAssets = import.meta.glob(
  '../../Assets/Sneakers/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default', query: '?url' }
) as Record<string, string>;

const footballTeams = [
  { key: 'arsenal', aliases: ['arsenal'] },
  { key: 'manchestercity', aliases: ['manchestercity'] },
  { key: 'manchesterunited', aliases: ['manchesterunited'] },
  { key: 'liverpool', aliases: ['liverpool'] },
  { key: 'tottenhamhotspur', aliases: ['tottenhamhotspur'] },
  { key: 'astonvilla', aliases: ['astonvilla'] },
  { key: 'brightonhove', aliases: ['brightonhove', 'brighton'] },
  { key: 'chelsea', aliases: ['chelsea'] },
  { key: 'kaizerchiefs', aliases: ['kaizerchiefs', 'chiefs', 'amakhosi'] },
  { key: 'amazulu', aliases: ['amazulu'] },
  { key: 'barcelona', aliases: ['barcelona'] },
  { key: 'realmadrid', aliases: ['realmadrid'] },
  { key: 'atleticomadrid', aliases: ['atleticomadrid'] },
  { key: 'realsociedad', aliases: ['realsociedad'] },
  { key: 'psg', aliases: ['psg', 'parissaintgermain'] },
  { key: 'chicagofire', aliases: ['chicagofire'] },
  { key: 'alnassr', aliases: ['alnassr'] },
  { key: 'bayernmunich', aliases: ['bayernmunich'] },
  { key: 'borussiadortmund', aliases: ['borussiadortmund', 'dortmund'] },
  { key: 'rbleipzig', aliases: ['rbleipzig'] },
  { key: 'galatasaray', aliases: ['galatasaray'] },
  { key: 'roma', aliases: ['roma'] },
  { key: 'juventus', aliases: ['juventus'] },
  { key: 'napoli', aliases: ['napoli'] },
  { key: 'acmilan', aliases: ['acmilan'] },
  { key: 'intermilan', aliases: ['intermilan'] },
  { key: 'bafanabafana', aliases: ['bafanabafana'] },
  { key: 'argentina', aliases: ['argentina'] },
  { key: 'france', aliases: ['france'] },
  { key: 'spain', aliases: ['spain'] },
  { key: 'england', aliases: ['england'] },
  { key: 'portugal', aliases: ['portugal'] },
  { key: 'germany', aliases: ['germany', 'german'] },
  { key: 'mamelodisundowns', aliases: ['mamelodisundowns', 'sundowns'] },
  { key: 'intermiami', aliases: ['intermiami'] },
  { key: 'orlandopirates', aliases: ['orlandopirates'] },
  { key: 'stellenbosch', aliases: ['stellenbosch'] }
] as const;

const photoIds: Record<UnsplashCategory, Record<GeneratedImageView, string[]>> = {
  sneakers: {
    top: ['1549298916-b41d501d3772', '1608231387042-66d1773070a'],
    side: ['1606107557195-0e29a4b5b4aa', '1595950653106-6c9ebd614d3a'],
    back: ['1600185365483-26d7a4cc7519', '1605348532760-6753d2c43329'],
    front: ['1606107557195-0e29a4b5b4aa', '1600185365483-26d7a4cc7519']
  },
  phones: {
    top: ['1592899677977-9c10ca588bbd', '1592750475338-74b7b21085ab'],
    side: ['1511707171634-5f897ff02aa9', '1585060544812-6b45742d762f'],
    back: ['1592750475338-74b7b21085ab', '1585060544812-6b45742d762f'],
    front: ['1511707171634-5f897ff02aa9', '1592899677977-9c10ca588bbd']
  },
  'phone-accessories': {
    top: ['1585060544812-6b45742d762f', '1592899677977-9c10ca588bbd'],
    side: ['1592750475338-74b7b21085ab', '1511707171634-5f897ff02aa9'],
    back: ['1592899677977-9c10ca588bbd', '1585060544812-6b45742d762f'],
    front: ['1585060544812-6b45742d762f', '1592750475338-74b7b21085ab']
  },
  tablets: {
    top: ['1592899677977-9c10ca588bbd', '1592750475338-74b7b21085ab'],
    side: ['1511707171634-5f897ff02aa9', '1585060544812-6b45742d762f'],
    back: ['1592750475338-74b7b21085ab', '1585060544812-6b45742d762f'],
    front: ['1511707171634-5f897ff02aa9', '1592899677977-9c10ca588bbd']
  }
};

const getSlug = (name: string) =>
  name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '');

const getNameHash = (name: string) =>
  Array.from(name).reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 0);

const normalizeName = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const getSneakerAsset = (name: string) => {
  const normalizedName = normalizeName(name);
  const matchingAssets = Object.entries(sneakerAssets)
    .map(([assetPath, imageUrl]) => ({
      imageUrl,
      normalizedFileName: normalizeName(assetPath.split('/').pop()?.replace(/\.[^.]+$/, '') || '')
    }))
    .filter(({ normalizedFileName }) =>
      normalizedName.includes(normalizedFileName) || normalizedFileName.includes(normalizedName)
    )
    .sort((first, second) => second.normalizedFileName.length - first.normalizedFileName.length);

  return matchingAssets[0]?.imageUrl || '';
};

const normalizeSeason = (value: string) => {
  const years = value.match(/(?:20)?(\d{2})\D+(?:20)?(\d{2})/);
  return years ? `${years[1]}${years[2]}` : '';
};

const getFootballJerseyImage = (name: string, season?: string, jerseyType?: string) => {
  const normalizedName = normalizeName(name);
  const team = footballTeams.find(({ aliases }) =>
    aliases.some((alias) => normalizedName.includes(alias))
  );
  if (!team) return '';

  const variant = jerseyType?.toLowerCase().includes('away') || normalizedName.includes('away')
    ? 'away'
    : jerseyType?.toLowerCase().includes('third') || normalizedName.includes('third')
      ? 'third'
      : 'home';
  const matchingAssets = Object.entries(footballJerseyAssets)
    .filter(([assetPath]) => {
      const normalizedPath = normalizeName(assetPath);
      const matchesTeam = team.aliases.some((alias) => normalizedPath.includes(alias));
      return matchesTeam && normalizedPath.includes(variant);
    })
    .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath));
  const productSeason = normalizeSeason(season || name);
  const seasonMatch = productSeason
    ? matchingAssets.find(([assetPath]) => normalizeName(assetPath).includes(productSeason))
    : undefined;

  return seasonMatch?.[1] || matchingAssets[0]?.[1] || '';
};

const getStockXName = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('military black')) return 'Air-Jordan-4-Retro-Military-Black';
  if (normalized.includes('white oreo')) return 'Jordan-4-Retro-White-Oreo-2021';
  if (normalized.includes('red thunder')) return 'Jordan-4-Retro-Red-Thunder-2022';
  if (normalized.includes('black cat')) return 'Jordan-4-Retro-Black-Cat-2020';
  if (normalized.includes('nike dunk low') && normalized.includes('panda')) return 'Nike-Dunk-Low-Retro-White-Black-2021';
  if (normalized.includes('grey fog')) return 'Nike-Dunk-Low-Grey-Fog-2021';
  if (normalized.includes('michigan')) return 'Nike-Dunk-Low-Michigan-2021';
  if (normalized.includes('unc blue')) return 'Nike-Dunk-Low-UNC-2021';
  return getSlug(name);
};

export function getCategoryProductImage(
  name: string,
  category: Category,
  view: GeneratedImageView,
  fallback = false
) {
  if (category === 'football-kits') return getFootballJerseyImage(name);

  const candidates = photoIds[category][view];
  const primaryIndex = getNameHash(name) % candidates.length;
  const photoId = candidates[(primaryIndex + Number(fallback)) % candidates.length];
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=80`;
}

export function getProductImages(name: string, category: Category, season?: string) {
  if (category === 'sneakers') {
    const localImage = getSneakerAsset(name);
    if (localImage) {
      return { front: localImage, side: localImage, back: localImage, top: localImage };
    }

    const stockXName = getStockXName(name);

    return {
      front: `https://images.stockx.com/images/${stockXName}-Product.jpg`,
      side: `https://images.stockx.com/images/${stockXName}-Product-2.jpg`,
      back: `https://images.stockx.com/images/${stockXName}-Product-3.jpg`,
      top: `https://images.stockx.com/images/${stockXName}-Product.jpg`
    };
  }

  if (category === 'football-kits') {
    const image = getFootballJerseyImage(name, season);
    return { front: image, side: image, back: image, top: image };
  }

  return {
    front: getCategoryProductImage(name, category, 'front'),
    side: getCategoryProductImage(name, category, 'side'),
    back: getCategoryProductImage(name, category, 'back'),
    top: getCategoryProductImage(name, category, 'top')
  };
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
    default:
      return (category as string) === 'tablets' ? 'tablets' : null;
  }
}

export function getProductImage(product: Product, view: ProductImageView = 'side'): string {
  const category = getProductImageCategory(product.category);
  if (category === 'football-kits') {
    const image = getFootballJerseyImage(product.name, product.season, product.jerseyType);
    return image;
  }
  if (category) return getProductImages(product.name, category, product.season)[view];
  return product.views?.[view] || product.image || '';
}

export function getProductImageFallback(
  name: string,
  productCategory: ProductCategory,
  view: ProductImageView
): string | null {
  const category = getProductImageCategory(productCategory);
  if (!category) return null;
  if (category === 'football-kits') return null;
  if (category === 'sneakers') {
    const primary = getStockXName(name);
    const basic = getSlug(name);
    return primary === basic
      ? `https://images.stockx.com/images/${primary}-Product-2.jpg`
      : `https://images.stockx.com/images/${basic}-Product.jpg`;
  }
  return getCategoryProductImage(name, category, view, true);
}
