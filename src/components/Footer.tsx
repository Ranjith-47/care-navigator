import { Heart, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-8">
        {/* Disclaimer */}
        <div className="mb-8 rounded-xl bg-warning-light border border-warning/20 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Medical Disclaimer
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                This tool is for informational purposes only and does not constitute medical advice, 
                diagnosis, or treatment. Always seek the advice of your physician or other qualified 
                health provider with any questions you may have regarding a medical condition. 
                Never disregard professional medical advice or delay in seeking it because of 
                something you have read here.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-medical-blue">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                CareNav
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Your trusted companion for symptom assessment and healthcare guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Symptom Check
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Medical Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust Indicators */}
          <div>
            <h4 className="font-display font-semibold text-foreground">Our Standards</h4>
            <ul className="mt-3 space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-medical-teal" />
                Following CDC & WHO Guidelines
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-medical-teal" />
                Privacy-First Approach
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-medical-teal" />
                Evidence-Based Recommendations
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CareNav. For emergency situations, always call 108.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
