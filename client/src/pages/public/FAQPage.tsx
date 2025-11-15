import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQPage() {
  const faqs = [
    {
      q: "How do I book a ride?",
      a: "Simply sign up, enter your pickup and destination locations, and confirm your booking. A nearby driver will be matched with you instantly.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept cash, credit/debit cards, and various digital payment methods.",
    },
    {
      q: "How is the fare calculated?",
      a: "Fares are calculated based on distance traveled, with a base fare plus per-kilometer charges. You can see the estimated fare before confirming your ride.",
    },
    {
      q: "Can I cancel a ride?",
      a: "Yes, you can cancel a ride before it's accepted by a driver. However, there may be cancellation limits to ensure fair usage.",
    },
    {
      q: "How do I become a driver?",
      a: "Sign up as a driver, provide your vehicle information and documents, and wait for admin approval. Once approved, you can start accepting rides.",
    },
    {
      q: "Is my personal information safe?",
      a: "Yes, we take data security seriously and use industry-standard encryption to protect your personal information.",
    },
    {
      q: "How do I rate my driver?",
      a: "After completing a ride, you can rate your driver on a scale of 1-5 stars and leave feedback.",
    },
    {
      q: "What if I have an issue during a ride?",
      a: "Use the in-app SOS button for emergencies, or contact our support team immediately through the app.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Find answers to common questions about our service
          </p>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default FAQPage;
