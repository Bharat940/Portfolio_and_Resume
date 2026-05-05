"use client";

import { useState } from "react";
import { PixelGamepad } from "@/components/icons/PixelGamepad";
import { PixelBird } from "@/components/icons/PixelBird";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "motion/react";

export function MascotGames({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[540px] border-l border-border/30 bg-background/95 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <PixelGamepad className="w-6 h-6 text-primary" />
            Arcade Center
          </SheetTitle>
          <SheetDescription>
            Take a break and play some classic retro games!
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-8 flex flex-col gap-6">
          <div className="p-6 border border-border rounded-xl bg-card hover:border-primary/50 transition-colors cursor-pointer group">
            <h3 className="text-xl font-bold font-mono group-hover:text-primary">Retro Snake</h3>
            <p className="text-sm text-muted-foreground mt-2">The classic flip-phone experience. Eat the pixels, don't crash!</p>
            <Button className="mt-4 w-full" variant="secondary">Launch Snake</Button>
          </div>
          
          <div className="p-6 border border-border rounded-xl bg-card hover:border-primary/50 transition-colors cursor-pointer group">
            <h3 className="text-xl font-bold font-mono group-hover:text-primary">Modified Dino</h3>
            <p className="text-sm text-muted-foreground mt-2">Jump over the obstacles. A developer-themed twist on the classic.</p>
            <Button className="mt-4 w-full" variant="secondary">Launch Dino</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
