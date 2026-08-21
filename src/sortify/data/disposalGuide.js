// Predefined lookup list for the Disposal Guide (task 5). Purely static —
// no Firestore dependency. category must be one of WASTE_TYPES from
// lib/constants.js so any color/label logic can share the same mapping.

export const DISPOSAL_GUIDE = [
  { item: "Plastic bottle", category: "recyclable", tip: "Rinse and flatten before disposing." },
  { item: "Milk packet", category: "recyclable", tip: "Rinse out residue, then recycle." },
  { item: "Banana peel", category: "wet", tip: "Compostable — goes in the wet waste bin." },
  { item: "Vegetable peels", category: "wet", tip: "Compostable — goes in the wet waste bin." },
  { item: "Cooked food leftovers", category: "wet", tip: "Wet waste — avoid mixing with plastics." },
  { item: "Battery (AA/AAA)", category: "hazardous", tip: "Never bin with regular waste — drop at a battery collection point." },
  { item: "Car battery", category: "hazardous", tip: "Return to an authorized dealer or hazardous waste facility." },
  { item: "Newspaper", category: "dry", tip: "Keep dry and bundle for recycling." },
  { item: "Cardboard box", category: "dry", tip: "Flatten to save space before recycling." },
  { item: "Glass bottle", category: "recyclable", tip: "Rinse; separate by color if your facility asks." },
  { item: "Tetra pack (juice carton)", category: "recyclable", tip: "Rinse and flatten — accepted at most recycling points." },
  { item: "Plastic bag", category: "dry", tip: "Reuse where possible; many curbside programs don't accept thin film." },
  { item: "Expired medicine", category: "hazardous", tip: "Return to a pharmacy take-back point, don't flush or bin." },
  { item: "CFL / tube light", category: "hazardous", tip: "Contains mercury — take to an e-waste or hazardous drop-off." },
  { item: "Mobile phone", category: "hazardous", tip: "E-waste — drop at a designated e-waste collection drive." },
  { item: "Charger / cable", category: "hazardous", tip: "E-waste — don't bin with household trash." },
  { item: "Egg shells", category: "wet", tip: "Compostable wet waste." },
  { item: "Tea leaves / coffee grounds", category: "wet", tip: "Compostable wet waste." },
  { item: "Aluminium can", category: "recyclable", tip: "Rinse and crush to save space." },
  { item: "Broken ceramic / crockery", category: "dry", tip: "Not recyclable curbside — wrap safely before binning as dry waste." },
];
