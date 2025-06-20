import "./globals.css"

import "reactjs-tiptap-editor/style.css"
import "prism-code-editor-lightweight/layout.css"
import "prism-code-editor-lightweight/themes/github-dark.css"

import { Providers } from "@/components/providers"
import { GoogleAnalytics } from "@next/third-parties/google"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FaculHub - Sua plataforma universitária",
  description: "Conectando estudantes, compartilhando conhecimento",
  icons: {
    icon: "/favicon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <div className="flex flex-col flex-1">{children}</div>
        </Providers>
      </body>

      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </html>
  )
}
