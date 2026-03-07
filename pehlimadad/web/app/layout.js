import './globals.css';

const BASE_URL = 'https://pehlimadad.in';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'PehliMadad — AI Health Emergency Triage on WhatsApp',
  description:
    'Voice-first AI health emergency triage for rural India. Send a WhatsApp voice note, get instant triage guidance in your language. Powered by Amazon Bedrock.',
  keywords: [
    'AI health triage', 'WhatsApp bot', 'rural India', 'emergency triage',
    'Amazon Bedrock', 'Hindi health bot', 'AI for Bharat',
  ],
  openGraph: {
    title: 'PehliMadad — AI Health Emergency Triage on WhatsApp',
    description:
      'AI-powered health triage on WhatsApp for 600M+ rural Indians. 10 languages. Voice-first. Amazon Bedrock. No app needed.',
    url: BASE_URL,
    siteName: 'PehliMadad',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PehliMadad — AI Health Emergency Triage on WhatsApp',
      },
    ],
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PehliMadad — AI Health Emergency Triage on WhatsApp',
    description:
      'AI-powered health triage on WhatsApp for rural India. Voice-first, 10 languages, Amazon Bedrock.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
