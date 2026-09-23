import type { Metadata } from 'next'

import './globals.css'
export const metadata: Metadata = {
  title: 'A Special Gift For You 🎁',
  description: 'A heartfelt birthday message just for you.',
  openGraph: {
    title: 'A Special Gift For You 🎁',
    description: 'A heartfelt birthday message just for you.',
    images: [
      {
        url: '/images/share-cover.png', // 👈 تأكد من وجود الصورة بهذا الاسم والامتداد في مجلد images
        width: 1200,
        height: 630,
        alt: 'A Special Gift',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Nunito:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
