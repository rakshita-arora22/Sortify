// City-scale route efficiency + fuel/CO2 estimates.
//
// Per TEAM_SYNC_NOTES.md, Crew (Person 4) owns the actual smart-route
// algorithm and writes its result into cityStats.distanceSavedPercent.
// Rather than re-deriving a second, possibly-inconsistent % here, this file
// *reuses* that same number and scales it to a city-wide distance estimate
// using the live bin count. If Person 4 later exposes their raw
// fixed-vs-smart distance numbers directly, swap AVG_LEG_KM math below for
// their real figures — the component API (below) won't need to change.

const AVG_LEG_KM = 1.8; // estimated avg distance between consecutive stops
const LITERS_PER_KM = 0.35; // estimated collection-truck fuel consumption
const CO2_KG_PER_LITER = 2.68; // diesel combustion factor (kg CO2 per liter)

const round1 = (n) => Math.round(n * 10) / 10;

export function estimateRouteEfficiency({ binCount, distanceSavedPercent }) {
  const safePercent = Math.max(0, Math.min(100, distanceSavedPercent || 0));
  const fixedDistanceKm = Math.max(binCount, 1) * AVG_LEG_KM;
  const smartDistanceKm = fixedDistanceKm * (1 - safePercent / 100);
  const savedKm = fixedDistanceKm - smartDistanceKm;

  return {
    fixedDistanceKm: round1(fixedDistanceKm),
    smartDistanceKm: round1(smartDistanceKm),
    savedKm: round1(savedKm),
    percentSaved: round1(safePercent),
  };
}

export function estimateFuelAndCO2(savedKm) {
  const fuelSavedLiters = savedKm * LITERS_PER_KM;
  const co2AvoidedKg = fuelSavedLiters * CO2_KG_PER_LITER;
  return {
    fuelSavedLiters: round1(fuelSavedLiters),
    co2AvoidedKg: round1(co2AvoidedKg),
  };
}
