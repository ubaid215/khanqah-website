import type { Metadata } from 'next'
import '@/features/styles/qurbani.css'
import QurbaniPage from '@/features/components/QurbaniPage'

export const metadata: Metadata = {
  title:       'Qurbani 1447H Registration — Khanqah Saifia',
  description: 'Register your Qurbani participation for 1447H with Khanqah Saifia Murshidabad Shareef, Faisalabad.',
  openGraph: {
    title:       'Qurbani 1447H Registration — Khanqah Saifia',
    description: 'Register your Qurbani participation with Khanqah Saifia Murshidabad Shareef.',
    locale:      'en_PK',
  },
}

export default function QurbaniRoute() {
  return <QurbaniPage />
}
