'use client'

import { useState, useEffect } from 'react'
import { Search, Loader2, AlertCircle, CheckCircle2, Clock, XCircle, Upload, ChevronDown, ChevronUp } from 'lucide-react'
import { useCheckStatus } from '../hooks/useQurbani'
import type { StatusResult } from '../lib/qurbaniApi'

interface Props {
  prefillId?: string
}

const STATUS_CONFIG = {
  PENDING: {
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    iconBg: 'bg-amber-100',
    label: 'Awaiting Payment',
  },
  PAYMENT_UPLOADED: {
    icon: Upload,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
    label: 'Under Review',
  },
  CONFIRMED: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    iconBg: 'bg-emerald-100',
    label: 'Confirmed',
  },
  REJECTED: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
    iconBg: 'bg-red-100',
    label: 'Rejected',
  },
} as const

const CATEGORY_EMOJI: Record<string, string> = {
  STANDARD: '🐂', MEDIUM: '🐃', PREMIUM: '🦌',
}

export default function StatusChecker({ prefillId }: Props) {
  const [id, setId]                   = useState(prefillId ?? '')
  const [showInstallments, setShowI]  = useState(false)
  const { check, loading, error, result } = useCheckStatus()

  // Auto-check if prefill ID is provided
  useEffect(() => {
    if (prefillId) check(prefillId)
  }, [prefillId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (id.trim()) check(id.trim())
  }

  const statusKey = (result?.status ?? 'PENDING') as keyof typeof STATUS_CONFIG
  const config = STATUS_CONFIG[statusKey] ?? STATUS_CONFIG.PENDING
  const StatusIcon = config.icon

  return (
    <div className="space-y-5 animate-fade-up">

      {/* ── Search ────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-stone-800 mb-1">Check Your Status</h2>
        <p className="text-stone-500 text-sm">Enter your reference number to view your booking status.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={id}
          onChange={e => setId(e.target.value)}
          placeholder="Enter your reference number (e.g. 42)..."
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm outline-none
            focus:border-[#2c5f2e] focus:ring-2 focus:ring-[#2c5f2e]/20 bg-white transition-colors font-mono"
        />
        <button
          type="submit"
          disabled={!id.trim() || loading}
          className="px-5 py-2.5 rounded-xl bg-[#2c5f2e] text-white font-medium text-sm
            hover:bg-[#245828] transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-2 flex-shrink-0"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* ── Result ────────────────────────────────────────────────────────── */}
      {result && !result.isDeleted && (
        <div className="space-y-4 animate-fade-up">

          {/* Status Card */}
          <div className={`rounded-2xl border p-5 ${config.bg}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
                <StatusIcon size={22} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-base ${config.color}`}>{result.statusLabel}</p>
                <p className="urdu text-stone-500 text-sm mt-0.5" style={{ fontFamily: '"Amiri", serif', direction: 'rtl', lineHeight: '1.8' }}>
                  {STATUS_URDU[result.status] ?? result.status}
                </p>

                {result.status === 'CONFIRMED' && result.confirmedAt && (
                  <p className="text-xs text-emerald-600 mt-1.5 font-medium">
                    ✓ Confirmed on {new Date(result.confirmedAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}

                {result.status === 'REJECTED' && result.adminNote && (
                  <div className="mt-2 bg-red-100 rounded-lg p-2.5">
                    <p className="text-xs text-red-700 font-medium">Reason: {result.adminNote}</p>
                  </div>
                )}

                {result.status === 'PENDING' && (
                  <p className="text-xs text-amber-700 mt-1.5">
                    Please transfer the payment to complete your booking.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="bg-stone-50 border-b border-stone-200 px-5 py-3">
              <p className="font-semibold text-stone-700 text-sm">Booking Details</p>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <InfoRow label="Name"      value={result.fillerName} />
              <InfoRow label="Phone"     value={result.fillerPhone} />
              <InfoRow label="Category"  value={`${CATEGORY_EMOJI[result.category] ?? ''} ${result.category}`} />
              <InfoRow label="Payment"   value={result.paymentMode === 'FULL' ? 'Full Payment' : 'Installments'} />
              <InfoRow label="Submitted" value={new Date(result.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })} />
              <div className="border-t border-stone-100 pt-3 flex justify-between items-center">
                <span className="font-semibold text-stone-700">Total Amount</span>
                <span className="text-lg font-bold text-[#2c5f2e]">Rs {result.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            <div className="bg-stone-50 border-b border-stone-200 px-5 py-3">
              <p className="font-semibold text-stone-700 text-sm">Participants ({result.participants.length})</p>
            </div>
            <div className="divide-y divide-stone-100">
              {result.participants.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-6 h-6 rounded-full bg-[#f0f9f0] border border-[#c8e6c9] text-[#2c5f2e] text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-stone-800 text-sm">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Installments */}
          {result.installments.length > 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowI(!showInstallments)}
                className="w-full bg-stone-50 border-b border-stone-200 px-5 py-3 flex items-center justify-between hover:bg-stone-100 transition-colors"
              >
                <p className="font-semibold text-stone-700 text-sm">
                  Installments ({result.installments.filter(i => i.isPaid).length}/{result.installments.length} paid)
                </p>
                {showInstallments ? <ChevronUp size={15} className="text-stone-400" /> : <ChevronDown size={15} className="text-stone-400" />}
              </button>

              {showInstallments && (
                <div className="divide-y divide-stone-100">
                  {result.installments.map(inst => (
                    <div key={inst.installmentNo} className="flex items-center gap-3 px-5 py-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                        ${inst.isPaid ? 'bg-emerald-100 text-emerald-700' : inst.isOverdue ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-400'}`}>
                        {inst.isPaid ? '✓' : inst.installmentNo}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-stone-800">Installment {inst.installmentNo}</p>
                        <p className="text-xs text-stone-400">Due: {new Date(inst.dueDate).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-stone-800">Rs {Number(inst.amount).toLocaleString()}</p>
                        <p className={`text-xs font-medium ${inst.isPaid ? 'text-emerald-600' : inst.isOverdue ? 'text-red-600' : 'text-stone-400'}`}>
                          {inst.isPaid ? `Paid ${inst.paidAt ? new Date(inst.paidAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }) : ''}` : inst.isOverdue ? 'Overdue' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {result?.isDeleted && (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-center">
          <XCircle size={32} className="text-stone-400 mx-auto mb-3" />
          <p className="font-semibold text-stone-600 text-sm">This registration has been cancelled.</p>
          <p className="text-stone-400 text-xs mt-1">Please contact us if you believe this is a mistake.</p>
        </div>
      )}

    </div>
  )
}

const STATUS_URDU: Record<string, string> = {
  PENDING:          'ادائیگی کا انتظار',
  PAYMENT_UPLOADED: 'ادائیگی زیر جائزہ',
  CONFIRMED:        'تصدیق ہو گئی ✓',
  REJECTED:         'مسترد ہو گئی',
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-stone-500">{label}</span>
      <span className="font-medium text-stone-800">{value}</span>
    </div>
  )
}