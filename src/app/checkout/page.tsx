"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, FREE_SHIPPING_THRESHOLD } from "@/lib/cart";
import { cn, formatPrice } from "@/lib/utils";
import {
  ArrowRight,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  X,
  Loader2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormData {
  email: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Japan",
  "New Zealand",
];

const INITIAL_FORM: FormData = {
  email: "",
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
};

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

function validateField(
  name: keyof FormData,
  value: string,
): string | undefined {
  switch (name) {
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Please enter a valid email";
      return undefined;
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return undefined;
    case "phone":
      if (!value.trim()) return "Phone number is required";
      if (!/^[\d\s\-()+.]{7,}$/.test(value))
        return "Please enter a valid phone number";
      return undefined;
    case "street":
      if (!value.trim()) return "Street address is required";
      return undefined;
    case "city":
      if (!value.trim()) return "City is required";
      return undefined;
    case "state":
      if (!value.trim()) return "State is required";
      return undefined;
    case "zip":
      if (!value.trim()) return "ZIP code is required";
      return undefined;
    case "country":
      if (!value.trim()) return "Country is required";
      return undefined;
    default:
      return undefined;
  }
}

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  for (const key of Object.keys(data) as (keyof FormData)[]) {
    const error = validateField(key, data[key]);
    if (error) errors[key] = error;
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, removeItem, updateQuantity, clearCart } =
    useCartStore();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [discountCode, setDiscountCode] = useState("");
  const [discount, setDiscount] = useState<{
    code: string;
    amount: number;
    type: "percentage" | "fixed";
  } | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "paypal" | "card-manual" | null
  >(null);

  /* -- Blur handler ------------------------------------------------ */
  const handleBlur = useCallback(
    (name: keyof FormData) => {
      setTouched((prev) => new Set(prev).add(name));
      const error = validateField(name, form[name]);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) next[name] = error;
        else delete next[name];
        return next;
      });
    },
    [form],
  );

  /* -- Change handler ---------------------------------------------- */
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (touched.has(name)) {
        const error = validateField(name as keyof FormData, value);
        setErrors((prev) => {
          const next = { ...prev };
          if (error) next[name as keyof FormData] = error;
          else delete next[name as keyof FormData];
          return next;
        });
      }
    },
    [touched],
  );

  /* -- Shipping calculation ---------------------------------------- */
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 14.95;
  const discountAmount = discount
    ? discount.type === "percentage"
      ? Math.round(subtotal * (discount.amount / 100) * 100) / 100
      : discount.amount
    : 0;
  const total = Math.max(0, subtotal - discountAmount + shipping);

  /* -- Apply discount ---------------------------------------------- */
  const handleApplyDiscount = useCallback(async () => {
    if (!discountCode.trim()) return;
    setApplyingDiscount(true);
    setDiscountError("");
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setDiscountError(data.message || "Invalid discount code");
        setDiscount(null);
      } else {
        setDiscount({
          code: data.code,
          amount: data.amount,
          type: data.type,
        });
      }
    } catch {
      setDiscountError("Failed to validate discount code");
    } finally {
      setApplyingDiscount(false);
    }
  }, [discountCode]);

  const handleRemoveDiscount = useCallback(() => {
    setDiscount(null);
    setDiscountCode("");
    setDiscountError("");
  }, []);

  /* -- Submit: PayPal flow ----------------------------------------- */
  const handlePayPalCheckout = useCallback(async () => {
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTouched(
        new Set(Object.keys(form) as (keyof FormData)[]),
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shipping: form,
          items: items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
          })),
          discountCode: discount?.code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Checkout failed. Please try again.");
        return;
      }
      // Redirect to PayPal or success page
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else if (data.orderId) {
        router.push(`/checkout/success?orderId=${data.orderId}`);
      }
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [form, items, discount, router]);

  /* -- Empty cart guard -------------------------------------------- */
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div
          className="text-center max-w-md animate-fade-in"
          style={{ color: "var(--dark)" }}
        >
          <ShoppingBagIcon className="w-16 h-16 mx-auto mb-6 opacity-30" />
          <h1
            className="text-2xl font-medium mb-3"
            style={{ color: "var(--heading)" }}
          >
            Your cart is empty
          </h1>
          <p className="mb-8" style={{ color: "var(--body)" }}>
            Add some handcrafted lighting to your cart to get started.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-md transition-colors"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Browse Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  /* -- Main render ------------------------------------------------- */
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
        {/* Back link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-sm mb-8 hover:underline"
          style={{ color: "var(--body)" }}
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to cart
        </Link>

        <h1
          className="text-3xl lg:text-4xl font-medium mb-10"
          style={{ color: "var(--heading)" }}
        >
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Form */}
          <div className="lg:col-span-3 space-y-10">
            {/* Contact Info */}
            <section>
              <h2
                className="text-lg font-medium mb-4"
                style={{ color: "var(--heading)" }}
              >
                Contact Information
              </h2>
              <div className="space-y-4">
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  error={errors.email}
                  touched={touched.has("email")}
                  placeholder="you@example.com"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    error={errors.name}
                    touched={touched.has("name")}
                    placeholder="Jane Doe"
                  />
                  <FormField
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={() => handleBlur("phone")}
                    error={errors.phone}
                    touched={touched.has("phone")}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2
                className="text-lg font-medium mb-4"
                style={{ color: "var(--heading)" }}
              >
                Shipping Address
              </h2>
              <div className="space-y-4">
                <FormField
                  label="Street Address"
                  name="street"
                  type="text"
                  value={form.street}
                  onChange={handleChange}
                  onBlur={() => handleBlur("street")}
                  error={errors.street}
                  touched={touched.has("street")}
                  placeholder="123 Main Street, Apt 4"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField
                    label="City"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    onBlur={() => handleBlur("city")}
                    error={errors.city}
                    touched={touched.has("city")}
                    placeholder="Sonoma"
                  />
                  <FormField
                    label="State"
                    name="state"
                    type="text"
                    value={form.state}
                    onChange={handleChange}
                    onBlur={() => handleBlur("state")}
                    error={errors.state}
                    touched={touched.has("state")}
                    placeholder="CA"
                  />
                  <FormField
                    label="ZIP Code"
                    name="zip"
                    type="text"
                    value={form.zip}
                    onChange={handleChange}
                    onBlur={() => handleBlur("zip")}
                    error={errors.zip}
                    touched={touched.has("zip")}
                    placeholder="95476"
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "var(--heading)" }}
                  >
                    Country
                  </label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    onBlur={() => handleBlur("country")}
                    className={cn(
                      "w-full px-4 py-3 rounded-md border bg-white text-sm transition-colors appearance-none",
                      errors.country && touched.has("country")
                        ? "border-red-500"
                        : "border-[#ebebeb] focus:border-[#303e39]",
                    )}
                    style={{ color: "var(--heading)" }}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.country && touched.has("country") && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Crafted to Order banner */}
            <div
              className="rounded-lg p-5 flex items-start gap-3"
              style={{ backgroundColor: "var(--sand)" }}
            >
              <RotateCcw
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                style={{ color: "var(--dark)" }}
              />
              <div>
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: "var(--heading)" }}
                >
                  Crafted to Order
                </p>
                <p className="text-sm" style={{ color: "var(--body)" }}>
                  Each Flint & Beam piece is hand-finished in our Sonoma
                  workshop. Please allow 5-7 business days for crafting before
                  shipment.
                </p>
              </div>
            </div>

            {/* Payment Section */}
            <section>
              <h2
                className="text-lg font-medium mb-4"
                style={{ color: "var(--heading)" }}
              >
                Payment
              </h2>

              <div className="space-y-4">
                {/* PayPal button */}
                <button
                  onClick={() => {
                    setPaymentMethod("paypal");
                    handlePayPalCheckout();
                  }}
                  disabled={submitting}
                  className={cn(
                    "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-md text-white font-medium transition-colors",
                    submitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:opacity-90",
                  )}
                  style={{ backgroundColor: "#0070ba" }}
                >
                  {submitting && paymentMethod === "paypal" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <PayPalLogo />
                  )}
                  Pay with PayPal
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--border)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--body)" }}>
                    OR
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: "var(--border)" }}
                  />
                </div>

                {/* Card manual fallback */}
                <button
                  onClick={() => {
                    setPaymentMethod("card-manual");
                    handlePayPalCheckout();
                  }}
                  disabled={submitting}
                  className={cn(
                    "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-md font-medium transition-colors border",
                    submitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-gray-50",
                  )}
                  style={{
                    color: "var(--heading)",
                    borderColor: "var(--border)",
                  }}
                >
                  {submitting && paymentMethod === "card-manual" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : null}
                  Pay with Card
                </button>
              </div>

              {/* Trust signals */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Shield
                    className="w-5 h-5"
                    style={{ color: "var(--dark)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--body)" }}>
                    SSL Encrypted
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw
                    className="w-5 h-5"
                    style={{ color: "var(--dark)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--body)" }}>
                    30-Day Returns
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Truck
                    className="w-5 h-5"
                    style={{ color: "var(--dark)" }}
                  />
                  <span className="text-xs" style={{ color: "var(--body)" }}>
                    Free Shipping Over $149
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div
              className="sticky top-24 rounded-xl border p-6 space-y-6"
              style={{ borderColor: "var(--border)" }}
            >
              <h2
                className="text-lg font-medium"
                style={{ color: "var(--heading)" }}
              >
                Order Summary ({itemCount} {itemCount === 1 ? "item" : "items"})
              </h2>

              {/* Cart items */}
              <div className="space-y-4 max-h-[380px] overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-4 border-b"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBagIcon className="w-6 h-6 opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--heading)" }}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs" style={{ color: "var(--body)" }}>
                        Qty: {item.quantity}
                      </p>
                      <p
                        className="text-sm font-medium mt-0.5"
                        style={{ color: "var(--heading)" }}
                      >
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount code */}
              <div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Discount code"
                    disabled={!!discount}
                    className={cn(
                      "flex-1 px-3 py-2.5 rounded-md border text-sm",
                      discount
                        ? "bg-gray-50 text-gray-400"
                        : "",
                    )}
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--heading)",
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleApplyDiscount();
                    }}
                  />
                  {discount ? (
                    <button
                      onClick={handleRemoveDiscount}
                      className="px-3 py-2.5 rounded-md text-sm transition-colors flex items-center gap-1"
                      style={{
                        color: "var(--accent)",
                        border: "1px solid var(--accent)",
                      }}
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyDiscount}
                      disabled={applyingDiscount || !discountCode.trim()}
                      className={cn(
                        "px-4 py-2.5 rounded-md text-sm font-medium transition-colors text-white",
                        applyingDiscount || !discountCode.trim()
                          ? "opacity-50 cursor-not-allowed"
                          : "",
                      )}
                      style={{ backgroundColor: "var(--dark)" }}
                    >
                      {applyingDiscount ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  )}
                </div>
                {discountError && (
                  <p className="text-red-500 text-xs mt-1.5">{discountError}</p>
                )}
                {discount && (
                  <div
                    className="mt-2 text-sm flex items-center justify-between"
                    style={{ color: "#16a34a" }}
                  >
                    <span>Discount applied: {discount.code}</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              {/* Free shipping progress / status */}
              <div>
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#16a34a" }}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Free shipping unlocked!</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span style={{ color: "var(--body)" }}>
                        Free shipping at $149
                      </span>
                      <span style={{ color: "var(--heading)" }}>
                        {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} away
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--border)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
                          )}%`,
                          backgroundColor: "var(--accent)",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div
                className="space-y-2 pt-4 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--body)" }}>Subtotal</span>
                  <span style={{ color: "var(--heading)" }}>
                    {formatPrice(subtotal)}
                  </span>
                </div>
                {discount && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "#16a34a" }}>Discount</span>
                    <span style={{ color: "#16a34a" }}>
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--body)" }}>Shipping</span>
                  <span style={{ color: "var(--heading)" }}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div
                  className="flex justify-between text-base font-medium pt-2 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span style={{ color: "var(--heading)" }}>Total</span>
                  <span style={{ color: "var(--heading)" }}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error?: string;
  touched: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-1.5"
        style={{ color: "var(--heading)" }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn(
          "w-full px-4 py-3 rounded-md border bg-white text-sm transition-colors",
          error && touched
            ? "border-red-500 focus:border-red-500"
            : "border-[#ebebeb] focus:border-[#303e39]",
        )}
        style={{
          color: "var(--heading)",
        }}
      />
      {error && touched && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function PayPalLogo() {
  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 24 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.5 7.5C21.5 6.5 20.5 3 15.5 3H7L2.5 24H9L10.5 16L11 13.5H15.5C19 13.5 22 11 22.5 7.5H21.5Z"
        fill="white"
      />
      <path
        d="M5.5 4.5C5.5 3.5 5 2.5 4 2H1.5C0.5 2 0 2.5 0 3.5L3 24.5C3 25.5 3.5 26 5 26H14L15.5 18.5L12 19H8.5L5.5 4.5Z"
        fill="white"
      />
    </svg>
  );
}
