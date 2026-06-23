// @ts-nocheck
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  ArrowUpDown,
  Loader2,
  Save,
  Eye,
  EyeOff,
  Tag,
  Star,
  ChevronDown,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCTS, type Product, CATEGORIES } from "@/lib/products";

const STORAGE_KEY = "flintbeam-product-edits";

interface ProductEdits {
  [productId: string]: Partial<Product> & { isActive?: boolean };
}

interface NewProductEdits {
  [productId: string]: Product;
}

function getStoredEdits(): ProductEdits {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStoredEdits(edits: ProductEdits) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
  } catch {
    // localStorage full or unavailable
  }
}

function mergeProducts(
  baseProducts: Product[],
  edits: ProductEdits,
  newProducts: NewProductEdits,
): (Product & { isActive: boolean })[] {
  const mergedBase = baseProducts.map((p) => {
    const edit = edits[p.id] || {};
    return {
      ...p,
      ...edit,
      isActive: edit.isActive !== undefined ? edit.isActive : p.isActive,
    };
  });

  const extras = Object.values(newProducts).map((p) => ({
    ...p,
    isActive: p.inStock,
  }));

  return [...mergedBase, ...extras];
}

export default function AdminProductsPage() {
  const [edits, setEdits] = useState<ProductEdits>({});
  const [newProducts, setNewProducts] = useState<NewProductEdits>({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "price" | "category" | "">("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedEdits = getStoredEdits();
    setEdits(storedEdits);
    // Load new products
    const newEdits: NewProductEdits = {};
    for (const [key, val] of Object.entries(storedEdits)) {
      if (!PRODUCTS.find((p) => p.id === key)) {
        newEdits[key] = val as Product;
      }
    }
    setNewProducts(newEdits);
    setInitialized(true);
  }, []);

  // Merge products
  const products = useMemo(
    () => mergeProducts(PRODUCTS, edits, newProducts),
    [edits, newProducts],
  );

  // Filter and sort
  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q),
      );
    }

    if (categoryFilter) {
      result = result.filter((p) => p.categorySlug === categoryFilter);
    }

    if (sortKey) {
      result.sort((a, b) => {
        let va: string | number = "";
        let vb: string | number = "";
        if (sortKey === "name") {
          va = a.name.toLowerCase();
          vb = b.name.toLowerCase();
        } else if (sortKey === "price") {
          va = a.price;
          vb = b.price;
        } else if (sortKey === "category") {
          va = a.category.toLowerCase();
          vb = b.category.toLowerCase();
        }
        if (va < vb) return sortDir === "asc" ? -1 : 1;
        if (va > vb) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [products, search, categoryFilter, sortKey, sortDir]);

  // Toggle active
  const toggleActive = useCallback(
    (productId: string) => {
      const current = edits[productId]?.isActive;
      const base = PRODUCTS.find((p) => p.id === productId);
      const newActive = current !== undefined ? !current : !base?.inStock;

      const updated = { ...edits, [productId]: { ...edits[productId], isActive: newActive } };
      setEdits(updated);
      setStoredEdits(updated);
      toast.success(newActive ? "Product activated" : "Product deactivated");
    },
    [edits],
  );

  // Toggle best seller
  const toggleBestSeller = useCallback(
    (productId: string) => {
      const baseProduct = PRODUCTS.find((p) => p.id === productId);
      const current =
        edits[productId]?.isBestSeller !== undefined
          ? edits[productId].isBestSeller
          : baseProduct?.isBestSeller;

      const updated = {
        ...edits,
        [productId]: { ...edits[productId], isBestSeller: !current },
      };
      setEdits(updated);
      setStoredEdits(updated);
      toast.success(!current ? "Marked as best seller" : "Removed from best sellers");
    },
    [edits],
  );

  // Toggle new badge
  const toggleIsNew = useCallback(
    (productId: string) => {
      const baseProduct = PRODUCTS.find((p) => p.id === productId);
      const current =
        edits[productId]?.isNew !== undefined
          ? edits[productId].isNew
          : baseProduct?.isNew;

      const updated = {
        ...edits,
        [productId]: { ...edits[productId], isNew: !current },
      };
      setEdits(updated);
      setStoredEdits(updated);
      toast.success(!current ? "Marked as new arrival" : "Removed from new arrivals");
    },
    [edits],
  );

  // Open edit modal
  const startEdit = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      setEditingProduct(product as Product);
      setFormData({ ...product });
    },
    [products],
  );

  // Save edit
  const saveEdit = useCallback(async () => {
    if (!editingProduct) return;
    setSaving(true);

    // Simulate a small delay for UX
    await new Promise((r) => setTimeout(r, 300));

    const { id, isActive, ...rest } = formData;
    const updated = { ...edits, [editingProduct.id]: { ...rest, isActive } };
    setEdits(updated);
    setStoredEdits(updated);
    setEditingProduct(null);
    setFormData({});
    setSaving(false);
    toast.success("Product updated successfully");
  }, [editingProduct, formData, edits]);

  // Add product
  const addProduct = useCallback(async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));

    const newId = `prod_custom_${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: formData.name || "New Product",
      slug: formData.slug || `new-product-${Date.now()}`,
      description: formData.description || "",
      price: formData.price || 0,
      compareAt: formData.compareAt || null,
      images: formData.images || ["/images/products/placeholder.jpg"],
      category: formData.category || "Pendants",
      categorySlug: formData.categorySlug || "pendants",
      tags: formData.tags || [],
      isBestSeller: formData.isBestSeller || false,
      isNew: formData.isNew || false,
      rating: formData.rating || 0,
      reviewCount: formData.reviewCount || 0,
      inStock: true,
      sku: formData.sku || `FB-CUSTOM-${Date.now()}`,
      specs: formData.specs || "",
    };

    const updatedEdits = { ...edits, [newId]: newProduct };
    const updatedNew = { ...newProducts, [newId]: newProduct };
    setEdits(updatedEdits);
    setNewProducts(updatedNew);
    setStoredEdits(updatedEdits);
    setShowAddModal(false);
    setFormData({});
    setSaving(false);
    toast.success("Product added successfully");
  }, [formData, edits, newProducts]);

  // Delete product (only custom products)
  const deleteProduct = useCallback(
    (productId: string) => {
      if (PRODUCTS.find((p) => p.id === productId)) {
        toast.error("Cannot delete built-in products");
        return;
      }
      const updatedEdits = { ...edits };
      delete updatedEdits[productId];
      const updatedNew = { ...newProducts };
      delete updatedNew[productId];
      setEdits(updatedEdits);
      setNewProducts(updatedNew);
      setStoredEdits(updatedEdits);
      toast.success("Product deleted");
    },
    [edits, newProducts],
  );

  // Reset form when opening add modal
  const openAddModal = useCallback(() => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: 0,
      compareAt: null,
      images: ["/images/products/placeholder.jpg"],
      category: "Pendants",
      categorySlug: "pendants",
      tags: [],
      isBestSeller: false,
      isNew: false,
      rating: 0,
      reviewCount: 0,
      inStock: true,
      sku: "",
      specs: "",
    });
    setShowAddModal(true);
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-[#c25b3e]" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "0.5rem",
            background: "#fff",
            color: "#111",
            fontSize: "13px",
            border: "1px solid #e1dcd0",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          },
          success: {
            iconTheme: { primary: "#303e39", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#c25b3e", secondary: "#fff" },
          },
        }}
      />

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#111]">
            Products
          </h2>
          <p className="mt-1 text-sm text-[#555]">
            {products.length} products total &middot;{" "}
            {products.filter((p) => p.isActive).length} active
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#c25b3e] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#a84d35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#e1dcd0]/40 bg-white p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
          <input
            type="text"
            placeholder="Search products by name, description, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] py-2 pl-10 pr-4 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            if (sortKey === "name") {
              setSortDir((d) => (d === "asc" ? "desc" : "asc"));
            } else {
              setSortKey("name");
              setSortDir("asc");
            }
          }}
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
            sortKey
              ? "border-[#c25b3e] bg-[#c25b3e]/5 text-[#c25b3e]"
              : "border-[#e1dcd0] bg-[#fafaf8] text-[#555] hover:bg-[#f5f3f0]",
          )}
        >
          <ArrowUpDown className="h-4 w-4" />
          Sort
        </button>
      </div>

      {/* Products Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#e1dcd0]/40 bg-white py-16">
          <Package className="mb-3 h-12 w-12 text-[#ccc]" />
          <p className="text-sm font-medium text-[#555]">No products found</p>
          <p className="mt-1 text-xs text-[#999]">
            {search || categoryFilter
              ? "Try adjusting your search or filter."
              : "Add your first product to get started."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e1dcd0]/40 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e1dcd0]/50 bg-[#fafaf8] text-xs font-semibold uppercase tracking-wider text-[#999]">
                  <th className="px-5 py-3.5 font-medium">Product</th>
                  <th className="px-5 py-3.5 font-medium">Category</th>
                  <th className="px-5 py-3.5 font-medium">Price</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium">Badges</th>
                  <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1dcd0]/30">
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-[#f5f3f0]/60"
                  >
                    {/* Product Image + Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-[#f5f3f0]">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-5 w-5 text-[#ccc]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#111]">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#999]">{product.sku}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e1dcd0]/50 px-2.5 py-0.5 text-xs font-medium text-[#555]">
                        <Tag className="h-3 w-3" />
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="text-sm font-semibold text-[#111]">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAt && (
                          <span className="ml-1.5 text-xs text-[#999] line-through">
                            {formatPrice(product.compareAt)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleActive(product.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all",
                          product.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
                        )}
                      >
                        {product.isActive ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>

                    {/* Badges */}
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => toggleBestSeller(product.id)}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase transition-all",
                            product.isBestSeller
                              ? "border-[#d4a85c] bg-[#d4a85c]/10 text-[#d4a85c]"
                              : "border-[#e1dcd0] bg-transparent text-[#999] hover:border-[#d4a85c] hover:text-[#d4a85c]",
                          )}
                          title="Toggle best seller"
                        >
                          <Star className="mr-0.5 inline h-2.5 w-2.5" />
                          Best
                        </button>
                        <button
                          onClick={() => toggleIsNew(product.id)}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase transition-all",
                            product.isNew
                              ? "border-[#c25b3e] bg-[#c25b3e]/10 text-[#c25b3e]"
                              : "border-[#e1dcd0] bg-transparent text-[#999] hover:border-[#c25b3e] hover:text-[#c25b3e]",
                          )}
                          title="Toggle new badge"
                        >
                          New
                        </button>
                        {product.rating > 0 && (
                          <span className="inline-flex items-center gap-0.5 rounded-full border border-[#e1dcd0] px-2 py-0.5 text-[10px] font-medium text-[#555]">
                            <Star className="h-2.5 w-2.5 fill-[#d4a85c] text-[#d4a85c]" />
                            {product.rating} ({product.reviewCount})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(product.id)}
                          className="rounded-md p-2 text-[#999] transition-colors hover:bg-[#f5f3f0] hover:text-[#111]"
                          title="Edit product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {!PRODUCTS.find((p) => p.id === product.id) && (
                          <button
                            onClick={() => {
                              if (confirm("Delete this product?")) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="rounded-md p-2 text-[#999] transition-colors hover:bg-rose-50 hover:text-rose-600"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setEditingProduct(null);
              setFormData({});
            }}
          />

          {/* Modal */}
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#e1dcd0]/40 bg-white shadow-2xl animate-fade-in">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e1dcd0]/40 bg-white px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-[#111]">Edit Product</h3>
                <p className="text-xs text-[#999]">
                  Editing: {editingProduct.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({});
                }}
                className="rounded-md p-2 text-[#999] transition-colors hover:bg-[#f5f3f0] hover:text-[#111]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e] resize-y"
                />
              </div>

              {/* Price & Compare At */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                    Compare At Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAt || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compareAt: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    placeholder="Leave empty for no sale"
                    className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Category
                </label>
                <select
                  value={formData.category || "Pendants"}
                  onChange={(e) => {
                    const cat = CATEGORIES.find((c) => c.name === e.target.value);
                    setFormData({
                      ...formData,
                      category: e.target.value,
                      categorySlug: cat?.slug || "pendants",
                    });
                  }}
                  className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm font-medium text-[#555] transition-colors hover:bg-[#f5f3f0] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-[#e1dcd0] text-[#c25b3e] focus:ring-[#c25b3e]"
                  />
                  Active
                </label>
                <label className="inline-flex items-center gap-2 rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm font-medium text-[#555] transition-colors hover:bg-[#f5f3f0] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isBestSeller: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-[#e1dcd0] text-[#c25b3e] focus:ring-[#c25b3e]"
                  />
                  Best Seller
                </label>
                <label className="inline-flex items-center gap-2 rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm font-medium text-[#555] transition-colors hover:bg-[#f5f3f0] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isNew || false}
                    onChange={(e) =>
                      setFormData({ ...formData, isNew: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-[#e1dcd0] text-[#c25b3e] focus:ring-[#c25b3e]"
                  />
                  New Arrival
                </label>
              </div>

              {/* Rating & Reviews */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                    Review Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviewCount || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reviewCount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-[#e1dcd0]/40 bg-[#fafaf8] px-6 py-4">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({});
                }}
                className="rounded-lg border border-[#e1dcd0] bg-white px-4 py-2 text-sm font-medium text-[#555] transition-colors hover:bg-[#f5f3f0]"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-[#303e39] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#252f2b] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowAddModal(false);
              setFormData({});
            }}
          />
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-[#e1dcd0]/40 bg-white shadow-2xl animate-fade-in">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e1dcd0]/40 bg-white px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-[#111]">Add Product</h3>
                <p className="text-xs text-[#999]">
                  Create a new product (saved locally).
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({});
                }}
                className="rounded-md p-2 text-[#999] transition-colors hover:bg-[#f5f3f0] hover:text-[#111]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Product name"
                  className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Product description"
                  className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e] resize-y"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                    Compare At Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAt || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compareAt: e.target.value
                          ? parseFloat(e.target.value)
                          : null,
                      })
                    }
                    placeholder="Optional"
                    className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="FB-XX-000"
                  className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Category
                </label>
                <select
                  value={formData.category || "Pendants"}
                  onChange={(e) => {
                    const cat = CATEGORIES.find((c) => c.name === e.target.value);
                    setFormData({
                      ...formData,
                      category: e.target.value,
                      categorySlug: cat?.slug || "pendants",
                    });
                  }}
                  className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.images?.[0] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: [e.target.value],
                    })
                  }
                  placeholder="/images/products/my-product.jpg"
                  className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm font-medium text-[#555] transition-colors hover:bg-[#f5f3f0] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isBestSeller: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-[#e1dcd0] text-[#c25b3e] focus:ring-[#c25b3e]"
                  />
                  Best Seller
                </label>
                <label className="inline-flex items-center gap-2 rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm font-medium text-[#555] transition-colors hover:bg-[#f5f3f0] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isNew || false}
                    onChange={(e) =>
                      setFormData({ ...formData, isNew: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-[#e1dcd0] text-[#c25b3e] focus:ring-[#c25b3e]"
                  />
                  New Arrival
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-[#e1dcd0]/40 bg-[#fafaf8] px-6 py-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({});
                }}
                className="rounded-lg border border-[#e1dcd0] bg-white px-4 py-2 text-sm font-medium text-[#555] transition-colors hover:bg-[#f5f3f0]"
              >
                Cancel
              </button>
              <button
                onClick={addProduct}
                disabled={saving || !formData.name}
                className="inline-flex items-center gap-2 rounded-lg bg-[#c25b3e] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#a84d35] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {saving ? "Adding..." : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
