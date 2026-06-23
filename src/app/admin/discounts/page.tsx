"use client";

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Loader2,
  Save,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  PackageOpen,
  Search,
} from "lucide-react";
import { cn, formatPrice, formatDate } from "@/lib/utils";

interface DiscountCode {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  label: string;
  description: string | null;
  minSubtotal: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  startsAt: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DiscountFormData {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  label: string;
  description: string;
  minSubtotal: number;
  maxUses: number;
  isActive: boolean;
  expiresAt: string;
}

const emptyForm: DiscountFormData = {
  code: "",
  type: "percentage",
  value: 10,
  label: "",
  description: "",
  minSubtotal: 0,
  maxUses: 0,
  isActive: true,
  expiresAt: "",
};

function fetchDiscounts(): Promise<DiscountCode[]> {
  return fetch("/api/admin/discounts")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch discounts");
      return res.json();
    })
    .then((data) => data.discounts || data);
}

async function createDiscount(
  data: DiscountFormData,
): Promise<DiscountCode> {
  const res = await fetch("/api/admin/discounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create discount");
  }
  return res.json();
}

async function updateDiscount(
  id: string,
  data: Partial<DiscountFormData>,
): Promise<DiscountCode> {
  const res = await fetch(`/api/admin/discounts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update discount");
  }
  return res.json();
}

async function deleteDiscount(id: string): Promise<void> {
  const res = await fetch(`/api/admin/discounts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete discount");
  }
}

export default function AdminDiscountsPage() {
  const router = useRouter();
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<DiscountFormData>({ ...emptyForm });
  const [search, setSearch] = useState("");
  const [, startTransition] = useTransition();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Load discounts
  const loadDiscounts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchDiscounts();
      setDiscounts(data);
    } catch (error) {
      console.error("Failed to load discounts:", error);
      toast.error("Failed to load discounts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiscounts();
  }, [loadDiscounts]);

  // Filtered discounts
  const filtered = useMemo(() => {
    if (!search.trim()) return discounts;
    const q = search.toLowerCase();
    return discounts.filter(
      (d) =>
        d.code.toLowerCase().includes(q) ||
        d.label.toLowerCase().includes(q) ||
        (d.description && d.description.toLowerCase().includes(q)),
    );
  }, [discounts, search]);

  // Open create modal
  const openCreate = useCallback(() => {
    setFormData({ ...emptyForm });
    setEditingId(null);
    setShowCreateModal(true);
  }, []);

  // Open edit modal
  const openEdit = useCallback((discount: DiscountCode) => {
    setFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      label: discount.label,
      description: discount.description || "",
      minSubtotal: discount.minSubtotal,
      maxUses: discount.maxUses,
      isActive: discount.isActive,
      expiresAt: discount.expiresAt ? discount.expiresAt.split("T")[0] : "",
    });
    setEditingId(discount.id);
    setShowCreateModal(true);
  }, []);

  // Save (create or update)
  const handleSave = useCallback(async () => {
    // Validation
    if (!formData.code.trim()) {
      toast.error("Discount code is required");
      return;
    }
    if (formData.value <= 0) {
      toast.error("Value must be greater than 0");
      return;
    }
    if (formData.type === "percentage" && formData.value > 100) {
      toast.error("Percentage cannot exceed 100%");
      return;
    }
    if (!formData.label.trim()) {
      toast.error("Label is required");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...formData,
        expiresAt: formData.expiresAt
          ? new Date(formData.expiresAt).toISOString()
          : null,
      };

      if (editingId) {
        await updateDiscount(editingId, formData);
        toast.success("Discount updated successfully");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { expiresAt: _, ...createPayload } = formData;
        await createDiscount({
          ...createPayload,
          expiresAt: formData.expiresAt
            ? new Date(formData.expiresAt).toISOString()
            : "",
        } as DiscountFormData);
        toast.success("Discount created successfully");
      }

      setShowCreateModal(false);
      setEditingId(null);
      await loadDiscounts();
      startTransition(() => router.refresh());
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }, [formData, editingId, loadDiscounts, router]);

  // Toggle active
  const toggleActive = useCallback(
    async (discount: DiscountCode) => {
      try {
        await updateDiscount(discount.id, { isActive: !discount.isActive } as DiscountFormData);
        setDiscounts((prev) =>
          prev.map((d) =>
            d.id === discount.id ? { ...d, isActive: !d.isActive } : d,
          ),
        );
        toast.success(
          discount.isActive
            ? "Discount deactivated"
            : "Discount activated",
        );
        startTransition(() => router.refresh());
      } catch {
        toast.error("Failed to toggle discount status");
      }
    },
    [router],
  );

  // Delete
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteDiscount(id);
        setDiscounts((prev) => prev.filter((d) => d.id !== id));
        setDeleteConfirmId(null);
        toast.success("Discount deleted");
        startTransition(() => router.refresh());
      } catch {
        toast.error("Failed to delete discount");
      }
    },
    [router],
  );

  const formatValue = (d: DiscountCode) => {
    if (d.type === "percentage") return `${d.value}%`;
    return formatPrice(d.value);
  };

  const activeCount = discounts.filter((d) => d.isActive).length;

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
            Discount Codes
          </h2>
          <p className="mt-1 text-sm text-[#555]">
            {discounts.length} total &middot; {activeCount} active
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#c25b3e] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#a84d35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c25b3e] focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Create Discount
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999]" />
        <input
          type="text"
          placeholder="Search discount codes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-[#e1dcd0]/40 bg-white py-2.5 pl-10 pr-4 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center rounded-xl border border-[#e1dcd0]/40 bg-white py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#c25b3e]" />
        </div>
      )}

      {/* Empty State */}
      {!loading && discounts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#e1dcd0]/40 bg-white py-16">
          <Tag className="mb-3 h-12 w-12 text-[#ccc]" />
          <p className="text-sm font-medium text-[#555]">No discount codes yet</p>
          <p className="mt-1 text-xs text-[#999]">
            Create your first discount code to offer promotions.
          </p>
          <button
            onClick={openCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#c25b3e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a84d35]"
          >
            <Plus className="h-4 w-4" />
            Create Discount
          </button>
        </div>
      )}

      {/* No Results */}
      {!loading && discounts.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#e1dcd0]/40 bg-white py-16">
          <Search className="mb-3 h-12 w-12 text-[#ccc]" />
          <p className="text-sm font-medium text-[#555]">No matching discounts</p>
          <p className="mt-1 text-xs text-[#999]">
            Try a different search term.
          </p>
        </div>
      )}

      {/* Discounts Table */}
      {!loading && filtered.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-[#e1dcd0]/40 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e1dcd0]/50 bg-[#fafaf8] text-xs font-semibold uppercase tracking-wider text-[#999]">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Type / Value</th>
                  <th className="px-5 py-3 font-medium">Label</th>
                  <th className="px-5 py-3 font-medium">Usage</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Expires</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1dcd0]/30">
                {filtered.map((discount) => {
                  const isExpired =
                    discount.expiresAt &&
                    new Date(discount.expiresAt) < new Date();
                  const usagePercent =
                    discount.maxUses > 0
                      ? Math.round(
                          (discount.usedCount / discount.maxUses) * 100,
                        )
                      : 0;

                  return (
                    <tr
                      key={discount.id}
                      className={cn(
                        "transition-colors hover:bg-[#f5f3f0]/60",
                        !discount.isActive && "opacity-50",
                      )}
                    >
                      {/* Code */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-md border border-[#d4a85c] bg-[#d4a85c]/5 px-2.5 py-1 font-mono text-sm font-bold text-[#111] uppercase">
                            {discount.code}
                          </span>
                        </div>
                      </td>

                      {/* Type / Value */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          {discount.type === "percentage" ? (
                            <Percent className="h-3.5 w-3.5 text-[#c25b3e]" />
                          ) : (
                            <DollarSign className="h-3.5 w-3.5 text-[#c25b3e]" />
                          )}
                          <span className="text-sm font-semibold text-[#111]">
                            {formatValue(discount)}
                          </span>
                          {discount.type === "percentage" && (
                            <span className="text-xs text-[#999]">off</span>
                          )}
                        </div>
                        {discount.minSubtotal > 0 && (
                          <p className="mt-0.5 text-[11px] text-[#999]">
                            Min order: {formatPrice(discount.minSubtotal)}
                          </p>
                        )}
                      </td>

                      {/* Label */}
                      <td className="px-5 py-3">
                        <div className="max-w-40">
                          <p className="truncate text-sm font-medium text-[#111]">
                            {discount.label}
                          </p>
                          {discount.description && (
                            <p className="truncate text-xs text-[#999]">
                              {discount.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Usage */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 overflow-hidden rounded-full bg-[#e1dcd0]/40">
                            <div
                              className="h-1.5 rounded-full bg-[#c25b3e] transition-all"
                              style={{ width: `${Math.min(usagePercent, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#555]">
                            {discount.usedCount}
                            {discount.maxUses > 0 && ` / ${discount.maxUses}`}
                          </span>
                        </div>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-5 py-3">
                        <button
                          onClick={() => toggleActive(discount)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all",
                            discount.isActive
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100",
                          )}
                        >
                          {discount.isActive ? (
                            <>
                              <Check className="h-3 w-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>

                      {/* Expires */}
                      <td className="px-5 py-3">
                        {discount.expiresAt ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#999]" />
                            <span
                              className={cn(
                                "text-xs",
                                isExpired
                                  ? "font-medium text-rose-600"
                                  : "text-[#555]",
                              )}
                            >
                              {formatDate(discount.expiresAt)}
                              {isExpired && " (expired)"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#999]">
                            No expiration
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(discount)}
                            className="rounded-md p-2 text-[#999] transition-colors hover:bg-[#f5f3f0] hover:text-[#111]"
                            title="Edit discount"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {deleteConfirmId === discount.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(discount.id)}
                                className="rounded-md bg-rose-50 p-1.5 text-rose-600 transition-colors hover:bg-rose-100"
                                title="Confirm delete"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="rounded-md bg-gray-50 p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                                title="Cancel"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(discount.id)}
                              className="rounded-md p-2 text-[#999] transition-colors hover:bg-rose-50 hover:text-rose-600"
                              title="Delete discount"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowCreateModal(false);
              setEditingId(null);
              setFormData({ ...emptyForm });
            }}
          />

          {/* Modal */}
          <div className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl border border-[#e1dcd0]/40 bg-white shadow-2xl animate-fade-in">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#e1dcd0]/40 bg-white px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-[#111]">
                  {editingId ? "Edit Discount" : "Create Discount"}
                </h3>
                <p className="text-xs text-[#999]">
                  {editingId
                    ? "Update discount code details."
                    : "Create a new discount or promo code."}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingId(null);
                  setFormData({ ...emptyForm });
                }}
                className="rounded-md p-2 text-[#999] transition-colors hover:bg-[#f5f3f0] hover:text-[#111]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* Code */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""),
                    })
                  }
                  placeholder="e.g. SUMMER20"
                  disabled={!!editingId}
                  className={cn(
                    "w-full rounded-lg border bg-[#fafaf8] px-3 py-2 text-sm font-mono uppercase text-[#111] placeholder:font-sans placeholder:normal-case placeholder:text-[#aaa] focus:outline-none focus:ring-1",
                    editingId
                      ? "cursor-not-allowed border-[#e1dcd0] opacity-60"
                      : "border-[#e1dcd0] focus:border-[#c25b3e] focus:ring-[#c25b3e]",
                  )}
                />
                {editingId && (
                  <p className="mt-1 text-[11px] text-[#999]">
                    Code cannot be changed after creation.
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: "percentage" })
                    }
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                      formData.type === "percentage"
                        ? "border-[#c25b3e] bg-[#c25b3e]/5 text-[#c25b3e]"
                        : "border-[#e1dcd0] bg-[#fafaf8] text-[#555] hover:bg-[#f5f3f0]",
                    )}
                  >
                    <Percent className="h-4 w-4" />
                    Percentage
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, type: "fixed" })
                    }
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                      formData.type === "fixed"
                        ? "border-[#c25b3e] bg-[#c25b3e]/5 text-[#c25b3e]"
                        : "border-[#e1dcd0] bg-[#fafaf8] text-[#555] hover:bg-[#f5f3f0]",
                    )}
                  >
                    <DollarSign className="h-4 w-4" />
                    Fixed Amount
                  </button>
                </div>
              </div>

              {/* Value */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  {formData.type === "percentage"
                    ? "Percentage (%) *"
                    : "Amount (USD) *"}
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#999]">
                    {formData.type === "percentage" ? "%" : "$"}
                  </span>
                  <input
                    type="number"
                    step={formData.type === "percentage" ? "1" : "0.01"}
                    min="0"
                    max={formData.type === "percentage" ? "100" : undefined}
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        value: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] py-2 pl-8 pr-3 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                  />
                </div>
              </div>

              {/* Label */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Display Label *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                  placeholder="e.g. Summer Sale 20% Off"
                  className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Optional description of terms..."
                  className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e] resize-y"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Min Subtotal */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                    Min. Subtotal
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#999]">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minSubtotal}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minSubtotal: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] py-2 pl-8 pr-3 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                    />
                  </div>
                </div>

                {/* Max Uses */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxUses}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxUses: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0 = unlimited"
                    className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] placeholder:text-[#aaa] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                  />
                </div>
              </div>

              {/* Expires At */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#999]">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData({ ...formData, expiresAt: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-3 py-2 text-sm text-[#111] focus:border-[#c25b3e] focus:outline-none focus:ring-1 focus:ring-[#c25b3e]"
                />
              </div>

              {/* Active Toggle */}
              <label className="inline-flex items-center gap-3 rounded-lg border border-[#e1dcd0] bg-[#fafaf8] px-4 py-3 transition-colors hover:bg-[#f5f3f0] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-[#e1dcd0] text-[#c25b3e] focus:ring-[#c25b3e]"
                />
                <div>
                  <p className="text-sm font-medium text-[#111]">
                    Active
                  </p>
                  <p className="text-xs text-[#999]">
                    Discount will be usable immediately when active.
                  </p>
                </div>
              </label>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-[#e1dcd0]/40 bg-[#fafaf8] px-6 py-4">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingId(null);
                  setFormData({ ...emptyForm });
                }}
                className="rounded-lg border border-[#e1dcd0] bg-white px-4 py-2 text-sm font-medium text-[#555] transition-colors hover:bg-[#f5f3f0]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-[#303e39] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#252f2b] disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Discount"
                    : "Create Discount"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
