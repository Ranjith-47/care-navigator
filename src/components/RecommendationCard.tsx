import { AlertTriangle, Stethoscope, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const levelStyles = {
  "urgent": {
    icon: AlertTriangle,
    color: "text-danger",
    bg: "bg-danger-light"
  },
  "teleconsult": {
    icon: Stethoscope,
    color: "text-medical-blue",
    bg: "bg-medical-blue-light"
  },
  "self-care": {
    icon: Heart,
    color: "text-green-600",
    bg: "bg-green-100"
  }
};

const RecommendationCard = ({ recommendation, onRestart }) => {
  if (!recommendation) return null; // prevents crash

  const { level, title, description, actions = [] } = recommendation;
  const Icon = levelStyles[level]?.icon || Heart;
  const iconColor = levelStyles[level]?.color || "text-foreground";
  const bgColor = levelStyles[level]?.bg || "bg-secondary";

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-md space-y-4">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* ACTIONS LIST — SAFE EVEN IF EMPTY */}
      {actions.length > 0 && (
        <ul className="list-disc pl-5 space-y-1">
          {actions.map((action, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              {action}
            </li>
          ))}
        </ul>
      )}

      {/* Urgent: Call 108; Otherwise Restart */}
      {level === "urgent" ? (
        <a href="tel:108" className="w-full block">
          <Button className="w-full mt-3" variant="destructive">
            Call 108 (Emergency)
          </Button>
        </a>
      ) : (
        <Button className="w-full mt-3" onClick={onRestart}>
          Restart Assessment
        </Button>
      )}
    </div>
  );
};

export default RecommendationCard;
