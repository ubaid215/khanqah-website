'use client'

import { useState } from 'react'
import ParticipationForm from './ParticipationForm'
import StatusChecker from './StatusChecker'
import SubmissionSuccess from './SubmissionSuccess'
import { useFormData } from '../hooks/useQurbani'
import type { SubmitParticipationResult } from '../lib/qurbaniApi'

type View = 'form' | 'success' | 'status'

export default function QurbaniPage() {
  const [view, setView]             = useState<View>('form')
  const [submission, setSubmission] = useState<SubmitParticipationResult | null>(null)
  const [activeTab, setActiveTab]   = useState<'register' | 'status'>('register')

  const { data: formData } = useFormData()
  const bankAccount        = formData?.bankAccount ?? null

  const handleSubmitted = (result: SubmitParticipationResult) => {
    setSubmission(result)
    setView('success')
  }

  const handleReset = () => {
    setSubmission(null)
    setView('form')
    setActiveTab('register')
  }

  return (
    <div className="min-h-screen bg-[#f5f3ee]" style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>

      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden bg-[#111f12]">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-2xl mx-auto px-5 py-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2c5f2e] shadow-[0_0_32px_rgba(44,95,46,0.5)] mb-5">
            <span className="text-3xl" role="img" aria-label="qurbani">🐄</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-1">
            Qurbani Registration
          </h1>
          <p
            className="urdu text-[#8abf8c] text-xl mb-3"
            style={{ fontFamily: '"Amiri", Georgia, serif', direction: 'rtl', lineHeight: '2' }}
          >
            قربانی رجسٹریشن
          </p>
          <p className="text-[#6b9b6d] text-sm max-w-md mx-auto leading-relaxed">
            Register your participation for Qurbani. Fill in the form below, complete your payment, and we'll confirm your booking.
          </p>
        </div>
      </header>

      {/* ── Tab Navigation (hidden on success screen) ────────────────────── */}
      {view !== 'success' && (
        <div className="bg-white border-b border-stone-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-2xl mx-auto px-5 flex">
            <button
              onClick={() => { setActiveTab('register'); setView('form') }}
              className={`flex-1 py-3.5 text-sm font-medium transition-all border-b-2 ${
                activeTab === 'register'
                  ? 'border-[#2c5f2e] text-[#2c5f2e]'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              📝 Register
            </button>
            <button
              onClick={() => { setActiveTab('status'); setView('status') }}
              className={`flex-1 py-3.5 text-sm font-medium transition-all border-b-2 ${
                activeTab === 'status'
                  ? 'border-[#2c5f2e] text-[#2c5f2e]'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              🔍 Check Status
            </button>
          </div>
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-5 py-8">
        {view === 'form' && (
          <ParticipationForm onSuccess={handleSubmitted} bankAccount={bankAccount} />
        )}

        {view === 'success' && submission && (
          <SubmissionSuccess
            submission={submission}
            bankAccount={bankAccount}
            onCheckStatus={() => { setActiveTab('status'); setView('status') }}
            onNewSubmission={handleReset}
          />
        )}

        {view === 'status' && (
          <StatusChecker prefillId={submission?.refNumber?.toString()} />
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="text-center py-8 text-xs text-stone-400 border-t border-stone-200 mt-4">
        <p>For assistance, contact us via WhatsApp</p>
        <p
          className="mt-1 urdu text-sm text-stone-400"
          style={{ fontFamily: '"Amiri", serif', direction: 'rtl' }}
        >
          مزید معلومات کے لیے ہم سے رابطہ کریں
        </p>
      </footer>
    </div>
  )
}