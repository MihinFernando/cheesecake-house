import { Playfair_Display, Montserrat } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', weight: ['600','700'] })
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans', weight: ['400','500','600','700'] })

export const metadata = {
  title: 'The Cheesecake House | Artisanal Cheesecakes',
  description: 'Handcrafted premium cheesecakes baked fresh daily. Available for delivery in Colombo & suburbs.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${montserrat.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}