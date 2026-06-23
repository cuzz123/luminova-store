/* ------------------------------------------------------------------ */
/*  Client-side analytics helper for Google Analytics 4 (GA4)         */
/*  Requires NEXT_PUBLIC_GA_ID to be set in environment.              */
/* ------------------------------------------------------------------ */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/* ------------------------------------------------------------------ */
/*  Type-safe gtag wrapper                                            */
/* ------------------------------------------------------------------ */

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      targetOrDate: string | Date,
      params?: Record<string, unknown>,
    ) => void;
  }
}

function gtag(
  command: "event" | "config" | "js",
  targetOrDate: string | Date,
  params?: Record<string, unknown>,
): void {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(command, targetOrDate, params);
  }
}

/* ------------------------------------------------------------------ */
/*  Event payload types                                               */
/* ------------------------------------------------------------------ */

interface ItemParams {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_category?: string;
  item_variant?: string;
}

interface PurchaseParams {
  transaction_id: string;
  value: number;
  currency: string;
  tax?: number;
  shipping?: number;
  items: ItemParams[];
  coupon?: string;
}

/* ------------------------------------------------------------------ */
/*  Tracked events                                                    */
/* ------------------------------------------------------------------ */

/** Fire when a page is viewed. Call from Next.js router events or useEffect. */
export function pageView(url: string, title?: string): void {
  if (!GA_ID) return;
  gtag("config", GA_ID, {
    page_path: url,
    page_title: title ?? document.title,
  });
}

/** Fire when a product detail page is viewed. */
export function viewItem(item: ItemParams): void {
  if (!GA_ID) return;
  gtag("event", "view_item", {
    currency: "USD",
    value: item.price,
    items: [item],
  });
}

/** Fire when a product is added to the cart. */
export function addToCart(item: ItemParams): void {
  if (!GA_ID) return;
  gtag("event", "add_to_cart", {
    currency: "USD",
    value: item.price && item.quantity
      ? item.price * item.quantity
      : item.price,
    items: [item],
  });
}

/** Fire when a product is removed from the cart. */
export function removeFromCart(item: ItemParams): void {
  if (!GA_ID) return;
  gtag("event", "remove_from_cart", {
    currency: "USD",
    value: item.price,
    items: [item],
  });
}

/** Fire when checkout begins (e.g. user clicks "Proceed to Checkout"). */
export function beginCheckout(items: ItemParams[], value?: number): void {
  if (!GA_ID) return;
  gtag("event", "begin_checkout", {
    currency: "USD",
    value: value ?? items.reduce(
      (sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1),
      0,
    ),
    items,
  });
}

/** Fire after a successful purchase. */
export function purchase(params: PurchaseParams): void {
  if (!GA_ID) return;
  gtag("event", "purchase", {
    currency: params.currency,
    value: params.value,
    transaction_id: params.transaction_id,
    tax: params.tax,
    shipping: params.shipping,
    items: params.items,
    coupon: params.coupon,
  });
}

/** Fire when a user signs up. */
export function signUp(method?: string): void {
  if (!GA_ID) return;
  gtag("event", "sign_up", { method: method ?? "email" });
}

/** Fire when a user logs in. */
export function login(method?: string): void {
  if (!GA_ID) return;
  gtag("event", "login", { method: method ?? "email" });
}

/** Fire when a search is performed. */
export function search(searchTerm: string): void {
  if (!GA_ID) return;
  gtag("event", "search", { search_term: searchTerm });
}

/** Fire when a wishlist item is added. */
export function addToWishlist(item: ItemParams): void {
  if (!GA_ID) return;
  gtag("event", "add_to_wishlist", {
    currency: "USD",
    value: item.price,
    items: [item],
  });
}
