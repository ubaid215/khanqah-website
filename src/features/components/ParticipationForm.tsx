"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  AlertCircle,
  Loader2,
  Info,
  Building2,
  Copy,
  Upload,
  FileText,
  X,
  Image,
} from "lucide-react";
import {
  useFormData,
  useSubmitParticipation,
  useUploadPayment,
} from "../hooks/useQurbani";
import type {
  CategoryInfo,
  AnimalCategory,
  PaymentMode,
  SubmitParticipationResult,
  BankAccount,
} from "../lib/qurbaniApi";
import QurbaniTermsModal from "./QurbaniTermsModal";

interface Props {
  onSuccess: (result: SubmitParticipationResult) => void;
  bankAccount?: BankAccount | null; // Add this
}

interface Participant {
  id: string;
  firstName: string;
  fatherName: string;
  connector: "bin" | "binte";
}

interface FormState {
  fillerName: string;
  fillerPhone: string;
  fillerEmail: string;
  category: AnimalCategory | "";
  paymentMode: PaymentMode;
  participants: Participant[];
  transactionId: string;
  paymentFile: File | null;
  termsAccepted: boolean;
}

const CATEGORY_LABELS: Record<
  AnimalCategory,
  { en: string; ur: string; emoji: string; color: string; image: string }
> = {
  STANDARD: {
    en: "Standard",
    ur: "معیاری",
    emoji: "🐂",
    color: "#5a8c5c",
    image: "/images/standard.jpg",
  },
  MEDIUM: {
    en: "Medium",
    ur: "درمیانہ",
    emoji: "🐃",
    color: "#2c5f2e",
    image: "/images/medium.jpg",
  },
  PREMIUM: {
    en: "Premium",
    ur: "اعلیٰ",
    emoji: "🦌",
    color: "#d4a017",
    image: "/images/premium.jpg",
  },
};

export default function ParticipationForm({ onSuccess, bankAccount }: Props) {
  // ← FIX: Add bankAccount here
  const { data, loading: loadingData, error: dataError } = useFormData();
  const {
    submit,
    loading: submitting,
    error: submitError,
  } = useSubmitParticipation();
  const { upload, loading: uploading, error: uploadError } = useUploadPayment();

  // NOTE: No local submittingRef needed — useSubmitParticipation and useUploadPayment
  // each carry their own stable inFlight ref guard inside the hook. Having a second
  // ref here was causing both to reset independently, which allowed a second request
  // to slip through on slow networks or in React StrictMode (dev).

  const [form, setForm] = useState<FormState>({
    fillerName: "",
    fillerPhone: "",
    fillerEmail: "",
    category: "",
    paymentMode: "FULL",
    participants: [{ id: crypto.randomUUID(), firstName: "", fatherName: "", connector: "bin" }],
    transactionId: "",
    paymentFile: null,
    termsAccepted: false,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTerms, setShowTerms] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCategory: CategoryInfo | undefined = data?.categories.find(
    (c) => c.category === form.category,
  );

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: Record<string, string> = {};

    if (!form.fillerName.trim() || form.fillerName.trim().length < 2)
      e.fillerName = "Full name is required (min 2 characters)";

    if (!/^(\+92|0)?3[0-9]{9}$/.test(form.fillerPhone.trim()))
      e.fillerPhone =
        "Enter a valid Pakistani mobile number (e.g. 03001234567)";

    if (
      form.fillerEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.fillerEmail)
    )
      e.fillerEmail = "Enter a valid email address";

    if (!form.category) e.category = "Please select a category";

    form.participants.forEach((p, i) => {
      if (!p.firstName.trim() || p.firstName.trim().length < 2)
        e[`participant_${i}_first`] =
          "First name is required (min 2 characters)";
      if (!p.fatherName.trim() || p.fatherName.trim().length < 2)
        e[`participant_${i}_father`] =
          "Father's name is required (min 2 characters)";
    });

    if (!form.paymentFile)
      e.paymentFile = "Please upload your payment screenshot";

    if (!form.transactionId.trim())
      e.transactionId = "Transaction ID is required";

    if (!form.termsAccepted)
      e.termsAccepted = "You must accept the terms and conditions to proceed";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const addParticipant = () => {
    if (form.participants.length < 30)
      setForm((f) => ({
        ...f,
        participants: [
          ...f.participants,
          { id: crypto.randomUUID(), firstName: "", fatherName: "", connector: "bin" as const },
        ],
      }));
  };

  const removeParticipant = (i: number) => {
    if (form.participants.length > 1)
      setForm((f) => ({
        ...f,
        participants: f.participants.filter((_, idx) => idx !== i),
      }));
  };

  const updateParticipant = (
    i: number,
    field: keyof Participant,
    value: string,
  ) => {
    setForm((f) => ({
      ...f,
      participants: f.participants.map((p, idx) =>
        idx === i ? { ...p, [field]: value } : p,
      ),
    }));
    if (errors[`participant_${i}`])
      setErrors((e) => {
        const ne = { ...e };
        delete ne[`participant_${i}`];
        return ne;
      });
  };

  // Compose "Ahmad bin Yusuf" from split fields
  const composeParticipantName = (p: Participant): string => {
    const connector = p.connector === "bin" ? "bin" : "bint-e";
    return `${p.firstName.trim()} ${connector} ${p.fatherName.trim()}`;
  };

  const handleFile = useCallback((f: File) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowed.includes(f.type)) return;
    if (f.size > 5 * 1024 * 1024) return;
    setForm((prev) => ({ ...prev, paymentFile: f }));
    setErrors((e) => {
      const ne = { ...e };
      delete ne.paymentFile;
      return ne;
    });
    if (f.type !== "application/pdf") {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  }, []);

  const handleDrop = useCallback(
    (ev: React.DragEvent) => {
      ev.preventDefault();
      setDragOver(false);
      const dropped = ev.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [handleFile],
  );

  const clearFile = () => {
    setForm((prev) => ({ ...prev, paymentFile: null }));
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || uploading) return;  // hard guard — prevents any double-fire
    if (!validate()) return;
    // Double-submit is prevented inside useSubmitParticipation via its own
    // stable inFlight ref — submit() returns undefined if already in-flight.
    try {
      const result = await submit({
        fillerName: form.fillerName.trim(),
        fillerPhone: form.fillerPhone.trim(),
        fillerEmail: form.fillerEmail.trim() || undefined,
        category: form.category as AnimalCategory,
        paymentMode: form.paymentMode,
        participants: form.participants.map((p) => ({
          name: composeParticipantName(p),
        })),
      });
      // result is undefined if submit was blocked by in-flight guard
      if (result) {
        await upload(result.id, form.paymentFile!, form.transactionId.trim());
        onSuccess(result);
      }
    } catch {
      // errors are surfaced via submitError / uploadError from hooks
    }
  };
  // ── Computed ───────────────────────────────────────────────────────────────

  const totalAmount = selectedCategory
    ? selectedCategory.price * form.participants.length
    : 0;

  // ── Loading / Error ────────────────────────────────────────────────────────

  if (loadingData) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex gap-3">
        <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-700 text-sm">
            Could not load form data
          </p>
          <p className="text-red-600 text-xs mt-0.5">{dataError}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
      {/* ── Category Selection ───────────────────────────────────────────── */}
      {/* ── Category Selection ───────────────────────────────────────────── */}
      <section>
        <SectionHeader
          number={1}
          title="Select Category"
          urdu="قسم منتخب کریں"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
          {data?.categories.map((cat) => {
            const meta = CATEGORY_LABELS[cat.category];
            const isSelected = form.category === cat.category;
            return (
              <button
                key={cat.category}
                type="button"
                disabled={cat.isSoldOut}
                onClick={() => {
                  setForm((f) => ({
                    ...f,
                    category: cat.category,
                    paymentMode: "FULL",
                  }));
                  setErrors((e) => {
                    const ne = { ...e };
                    delete ne.category;
                    return ne;
                  });
                }}
                className={`relative flex flex-col items-end overflow-hidden rounded-xl border-2 transition-all text-left h-36
            ${
              cat.isSoldOut
                ? "opacity-50 cursor-not-allowed border-stone-200"
                : isSelected
                  ? "border-[#2c5f2e] shadow-[0_0_0_3px_rgba(44,95,46,0.2)] cursor-pointer"
                  : "border-stone-200 hover:border-[#5a8c5c] hover:shadow-md cursor-pointer"
            }
          `}
              >
                {/* Background image */}
                <img
                  src={meta.image}
                  alt={meta.en}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Multiple overlay layers for better text readability */}
                {/* Dark base overlay */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Gradient overlay from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Selected state overlay with subtle tint */}
                {isSelected && !cat.isSoldOut && (
                  <div className="absolute inset-0 bg-[#2c5f2e]/20" />
                )}

                {/* Sold out overlay */}
                {cat.isSoldOut && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
                )}

                {/* Selected checkmark */}
                {isSelected && !cat.isSoldOut && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2c5f2e] flex items-center justify-center shadow-md z-10">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                {/* Sold out badge */}
                {cat.isSoldOut && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-lg">
                    Sold Out
                  </div>
                )}

                {/* Content overlay at bottom with improved contrast */}
                <div className="relative z-10 w-full p-3 text-left mt-auto">
                  <div className="flex items-end justify-between gap-1">
                    <div>
                      <p className="font-bold text-white text-sm leading-tight drop-shadow-md">
                        {meta.en}
                      </p>
                      <p
                        className="urdu text-white/90 text-xs drop-shadow-md"
                        style={{
                          fontFamily: '"Amiri", serif',
                          direction: "rtl",
                        }}
                      >
                        {meta.ur}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white font-bold text-sm drop-shadow-md bg-black/30 px-2 py-0.5 rounded-lg">
                        Rs {cat.price.toLocaleString()}
                      </p>
                      <p className="text-white/80 text-[10px] drop-shadow-sm">
                        /person
                      </p>
                    </div>
                  </div>
                  {cat.remainingSeats !== null && !cat.isSoldOut && (
                    <p
                      className={`text-[10px] font-medium mt-1 drop-shadow-md ${
                        cat.remainingSeats <= 5
                          ? "text-amber-300"
                          : "text-white/70"
                      }`}
                    >
                      {cat.remainingSeats <= 5
                        ? `⚡ Only ${cat.remainingSeats} left`
                        : `${cat.remainingSeats} seats available`}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {errors.category && <FieldError msg={errors.category} />}
      </section>

      {/* ── Payment Mode ─────────────────────────────────────────────────── */}
      {selectedCategory && (
        <section className="animate-fade-up">
          <SectionHeader
            number={2}
            title="Payment Mode"
            urdu="ادائیگی کا طریقہ"
          />
          <div className="grid grid-cols-2 gap-3 mt-3">
            <ModeCard
              selected={form.paymentMode === "FULL"}
              onClick={() => setForm((f) => ({ ...f, paymentMode: "FULL" }))}
              title="Full Payment"
              urdu="مکمل ادائیگی"
              desc="Pay the total amount upfront"
            />
            <ModeCard
              selected={form.paymentMode === "INSTALLMENT"}
              onClick={() =>
                selectedCategory.installmentEnabled &&
                setForm((f) => ({ ...f, paymentMode: "INSTALLMENT" }))
              }
              disabled={!selectedCategory.installmentEnabled}
              title="Installments"
              urdu="قسطیں"
              desc={
                selectedCategory.installmentEnabled
                  ? (selectedCategory.installmentNote ??
                    `${selectedCategory.installmentCount} installments`)
                  : "Not available for this category"
              }
            />
          </div>
        </section>
      )}

      {/* ── Contact Info ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          number={selectedCategory ? 3 : 2}
          title="Your Contact Details"
          urdu="آپ کی معلومات"
        />
        <div className="space-y-3 mt-3">
          <Field
            label="Full Name"
            urdu="پورا نام"
            placeholder="e.g. Muhammad Ahmed"
            value={form.fillerName}
            onChange={(v) => {
              setForm((f) => ({ ...f, fillerName: v }));
              setErrors((e) => {
                const ne = { ...e };
                delete ne.fillerName;
                return ne;
              });
            }}
            error={errors.fillerName}
          />
          <Field
            label="Mobile Number"
            urdu="موبائل نمبر"
            placeholder="03001234567"
            value={form.fillerPhone}
            onChange={(v) => {
              setForm((f) => ({ ...f, fillerPhone: v }));
              setErrors((e) => {
                const ne = { ...e };
                delete ne.fillerPhone;
                return ne;
              });
            }}
            error={errors.fillerPhone}
            type="tel"
          />
          <Field
            label="Email Address (optional)"
            urdu="ای میل (اختیاری)"
            placeholder="your@email.com"
            value={form.fillerEmail}
            onChange={(v) => {
              setForm((f) => ({ ...f, fillerEmail: v }));
              setErrors((e) => {
                const ne = { ...e };
                delete ne.fillerEmail;
                return ne;
              });
            }}
            error={errors.fillerEmail}
            type="email"
          />
        </div>
      </section>

      {/* ── Participants ─────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <SectionHeader
            number={selectedCategory ? 4 : 3}
            title={`Participants (${form.participants.length})`}
            urdu="شرکاء"
          />
          <button
            type="button"
            onClick={addParticipant}
            disabled={form.participants.length >= 30}
            className="flex items-center gap-1.5 text-xs font-medium text-[#2c5f2e] bg-[#f0f9f0] border border-[#c8e6c9] rounded-lg px-3 py-1.5 hover:bg-[#dcf0dc] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={13} />
            Add Person
          </button>
        </div>

        <div className="space-y-2.5">
          {form.participants.map((p, i) => (
            <div
              key={p.id}
              className="rounded-xl border border-stone-200 bg-white overflow-hidden"
            >
              {/* Row header */}
              <div className="flex items-center justify-between px-3 py-2 bg-stone-50 border-b border-stone-100">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Participant {i + 1}
                </span>
                {form.participants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParticipant(i)}
                    className="p-1 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              {/* Split name inputs */}
              <div className="p-3 space-y-2">
                {/* First name */}
                <div>
                  <label className="block text-[11px] font-medium text-stone-400 mb-1">
                    Given Name <span className="text-red-400">*</span>
                    <span
                      className="urdu text-stone-400 ml-1"
                      style={{ fontFamily: '"Amiri", serif' }}
                    >
                      اسم
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ahmad"
                    value={p.firstName}
                    onChange={(e) =>
                      updateParticipant(i, "firstName", e.target.value)
                    }
                    className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors bg-white outline-none
                      ${
                        errors[`participant_${i}_first`]
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                          : "border-stone-200 focus:border-[#2c5f2e] focus:ring-2 focus:ring-[#2c5f2e]/20"
                      }`}
                  />
                  {errors[`participant_${i}_first`] && (
                    <FieldError msg={errors[`participant_${i}_first`]} />
                  )}
                </div>

                {/* bin / bint-e connector + father's name */}
                <div>
                  <label className="block text-[11px] font-medium text-stone-400 mb-1">
                    Father's Name <span className="text-red-400">*</span>
                    <span
                      className="urdu text-stone-400 ml-1"
                      style={{ fontFamily: '"Amiri", serif' }}
                    >
                      والد کا نام
                    </span>
                  </label>
                  <div className="flex gap-1.5 items-stretch">
                    {/* bin / bint-e toggle */}
                    <div className="flex rounded-lg border border-stone-200 overflow-hidden text-xs font-semibold flex-shrink-0 self-start">
                      <button
                        type="button"
                        onClick={() => updateParticipant(i, "connector", "bin")}
                        className={`px-2.5 py-2 transition-colors ${
                          p.connector === "bin"
                            ? "bg-[#2c5f2e] text-white"
                            : "bg-white text-stone-500 hover:bg-stone-50"
                        }`}
                      >
                        bin
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateParticipant(i, "connector", "binte")
                        }
                        className={`px-2.5 py-2 border-l border-stone-200 transition-colors ${
                          p.connector === "binte"
                            ? "bg-[#2c5f2e] text-white"
                            : "bg-white text-stone-500 hover:bg-stone-50"
                        }`}
                      >
                        bint-e
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Yusuf"
                      value={p.fatherName}
                      onChange={(e) =>
                        updateParticipant(i, "fatherName", e.target.value)
                      }
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-colors bg-white outline-none
                        ${
                          errors[`participant_${i}_father`]
                            ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                            : "border-stone-200 focus:border-[#2c5f2e] focus:ring-2 focus:ring-[#2c5f2e]/20"
                        }`}
                    />
                  </div>
                  {errors[`participant_${i}_father`] && (
                    <FieldError msg={errors[`participant_${i}_father`]} />
                  )}
                </div>

                {/* Live preview */}
                {(p.firstName.trim() || p.fatherName.trim()) && (
                  <div className="flex items-center gap-2 bg-[#f0f9f0] rounded-lg px-3 py-1.5 border border-[#c8e6c9]">
                    <span className="text-[10px] text-[#5a8c5c] font-medium uppercase tracking-wide flex-shrink-0">
                      Full name:
                    </span>
                    <span className="text-xs font-semibold text-[#2c5f2e] truncate">
                      {p.firstName.trim() || "—"}{" "}
                      {p.connector === "bin" ? "bin" : "bint-e"}{" "}
                      {p.fatherName.trim() || "—"}
                    </span>
                    <span
                      className="urdu text-[10px] text-[#5a8c5c] ml-auto flex-shrink-0"
                      style={{ fontFamily: '"Amiri", serif', direction: "rtl" }}
                    >
                      {p.connector === "bin" ? "بن" : "بنت"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Summary ──────────────────────────────────────────────────────── */}
      {selectedCategory && (
        <section className="bg-[#111f12] rounded-2xl p-5 text-white animate-fade-up">
          <p className="text-[#6b9b6d] text-xs font-medium uppercase tracking-wider mb-3">
            Order Summary
          </p>
          <div className="space-y-2 text-sm">
            <Row
              label="Category"
              value={`${CATEGORY_LABELS[selectedCategory.category].en} — ${CATEGORY_LABELS[selectedCategory.category].emoji}`}
            />
            <Row
              label="Price per person"
              value={`Rs ${selectedCategory.price.toLocaleString()}`}
            />
            <Row
              label="Participants"
              value={form.participants.length.toString()}
            />
            <Row
              label="Payment mode"
              value={
                form.paymentMode === "FULL" ? "Full Payment" : "Installments"
              }
            />
            <div className="border-t border-[#2c5f2e]/40 pt-2 mt-2 flex justify-between items-center">
              <span className="font-semibold">Total Amount</span>
              <span className="text-xl font-bold text-[#f0c040]">
                Rs {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── Bank Details ──────────────────────────────────────────────────────── */}
      {bankAccount && (
        <section className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <Building2 size={18} className="text-amber-600" />
            <p className="font-semibold text-amber-800 text-sm">
              Step 1 — Transfer Payment to This Account
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <BankDetailRow label="Bank" value={bankAccount.bankName} />
            <BankDetailRow
              label="Account Title"
              value={bankAccount.accountTitle}
            />
            <BankDetailRow
              label="Account Number"
              value={bankAccount.accountNumber}
              copyable
            />
            {bankAccount.iban && (
              <BankDetailRow label="IBAN" value={bankAccount.iban} copyable />
            )}
          </div>
          {totalAmount > 0 && (
            <p className="text-xs text-amber-700 mt-3 pt-2 border-t border-amber-200">
              Amount to transfer:{" "}
              <strong className="font-bold">
                Rs {totalAmount.toLocaleString()}
              </strong>
            </p>
          )}
        </section>
      )}

      {/* ── Payment Upload ────────────────────────────────────────────────── */}
      <section className="animate-fade-up">
        <SectionHeader
          number={selectedCategory ? 5 : 4}
          title="Step 2 — Upload Payment Proof"
          urdu="ادائیگی کا ثبوت"
        />
        <div className="space-y-3 mt-3">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !form.paymentFile && fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all min-h-[150px] flex flex-col items-center justify-center cursor-pointer
              ${
                errors.paymentFile
                  ? "border-red-300 bg-red-50"
                  : form.paymentFile
                    ? "border-[#2c5f2e] bg-[#f0f9f0] cursor-default"
                    : dragOver
                      ? "border-[#2c5f2e] bg-[#f0f9f0] scale-[1.01]"
                      : "border-stone-300 bg-white hover:border-[#5a8c5c] hover:bg-[#f9fcf9]"
              }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFile(e.target.files[0])
              }
            />

            {form.paymentFile ? (
              <div className="w-full p-4">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Payment screenshot"
                      className="w-full max-h-40 object-contain rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md text-stone-600 hover:text-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#c8e6c9]">
                    <FileText
                      size={22}
                      className="text-[#2c5f2e] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">
                        {form.paymentFile.name}
                      </p>
                      <p className="text-xs text-stone-400">
                        {(form.paymentFile.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearFile();
                      }}
                      className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-6">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-stone-100 mb-3">
                  <Upload size={18} className="text-stone-400" />
                </div>
                <p className="font-medium text-stone-700 text-sm">
                  Drop your payment screenshot here
                </p>
                <p className="text-stone-400 text-xs mt-1">
                  or click to browse
                </p>
                <p className="text-stone-400 text-xs mt-2">
                  JPEG, PNG, WebP or PDF — max 5MB
                </p>
              </div>
            )}
          </div>
          {errors.paymentFile && <FieldError msg={errors.paymentFile} />}

          {/* Transaction ID */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">
              Transaction ID <span className="text-red-500">*</span>
              <span
                className="urdu text-stone-400 ml-2"
                style={{ fontFamily: '"Amiri", serif' }}
              >
                ٹرانزیکشن نمبر
              </span>
            </label>
            <input
              type="text"
              placeholder="Bank transaction reference number from your receipt"
              value={form.transactionId}
              onChange={(e) => {
                setForm((f) => ({ ...f, transactionId: e.target.value }));
                setErrors((er) => {
                  const ne = { ...er };
                  delete ne.transactionId;
                  return ne;
                });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors bg-white
                ${
                  errors.transactionId
                    ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-stone-200 focus:border-[#2c5f2e] focus:ring-2 focus:ring-[#2c5f2e]/20"
                }`}
            />
            {errors.transactionId && <FieldError msg={errors.transactionId} />}
          </div>
        </div>
      </section>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {(submitError || uploadError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 animate-fade-up">
          <AlertCircle
            size={16}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-red-700 text-sm">{submitError || uploadError}</p>
        </div>
      )}

      {/* ── Terms & Conditions ───────────────────────────────────────────── */}
      <div
        className={`rounded-xl border-2 p-4 transition-colors ${
          errors.termsAccepted
            ? "border-red-300 bg-red-50"
            : "border-stone-200 bg-stone-50"
        }`}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={form.termsAccepted}
              onChange={(e) => {
                setForm((f) => ({ ...f, termsAccepted: e.target.checked }));
                if (e.target.checked)
                  setErrors((er) => {
                    const ne = { ...er };
                    delete ne.termsAccepted;
                    return ne;
                  });
              }}
              className="sr-only peer"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
              peer-checked:bg-[#2c5f2e] peer-checked:border-[#2c5f2e]
              ${errors.termsAccepted ? "border-red-400" : "border-stone-300 bg-white"}`}
            >
              {form.termsAccepted && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
          <span className="text-xs text-stone-600 leading-relaxed">
            I have read and accept the{" "}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="text-[#2c5f2e] font-semibold underline underline-offset-2 hover:text-[#1e4621] transition-colors"
            >
              Power of Attorney (Wikalat Nama) for Qurbani
            </button>{" "}
            — and hereby appoint{" "}
            <strong className="text-stone-800">Shakeel Ahmad</strong> (son of
            Muhammad Abdul Ghafur) on behalf of{" "}
            <strong className="text-stone-800">
              Khanqah Saifia Murshidabad Shareef
            </strong>{" "}
            as my authorised Wakeel to perform Qurbani, distribute meat, and
            manage all related matters on my behalf. I understand that the funds
            transferred are held as{" "}
            <strong className="text-stone-800">Amanah</strong> and that the
            payment is non-refundable once confirmed.
            <span
              className="urdu block text-right mt-1.5 text-stone-400 text-sm"
              style={{
                fontFamily: '"Amiri", serif',
                direction: "rtl",
                lineHeight: "2",
              }}
            >
              میں وکالت نامے سے متفق ہوں اور شکیل احمد ولد محمد عبدالغفور کو
              اپنی قربانی، گوشت کی تقسیم اور متعلقہ تمام امور کے لیے اپنا وکیلِ
              مطلق مقرر کرتا/کرتی ہوں
            </span>
          </span>
        </label>
        {errors.termsAccepted && <FieldError msg={errors.termsAccepted} />}
      </div>

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <button
        type="submit"
        disabled={submitting || uploading || !form.termsAccepted}
        className="w-full py-3.5 rounded-xl bg-[#2c5f2e] text-white font-semibold text-sm
          hover:bg-[#245828] active:bg-[#1e4621] transition-colors shadow-[0_4px_16px_rgba(44,95,46,0.3)]
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting Registration...
          </>
        ) : uploading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Uploading Payment...
          </>
        ) : (
          <>
            Submit Registration & Payment
            <span
              className="urdu text-sm"
              style={{ fontFamily: '"Amiri", serif' }}
            >
              جمع کریں
            </span>
          </>
        )}
      </button>

      {showTerms && <QurbaniTermsModal onClose={() => setShowTerms(false)} />}
    </form>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({
  number,
  title,
  urdu,
}: {
  number: number;
  title: string;
  urdu: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-[#2c5f2e] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {number}
      </div>
      <div>
        <span className="font-semibold text-stone-800 text-sm">{title}</span>
        <span
          className="urdu text-stone-400 text-sm mr-2 ml-2"
          style={{ fontFamily: '"Amiri", serif', direction: "rtl" }}
        >
          {" "}
          — {urdu}
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  urdu,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  urdu: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1.5">
        {label}
        <span
          className="urdu text-stone-400 ml-2"
          style={{ fontFamily: '"Amiri", serif' }}
        >
          {urdu}
        </span>
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors bg-white outline-none
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-stone-200 focus:border-[#2c5f2e] focus:ring-2 focus:ring-[#2c5f2e]/20"
          }`}
      />
      {error && <FieldError msg={error} />}
    </div>
  );
}

function ModeCard({
  selected,
  onClick,
  title,
  urdu,
  desc,
  disabled = false,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  urdu: string;
  desc: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-4 rounded-xl border-2 text-left transition-all w-full
        ${
          disabled
            ? "opacity-40 cursor-not-allowed bg-stone-50 border-stone-200"
            : selected
              ? "border-[#2c5f2e] bg-[#f0f9f0]"
              : "border-stone-200 bg-white hover:border-[#5a8c5c]"
        }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${selected ? "border-[#2c5f2e] bg-[#2c5f2e]" : "border-stone-300"}`}
        />
        <p className="font-semibold text-stone-800 text-sm">{title}</p>
      </div>
      <p
        className="urdu text-xs text-stone-400 mb-1"
        style={{
          fontFamily: '"Amiri", serif',
          direction: "rtl",
          textAlign: "right",
        }}
      >
        {urdu}
      </p>
      <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#6b9b6d]">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function BankDetailRow({
  label,
  value,
  copyable = false,
}: {
  label: string;
  value: string;
  copyable?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-amber-700 text-xs">{label}</span>
      <div className="flex items-center gap-1">
        <span className="font-mono text-amber-800 text-xs">{value}</span>
        {copyable && (
          <button
            onClick={copy}
            className="p-1 text-amber-500 hover:text-amber-700 transition-colors"
          >
            <Copy size={12} />
          </button>
        )}
      </div>
      {copied && <span className="text-[10px] text-emerald-600">Copied!</span>}
    </div>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="flex items-center gap-1 text-xs text-red-600 mt-1">
      <AlertCircle size={11} />
      {msg}
    </p>
  );
}