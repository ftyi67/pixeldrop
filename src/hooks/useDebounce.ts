import { useState, useEffect } from 'react';

/**
 * useDebounce hook
 * Delays updating the debounced value until after the specified delay (default 500ms)
 * has passed since the last keystroke, preventing spamming API requests on every input change.
 *
 * @param value The raw input value to debounce
 * @param delay Time in milliseconds to wait before updating (default 500ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
