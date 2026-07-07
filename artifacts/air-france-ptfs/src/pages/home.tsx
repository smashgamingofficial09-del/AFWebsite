import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Calendar, Globe, Award, ChevronRight } from "lucide-react";
import heroA350 from "@assets/Untitled_design_11_1783454590243.png";
import concorde from "@assets/Untitled_design_16_1783454590243.png";
import businessClass from "@assets/Untitled_design_19_1783454590244.png";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroA350})` }}
        />
        <div className="absolute inset-0 bg-primary/40 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-white"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-semibold leading-tight mb-6">
              France is in <br />
              <span className="italic text-accent font-light">the air.</span>
            </h1>
            <p className="text-lg md:text-xl font-light text-white/90 mb-10 max-w-lg leading-relaxed">
              Experience the pinnacle of virtual aviation in PTFS. Precision, elegance, and a community of dedicated aviators await.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/book" 
                className="bg-accent text-white px-8 py-4 font-medium tracking-wide hover:bg-accent/90 transition-all flex items-center justify-center gap-2 group shadow-lg"
              >
                Book a Flight
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/flights" 
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 font-medium tracking-wide hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                Flight Schedule
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Booking Teaser / Info Strip */}
      <section className="bg-white py-12 border-b border-border relative -mt-8 z-20 mx-6 md:mx-auto max-w-5xl w-full shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-secondary/10 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-primary mb-2">Global Network</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Connecting major hubs across the PTFS map with scheduled and charter flights.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent/10 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-primary mb-2">Daily Flights</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Consistent flight schedules allowing you to plan your virtual journeys easily.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-primary mb-2">Premium Experience</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Enjoy our renowned First and Business class offerings on long-haul routes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Excellence Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-accent font-semibold tracking-widest text-xs uppercase mb-4 block">The Experience</span>
              <h2 className="text-4xl font-serif text-primary font-semibold mb-6 leading-tight">
                Refined comfort above the clouds.
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Step aboard our fleet and immerse yourself in an atmosphere of calm and sophistication. From the moment you book to the moment you land, every detail is considered.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Our business class cabins offer unprecedented privacy and luxury, bringing the renowned Air France hospitality to the virtual skies of PTFS.
              </p>
              <Link 
                href="/about" 
                className="inline-flex items-center text-primary font-medium border-b border-primary pb-1 hover:text-accent hover:border-accent transition-colors group"
              >
                Discover our fleet
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square md:aspect-[4/3] w-full"
            >
              <img 
                src={businessClass} 
                alt="Air France Business Class" 
                className="object-cover w-full h-full shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-secondary/10 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
          <img 
            src={concorde} 
            alt="Concorde Takeoff" 
            className="object-cover w-full h-full object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-xl">
            <span className="text-secondary font-semibold tracking-widest text-xs uppercase mb-4 block">Our Heritage</span>
            <h2 className="text-4xl font-serif font-semibold mb-6 leading-tight">
              A legacy of aviation excellence.
            </h2>
            <p className="text-white/80 mb-10 leading-relaxed">
              We carry forward the pride of French aviation into the virtual realm. Whether commanding a supersonic legend or navigating our modern wide-bodies, you are part of a rich history.
            </p>
            <Link 
              href="/about" 
              className="bg-white text-primary px-8 py-4 font-medium tracking-wide hover:bg-white/90 transition-all inline-block"
            >
              Read Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
