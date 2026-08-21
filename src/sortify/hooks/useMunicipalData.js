import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebaseConfig";
import { subscribeToBins } from "../lib/firestoreHelpers";
import { computeWardStats, cityAverageCompliance, detectAnomalies } from "../utils/wardStats";

export function useMunicipalData() {
  const [bins, setBins] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [cityStats, setCityStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubBins = subscribeToBins(setBins);

    const unsubCitizens = onSnapshot(collection(db, "citizens"), (snap) => {
      setCitizens(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    const unsubStats = onSnapshot(doc(db, "cityStats", "current"), (snap) => {
      setCityStats(snap.exists() ? snap.data() : null);
      setLoading(false);
    });

    return () => {
      unsubBins();
      unsubCitizens();
      unsubStats();
    };
  }, []);

  const wardStats = useMemo(() => computeWardStats(bins, citizens), [bins, citizens]);
  const cityCompliance = useMemo(() => cityAverageCompliance(wardStats), [wardStats]);
  const anomalies = useMemo(() => detectAnomalies(wardStats), [wardStats]);
  const criticalBinCount = useMemo(
    () => bins.filter((b) => (b.fillLevel || 0) >= 80).length,
    [bins]
  );

  return {
    loading,
    bins,
    citizens,
    cityStats,
    wardStats,
    cityCompliance,
    anomalies,
    criticalBinCount,
  };
}