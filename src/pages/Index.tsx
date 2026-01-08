import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Heart, 
  Stethoscope, 
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  const features = [
    {
      icon: Stethoscope,
      title: 'Intelligent Triage',
      description: 'Our system asks targeted follow-up questions to understand your symptoms better.',
    },
    {
      icon: AlertTriangle,
      title: 'Red Flag Detection',
      description: 'Automatically identifies emergency symptoms that require immediate attention.',
    },
    {
      icon: Shield,
      title: 'Evidence-Based',
      description: 'Recommendations aligned with CDC, WHO, and NHS medical guidelines.',
    },
    {
      icon: Clock,
      title: 'Quick Assessment',
      description: 'Get personalized care guidance in just a few minutes.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Describe Symptoms',
      description: 'Tell us what you are experiencing in your own words.',
    },
    {
      number: '02',
      title: 'Answer Questions',
      description: 'Respond to targeted follow-up questions about your condition.',
    },
    {
      number: '03',
      title: 'Get Guidance',
      description: 'Receive personalized recommendations for next steps.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-medical-blue-light to-background py-20 lg:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-medical-blue/10 blur-3xl" />
            <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-medical-teal/10 blur-3xl" />
          </div>
          
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 shadow-sm">
                <Heart className="h-4 w-4 text-medical-blue" />
                <span className="text-sm font-medium text-muted-foreground">
                  Your Health Companion
                </span>
              </div>
              
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Understand Your Symptoms,{' '}
                <span className="text-medical-blue">Navigate Your Care</span>
              </h1>
              
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Get personalized guidance on your next steps. Our intelligent symptom checker 
                helps you understand when to seek care and what level of attention you need.
              </p>
              
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="medical" size="xl" asChild>
                  <Link to="/chat">
                    Start Symptom Check
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="medical-outline" size="lg" asChild>
                  <Link to="/guidelines">View Guidelines</Link>
                </Button>
              </div>
              
              <p className="mt-6 text-sm text-muted-foreground">
                <AlertTriangle className="mr-1 inline h-4 w-4" />
                Not a substitute for professional medical advice
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                Smart Symptom Assessment
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Our system uses evidence-based protocols to help you make informed decisions.
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:border-medical-blue/30 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-medical-blue-light p-3 transition-colors group-hover:bg-medical-blue/20">
                    <feature.icon className="h-6 w-6 text-medical-blue" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-secondary/30 py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Get guidance in three simple steps
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  {index < steps.length - 1 && (
                    <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-x-1/2 bg-gradient-to-r from-medical-blue to-medical-teal lg:block" />
                  )}
                  <div className="relative rounded-2xl border border-border bg-card p-8 text-center shadow-card">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-medical-blue text-xl font-bold text-primary-foreground">
                      {step.number}
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-medical-blue to-medical-teal p-8 text-center lg:p-12">
              <Activity className="mx-auto mb-4 h-12 w-12 text-primary-foreground/80" />
              <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
                Your Health Information is Private
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
                Your symptom information is processed locally in your browser. 
                We do not store or transmit your health data to external servers.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-primary-foreground">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">No account required</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Client-side processing</span>
                </div>
                <div className="flex items-center gap-2 text-primary-foreground">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">HIPAA-aligned practices</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border bg-card py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Begin your symptom assessment now and get personalized care guidance.
            </p>
            <Button variant="medical" size="xl" className="mt-8" asChild>
              <Link to="/chat">
                Start Symptom Check
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
