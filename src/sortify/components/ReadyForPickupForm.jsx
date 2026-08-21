// ReadyForPickupForm.jsx
// Person 3 (Hemakshi)
//
// Writes to `pickupRequests` via Person 1's addPickupRequest() helper.
// addPickupRequest({ citizenId, wasteType, quantity, ward }) — see
// firestoreHelpers.js. It sets status + timestamp internally, don't pass those.

import { useState } from "react";
import { addPickupRequest } from "../lib/firestoreHelpers";
import { WARDS, WASTE_TYPES, CURRENT_CITIZEN_ID } from "../lib/constants";

export default function ReadyForPickupForm() {
  const [wasteType, setWasteType] = useState(WASTE_TYPES[0]);
  const [quantity, setQuantity] = useState("");
  const [ward, setWard] = useState(WARDS[0]);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!quantity) return;
    setStatus("submitting");

    try {
      await addPickupRequest({
        citizenId: CURRENT_CITIZEN_ID,
        wasteType,
        quantity: Number(quantity),
        ward,
      });

      setStatus("success");
      setQuantity("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320 }}>
      <label>
        Waste type
        <select value={wasteType} onChange={(e) => setWasteType(e.target.value)}>
          {WASTE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      <label>
        Ward
        <select value={ward} onChange={(e) => setWard(e.target.value)}>
          {WARDS.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </label>

      <label>
        Estimated quantity (kg)
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g. 5"
          required
        />
      </label>

      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting..." : "Ready for Pickup"}
      </button>

      {status === "success" && <p>Request sent — the crew has been notified.</p>}
      {status === "error" && <p>Something went wrong. Try again.</p>}
    </form>
  );
}
