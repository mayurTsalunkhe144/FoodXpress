import { createContext, useRef } from 'react'

export const CacheContext = createContext()

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function CacheProvider({ children }) {
  const cacheRef = useRef({})
  const loadingRef = useRef({})
  const timestampRef = useRef({})

  const getCache = (key) => {
    const timestamp = timestampRef.current[key]
    if (timestamp && Date.now() - timestamp > CACHE_TTL) {
      delete cacheRef.current[key]
      delete timestampRef.current[key]
      return null
    }
    return cacheRef.current[key]
  }
  
  const setCacheData = (key, data) => {
    cacheRef.current[key] = data
    timestampRef.current[key] = Date.now()
    loadingRef.current[key] = false
  }

  const isLoading = (key) => loadingRef.current[key]
  
  const setLoading = (key, value) => {
    loadingRef.current[key] = value
  }

  const clearCache = (key) => {
    delete cacheRef.current[key]
    delete loadingRef.current[key]
    delete timestampRef.current[key]
  }

  return (
    <CacheContext.Provider value={{ getCache, setCache: setCacheData, isLoading, setLoading, clearCache }}>
      {children}
    </CacheContext.Provider>
  )
}
