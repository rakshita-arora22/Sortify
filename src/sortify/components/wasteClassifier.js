// wasteClassifier.js
// Person 3 (Hemakshi) — AI classification module
//
// Uses plain fetch() to call an existing Gradio Space's REST API directly —
// no extra npm package needed (avoids @gradio/client compatibility issues
// with bundlers/CORS). Just standard browser fetch.
//
// IMPORTANT — VERIFY BEFORE 1:15:
// 1. Pick ONE working space from these (test each in the browser):
//    - "Omkar654/EcoSort-AI"
//    - "Deepakbusa/waste-classifier"
//    - "Bodhisattva-Duduka/RecyclingNetSpace"
//    - "A-I4All/Recycle-AI"
// 2. Every Gradio Space exposes a REST endpoint at:
//      https://<space-name-with-dashes>.hf.space/run/predict
//    e.g. "Omkar654/EcoSort-AI" -> "https://omkar654-ecosort-ai.hf.space/run/predict"
//    Confirm the exact URL by visiting https://huggingface.co/spaces/<space-name>?view=api
//    and copying the "curl" example shown there — update SPACE_API_URL below.
// 3. Test with 2-3 real sample images (not a random parrot photo).

const SPACE_API_URL = "https://omkar654-ecosort-ai.hf.space/run/predict"; // <-- confirm this URL

// The model's 11 raw output classes, mapped to citizen-facing bin categories.
const BIN_MAP = {
  aluminium: "Dry / Recyclable",
  batteries: "Hazardous",
  cardboard: "Dry / Recyclable",
  "disposable plates": "Dry / Non-recyclable",
  glass: "Dry / Recyclable",
  "hard plastic": "Dry / Recyclable",
  paper: "Dry / Recyclable",
  "paper towel": "Wet / Compostable",
  polystyrene: "Dry / Non-recyclable",
  "soft plastics": "Dry / Recyclable (drop-off point)",
  "takeaway cups": "Dry / Non-recyclable",
};

// Convert a File/Blob to a base64 data URL (what Gradio's REST API expects).
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * classifyWasteImage
 * @param {File|Blob} imageFile - image captured/uploaded by the citizen
 * @returns {Promise<{
 *   label: string,
 *   confidence: number,
 *   recommendedBin: string,
 *   allScores: object,
 *   usedFallback: boolean
 * }>}
 */
export async function classifyWasteImage(imageFile) {
  try {
    const base64Image = await fileToBase64(imageFile);

    const response = await fetch(SPACE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [base64Image] }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`API returned ${response.status}`);
    const result = await response.json();

    // Gradio Label output typically looks like:
    // { data: [ { label: "hard plastic", confidences: [{label, confidence}, ...] } ] }
    const data = result?.data?.[0];
    const allScores = data?.confidences
      ? Object.fromEntries(data.confidences.map((c) => [c.label, c.confidence]))
      : data;

    const topLabel = data?.label ?? Object.keys(allScores).sort((a, b) => allScores[b] - allScores[a])[0];
    const confidence = allScores?.[topLabel] ?? 0;

    return {
      label: topLabel,
      confidence,
      recommendedBin: BIN_MAP[topLabel] || "Unclassified — check manually",
      allScores,
      usedFallback: false,
    };
  } catch (err) {
    console.error("Classifier API failed, using fallback:", err);
    // Safety net so the demo never breaks on a flaky connection.
    const fallbackLabel = "hard plastic";
    return {
      label: fallbackLabel,
      confidence: 0.5,
      recommendedBin: BIN_MAP[fallbackLabel],
      allScores: { [fallbackLabel]: 0.5 },
      usedFallback: true,
    };
  }
}
