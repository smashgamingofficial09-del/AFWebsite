import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useSearch } from "wouter";
import { 
  useListFlights, 
  useCreateBooking, 
  useGetProfile,
  getListFlightsQueryKey,
  getGetProfileQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckCircle2, Plane } from "lucide-react";
import { useState } from "react";
import businessClass from "@assets/Untitled_design_26_1783454590244.png";

const bookingSchema = z.object({
  flightId: z.coerce.number().min(1, "Please select a flight"),
  passengerName: z.string().min(2, "Passenger name is required"),
  seatClass: z.enum(["economy", "business", "first"], {
    required_error: "Please select a cabin class",
  }),
});

type BookingValues = z.infer<typeof bookingSchema>;

export default function Book() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialFlightId = searchParams.get("flightId");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { data: profile } = useGetProfile({ query: { retry: false, queryKey: getGetProfileQueryKey() } });
  
  const { data: flights, isLoading: isLoadingFlights } = useListFlights({
    query: {
      queryKey: getListFlightsQueryKey(),
    }
  });

  const availableFlights = flights?.filter(f => 
    f.status === 'scheduled' || f.status === 'boarding'
  ) || [];

  const createBooking = useCreateBooking({
    mutation: {
      onSuccess: () => {
        setIsSuccess(true);
        // We do not invalidate queries to avoid form reset during transition,
        // user will navigate away anyway
      },
      onError: (error) => {
        toast({
          title: "Booking Failed",
          description: error.message || "An error occurred while booking your flight.",
          variant: "destructive",
        });
      }
    }
  });

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      flightId: initialFlightId ? parseInt(initialFlightId) : 0,
      passengerName: profile?.username || "",
      seatClass: "economy",
    },
  });

  const watchFlightId = form.watch("flightId");
  const selectedFlight = availableFlights.find(f => f.id === watchFlightId);

  const onSubmit = (data: BookingValues) => {
    createBooking.mutate({
      data: {
        flightId: data.flightId,
        passengerName: data.passengerName,
        seatClass: data.seatClass,
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-screen pt-20 bg-background items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-border p-10 text-center shadow-lg">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-3xl font-serif text-primary font-semibold mb-4">Booking Confirmed</h2>
          <p className="text-muted-foreground mb-8">
            Your flight has been successfully booked. You can view your itinerary in your profile.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => setLocation("/profile")}
              className="bg-primary text-white py-3 font-medium tracking-wide hover:bg-primary/90 transition-colors w-full"
            >
              View My Bookings
            </button>
            <button 
              onClick={() => setLocation("/")}
              className="bg-transparent border border-primary text-primary py-3 font-medium tracking-wide hover:bg-primary/5 transition-colors w-full"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div className="lg:col-span-7">
          <div className="mb-10">
            <h1 className="text-4xl font-serif font-semibold text-primary mb-4">Book Your Flight</h1>
            <p className="text-muted-foreground">Select an upcoming flight to secure your seat aboard Air France PTFS.</p>
          </div>

          <div className="bg-white border border-border p-8 shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <FormField
                  control={form.control}
                  name="flightId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-primary font-semibold uppercase tracking-wider text-xs">Select Flight</FormLabel>
                      <Select 
                        onValueChange={(val) => field.onChange(parseInt(val))} 
                        defaultValue={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger className="h-14 border-border rounded-none focus:ring-accent">
                            <SelectValue placeholder="Choose an available flight" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingFlights ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">Loading flights...</div>
                          ) : availableFlights.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">No flights available right now.</div>
                          ) : (
                            availableFlights.map(flight => (
                              <SelectItem key={flight.id} value={flight.id.toString()} className="py-3 cursor-pointer">
                                <div className="flex items-center gap-4 font-medium">
                                  <span className="text-primary">{flight.flightNumber}</span>
                                  <span className="text-muted-foreground font-normal">|</span>
                                  <span>{flight.origin} → {flight.destination}</span>
                                  <span className="text-muted-foreground font-normal ml-2">
                                    {format(new Date(flight.departureTime), "MMM dd, HH:mm")}
                                  </span>
                                </div>
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="passengerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold uppercase tracking-wider text-xs">Passenger Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Roblox Username" className="h-14 rounded-none border-border focus-visible:ring-accent" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="seatClass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary font-semibold uppercase tracking-wider text-xs">Cabin Class</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-14 border-border rounded-none focus:ring-accent">
                              <SelectValue placeholder="Select cabin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="economy" className="py-3">Economy Class</SelectItem>
                            <SelectItem value="business" className="py-3">Business Class</SelectItem>
                            <SelectItem value="first" className="py-3">La Première (First)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-6 border-t border-border">
                  <button 
                    type="submit" 
                    disabled={createBooking.isPending || !watchFlightId}
                    className="w-full bg-primary text-white py-4 font-medium tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {createBooking.isPending ? "Confirming..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-muted p-8 sticky top-32">
            <h3 className="font-serif text-2xl font-semibold text-primary mb-6">Booking Summary</h3>
            
            {selectedFlight ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-border">
                  <div className="text-center">
                    <span className="block text-3xl font-bold text-primary mb-1">{selectedFlight.origin}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Origin</span>
                  </div>
                  <Plane className="w-6 h-6 text-accent" />
                  <div className="text-center">
                    <span className="block text-3xl font-bold text-primary mb-1">{selectedFlight.destination}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Destination</span>
                  </div>
                </div>
                
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Flight Number</span>
                    <span className="font-semibold text-primary">{selectedFlight.flightNumber}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Aircraft</span>
                    <span className="font-semibold text-primary">{selectedFlight.aircraft}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Departure</span>
                    <span className="font-semibold text-primary">{format(new Date(selectedFlight.departureTime), "MMM dd, yyyy HH:mm")} UTC</span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border flex justify-between items-center">
                  <span className="font-serif text-lg text-primary">Total Price</span>
                  <span className="text-2xl font-bold text-primary">${selectedFlight.price.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Plane className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
                <p>Select a flight to view itinerary details.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 relative h-48 overflow-hidden bg-primary shadow-md">
             <img src={businessClass} alt="Business Class Preview" className="w-full h-full object-cover opacity-60" />
             <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-primary/90 to-transparent">
               <h4 className="text-white font-serif font-semibold text-xl mb-1">Upgrade your journey</h4>
               <p className="text-white/80 text-sm">Experience the comfort of our premium cabins.</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
