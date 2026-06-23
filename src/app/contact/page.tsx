"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Mail, MapPin, Phone, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const SUBJECTS = [
  "General Inquiry",
  "Order Question",
  "Trade Program",
  "Custom Project",
  "Press",
  "Other",
];

const INITIAL_FORM: FormData = {
  name: "",
  email: "",
  subject: "General Inquiry",
  message: "",
};

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

function validateField(
  name: keyof FormData,
  value: string,
): string | undefined {
  switch (name) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return undefined;
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Please enter a valid email";
      return undefined;
    case "subject":
      if (!value.trim()) return "Please select a subject";
      return undefined;
    case "message":
      if (!value.trim()) return "Message is required";
      if (value.trim().length < 10)
        return "Message must be at least 10 characters";
      return undefined;
    default:
      return undefined;
  }
}

/* ------------------------------------------------------------------ */
/*  Contact Info Data                                                  */
/* ------------------------------------------------------------------ */

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@flintandbeam.com",
    href: "mailto:hello@flintandbeam.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "(707) 555-0147",
    href: "tel:+17075550147",
  },
  {
    icon: MapPin,
    label: "Workshop",
    value: "421 Spain Street, Sonoma, CA 95476",
    href: "https://maps.google.com/?q=421+Spain+Street+Sonoma+CA",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Monday–Friday, 9am–5pm PT",
    href: undefined,
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContactPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState<FormData>({
    ...INITIAL_FORM,
    email: session?.user?.email || "",
    name: session?.user?.name || "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      // Clear error on change
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
    },
    [],
  );

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      const error = validateField(name as keyof FormData, value);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) next[name as keyof FormErrors] = error;
        else delete next[name as keyof FormErrors];
        return next;
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const allErrors: FormErrors = {};
      for (const key of Object.keys(form) as (keyof FormData)[]) {
        const error = validateField(key, form[key]);
        if (error) allErrors[key] = error;
      }

      if (Object.keys(allErrors).length > 0) {
        setErrors(allErrors);
        return;
      }

      setSubmitting(true);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.message || "Failed to send message. Please try again.");
        } else {
          toast.success("Message sent! We'll get back to you within one business day.");
          setForm(INITIAL_FORM);
          setErrors({});
        }
      } catch {
        toast.error("Something went wrong. Please try again later.");
      } finally {
        setSubmitting(false);
      }
    },
    [form],
  );

  return (
    <div style={{ backgroundColor: "var(--bg)" }}>
      {/* Header */}
      <section
        className="py-16 lg:py-24 px-4 text-center"
        style={{ backgroundColor: "var(--sand)" }}
      >
        <div className="max-w-2xl mx-auto">
          <p
            className="text-sm uppercase tracking-[0.2em] mb-4 font-medium"
            style={{ color: "var(--accent)" }}
          >
            Get in Touch
          </p>
          <h1
            className="text-3xl lg:text-4xl xl:text-5xl font-medium mb-4"
            style={{ color: "var(--heading)" }}
          >
            Contact Us
          </h1>
          <p style={{ color: "var(--body)" }}>
            Questions about a piece? Interested in a custom project? We'd love
            to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  label="Name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name}
                  placeholder="Your name"
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--heading)" }}
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={cn(
                    "w-full px-4 py-3 rounded-md border bg-white text-sm transition-colors appearance-none",
                    errors.subject
                      ? "border-red-500"
                      : "border-[#ebebeb] focus:border-[#303e39]",
                  )}
                  style={{ color: "var(--heading)" }}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--heading)" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={6}
                  placeholder="Tell us how we can help..."
                  className={cn(
                    "w-full px-4 py-3 rounded-md border bg-white text-sm transition-colors resize-y",
                    errors.message
                      ? "border-red-500"
                      : "border-[#ebebeb] focus:border-[#303e39]",
                  )}
                  style={{ color: "var(--heading)" }}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "inline-flex items-center gap-2 px-8 py-3 rounded-md text-white font-medium transition-colors",
                  submitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:opacity-90",
                )}
                style={{ backgroundColor: "var(--accent)" }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2
              className="text-lg font-medium mb-6"
              style={{ color: "var(--heading)" }}
            >
              Contact Information
            </h2>
            <div className="space-y-6">
              {CONTACT_INFO.map((info, i) => (
                <div key={i} className="flex items-start gap-3">
                  <info.icon
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                    style={{ color: "var(--accent)" }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium mb-0.5"
                      style={{ color: "var(--heading)" }}
                    >
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-sm hover:underline"
                        style={{ color: "var(--body)" }}
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm" style={{ color: "var(--body)" }}>
                        {info.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div
              className="mt-8 rounded-xl overflow-hidden aspect-[4/3]"
              style={{ backgroundColor: "var(--sand)" }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <MapPin
                  className="w-10 h-10"
                  style={{ color: "var(--body)", opacity: 0.3 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FormField                                                          */
/* ------------------------------------------------------------------ */

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
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
          error
            ? "border-red-500 focus:border-red-500"
            : "border-[#ebebeb] focus:border-[#303e39]",
        )}
        style={{ color: "var(--heading)" }}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
