import { useEffect, useState } from "react";
import { subscribeToCitizen } from "./firestoreHelpers";
import { CURRENT_CITIZEN_ID } from "./constants";

// Every citizen-facing component that needs "the logged-in user" should use
// this hook instead of calling subscribeToCitizen directly, so there's one
// place to change if CURRENT_CITIZEN_ID's shape ever changes.
//
// Returns { citizen, loading, error }. `citizen` is null while loading AND
// if the doc genuinely doesn't exist yet (e.g. seedData.js hasn't been
// re-run with the citizen-1..citizen-8 fixed ids yet) — check `loading`
// to tell the difference.
export function useCurrentCitizen() {
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToCitizen(CURRENT_CITIZEN_ID, (data) => {
      setCitizen(data);
      setLoading(false);
      if (!data) {
        setError(
          `No citizen doc found for "${CURRENT_CITIZEN_ID}". Ask Person 1 to re-run seedData.js with fixed citizen ids.`
        );
      } else {
        setError(null);
      }
    });
    return unsubscribe;
  }, []);

  return { citizen, loading, error };
}
