"use client"
import * as React from "react";

export function useMediaQuery(query) {
  const [value, setValue] = React.useState(false);

  React.useEffect(() => {
    const result = matchMedia(query);

    function onChange(event) {
      setValue(event.matches);
    }

    if (result.addEventListener) {
      result.addEventListener("change", onChange);
    } else {
      result.addListener(onChange); // Fallback for older browsers
    }

    setValue(result.matches);

    return () => {
      if (result.removeEventListener) {
        result.removeEventListener("change", onChange);
      } else {
        result.removeListener(onChange); // Fallback for older browsers
      }
    };
  }, [query]);

  return value;
}


