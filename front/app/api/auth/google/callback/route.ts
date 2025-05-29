import { deleteCookie, getCookie } from "@/lib/utils/cookie.utils"
import { setTokenCookie } from "@/lib/utils/token"
import { redirect } from "next/navigation"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get("token")
  if (!token) {
    return new Response("No token found", { status: 400 })
  }

  await setTokenCookie(token)
  const redirectTo = await getCookie("redirectTo")

  if (redirectTo) {
    await deleteCookie("redirectTo")

    const redirectUrl = new URL(redirectTo)
    redirectUrl.searchParams.set("auth_success", "true")

    return redirect(redirectUrl.toString())
  }

  return redirect("/?auth_success=true")
}
