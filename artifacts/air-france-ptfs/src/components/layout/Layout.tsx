import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Plane, Menu, X, UserCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useGetProfile, getGetProfileQueryKey } from "@workspace/api-client-react";

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // In a real app we might handle missing auth here, but we will just silently fail and show login/profile button
  const { data: profile } = useGetProfile({
    query: {
      retry: false,
      queryKey: getGetProfileQueryKey(),
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/flights", label: "Flights" },
    { href: "/book", label: "Book" },
  ];

  if (profile?.role === 'admin') {
    navLinks.push({ href: "/admin", label: "Admin" });
  }

  const isTransparent = location === "/" && !isScrolled;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b",
          isTransparent
            ? "bg-transparent border-transparent text-white"
            : "bg-white border-border/40 text-primary shadow-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 z-50 relative">
            <Plane className={cn("w-6 h-6", isTransparent ? "text-accent" : "text-accent")} />
            <span className="font-serif text-2xl font-semibold tracking-wide">
              AIR FRANCE <span className="font-sans text-sm font-medium opacity-80 tracking-widest ml-1">PTFS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent",
                  location === link.href && !isTransparent
                    ? "text-accent"
                    : location === link.href && isTransparent
                    ? "text-white opacity-100"
                    : isTransparent
                    ? "text-white/80"
                    : "text-primary/70"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <Link
              href="/profile"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent ml-4",
                isTransparent ? "text-white" : "text-primary"
              )}
            >
              <UserCircle className="w-5 h-5" />
              {profile ? profile.username : "Sign In"}
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className={cn("md:hidden z-50 relative p-2", isTransparent && !isMobileMenuOpen ? "text-white" : "text-primary")}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-40 transition-transform duration-300 md:hidden flex flex-col pt-24 px-6 text-primary",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-2xl font-serif py-4 border-b border-border"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/profile"
            className="text-2xl font-serif py-4 flex items-center gap-3"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <UserCircle className="w-6 h-6 text-accent" />
            {profile ? profile.username : "Sign In"}
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col">{children}</main>

      <footer className="bg-primary text-primary-foreground pt-16 pb-8 border-t-4 border-accent">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Plane className="w-6 h-6 text-accent" />
              <span className="font-serif text-2xl font-semibold tracking-wide">
                AIR FRANCE <span className="font-sans text-sm font-medium opacity-80 tracking-widest ml-1">PTFS</span>
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm max-w-md leading-relaxed">
              The premier virtual airline for Pilot Training Flight Simulator on Roblox. 
              Experience the prestige, precision, and passion of French aviation.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-6 font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Our History</Link></li>
              <li><Link href="/flights" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Flight Schedule</Link></li>
              <li><Link href="/book" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Book a Flight</Link></li>
              <li><Link href="/profile" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Passenger Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-lg mb-6 font-semibold">Connect</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Roblox Group</a></li>
              <li><a href="#" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">Discord Server</a></li>
              <li><a href="#" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">PTFS Hub</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-primary-foreground/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} Air France PTFS. All rights reserved. Not affiliated with the real Air France.</p>
          <p>Built for the Roblox PTFS Community</p>
        </div>
      </footer>
    </div>
  );
}
