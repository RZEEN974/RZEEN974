export interface MenuItem {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  priceSlice?: number;
  priceWhole?: number;
  priceStandard?: number; // For sides, drinks, desserts
  image: string;
  category: 'pizza' | 'sides' | 'drinks' | 'desserts';
  tags?: string[];
  options?: {
    en: string;
    ar: string;
    price: number;
    default?: boolean;
  }[];
}

export interface CartItem {
  id: string; // unique ID incorporating menu item ID + size + options hash
  menuItemId: string;
  name: {
    en: string;
    ar: string;
  };
  image: string;
  size: 'slice' | 'whole' | 'standard';
  price: number;
  quantity: number;
  selectedOptions: {
    en: string;
    ar: string;
    price: number;
  }[];
  notes?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: {
    en: string;
    ar: string;
  };
  text: {
    en: string;
    ar: string;
  };
  avatar: string;
  googleReview?: boolean;
}

export type OrderType = 'dine-in' | 'pickup' | 'delivery';

export interface CheckoutDetails {
  customerName: string;
  phone: string;
  orderType: OrderType;
  tableNumber?: string;
  carPlateNumber?: string; // for drive-through/curbside
  deliveryAddress?: string;
  paymentMethod: 'cash_card_on_delivery' | 'online_talabat';
  notes?: string;
}
