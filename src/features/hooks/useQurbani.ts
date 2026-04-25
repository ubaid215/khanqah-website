import { useState, useEffect, useCallback, useRef } from 'react'
import {
  qurbaniApi,
  type FormDataResponse,
  type SubmitParticipationPayload,
  type SubmitParticipationResult,
  type UploadPaymentResult,
  type StatusResult,
} from '../lib/qurbaniApi'

// ── useFormData ───────────────────────────────────────────────────────────────
// Fetches category prices, slot availability, and bank account on mount.
// Safe to call from a Server Component via a wrapper, or directly in a Client
// Component — result is cached in component state for the lifetime of the tree.

export function useFormData() {
  const [data, setData]       = useState<FormDataResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    qurbaniApi.getFormData()
      .then(res => { if (!cancelled) setData(res.data) })
      .catch(err => { if (!cancelled) setError(err.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}

// ── useSubmitParticipation ────────────────────────────────────────────────────
// Ref-based in-flight guard prevents double-submit on fast double-clicks or
// slow networks without needing a disabled button as the only protection.
//
// NOTE: The inFlight ref lives inside the hook (not module-level) so each form
// instance has its own guard. React StrictMode double-invokes the component
// function but useRef is stable across those — the ref is NOT recreated.
// The real StrictMode risk is effects, not refs, so this is safe.

export function useSubmitParticipation() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [result, setResult]   = useState<SubmitParticipationResult | null>(null)
  const inFlight              = useRef(false)

  const submit = useCallback(async (payload: SubmitParticipationPayload) => {
    // Synchronous guard — if already in-flight, silently bail out
    if (inFlight.current) return undefined
    inFlight.current = true
    setLoading(true)
    setError(null)
    try {
      const res = await qurbaniApi.submitParticipation(payload)
      setResult(res.data)
      return res.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
      inFlight.current = false
    }
  }, [])

  // Expose a reset so the parent can clear state for a new submission
  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    inFlight.current = false
  }, [])

  return { submit, loading, error, result, reset }
}

// ── useUploadPayment ──────────────────────────────────────────────────────────
// Handles multipart upload to Cloudinary via the Express backend.
// The `data` field on success gives back the updated participation snapshot
// (id, status, paymentScreenshot, transactionId, updatedAt, message).

export function useUploadPayment() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [data, setData]       = useState<UploadPaymentResult | null>(null)
  const inFlight              = useRef(false)

  const upload = useCallback(async (
    id:             string,
    file:           File,
    transactionId?: string,
  ) => {
    if (inFlight.current) return
    inFlight.current = true
    setLoading(true)
    setError(null)
    try {
      const res = await qurbaniApi.uploadPayment(id, file, transactionId)
      setData(res.data)
      setSuccess(true)
      return res.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
      inFlight.current = false
    }
  }, [])

  const reset = useCallback(() => {
    setSuccess(false)
    setData(null)
    setError(null)
  }, [])

  return { upload, loading, error, success, data, reset }
}

// ── useCheckStatus ────────────────────────────────────────────────────────────
// Lazy — only fires when `check(id)` is called, not on mount.
// StatusChecker calls it on mount when prefillId is provided.

export function useCheckStatus() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [result, setResult]   = useState<StatusResult | null>(null)

  const check = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await qurbaniApi.checkStatus(id)
      setResult(res.data)
      return res.data
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { check, loading, error, result, reset }
}