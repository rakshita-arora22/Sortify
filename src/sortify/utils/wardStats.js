import { WARDS } from "../lib/constants";
// Deterministic pseudo-trend since there's no historical time-series
// collection this hackathon. Same ward always produces the same arrow/value,
// so the demo doesn't visibly flicker between renders. Swap for a real
// week-over-week comparison if Person 1 adds a snapshot history collection.
function deterministicTrend(seedString) {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const magnitude = Math.abs(hash % 6) + 1; // 1–6
  const direction = hash % 2 === 0 ? "up" : "down";
  return { direction, magnitude };
}

// Builds one stats object per ward from the live bins + citizens collections.
// compliance% is the average citizen segregationScore in that ward (real data).
// contamination% is a simplified inverse proxy (100 - compliance), clearly an
// estimate rather than a separately measured figure — flag this in the UI.
export function computeWardStats(bins, citizens) {
  return WARDS.map((ward) => {
    const wardCitizens = citizens.filter((c) => c.ward === ward);
    const compliance = wardCitizens.length
      ? Math.round(
          wardCitizens.reduce((sum, c) => sum + (c.segregationScore || 0), 0) /
            wardCitizens.length
        )
      : 0;

    const wardBins = bins.filter((b) => b.ward === ward);
    const overflowCount = wardBins.filter((b) => (b.fillLevel || 0) >= 85).length;
    const contamination = Math.max(0, 100 - compliance);
    const trend = deterministicTrend(ward);

    return {
      ward,
      compliance,
      contamination,
      overflowCount,
      binCount: wardBins.length,
      citizenCount: wardCitizens.length,
      trend,
    };
  });
}

export function cityAverageCompliance(wardStats) {
  const withCitizens = wardStats.filter((w) => w.citizenCount > 0);
  if (!withCitizens.length) return 0;
  return Math.round(
    withCitizens.reduce((sum, w) => sum + w.compliance, 0) / withCitizens.length
  );
}

// Hardcoded threshold rules — the "Anomaly / Bottleneck Detection" feature.
// Intentionally simple if/else logic per the MVP scope, not a model.
export function detectAnomalies(wardStats) {
  const cityAvg = cityAverageCompliance(wardStats);
  const alerts = [];

  wardStats.forEach((w) => {
    if (w.citizenCount === 0) return;

    if (w.compliance < 70) {
      const gap = cityAvg - w.compliance;
      alerts.push({
        id: `${w.ward}-compliance`,
        severity: w.compliance < 55 ? "critical" : "warning",
        ward: w.ward,
        message: `${w.ward}: compliance is ${w.compliance}%, ${
          gap > 0 ? `${gap}pts below` : "below"
        } the city average.`,
        suggestedAction: "Schedule a segregation awareness drive with the local society coordinators.",
      });
    }

    if (w.overflowCount >= 3) {
      alerts.push({
        id: `${w.ward}-overflow`,
        severity: w.overflowCount >= 5 ? "critical" : "warning",
        ward: w.ward,
        message: `${w.ward}: ${w.overflowCount} bins are at or above 85% capacity.`,
        suggestedAction: "Add an off-cycle pickup run to this ward before end of day.",
      });
    }
  });

  return alerts.sort((a, b) => (a.severity === "critical" ? -1 : 1));
}
