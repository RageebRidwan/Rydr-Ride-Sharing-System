import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Award, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">About RideBooking</h1>
            <p className="text-lg text-muted-foreground mb-12">
              We're on a mission to revolutionize urban transportation by
              connecting riders with drivers in the most efficient, safe, and
              affordable way possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <Target className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To provide seamless, reliable, and affordable ride-booking
                    services that enhance urban mobility and empower both riders
                    and drivers.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Globe className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    To become the most trusted transportation platform globally,
                    setting new standards for safety, efficiency, and customer
                    satisfaction.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Our Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Over 10,000+ active users including riders and drivers who
                    trust us for their daily commute and transportation needs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Safety first, transparency, innovation, and community
                    empowerment are at the core of everything we do.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded in 2024, RideBooking emerged from a simple idea:
                transportation should be accessible, affordable, and reliable
                for everyone. Our founders experienced firsthand the challenges
                of urban mobility and decided to create a solution that benefits
                both riders and drivers.
              </p>
              <p className="text-muted-foreground mb-4">
                Today, we operate across multiple cities, connecting thousands
                of riders with professional drivers every day. Our platform uses
                advanced technology to ensure quick matching, fair pricing, and
                safe rides.
              </p>
              <p className="text-muted-foreground">
                As we continue to grow, we remain committed to our founding
                principles: putting our community first, maintaining the highest
                safety standards, and constantly innovating to improve the
                ride-booking experience.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
