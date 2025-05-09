import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "../ui/sonner"
import { AuthProvider } from "./auth-provider"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"

export async function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <QueryProvider>
          {children}

          {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryProvider>

        <Toaster richColors position="top-center" />
      </AuthProvider>
    </ThemeProvider>
  )
}
