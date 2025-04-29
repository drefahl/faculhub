import { SocketProvider } from "@/components/context/socket-context"

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>
}
