import { useEffect, useState } from 'react';
const useDetectUrlChange = () => {
    const [url, setUrl] = useState(null);
    useEffect(() => {
        if (window.location.href) {
            setUrl(window.location.href);
        }
    }, []);
    return url;
};
export default useDetectUrlChange;
