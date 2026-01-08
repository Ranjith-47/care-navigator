import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TNGuidelines } from "@/data/tnGuidelines";
import { BookOpen, ExternalLink } from "lucide-react";

export default function TNGuidelinesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl px-4">

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-medical-blue-light px-4 py-2 rounded-full mb-4">
              <BookOpen className="h-4 w-4 text-medical-blue" />
              <span className="text-sm font-medium text-medical-blue">
                Tamil Nadu Health Guidelines
              </span>
            </div>
            <h1 className="text-4xl font-display font-bold">Health Guidelines for Tamil Nadu</h1>
            <p className="mt-3 text-muted-foreground text-lg">
              Seasonal guidance, emergency indicators, and public health recommendations
              tailored to Tamil Nadu.
            </p>
          </div>

          <div className="space-y-6">
            {TNGuidelines.map((item, index) => (
              <div
                key={index}
                className="p-6 border rounded-2xl bg-card shadow hover:shadow-lg transition"
              >
                <h2 className="text-2xl font-bold">{item.title}</h2>
                <p className="text-muted-foreground mt-2">{item.summary}</p>

                <div className="mt-4 space-y-2">
                  {item.actions.map((a, i) => (
                    <p key={i} className="text-sm">
                      • {a}
                    </p>
                  ))}
                </div>

                <a
                  href={item.source}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-medical-blue font-semibold mt-4"
                >
                  View Source <ExternalLink className="h-4 w-4" />
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
