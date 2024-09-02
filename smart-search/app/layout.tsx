import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"
import { Web3AuthProvider } from "@/components/web3auth/web3auth-context"
import { GlobalProvider } from "@/context/globalContext"

export const metadata: Metadata = {
  title: "Docs stater template",
  metadataBase: new URL("https://docstemplate.vercel.app/"),
  description:
    "This comprehensive documentation template, crafted with Next.js and available as open-source, delivers a sleek and responsive design, tailored to meet all your project documentation requirements.",
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
            <GlobalProvider>
              <Web3AuthProvider>
                <Navbar />
                <main className="mx-auto h-auto w-[85vw] sm:container">{children}</main>
                <Footer />
              </Web3AuthProvider>
            </GlobalProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
