'use client'

import { CheckCircle2, Copy, Search, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import type { SubmitParticipationResult, BankAccount } from '../lib/qurbaniApi'

interface Props {
  submission:      SubmitParticipationResult
  bankAccount?:    BankAccount | null
  onCheckStatus:   () => void
  onNewSubmission: () => void
}

const CATEGORY_EMOJI: Record<string, string> = {
  STANDARD: '🐂', MEDIUM: '🐃', PREMIUM: '🦌',
}

export default function SubmissionSuccess({ submission, onCheckStatus, onNewSubmission }: Props) {
  const [copied, setCopied] = useState(false)

  const copyId = () => {
    navigator.clipboard.writeText(submission.id).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-5 animate-fade-up">

      {/* ── Success Banner ────────────────────────────────────────────────── */}
      <div className="bg-[#f0f9f0] border border-[#c8e6c9] rounded-2xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2c5f2e] shadow-[0_0_32px_rgba(44,95,46,0.35)] mb-4">
          <CheckCircle2 size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[#1e4621] mb-1">Registration Complete!</h2>
        <p className="urdu text-[#2c5f2e] text-xl mb-3" style={{ fontFamily: '"Amiri", serif', direction: 'rtl', lineHeight: '2' }}>
          رجسٹریشن اور ادائیگی کامیاب ہوئی ✓
        </p>
        <p className="text-stone-600 text-sm leading-relaxed max-w-sm mx-auto">
          Your registration and payment proof have been submitted. Our team will verify your payment and confirm your booking within <strong>24 hours</strong>.
        </p>
      </div>

      {/* ── Reference ID ─────────────────────────────────────────────────── */}
      <div className="bg-[#111f12] rounded-2xl p-5">
        <p className="text-[#6b9b6d] text-xs font-medium uppercase tracking-wider mb-2">Your Reference ID</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 text-white font-mono text-sm bg-[#1e3a20] rounded-lg px-3 py-2 break-all">
            {submission.id}
          </code>
          <button
            onClick={copyId}
            className="p-2 text-[#5a8c5c] hover:text-white hover:bg-[#2c5f2e] rounded-lg transition-colors flex-shrink-0"
            title="Copy ID"
          >
            {copied
              ? <CheckCircle2 size={15} className="text-emerald-400" />
              : <Copy size={15} />
            }
          </button>
        </div>
        <p className="text-[#5a8c5c] text-xs mt-2">
          💡 Save this ID to track your booking status anytime
        </p>
      </div>

      {/* ── What Happens Next ─────────────────────────────────────────────── */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5">
        <p className="font-semibold text-stone-700 text-sm mb-3">What happens next?</p>
        <div className="space-y-3">
          {[
            { step: '1', icon: '🔍', text: 'Our team reviews your payment screenshot and transaction ID' },
            { step: '2', icon: '✅', text: 'Your booking status updates to Confirmed within 24 hours' },
            { step: '3', icon: '🐄', text: 'We proceed with Qurbani on your behalf on Eid ul Adha' },
          ].map(({ step, icon, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#f0f9f0] border border-[#c8e6c9] text-[#2c5f2e] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {step}
              </div>
              <p className="text-stone-600 text-sm leading-relaxed">
                <span className="mr-1">{icon}</span>{text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Booking Summary ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="bg-stone-50 border-b border-stone-200 px-5 py-3">
          <p className="font-semibold text-stone-700 text-sm">Booking Summary</p>
        </div>
        <div className="p-5 space-y-3 text-sm">
          <InfoRow label="Name"         value={submission.fillerName} />
          <InfoRow label="Phone"        value={submission.fillerPhone} />
          <InfoRow label="Category"     value={`${CATEGORY_EMOJI[submission.category] ?? ''} ${submission.category}`} />
          <InfoRow label="Payment Mode" value={submission.paymentMode === 'FULL' ? 'Full Payment' : 'Installments'} />
          <InfoRow label="Participants" value={submission.participantCount.toString()} />
          <div className="border-t border-stone-100 pt-3 flex justify-between items-center">
            <span className="font-semibold text-stone-700">Total Amount</span>
            <span className="text-xl font-bold text-[#2c5f2e]">Rs {submission.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Participants List ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="bg-stone-50 border-b border-stone-200 px-5 py-3">
          <p className="font-semibold text-stone-700 text-sm">Participants ({submission.participants.length})</p>
        </div>
        <div className="divide-y divide-stone-100">
          {submission.participants.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 px-5 py-3">
              <div className="w-6 h-6 rounded-full bg-[#f0f9f0] border border-[#c8e6c9] text-[#2c5f2e] text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-stone-800 text-sm">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <button
          onClick={onCheckStatus}
          className="w-full py-3.5 rounded-xl bg-[#2c5f2e] text-white font-semibold text-sm
            hover:bg-[#245828] transition-colors shadow-[0_4px_16px_rgba(44,95,46,0.3)]
            flex items-center justify-center gap-2"
        >
          <Search size={15} />
          Track My Booking Status
        </button>

        <button
          onClick={onNewSubmission}
          className="w-full py-2.5 text-stone-400 text-xs hover:text-stone-600 transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw size={12} />
          Submit another registration
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-stone-500">{label}</span>
      <span className="font-medium text-stone-800">{value}</span>
    </div>
  )
}