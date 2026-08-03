import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}

/**
 * useInView — lightweight IntersectionObserver hook
 * Returns [ref, isVisible] — attach ref to the element you want to observe.
 * triggerOnce: true means it fires once and never unobserves (most common for reveal animations).
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {}
): [React.RefObject<T>, boolean] {
  const { threshold = 0.15, triggerOnce = true, rootMargin = "0px" } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, triggerOnce, rootMargin]);

  return [ref, isVisible];
}
