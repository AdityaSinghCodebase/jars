import { useEffect, useRef, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

function useUserDocument(uid, defaults) {
  const [data, setData] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const skipNextSave = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const snapshot = await getDoc(doc(db, "users", uid));
        if (cancelled) return;

        if (snapshot.exists()) {
          skipNextSave.current = true;
          setData({ ...defaults, ...snapshot.data() });
        }
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [uid, defaults]);

  useEffect(() => {
    if (loading || error) return;

    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    setDoc(doc(db, "users", uid), data).catch((err) => {
      console.error("Could not save data:", err);
    });
  }, [data, loading, error, uid]);

  return [data, setData, { loading, error }];
}

export default useUserDocument;
