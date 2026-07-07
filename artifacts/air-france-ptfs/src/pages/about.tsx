import { motion } from "framer-motion";
import { Link } from "wouter";
import livery777 from "@assets/Untitled_design_30_1783454590244.png";
import livery777_card from "@assets/Untitled_design_1_1783454590244.png";
import a350takeoff from "@assets/Untitled_design_1783454590243.png";
import a350airport from "@assets/Untitled_design_14_1783454590243.png";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen pt-20 bg-background">
      {/* Header */}
      <section className="py-20 md:py-32 bg-primary text-white text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={livery777} alt="Air France 777" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-semibold mb-6">Our Identity</h1>
          <p className="text-lg md:text-xl font-light text-white/80 leading-relaxed">
            Elevating the virtual aviation experience in PTFS. We are more than an airline; we are a community of aviation enthusiasts dedicated to realism and prestige.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="text-accent font-semibold tracking-widest text-xs uppercase block">Our Mission</span>
            <h2 className="text-3xl font-serif text-primary font-semibold">Excellence in every detail.</h2>
            <p className="text-muted-foreground leading-relaxed">
              Air France PTFS was founded with a singular goal: to bring the sophistication and operational excellence of the real Air France into the Roblox Pilot Training Flight Simulator universe. We strive to provide the most immersive, organized, and professional flight experiences possible.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From the exact pacing of our boarding procedures to the precise flight paths navigated by our captains, every aspect of our operations is designed to mirror reality.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-muted p-10 flex flex-col justify-center border-l-4 border-accent"
          >
            <h3 className="text-2xl font-serif text-primary font-semibold mb-4">Core Values</h3>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-accent font-bold">01.</span>
                <span><strong>Professionalism:</strong> Conducting ourselves with respect and dignity in all interactions.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">02.</span>
                <span><strong>Realism:</strong> Adhering to real-world aviation protocols adapted for the PTFS environment.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-accent font-bold">03.</span>
                <span><strong>Community:</strong> Fostering a welcoming, engaging space for Roblox aviators to grow and learn.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Fleet Showcase */}
      <section className="py-24 bg-muted border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-primary font-semibold mb-4">Our Fleet</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover the aircraft that power our global network across the PTFS skies.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-background group hover:-translate-y-2 transition-transform duration-300 shadow-md">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={livery777_card} alt="Boeing 777" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-serif text-primary font-semibold mb-2">Boeing 777-300ER</h3>
                <p className="text-sm text-muted-foreground mb-4">The backbone of our long-haul fleet, offering unparalleled capacity and range.</p>
                <div className="flex justify-between text-xs text-primary font-medium pt-4 border-t border-border">
                  <span>Range: Long Haul</span>
                  <span>Classes: First, Business, Eco</span>
                </div>
              </div>
            </div>

            <div className="bg-background group hover:-translate-y-2 transition-transform duration-300 shadow-md">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={a350takeoff} alt="Airbus A350" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-serif text-primary font-semibold mb-2">Airbus A350-900</h3>
                <p className="text-sm text-muted-foreground mb-4">Our most modern twin-engine aircraft, setting new standards for virtual comfort.</p>
                <div className="flex justify-between text-xs text-primary font-medium pt-4 border-t border-border">
                  <span>Range: Long Haul</span>
                  <span>Classes: Business, Premium, Eco</span>
                </div>
              </div>
            </div>

            <div className="bg-background group hover:-translate-y-2 transition-transform duration-300 shadow-md">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={a350airport} alt="AirFrench A350 at airport" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-serif text-primary font-semibold mb-2">Concorde (Heritage)</h3>
                <p className="text-sm text-muted-foreground mb-4">Flown on special event days, preserving the legacy of supersonic travel.</p>
                <div className="flex justify-between text-xs text-primary font-medium pt-4 border-t border-border">
                  <span>Range: Transatlantic</span>
                  <span>Classes: Luxury</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staff / Join CTA */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-serif text-primary font-semibold mb-6">Join the Crew</h2>
        <p className="text-muted-foreground mb-10 leading-relaxed">
          Air France PTFS is always looking for dedicated pilots, ground crew, and staff members to elevate our operations. Think you have what it takes to wear the uniform?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/flights" 
            className="bg-primary text-white px-8 py-4 font-medium tracking-wide hover:bg-primary/90 transition-colors"
          >
            Fly with us first
          </Link>
          <a 
            href="https://discord.gg/air-france-ptfs-1378004199266324480"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent border border-primary text-primary px-8 py-4 font-medium tracking-wide hover:bg-primary/5 transition-colors"
          >
            Visit our Discord
          </a>
        </div>
      </section>
    </div>
  );
}
