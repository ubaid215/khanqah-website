import axios from 'axios'

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QURBANI_API_URL ?? '/api/v1/public',
  timeout: 30_000,
})

// ── Unwrap envelope ───────────────────────────────────────────────────────────
publicApi.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// ── Types (mirrored from shared types, public-only subset) ────────────────────

export type AnimalCategory = 'STANDARD' | 'MEDIUM' | 'PREMIUM'
export type PaymentMode    = 'FULL' | 'INSTALLMENT'

export interface CategoryInfo {
  category:           AnimalCategory
  price:              number
  installmentEnabled: boolean
  installmentCount:   number | null
  installmentNote:    string | null
  totalSeats:         number | null
  remainingSeats:     number | null
  isSoldOut:          boolean
}

export interface BankAccount {
  bankName:      string
  accountTitle:  string
  accountNumber: string
  iban:          string | null
}

export interface FormDataResponse {
  categories:  CategoryInfo[]
  bankAccount: BankAccount | null
}

export interface SubmitParticipationPayload {
  fillerName:   string
  fillerPhone:  string
  fillerEmail?: string
  category:     AnimalCategory
  paymentMode:  PaymentMode
  participants: { name: string }[]
}

export interface SubmitParticipationResult {
  id:               string
  fillerName:       string
  fillerPhone:      string
  category:         AnimalCategory
  paymentMode:      PaymentMode
  totalAmount:      number
  participantCount: number
  participants:     { id: string; name: string }[]
  status:           string
  createdAt:        string
  message:          string
}

export interface StatusInstallment {
  installmentNo: number
  amount:        string       // Decimal comes as string from Prisma
  dueDate:       string
  isPaid:        boolean
  isOverdue:     boolean
  paidAt?:       string
}

export interface StatusParticipant {
  id:    string
  name:  string
  order: number
}

export interface StatusResult {
  id:                string
  fillerName:        string
  fillerPhone:       string
  category:          AnimalCategory
  paymentMode:       PaymentMode
  totalAmount:       number
  status:            string
  statusLabel:       string
  installmentStatus?: string
  adminNote?:        string
  confirmedAt?:      string
  createdAt:         string
  isDeleted:         boolean
  participants:      StatusParticipant[]
  installments:      StatusInstallment[]
}

export interface UploadPaymentResult {
  id:                string
  status:            string
  paymentScreenshot: string
  transactionId?:    string
  updatedAt:         string
  message:           string
}

// ── Envelope wrappers (axios interceptor strips to this level) ─────────────────
// After the interceptor, res.data is already the envelope, so calls resolve to:
// { success, message, data } — we return the inner `data` in useQurbani hooks.

export interface Envelope<T> {
  success: boolean
  message: string
  data:    T
}

// ── API calls ─────────────────────────────────────────────────────────────────

export const qurbaniApi = {

  /** GET /public/form-data */
  getFormData: (): Promise<Envelope<FormDataResponse>> =>
    publicApi.get('/form-data'),

  /** POST /public/participate */
  submitParticipation: (
    payload: SubmitParticipationPayload
  ): Promise<Envelope<SubmitParticipationResult>> =>
    publicApi.post('/participate', payload),

  /** POST /public/participations/:id/payment  (multipart) */
  uploadPayment: (
    id:             string,
    file:           File,
    transactionId?: string,
  ): Promise<Envelope<UploadPaymentResult>> => {
    const form = new FormData()
    form.append('screenshot', file)
    if (transactionId) form.append('transactionId', transactionId)
    // Do NOT set Content-Type manually — browser must add the boundary
    return publicApi.post(`/participations/${id}/payment`, form)
  },

  /** GET /public/participations/:id/status */
  checkStatus: (id: string): Promise<Envelope<StatusResult>> =>
    publicApi.get(`/participations/${id}/status`),
}