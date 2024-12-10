import { useEffect, useState } from 'react'

const useDetectUrlChange = (): string | null => {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (window.location.href) {
      setUrl(window.location.href)
    }
  }, [])
  return url
}

export default useDetectUrlChange
