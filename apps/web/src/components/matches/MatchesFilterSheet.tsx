'use client';
import * as React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MatchesFilterSidebar } from "./MatchesFilterSidebar";

interface MatchesFilterSheetProps {
  teamOptions: { label: string; value: string; emoji?: string }[];
}

export function MatchesFilterSheet({ teamOptions }: MatchesFilterSheetProps) {
  const [open, setOpen] = React.useState(false);

  const handleApply = () => {
    setOpen(false); // Close sheet when applied
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden flex items-center gap-2 border-gray-300 text-brand-navy rounded-xl">
          <Filter size={16} />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0 overflow-hidden bg-gray-50 flex flex-col">
        <SheetHeader className="p-4 bg-white border-b border-gray-100 shrink-0">
          <SheetTitle className="text-left text-lg font-bold text-brand-navy flex items-center gap-2">
            <Filter size={18} />
            Filters
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="h-full [&>div]:border-none [&>div]:shadow-none [&>div]:bg-transparent [&>div]:p-4">
            <MatchesFilterSidebar teamOptions={teamOptions} onApplyMobile={handleApply} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
