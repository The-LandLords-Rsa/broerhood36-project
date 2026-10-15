import { CustomerReview } from '../types';

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Kagiso M.',
    location: 'Sandton, Johannesburg',
    rating: 5,
    date: '2 days ago',
    comment: 'Broerhood36 is on another level. Ordered the Air Jordan 4 Military Black on Tuesday morning and it was delivered to my doorstep in Sandton by Wednesday afternoon via The Courier Guy. 100% legit authentic kicks with box in pristine condition.',
    verifiedPurchase: true,
    productReviewed: 'Air Jordan 4 Retro "Military Black"'
  },
  {
    id: 'rev-2',
    author: 'Liam van der Merwe',
    location: 'Camps Bay, Cape Town',
    rating: 5,
    date: '1 week ago',
    comment: 'Rented the Steamulation Pro X German Hubbly for our rooftop braai gathering. The service was insane—they brought everything: 1000W coal stove, CocoUrth coals, flavours, and clean hoses. Best smoke session we ever had in Cape Town!',
    verifiedPurchase: true,
    productReviewed: 'Steamulation Pro X III German Stainless Hubbly (Rental)'
  },
  {
    id: 'rev-3',
    author: 'Nandi Dlamini',
    location: 'Umhlanga, Durban',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Upgraded to the iPhone 16 Pro Max through Broerhood36. Saved R2,000 compared to mall stores, and the 65W GaN fast charger bundle charges the phone at light speed. Seamless PayFast checkout with zero hassle.',
    verifiedPurchase: true,
    productReviewed: 'iPhone 16 Pro Max (Titanium)'
  },
  {
    id: 'rev-4',
    author: 'Tshepo Sithole',
    location: 'Soweto, Gauteng',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Copped the Kaizer Chiefs 24/25 Heritage kit along with the Arsenal Home jersey for my brother. Stitching and embroidery are top tier matchday quality. Respect to the Broerhood36 team for bridging street fashion and football culture in Mzansi.',
    verifiedPurchase: true,
    productReviewed: 'Kaizer Chiefs 24/25 Heritage Gold Jersey'
  }
];

export const TRUST_FEATURES = [
  {
    title: 'Quality Products',
    description: '100% genuine verified streetwear kicks, authentic German stainless steel hubblies, and official brand smartphones with manufacturer warranty.',
    iconName: 'ShieldCheck'
  },
  {
    title: 'Competitive Prices',
    description: 'Direct relationships with importers allow us to give South African youth the sharpest prices in ZAR without ridiculous retail mall markups.',
    iconName: 'Tag'
  },
  {
    title: 'Convenient Ordering',
    description: 'Instant local checkout via PayFast, Ozow instant EFT, cards, or Cash on Delivery in major metro zones with real-time WhatsApp updates.',
    iconName: 'Smartphone'
  },
  {
    title: 'Reliable SA Delivery',
    description: 'Fast nationwide courier door-to-door delivery across Gauteng, Western Cape, KZN and all 9 South African provinces within 24-48 hours.',
    iconName: 'Truck'
  }
];
