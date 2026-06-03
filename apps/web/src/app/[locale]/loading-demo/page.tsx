import SqueezeLoader from "@/components/ui/loading-indicator";

export default function DemoOne() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-12 bg-slate-50 py-12">
      <h1 className="text-3xl font-bold text-brand-navy">SqueezeLoader Variations</h1>
      
      {/* Default loader */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Default</h2>
        <SqueezeLoader containerClassName="bg-transparent" />
      </div>
      
      {/* Alternative configurations */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Large, Custom Colors</h2>
        <SqueezeLoader 
          size={80} 
          color1="#9b59b6" 
          color2="#f39c12" 
          spinDuration={8} 
          squeezeDuration={2}
          containerClassName="bg-transparent"
        />
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Small, Fast Spin</h2>
        <SqueezeLoader 
          size={40} 
          color1="#2ecc71" 
          color2="#e67e22" 
          spinDuration={3} 
          squeezeDuration={1.5}
          containerClassName="bg-gray-900 rounded-xl p-8"
        />
      </div>
      
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Extra Large, Slow</h2>
        <SqueezeLoader 
          size={100} 
          color1="#1abc9c" 
          color2="#c0392b" 
          spinDuration={15} 
          squeezeDuration={4}
          containerClassName="bg-transparent"
        />
      </div>
    </div>
  );
}
