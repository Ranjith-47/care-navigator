import { MapPin, Hospital, ShieldAlert, ExternalLink, Route } from "lucide-react";

interface HospitalData {
  name: string;
  city: string;
  specialty: string[];
  emergency24x7: boolean;
  maps: string;
  distance?: number; // Optional for GPS results
}

interface Props {
  hospitals: HospitalData[];
  title?: string;
}

const HospitalRecommendationCard = ({ hospitals, title }: Props) => {
  if (!hospitals || hospitals.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          No specific hospitals found. Try searching:{" "}
          <a
            href="https://www.google.com/maps/search/hospitals+near+me"
            target="_blank"
            className="text-medical-blue underline"
          >
            hospitals near me
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Title (GPS / Rule-Based) */}
      {title && (
        <h2 className="font-display text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Hospital className="h-6 w-6 text-medical-blue" />
          {title}
        </h2>
      )}

      {hospitals.map((hospital, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-medical-blue/30 bg-medical-blue-light/10 p-5 shadow-card hover:shadow-lg transition-all"
        >
          {/* Hospital Header */}
          <div className="flex items-center gap-3">
            <Hospital className="h-7 w-7 text-medical-blue" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {hospital.name}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {hospital.city}
              </p>
            </div>
          </div>

          {/* Distance (GPS only) */}
          {hospital.distance !== undefined && (
            <p className="mt-2 flex items-center gap-2 text-medical-blue font-medium text-sm">
              <Route className="h-4 w-4" />
              {hospital.distance.toFixed(1)} km away
            </p>
          )}

          {/* Specialties */}
          <div className="mt-3">
            <p className="text-sm font-medium text-muted-foreground">Specialties:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {hospital.specialty.map((spec, index) => (
                <span
                  key={index}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Emergency Badge */}
          {hospital.emergency24x7 && (
            <div className="mt-3 flex items-center gap-1 text-danger font-medium">
              <ShieldAlert className="h-4 w-4" />
              24×7 Emergency Available
            </div>
          )}

          {/* Google Maps Button */}
          <a
            href={hospital.maps}
            target="_blank"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-medical-blue px-4 py-2 text-sm text-primary-foreground font-medium hover:bg-medical-blue-dark transition"
          >
            Open in Google Maps
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      ))}
    </div>
  );
};

export default HospitalRecommendationCard;
