import { ExternalLink, BookOpen, Shield, Heart, AlertTriangle, Phone } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Guidelines = () => {
  // ------------------------------
  // INDIA + TAMIL NADU GUIDELINES
  // ------------------------------
  const guidelines = [
    {
      organization: "National Health Portal (NHP) – Government of India",
      description:
        "Official government portal providing verified health information, disease symptoms, treatment guidelines, and emergency care details for Indian citizens.",
      links: [
        { title: "Diseases & Symptoms A–Z", url: "https://www.nhp.gov.in/health-a-z" },
        { title: "Emergency Medical Services", url: "https://www.nhp.gov.in/ems" },
      ],
      color: "medical-blue",
    },
    {
      organization: "Tamil Nadu Health & Family Welfare Department",
      description:
        "State health authority responsible for public healthcare services, medical schemes, vaccinations, and emergency care across Tamil Nadu.",
      links: [
        { title: "TN Health Official Website", url: "https://tnhealth.tn.gov.in/" },
        { title: "TN Government Hospitals List", url: "https://tnhealth.tn.gov.in/tngovin/dph/Hospitals_list.php" },
      ],
      color: "medical-green",
    },
    {
      organization: "AIIMS – All India Institute of Medical Sciences",
      description:
        "India’s premier medical institute offering expert-backed clinical guidelines, emergency department procedures, and patient care recommendations.",
      links: [
        { title: "AIIMS Patient Care Guidelines", url: "https://www.aiims.edu/en/patient-care.html" },
        { title: "AIIMS Emergency Info", url: "https://www.aiims.edu/en/emergency.html" },
      ],
      color: "medical-blue",
    },
    {
      organization: "World Health Organization (WHO)",
      description:
        "Global health authority providing international medical guidelines, disease data, and emergency response recommendations.",
      links: [
        { title: "Health Topics", url: "https://www.who.int/health-topics" },
        { title: "Global Health Emergencies", url: "https://www.who.int/emergencies" },
      ],
      color: "medical-teal",
    },
    {
      organization: "Ayushman Bharat Digital Mission (ABDM)",
      description:
        "India’s national digital health ecosystem offering Health ID, online records, and verified medical information.",
      links: [
        { title: "Health ID & Services", url: "https://healthid.ndhm.gov.in" },
        { title: "ABDM Portal", url: "https://abdm.gov.in/" },
      ],
      color: "medical-blue",
    }
  ];

  // ------------------------------
  // TAMIL NADU EMERGENCY CONTACTS
  // ------------------------------
  const emergencyInfo = [
    {
      icon: Phone,
      title: "Emergency Medical Services (India)",
      content: "Call 108 for ambulance & life-threatening emergencies",
    },
    {
      icon: Heart,
      title: "Tamil Nadu Health Helpline",
      content: "Call 104 for medical queries & mental health assistance",
    },
    {
      icon: AlertTriangle,
      title: "Tamil Nadu Poison Control",
      content: "Call 1800-425-0009 for poisoning emergencies (24×7)",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 lg:py-20">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-medical-blue-light px-4 py-2">
              <BookOpen className="h-4 w-4 text-medical-blue" />
              <span className="text-sm font-medium text-medical-blue">Medical References</span>
            </div>

            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Medical Guidelines & Resources
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Our recommendations are based on trusted health organizations across India and Tamil Nadu.
            </p>
          </div>

          {/* Emergency Contacts */}
          <div className="mx-auto mt-12 max-w-4xl">
            <div className="rounded-2xl border-2 border-danger/30 bg-danger-light p-6">
              <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-foreground">
                <AlertTriangle className="h-6 w-6 text-danger" />
                Emergency Contacts (Tamil Nadu)
              </h2>

              <div className="grid gap-4 sm:grid-cols-3">
                {emergencyInfo.map((item) => (
                  <div key={item.title} className="rounded-xl bg-card p-4">
                    <item.icon className="mb-2 h-6 w-6 text-danger" />
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="mx-auto mt-12 max-w-4xl space-y-6">
            {guidelines.map((guide) => (
              <div
                key={guide.organization}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  
                  <div className={`rounded-xl bg-${guide.color}-light p-3`}>
                    <Shield className={`h-6 w-6 text-${guide.color}`} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {guide.organization}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{guide.description}</p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {guide.links.map((link) => (
                        <a
                          key={link.title}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 
                                     text-sm font-medium text-secondary-foreground transition-colors 
                                     hover:bg-medical-blue-light hover:text-medical-blue"
                        >
                          {link.title}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-sm text-muted-foreground">
              This information is for general awareness only and should not replace advice from a qualified doctor. 
              For medical emergencies, call 108 immediately. Always consult a healthcare professional for diagnosis 
              and treatment.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Guidelines;
