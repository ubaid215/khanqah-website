// src/app/(main)/qurbani/page.tsx
import type { Metadata } from 'next'
import '@/features/styles/qurbani.css'
import QurbaniPage from '@/features/components/QurbaniPage'

export const metadata: Metadata = {
  title:       'Qurbani Registration — Khanqah Saifia',
  description: 'Register your Qurbani participation with Khanqah Saifia Murshidabad Shareef, Faisalabad.',
  openGraph: {
    title:       'Qurbani Registration — Khanqah Saifia',
    description: 'Register your Qurbani participation with Khanqah Saifia Murshidabad Shareef.',
    locale:      'en_PK',
  },
}

export default function QurbaniRoute() {
  return <QurbaniPage />
}