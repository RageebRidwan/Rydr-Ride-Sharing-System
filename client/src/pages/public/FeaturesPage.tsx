import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, MapPin, CreditCard, Star, Bell, Shield } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: Car,
      title: "Easy Booking",
      desc: "Book rides in seconds with our intuitive interface",
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      desc: "Track your ride and driver location in real-time",
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      desc: "Pay with cash, card, or digital wallets",
    },
    {
      icon: Star,
      title: "Driver Ratings",
      desc: "Rate your driver and read reviews from other riders",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      desc: "Get updates about your ride status instantly",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      desc: "Verified drivers and secure payment processing",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Features</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-3xl">
          Discover all the amazing features that make RideBooking the best
          choice for your transportation needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx}>
              <CardHeader>
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
