import SqueezeLoader from "@/components/ui/loading-indicator";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <SqueezeLoader size={60} containerClassName="min-h-full" />
    </div>
  );
}
