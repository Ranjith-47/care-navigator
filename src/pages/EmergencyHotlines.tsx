import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, AlertTriangle } from "lucide-react";

const hotlines = [
  { number: "108", description: "Medical Emergency Helpline" },
  { number: "104", description: "Tamil Nadu Health Helpline" },
  { number: "1091", description: "Women Helpline" },
  { number: "181", description: "Women & Child Helpline" },
  { number: "100", description: "Police" },
  { number: "101", description: "Fire & Rescue" },
  { number: "1800-425-0009", description: "Poison Control (TN)" },
];

export default function EmergencyHotlines() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-display font-bold text-center mb-8">
            Tamil Nadu Emergency Hotlines
          </h1>

          <div className="grid gap-6">
            {hotlines.map((h) => (
              <div
                key={h.number}
                className="p-6 border rounded-xl bg-card shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <Phone className="text-danger h-6 w-6" />
                  <h2 className="text-xl font-bold">{h.number}</h2>
                </div>
                <p className="text-muted-foreground mt-2">{h.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            For life-threatening emergencies, call <span className="font-bold">108</span> immediately.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
