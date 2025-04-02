import { Toaster } from "../ui/sonner"
import { AuthProvider } from "./auth-provider"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"

export async function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <QueryProvider>{children}</QueryProvider>

        <Toaster richColors position="top-center" />
      </AuthProvider>
    </ThemeProvider>
  )
}
