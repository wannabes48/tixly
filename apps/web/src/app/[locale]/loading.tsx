import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
      <p className="text-brand-navy font-semibold text-lg animate-pulse">Loading...</p>
    </div>
  );
}
