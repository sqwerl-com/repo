import { useEffect, useState } from 'react'
import useDetectUrlChange from 'utils/hooks/use-detect-url-change'

const useLastUrl = (): string | null => {
  const url = useDetectUrlChange()
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [lastUrl, setLastUrl] = useState<string | null>(null)
  useEffect(() => {
    if (url) {
      setLastUrl(currentUrl)
      setCurrentUrl(url)
    }
  }, [url])
  return lastUrl
}

export default useLastUrl
