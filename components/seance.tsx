"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { parseAsInteger, useQueryState } from "nuqs"
import React from "react"
import { parseAsBoolean } from "nuqs"

type Props = {}

export const Seance = (props: Props) => {
  const [id, toggle] = useQueryState("seance", parseAsInteger)

  const isOpen = !!id

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && toggle(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Seance de {"FILM"} à {"CINEMA"}
          </DialogTitle>
          <DialogDescription>
            <p>
              <strong>Date:</strong> {"DATE"}
            </p>
            <p>
              <strong>Heure:</strong> {"HEURE"}
            </p>
            <p>
              <strong>Adresse:</strong> {"ADRESSE"}
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
