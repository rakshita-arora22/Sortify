// ReportIssueForm.jsx
// Person 3 (Hemakshi)
//
// Writes to `complaints` via Person 1's reportComplaint() helper.
// reportComplaint({ citizenId, issueType, ward }) — sets status + timestamp
// internally. Person 1's schema wants `ward` (locked string from
// constants.js), not raw lat/lng — dropped the geolocation call.

import { useState } from "react";
import { reportComplaint } from "../lib/firestoreHelpers";
import { WARDS, ISSUE_TYPES, CURRENT_CITIZEN_ID } from "../lib/constants";

export default function ReportIssueForm() {
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [ward, setWard] = useState(WARDS[0]);
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");

    try {
      await reportComplaint({
        citizenId: CURRENT_CITIZEN_ID,
        issueType,
        ward,
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320 }}>
      <label>
        Issue type
        <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
          {ISSUE_TYPES.map((t) => (
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

      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting..." : "Report Issue"}
      </button>

      {status === "success" && <p>Issue reported — you can track it under My Requests & Reports.</p>}
      {status === "error" && <p>Something went wrong. Try again.</p>}
    </form>
  );
}
