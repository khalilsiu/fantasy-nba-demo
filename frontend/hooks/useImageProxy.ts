import { useState, useEffect } from "react";

const PROXY_DOMAIN = process.env.NEXT_PUBLIC_PROXY_DOMAIN;

export function useImageProxy(uri: string) {
    const [proxyUri, setProxyUri] = useState('');
    useEffect(() => {
        setProxyUri(PROXY_DOMAIN + '/sig/' + Buffer.from(uri).toString('base64'))
    }, [uri]);
    return proxyUri;
}
