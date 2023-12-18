import { useEffect, useState } from "react";

export const useMounted = (): { hasMounted: boolean } => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return { hasMounted };
};
