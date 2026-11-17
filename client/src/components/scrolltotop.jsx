import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Browser scroll position ni remember cheyyakunda chestundi
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // New page open ayinappudu top ki scroll chestundi
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}