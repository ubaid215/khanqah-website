import type { Metadata } from 'next'
import QurbaniThanksPage from '@/features/components/QurbaniThanksPage'

export const metadata: Metadata = {
  title:       'Qurbani 1446H — Jazakallah Khayran | Khanqah Saifia',
  description: 'Alhamdulillah. 1909 families received Qurbani meat this Eid ul-Adha through Khanqah Saifia Murshidabad Shareef. May Allah accept from all.',
  openGraph: {
    title:       'Qurbani 1446H Complete — Khanqah Saifia',
    description: '1909 houses served. May Allah accept from all.',
    locale:      'en_PK',
  },
}

export default function QurbaniRoute() {
  return <QurbaniThanksPage />
}
