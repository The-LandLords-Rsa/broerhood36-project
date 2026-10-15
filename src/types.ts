export type ProductCategory =
  | 'sneakers'
  | 'phones'
  | 'accessories'
  | 'football'
  | 'hubblies'
  | 'shisha-accessories'
  | 'vapes'
  | 'rentals';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  subcategory?: string;
  price: number; // in South African ZAR
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  image?: string;
  additionalImages?: string[];
  views?: {
    front: string;
    side: string;
    top: string;
    back: string;
  };
  inStock: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  description: string;
  specifications: Record<string, string>;
  sizes?: string[]; // e.g., UK 7, UK 8, UK 9 or S, M, L, XL
  colors?: string[];
  storageOptions?: string[]; // e.g. 128GB, 256GB, 512GB, 1TB
  jerseyType?: 'Home' | 'Away' | 'Third';
  season?: string;
  league?: string;
  isRental?: boolean;
  rentalDetails?: {
    dailyRate: number;
    deposit: number;
    durationOptions: string[];
    whatsIncluded: string[];
  };
}

export interface CartItem {
  id: string; // generated unique cart id
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedStorage?: string;
  isRental?: boolean;
  rentalDays?: number;
  rentalDate?: string;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  deliveryNotes?: string;
}

export type PaymentMethod = 'payfast' | 'ozow' | 'card' | 'cod' | 'eft';

export type OrderStatus =
  | 'placed'
  | 'pending'
  | 'payment_confirmed'
  | 'processing'
  | 'dispatched'
  | 'out_for_delivery'
  | 'delivered'
  | 'whatsapp_order';

export interface Order {
  id: string;
  date: string;
  customer: OrderCustomer;
  address: DeliveryAddress;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  courierName: string;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  location: string; // e.g., "Sandton, Johannesburg", "Camps Bay, Cape Town", "Umhlanga, Durban"
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  productReviewed: string;
}

export interface RentalBookingRequest {
  id: string;
  product: Product;
  customerName: string;
  email: string;
  phone: string;
  rentalDate: string;
  durationDays: number;
  quantity: number;
  eventType: string;
  eventLocation: string;
  deliveryNotes: string;
  dailyRate: number;
  deposit: number;
  totalAmount: number;
  status: 'Pending Review' | 'Confirmed' | 'Dispatched';
}

export interface PhoneComparisonSpec {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  display: string;
  processor: string;
  camera: string;
  battery: string;
  storage: string;
  os: string;
  materials: string;
}
