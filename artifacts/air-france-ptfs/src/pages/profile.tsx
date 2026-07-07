import { useGetProfile, useListBookings, useCancelBooking, getListBookingsQueryKey } from "@workspace/api-client-react";
import { format } from "date-fns";
import { UserCircle, PlaneTakeoff, Award, Ticket, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: profile, isLoading: isProfileLoading } = useGetProfile({
    query: {
      queryKey: ["/api/profile"]
    }
  });

  const { data: bookings, isLoading: isBookingsLoading } = useListBookings({
    query: {
      queryKey: getListBookingsQueryKey()
    }
  });

  const cancelBooking = useCancelBooking({
    mutation: {
      onSuccess: () => {
        toast({
          title: "Booking Cancelled",
          description: "Your flight reservation has been cancelled.",
        });
        queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
      },
      onError: () => {
        toast({
          title: "Cancellation Failed",
          description: "Could not cancel the booking.",
          variant: "destructive",
        });
      }
    }
  });

  if (isProfileLoading) {
    return (
      <div className="flex flex-col min-h-screen pt-20 bg-background items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 bg-muted rounded-full mb-4"></div>
          <div className="w-48 h-6 bg-muted mb-2"></div>
          <div className="w-32 h-4 bg-muted"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen pt-20 bg-background items-center justify-center text-center px-6">
        <UserCircle className="w-20 h-20 text-muted mx-auto mb-6" />
        <h2 className="text-3xl font-serif text-primary font-semibold mb-4">Not Signed In</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          You need to be signed in to view your profile and manage your bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-background pb-20">
      
      {/* Profile Header */}
      <div className="bg-primary text-white pt-16 pb-24 px-6 relative">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8 relative z-10">
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl shrink-0 overflow-hidden border-4 border-white">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-full h-full text-muted-foreground p-2" />
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            <Badge className="bg-accent hover:bg-accent text-white mb-3 border-none">{profile.role.toUpperCase()}</Badge>
            <h1 className="text-4xl font-serif font-semibold mb-2">{profile.username}</h1>
            <p className="text-white/70 font-light flex items-center justify-center md:justify-start gap-2">
              <Award className="w-4 h-4" /> Member since {format(new Date(profile.memberSince), "MMMM yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 w-full -mt-12 relative z-20">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 shadow-md border border-border flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full text-primary shrink-0">
              <PlaneTakeoff className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-3xl font-bold text-primary">{profile.totalFlights}</span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Flights Flown</span>
            </div>
          </div>
          <div className="bg-white p-6 shadow-md border border-border flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 flex items-center justify-center rounded-full text-accent shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-3xl font-bold text-primary">{bookings?.length || 0}</span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Bookings</span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {profile.bio && (
          <div className="bg-white p-8 border border-border mb-12 shadow-sm">
            <h3 className="font-serif text-xl font-semibold text-primary mb-4">About Me</h3>
            <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Bookings */}
        <div>
          <h3 className="font-serif text-2xl font-semibold text-primary mb-6">My Bookings</h3>
          
          {isBookingsLoading ? (
             <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="h-32 bg-white border border-border animate-pulse"></div>
               ))}
             </div>
          ) : bookings?.length === 0 ? (
            <div className="bg-white border border-border p-12 text-center text-muted-foreground shadow-sm">
              <Ticket className="w-12 h-12 text-muted mx-auto mb-4" />
              <p className="text-lg font-medium text-primary">No bookings found</p>
              <p>You haven't booked any flights yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings?.map(booking => {
                const flight = booking.flight;
                if (!flight) return null;
                
                const isUpcoming = flight.status === 'scheduled' || flight.status === 'boarding';
                
                return (
                  <div key={booking.id} className="bg-white border border-border flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
                    {/* Left: Date & Status */}
                    <div className="bg-muted p-6 flex flex-col justify-center items-center md:w-48 shrink-0 text-center border-b md:border-b-0 md:border-r border-border">
                      <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
                        {format(new Date(flight.departureTime), "MMM dd")}
                      </span>
                      <span className="text-2xl font-bold text-primary mb-3">
                        {format(new Date(flight.departureTime), "HH:mm")}
                      </span>
                      <Badge className={
                        booking.status === 'cancelled' ? 'bg-destructive/10 text-destructive border-transparent' :
                        booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800 border-transparent' : 'bg-secondary/10 text-secondary border-transparent'
                      }>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    {/* Center: Flight details */}
                    <div className="p-6 flex-grow flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-primary">{flight.flightNumber}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{flight.aircraft}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground capitalize">{booking.seatClass} Class</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-lg font-serif mt-2">
                        <span className="font-semibold text-primary">{flight.origin}</span>
                        <PlaneTakeoff className="w-5 h-5 text-accent" />
                        <span className="font-semibold text-primary">{flight.destination}</span>
                      </div>
                    </div>
                    
                    {/* Right: Actions */}
                    <div className="p-6 flex items-center justify-center md:justify-end border-t md:border-t-0 md:border-l border-border bg-gray-50/50">
                      {isUpcoming && booking.status !== 'cancelled' ? (
                        <button
                          onClick={() => cancelBooking.mutate({ id: booking.id })}
                          disabled={cancelBooking.isPending}
                          className="text-destructive text-sm font-medium hover:underline flex items-center gap-1 disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" /> Cancel Booking
                        </button>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">Past Flight</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
