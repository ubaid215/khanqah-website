// src/features/qurbani/index.ts
// All components use default exports — re-export them as named for convenience,
// OR import directly from the component file (both work).

export { default as QurbaniPage }       from './components/QurbaniPage'
export { default as ParticipationForm } from './components/ParticipationForm'
export { default as PaymentUpload }     from './components/PaymentUpload'
export { default as SubmissionSuccess } from './components/SubmissionSuccess'
export { default as StatusChecker }     from './components/StatusChecker'
export { default as QurbaniTermsModal } from './components/QurbaniTermsModal'
export { qurbaniApi }                   from './lib/qurbaniApi'
export * from './hooks/useQurbani'