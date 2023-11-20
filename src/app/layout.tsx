import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MapProvider } from '@/hooks/MapProvider'
import MainMap from '@/components/MainMap'
import { twMerge } from 'tailwind-merge'
import ClientProviders from '@/utils/ClientProviders'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Map Demo',
  description: 'Map Demo by tommyis.me',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={twMerge(inter.className, "bg-white text-base-800")}>
        <Suspense>
          <ClientProviders>
            <div className='absolute w-screen h-screen'>
              <MainMap />
            </div>
            {children}
          </ClientProviders>
        </Suspense>
      </body>
    </html>
  )
}
