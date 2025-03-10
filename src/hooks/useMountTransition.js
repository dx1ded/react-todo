import {useState, useEffect} from "react"

export const useMountTransition = (isMounted, unmountDelay) => {
  const [hasTransitionedIn, setHasTransitionedIn] = useState(false)

  useEffect(() => {
    let timeoutId

    if (isMounted && !hasTransitionedIn) {
      setHasTransitionedIn(true)
    } else if (!isMounted && hasTransitionedIn) {
      timeoutId = setTimeout(() => setHasTransitionedIn(false), unmountDelay)
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [unmountDelay, isMounted, hasTransitionedIn])

  return hasTransitionedIn
}
