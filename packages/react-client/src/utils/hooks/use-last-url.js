import { useEffect, useState } from 'react';
import useDetectUrlChange from '@/utils/hooks/use-detect-url-change';
const useLastUrl = () => {
    const url = useDetectUrlChange();
    const [currentUrl, setCurrentUrl] = useState(null);
    const [lastUrl, setLastUrl] = useState(null);
    useEffect(() => {
        if (url) {
            setLastUrl(currentUrl);
            setCurrentUrl(url);
        }
    }, [url]);
    return lastUrl;
};
export default useLastUrl;
