import { 
  useGetAdminStats, 
  useListFlights, 
  useListAllBookings,
  useCreateFlight,
  useUpdateFlight,
  useDeleteFlight,
  getListFlightsQueryKey,
  getGetAdminStatsQueryKey
} from "@workspace/api-client-react";
import { useState } from "react";
import { Plane, Users, Ticket, DollarSign, Plus, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const flightSchema = z.object({
  flightNumber: z.string().min(1, "Required"),
  origin: z.string().min(1, "Required"),
  destination: z.string().min(1, "Required"),
  departureTime: z.string().min(1, "Required"),
  arrivalTime: z.string().min(1, "Required"),
  aircraft: z.string().min(1, "Required"),
  seats: z.coerce.number().min(1),
  price: z.coerce.number().min(0),
});

type FlightFormValues = z.infer<typeof flightSchema>;

export default function Admin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'flights' | 'bookings'>('overview');
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [editingFlightId, setEditingFlightId] = useState<number | null>(null);

  const { data: stats } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() }});
  const { data: flights, isLoading: isLoadingFlights } = useListFlights({ query: { queryKey: getListFlightsQueryKey() }});
  const { data: bookings } = useListAllBookings({ query: { queryKey: ["/api/admin/bookings"] }});

  const createFlight = useCreateFlight({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListFlightsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        setIsFlightModalOpen(false);
        toast({ title: "Flight created" });
      }
    }
  });

  const updateFlight = useUpdateFlight({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListFlightsQueryKey() });
        setEditingFlightId(null);
        toast({ title: "Flight updated" });
      }
    }
  });

  const deleteFlight = useDeleteFlight({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListFlightsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        toast({ title: "Flight deleted" });
      }
    }
  });

  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      flightNumber: "AF",
      origin: "",
      destination: "",
      departureTime: new Date().toISOString().slice(0, 16),
      arrivalTime: new Date(Date.now() + 7200000).toISOString().slice(0, 16),
      aircraft: "Boeing 777-300ER",
      seats: 300,
      price: 500
    }
  });

  const handleOpenCreate = () => {
    form.reset({
      flightNumber: "AF",
      origin: "",
      destination: "",
      departureTime: new Date().toISOString().slice(0, 16),
      arrivalTime: new Date(Date.now() + 7200000).toISOString().slice(0, 16),
      aircraft: "Boeing 777-300ER",
      seats: 300,
      price: 500
    });
    setEditingFlightId(null);
    setIsFlightModalOpen(true);
  };

  const handleOpenEdit = (flight: any) => {
    form.reset({
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime.slice(0, 16),
      arrivalTime: flight.arrivalTime.slice(0, 16),
      aircraft: flight.aircraft,
      seats: flight.seats,
      price: flight.price
    });
    setEditingFlightId(flight.id);
    setIsFlightModalOpen(true);
  };

  const onSubmit = (data: FlightFormValues) => {
    const payload = {
      ...data,
      departureTime: new Date(data.departureTime).toISOString(),
      arrivalTime: new Date(data.arrivalTime).toISOString(),
    };
    if (editingFlightId) {
      updateFlight.mutate({ id: editingFlightId, data: payload });
    } else {
      createFlight.mutate({ data: payload });
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 border border-border shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-primary">{value ?? '-'}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen pt-20 bg-muted/30 pb-20">
      <div className="bg-primary text-white py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-semibold">Admin Command Center</h1>
            <p className="text-white/70">Manage flights, bookings, and fleet operations.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full mt-8">
        
        {/* Nav Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button 
            className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'overview' ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground hover:text-primary'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'flights' ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground hover:text-primary'}`}
            onClick={() => setActiveTab('flights')}
          >
            Flight Management
          </button>
          <button 
            className={`pb-4 px-2 font-medium transition-colors ${activeTab === 'bookings' ? 'text-accent border-b-2 border-accent' : 'text-muted-foreground hover:text-primary'}`}
            onClick={() => setActiveTab('bookings')}
          >
            All Bookings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Active Passengers" value={stats?.activePassengers} icon={Users} color="bg-blue-100 text-blue-700" />
            <StatCard title="Total Flights" value={stats?.totalFlights} icon={Plane} color="bg-indigo-100 text-indigo-700" />
            <StatCard title="Total Bookings" value={stats?.totalBookings} icon={Ticket} color="bg-emerald-100 text-emerald-700" />
            <StatCard title="Total Revenue" value={`$${stats?.totalRevenue?.toLocaleString() || 0}`} icon={DollarSign} color="bg-amber-100 text-amber-700" />
            
            <div className="col-span-1 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
               <div className="bg-white p-6 border border-border shadow-sm">
                 <h3 className="font-serif text-lg font-semibold text-primary mb-4">Quick Actions</h3>
                 <button onClick={() => { setActiveTab('flights'); handleOpenCreate(); }} className="w-full bg-primary text-white py-3 font-medium hover:bg-primary/90 flex items-center justify-center gap-2 mb-3">
                   <Plus className="w-4 h-4" /> Schedule New Flight
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Flights Tab */}
        {activeTab === 'flights' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-serif font-semibold text-primary">Flight Schedule</h2>
              
              <Dialog open={isFlightModalOpen} onOpenChange={setIsFlightModalOpen}>
                <DialogTrigger asChild>
                  <button onClick={handleOpenCreate} className="bg-accent text-white px-4 py-2 font-medium flex items-center gap-2 hover:bg-accent/90">
                    <Plus className="w-4 h-4" /> Add Flight
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white border-border rounded-none">
                  <DialogHeader>
                    <DialogTitle className="font-serif text-2xl text-primary">{editingFlightId ? 'Edit Flight' : 'Schedule Flight'}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <FormField control={form.control} name="flightNumber" render={({field}) => (
                          <FormItem><FormLabel>Flight Number</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="origin" render={({field}) => (
                          <FormItem><FormLabel>Origin</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="destination" render={({field}) => (
                          <FormItem><FormLabel>Destination</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="departureTime" render={({field}) => (
                          <FormItem><FormLabel>Departure (UTC)</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="arrivalTime" render={({field}) => (
                          <FormItem><FormLabel>Arrival (UTC)</FormLabel><FormControl><Input type="datetime-local" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <FormField control={form.control} name="aircraft" render={({field}) => (
                          <FormItem><FormLabel>Aircraft</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="seats" render={({field}) => (
                          <FormItem><FormLabel>Total Seats</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="price" render={({field}) => (
                          <FormItem><FormLabel>Price ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                        )} />
                      </div>
                      <button type="submit" className="w-full bg-primary text-white py-3 mt-4" disabled={createFlight.isPending || updateFlight.isPending}>
                        {editingFlightId ? 'Save Changes' : 'Create Flight'}
                      </button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white border border-border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-sm font-medium">Flight</th>
                    <th className="px-4 py-3 text-sm font-medium">Route</th>
                    <th className="px-4 py-3 text-sm font-medium">Time</th>
                    <th className="px-4 py-3 text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-sm font-medium">Booked</th>
                    <th className="px-4 py-3 text-sm font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoadingFlights ? (
                    <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>
                  ) : flights?.map(flight => (
                    <tr key={flight.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-semibold">{flight.flightNumber}</td>
                      <td className="px-4 py-3">{flight.origin} → {flight.destination}</td>
                      <td className="px-4 py-3 text-sm">{format(new Date(flight.departureTime), "MMM dd, HH:mm")}</td>
                      <td className="px-4 py-3">
                        <Select 
                          defaultValue={flight.status} 
                          onValueChange={(val: any) => updateFlight.mutate({ id: flight.id, data: { status: val } })}
                        >
                          <SelectTrigger className="h-8 text-xs w-32 border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="boarding">Boarding</SelectItem>
                            <SelectItem value="departed">Departed</SelectItem>
                            <SelectItem value="arrived">Arrived</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-sm">{flight.bookedSeats} / {flight.seats}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenEdit(flight)} className="p-2 text-muted-foreground hover:text-primary"><Edit2 className="w-4 h-4" /></button>
                          <button 
                            onClick={() => { if(confirm('Delete flight?')) deleteFlight.mutate({ id: flight.id }) }}
                            className="p-2 text-destructive/70 hover:text-destructive"
                          ><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-serif font-semibold text-primary">All Bookings Registry</h2>
            </div>
            <table className="w-full text-left">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium">ID</th>
                  <th className="px-6 py-4 text-sm font-medium">Passenger</th>
                  <th className="px-6 py-4 text-sm font-medium">Flight</th>
                  <th className="px-6 py-4 text-sm font-medium">Class</th>
                  <th className="px-6 py-4 text-sm font-medium">Status</th>
                  <th className="px-6 py-4 text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings?.map(booking => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">#{booking.id}</td>
                    <td className="px-6 py-4 font-medium">{booking.passengerName}</td>
                    <td className="px-6 py-4">{booking.flight?.flightNumber}</td>
                    <td className="px-6 py-4 text-sm capitalize">{booking.seatClass}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{booking.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{format(new Date(booking.createdAt), "MMM dd, yyyy")}</td>
                  </tr>
                ))}
                {!bookings?.length && (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
