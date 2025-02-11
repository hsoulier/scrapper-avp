import { cn } from "@/lib/utils"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import type { ReactNode } from "react"

export const Tooltip = ({
  children,
  content,
  className,
}: {
  children: ReactNode
  content: ReactNode
  className?: string
}) => (
  <TooltipPrimitive.Provider>
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className={cn("select-none rounded leading-none", className)}
          sideOffset={5}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
)
