import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Theme } from '@radix-ui/themes';
import { Toaster } from 'react-hot-toast';


import "./globals.css"
import '@radix-ui/themes/styles.css';

import { Web3AuthProvider } from "@/components/web3auth/web3auth-context"
import { GlobalProvider } from "@/context/globalContext"

export const metadata: Metadata = {
  title: "TeckDoc",
  metadataBase: new URL("https://docstemplate.vercel.app/"),
  description:
    "TeckDoc is a web3 documentation with token gated AI",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${GeistSans.variable} ${GeistMono.variable} font-regular`}
          suppressHydrationWarning
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Theme>
              <GlobalProvider>
                <Web3AuthProvider>
                  <Navbar />
                  <main className="mx-auto h-auto w-[85vw] sm:container">{children}</main>
                  <Footer />
                  <Toaster />
                </Web3AuthProvider>
              </GlobalProvider>
            </Theme>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
