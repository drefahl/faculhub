"use client"

import { Button } from "@/components/ui/button"
import { likePost, unlikePost } from "@/lib/api/react-query/like"
import { cn } from "@/lib/utils"
import { Heart } from "lucide-react"
import { useState } from "react"

interface LikeButtonProps {
  postId: number
  initialLikeCount: number
  isAuthenticated: boolean
  initialLiked?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LikeButton({
  postId,
  initialLikeCount = 0,
  initialLiked = false,
  isAuthenticated,
  size = "md",
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleLikeToggle = async () => {
    if (isLoading || !isAuthenticated) return

    setIsLoading(true)
    setIsAnimating(true)

    try {
      if (liked) {
        await unlikePost(postId)
        setLikeCount((prev) => Math.max(0, prev - 1))
        setLiked(false)
      } else {
        await likePost(postId)
        setLikeCount((prev) => prev + 1)
        setLiked(true)
      }
    } finally {
      setIsLoading(false)

      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }
  }

  const sizeClasses = {
    sm: "h-8 px-2 text-xs gap-1",
    md: "h-9 px-3 text-sm gap-1.5",
    lg: "h-10 px-4 text-base gap-2",
  }

  const iconSizes = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleLikeToggle}
      disabled={isLoading || !isAuthenticated}
      className={cn(
        sizeClasses[size],
        "group transition-all",
        liked ? "text-rose-500 hover:text-rose-600 hover:bg-rose-50" : "text-muted-foreground",
        className,
      )}
    >
      <Heart
        className={cn(
          iconSizes[size],
          "transition-all",
          liked ? "fill-current" : "fill-none",
          isAnimating && liked ? "scale-125" : "scale-100",
        )}
      />
      <span>{likeCount > 0 ? likeCount : ""}</span>
    </Button>
  )
}
