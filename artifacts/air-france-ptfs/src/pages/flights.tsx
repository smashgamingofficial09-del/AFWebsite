import { useListFlights } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Plane, ArrowRight, Search, Info } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function Flights() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: flights, isLoading } = useListFlights({
    query: {
      queryKey: ["/api/flights"]
    }
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled': return 'bg-secondary text-secondary-foreground border-transparent';
      case 'boarding': return 'bg-amber-500 text-white border-transparent';
      case 'departed': return 'bg-primary text-primary-foreground border-transparent';
      case 'arrived': return 'bg-emerald-600 text-white border-transparent';
      case 'cancelled': return 'bg-destructive text-destructive-foreground border-transparent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, HH:mm");
    } catch {
      return dateString;
    }
  };

  const filteredFlights = flights?.filter(f => 
    f.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-background">
      <div className="bg-primary py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-4">Flight Schedule</h1>
          <p className="text-white/80 max-w-2xl">Browse our active and upcoming flights across the PTFS network. Book a seat to join us in the skies.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
        
        {/* Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by flight number, origin, destination..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
            />
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Info className="w-4 h-4" /> All times in UTC
          </div>
        </div>

        {/* Flights Table */}
        <div className="bg-white border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border text-sm text-primary font-medium tracking-wide">
                  <th className="px-6 py-4">Flight</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Departure</th>
                  <th className="px-6 py-4">Aircraft</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse bg-white">
                      <td className="px-6 py-4"><div className="h-4 bg-muted w-16"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-muted w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-muted w-24"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-muted w-20"></div></td>
                      <td className="px-6 py-4"><div className="h-6 bg-muted w-20 rounded-full"></div></td>
                      <td className="px-6 py-4"><div className="h-8 bg-muted w-24 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredFlights?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                      <Plane className="w-12 h-12 text-muted mx-auto mb-4" />
                      <p className="text-lg font-medium text-primary">No flights found</p>
                      <p>Try adjusting your search criteria</p>
                    </td>
                  </tr>
                ) : (
                  filteredFlights?.map((flight) => (
                    <tr key={flight.id} className="hover:bg-muted/50 transition-colors group">
                      <td className="px-6 py-4 font-semibold text-primary">{flight.flightNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{flight.origin}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <span className="font-medium">{flight.destination}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatTime(flight.departureTime)}
                      </td>
                      <td className="px-6 py-4 text-sm">{flight.aircraft}</td>
                      <td className="px-6 py-4">
                        <Badge className={`${getStatusColor(flight.status)} uppercase tracking-wider text-[10px]`}>
                          {flight.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {flight.status === 'scheduled' || flight.status === 'boarding' ? (
                          <Link 
                            href={`/book?flightId=${flight.id}`}
                            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white text-sm font-medium tracking-wide hover:bg-accent transition-colors disabled:opacity-50"
                          >
                            Book
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground px-4 py-2">Closed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
