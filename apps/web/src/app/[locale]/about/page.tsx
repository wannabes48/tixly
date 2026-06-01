import Image from "next/image";
import { Globe, Heart, Shield, Trophy } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1518605368461-1ee7c5320746?auto=format&fit=crop&q=80"
            alt="Stadium lights"
            fill
            className="object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Connecting Fans to <br className="hidden md:block"/> History in the Making.
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
            Tixly was built with a single mission: to provide the most secure, transparent, and seamless ticketing experience for the FIFA World Cup 2026™.
          </p>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-brand-orange uppercase mb-2">Our Vision</h2>
                <h3 className="text-4xl font-bold text-brand-navy mb-4">A World United by Football</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We believe that the magic of the World Cup should be accessible to true fans across the globe, without the stress of fraud or exorbitant hidden fees. Tixly envisions a marketplace where trust is built-in, and the passion for the game takes center stage.
                </p>
              </div>
              
              <div>
                <h2 className="text-sm font-bold tracking-widest text-brand-orange uppercase mb-2">Our Mission</h2>
                <h3 className="text-4xl font-bold text-brand-navy mb-4">Empowering Every Fan</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  By leveraging cutting-edge technology and a rigorous seller verification process, we're democratizing access to the biggest sporting event on the planet. Whether you're traveling across the world or catching a match in your hometown, Tixly is your trusted passport to the stands.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 mt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="https://images.unsplash.com/photo-1508344928928-7137b29de216?auto=format&fit=crop&q=80" alt="Fans cheering" fill className="object-cover" />
                </div>
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="https://images.unsplash.com/photo-1551280857-2b9bbe520442?auto=format&fit=crop&q=80" alt="Soccer ball" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="https://images.unsplash.com/photo-1522778526582-12248ce19b4a?auto=format&fit=crop&q=80" alt="Stadium wide angle" fill className="object-cover" />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                  <Image src="https://images.unsplash.com/photo-1518091043644-c1d44570a2c1?auto=format&fit=crop&q=80" alt="Celebration" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-24 container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-navy">Our Core Values</h2>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Trust First</h3>
            <p className="text-slate-600">Every transaction is protected, every ticket is verified. We do the heavy lifting so you can focus on the game.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-brand-navy/10 rounded-full flex items-center justify-center text-brand-navy">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Global Reach</h3>
            <p className="text-slate-600">Bridging the gap between 48 nations, 16 host cities, and millions of fans. We are truly borderless.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Excellence</h3>
            <p className="text-slate-600">From our customer support to our platform's design, we strive for the highest standard of excellence.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-brand-navy/10 rounded-full flex items-center justify-center text-brand-navy">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">For the Fans</h3>
            <p className="text-slate-600">Built by fans, for fans. We understand the emotional investment you make when following your team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
