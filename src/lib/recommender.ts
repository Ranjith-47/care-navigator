// -------------------------------------------------------------
// Tamil Nadu Hospital Recommendation Engine (Rule-Based + GPS)
// -------------------------------------------------------------
import { calculateDistance } from "@/lib/location";

export interface Hospital {
  name: string;
  city: string;
  specialty: string[];
  emergency24x7: boolean;
  maps: string;
  lat: number;
  lng: number;
  distance?: number;
}

export interface HospitalRecommendationResult {
  hospitals: Hospital[];
  fallback?: boolean;
  mapsSearch?: string;
}

// -------------------------------------------------------------
// GPS-based Hospital Ranking
// -------------------------------------------------------------
export function recommendNearestHospitals(userLat: number, userLng: number) {
  let allHospitals: Hospital[] = [];

  Object.values(HOSPITALS).forEach((list) => {
    allHospitals.push(...list);
  });

  // Add distance to each hospital
  allHospitals = allHospitals.map(h => ({
    ...h,
    distance: calculateDistance(userLat, userLng, h.lat, h.lng),
  }));

  // Sort nearest first
  allHospitals.sort((a, b) => a.distance! - b.distance!);

  return allHospitals.slice(0, 3);
}

// -------------------------------------------------------------
// 1) Hospital Database with Coordinates (Tamil Nadu)
// -------------------------------------------------------------

const HOSPITALS: Record<string, Hospital[]> = {
  cardiac: [
    {
      name: "Rajiv Gandhi Government General Hospital (RGGGH)",
      city: "Chennai",
      specialty: ["Cardiology", "Emergency", "Trauma"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/7V8uFbW6ST62",
      lat: 13.0827,
      lng: 80.2707,
    },
    {
      name: "Apollo Hospitals – Greams Road",
      city: "Chennai",
      specialty: ["Cardiology", "ICU"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/J6Lqo7f7mPR2",
      lat: 13.0604,
      lng: 80.2496,
    }
  ],

  respiratory: [
    {
      name: "Government Stanley Medical College Hospital",
      city: "Chennai",
      specialty: ["Respiratory", "Emergency", "Trauma"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/TvYXUQdQL8L2",
      lat: 13.1045,
      lng: 80.2780,
    },
    {
      name: "Government Rajaji Hospital",
      city: "Madurai",
      specialty: ["Respiratory", "General Medicine"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/nJ99mEwDv7S2",
      lat: 9.9196,
      lng: 78.1198,
    }
  ],

  neurological: [
    {
      name: "Institute of Neurosurgery – RGGGH",
      city: "Chennai",
      specialty: ["Neurology", "Neurosurgery"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/7V8uFbW6ST62",
      lat: 13.0827,
      lng: 80.2707,
    },
    {
      name: "KMCH – Kovai Medical Center & Hospital",
      city: "Coimbatore",
      specialty: ["Neurology", "ICU"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/Ccqo4BktB8M2",
      lat: 11.0210,
      lng: 76.9500,
    }
  ],

  trauma: [
    {
      name: "Stanley Medical College – Trauma Care",
      city: "Chennai",
      specialty: ["Trauma", "Emergency"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/TvYXUQdQL8L2",
      lat: 13.1045,
      lng: 80.2780,
    },
    {
      name: "Kilpauk Medical College Hospital",
      city: "Chennai",
      specialty: ["Trauma", "Ortho"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/HZ73xU8WJ8m",
      lat: 13.0797,
      lng: 80.2378,
    }
  ],

  gastro: [
    {
      name: "Institute of Gastroenterology – Stanley Hospital",
      city: "Chennai",
      specialty: ["Gastroenterology"],
      emergency24x7: false,
      maps: "https://goo.gl/maps/TvYXUQdQL8L2",
      lat: 13.1045,
      lng: 80.2780,
    },
    {
      name: "MIOT Hospitals",
      city: "Chennai",
      specialty: ["Gastro", "General Medicine"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/wcDe8aikon92",
      lat: 13.0101,
      lng: 80.1910,
    }
  ],

  pediatric: [
    {
      name: "Institute of Child Health (ICH), Egmore",
      city: "Chennai",
      specialty: ["Pediatrics", "Emergency"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/75XGQhF7A4q",
      lat: 13.0735,
      lng: 80.2570,
    },
    {
      name: "CMC Vellore",
      city: "Vellore",
      specialty: ["Pediatric", "General"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/3kUQev2w4pS2",
      lat: 12.9245,
      lng: 79.1353,
    }
  ],

  general: [
    {
      name: "Government General Hospital – Coimbatore",
      city: "Coimbatore",
      specialty: ["General Medicine", "Emergency"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/k4NnJcY8DS12",
      lat: 11.0168,
      lng: 76.9558,
    },
    {
      name: "Government Rajaji Hospital – Madurai",
      city: "Madurai",
      specialty: ["General", "Emergency"],
      emergency24x7: true,
      maps: "https://goo.gl/maps/nJ99mEwDv7S2",
      lat: 9.9196,
      lng: 78.1198,
    }
  ]
};

// -------------------------------------------------------------
// Symptom → Specialty Mapping
// -------------------------------------------------------------
const CATEGORY_TO_SPECIALTY: Record<string, string> = {
  respiratory: "respiratory",
  infection: "general",
  neurological: "neurological",
  gastro: "gastro",
  "general-pain": "general",
  general: "general",
  chest: "cardiac",
  injury: "trauma",
};

// -------------------------------------------------------------
// Rule-Based Recommendation Engine
// -------------------------------------------------------------
export function recommendHospitals(
  category: string,
  severity: number
): HospitalRecommendationResult {
  const specialty = CATEGORY_TO_SPECIALTY[category] || "general";

  if (!HOSPITALS[specialty]) {
    return {
      hospitals: [],
      fallback: true,
      mapsSearch: `https://www.google.com/maps/search/hospitals+near+me`,
    };
  }

  let ranked = [...HOSPITALS[specialty]];

  if (severity >= 8) {
    ranked = ranked.sort((a, b) =>
      Number(b.emergency24x7) - Number(a.emergency24x7)
    );
  }

  return {
    hospitals: ranked.slice(0, 3),
  };
}
