import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TN_HOSPITALS } from "@/data/hospitalsTN";
import { ExternalLink } from "lucide-react";

export default function HospitalLocator() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-display font-bold text-center mb-8">
            Tamil Nadu Hospital Locator
          </h1>

          <div className="space-y-6">
            {TN_HOSPITALS.map((h) => (
              <div
                key={h.name}
                className="p-6 bg-card border rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-xl font-bold">{h.name}</h2>
                <p className="text-muted-foreground">{h.city}</p>

                <div className="mt-2">
                  <p className="text-sm">
                    <span className="font-semibold">Specialties:</span>{" "}
                    {h.specialty.join(", ")}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Type:</span> {h.type}
                  </p>
                  {h.emergency24x7 && (
                    <p className="text-danger font-semibold text-sm">
                      24×7 Emergency Available
                    </p>
                  )}
                </div>

                <a
                  href={h.maps}
                  target="_blank"
                  className="mt-4 inline-flex items-center gap-2 text-medical-blue font-semibold"
                >
                  Open in Google Maps <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
