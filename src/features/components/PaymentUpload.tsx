'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Image, FileText, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useUploadPayment } from '../hooks/useQurbani'

interface Props {
  participationId: string
  totalAmount:     number
  onSuccess:       () => void
  onSkip:          () => void
}

export default function PaymentUpload({ participationId, totalAmount, onSuccess, onSkip }: Props) {
  const { upload, loading, error, success } = useUploadPayment()
  const [file, setFile]               = useState<File | null>(null)
  const [preview, setPreview]         = useState<string | null>(null)
  const [transactionId, setTxId]      = useState('')
  const [dragOver, setDragOver]       = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowed.includes(f.type)) return
    if (f.size > 5 * 1024 * 1024) return

    setFile(f)
    if (f.type !== 'application/pdf') {
      const url = URL.createObjectURL(f)
      setPreview(url)
    } else {
      setPreview(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleFile(dropped)
  }, [handleFile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !transactionId.trim()) return
    try {
      await upload(participationId, file, transactionId.trim())
      setTimeout(onSuccess, 1500)
    } catch {}
  }

  if (success) {
    return (
      <div className="text-center py-12 animate-fade-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2c5f2e] shadow-[0_0_24px_rgba(44,95,46,0.3)] mb-5">
          <CheckCircle2 size={30} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">Payment Uploaded!</h2>
        <p className="text-stone-500 text-sm max-w-xs mx-auto">
          Our team will verify your payment and confirm your booking within 24 hours.
        </p>
        <p className="urdu text-[#2c5f2e] text-lg mt-3" style={{ fontFamily: '"Amiri", serif', direction: 'rtl', lineHeight: '2' }}>
          آپ کی ادائیگی جمع ہو گئی
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-stone-800 mb-1">Upload Payment Proof</h2>
        <p className="text-stone-500 text-sm">
          Transfer <span className="font-bold text-[#2c5f2e]">Rs {totalAmount.toLocaleString()}</span> to the bank account shown below, then upload your screenshot.
        </p>
      </div>

      {/* ── Instruction Notice ────────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-2.5">
        <span className="text-base flex-shrink-0">💳</span>
        <p className="text-amber-800 text-xs leading-relaxed">
          <strong>Complete your bank transfer first,</strong> then upload the payment screenshot along with the transaction ID from your bank receipt. Both are required to verify your payment.
        </p>
      </div>

      {/* ── Drop Zone ────────────────────────────────────────────────────── */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-all min-h-[180px] flex flex-col items-center justify-center cursor-pointer
          ${file
            ? 'border-[#2c5f2e] bg-[#f0f9f0] cursor-default'
            : dragOver
              ? 'border-[#2c5f2e] bg-[#f0f9f0] scale-[1.01]'
              : 'border-stone-300 bg-white hover:border-[#5a8c5c] hover:bg-[#f9fcf9]'
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="w-full p-4">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full max-h-48 object-contain rounded-xl" />
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setFile(null); setPreview(null) }}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md text-stone-600 hover:text-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#c8e6c9]">
                <FileText size={24} className="text-[#2c5f2e] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{file.name}</p>
                  <p className="text-xs text-stone-400">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setFile(null) }}
                  className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-stone-100 mb-3">
              <Upload size={20} className="text-stone-400" />
            </div>
            <p className="font-medium text-stone-700 text-sm">Drop your screenshot here</p>
            <p className="text-stone-400 text-xs mt-1">or click to browse</p>
            <p className="text-stone-400 text-xs mt-2">JPEG, PNG, WebP or PDF — max 5MB</p>
          </div>
        )}
      </div>

      {/* ── Transaction ID ────────────────────────────────────────────────── */}
      <div>
        <label className="block text-xs font-medium text-stone-600 mb-1.5">
          Transaction ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Bank transaction reference number"
          value={transactionId}
          onChange={e => setTxId(e.target.value)}
          required
          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm outline-none
            focus:border-[#2c5f2e] focus:ring-2 focus:ring-[#2c5f2e]/20 bg-white transition-colors"
        />
        <p className="text-xs text-stone-400 mt-1">Enter the transaction reference number from your bank receipt.</p>
      </div>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        <button
          type="submit"
          disabled={!file || !transactionId.trim() || loading}
          className="w-full py-3.5 rounded-xl bg-[#2c5f2e] text-white font-semibold text-sm
            hover:bg-[#245828] transition-colors shadow-[0_4px_16px_rgba(44,95,46,0.3)]
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={15} />
              Upload Payment Screenshot
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="w-full py-2.5 text-stone-400 text-xs hover:text-stone-600 transition-colors"
        >
          Skip for now — I'll upload later
        </button>
      </div>
    </form>
  )
}