"use client";

import type { EmotionCache, Options as OptionsOfCreateCache } from "@emotion/cache";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { CacheProvider as DefaultCacheProvider } from "@emotion/react";
import * as React from "react";

// This implementation is taken from the MUI material-ui-nextjs-v14-app-router-example
// It handles the integration of Emotion with Next.js App Router's SSR

export type NextAppDirEmotionCacheProviderProps = {
    /** This is the options passed to createCache() from 'import createCache from "@emotion/cache"' */
    options: Omit<OptionsOfCreateCache, "insertionPoint">;
    /** By default <CacheProvider /> from 'import { CacheProvider } from "@emotion/react"' */
    CacheProvider?: (props: {
        value: EmotionCache;
        children: React.ReactNode;
    }) => React.JSX.Element | null;
    children: React.ReactNode;
};

// Adapted for Next.js 15+ (React 19)
export function NextAppDirEmotionCacheProvider(props: NextAppDirEmotionCacheProviderProps) {
    const { options, CacheProvider = DefaultCacheProvider, children } = props;

    const [registry] = useState(() => {
        const cache = createCache(options);
        cache.compat = true;
        const prevInsert = cache.insert;
        let inserted: string[] = [];
        cache.insert = (...args) => {
            const [selector, serialized] = args;
            if (cache.inserted[serialized.name] === undefined) {
                inserted.push(serialized.name);
            }
            return prevInsert(...args);
        };
        const flush = () => {
            const prevInserted = inserted;
            inserted = [];
            return prevInserted;
        };
        return { cache, flush };
    });

    useServerInsertedHTML(() => {
        const names = registry.flush();
        if (names.length === 0) {
            return null;
        }
        let styles = "";
        for (const name of names) {
            styles += registry.cache.inserted[name];
        }
        return (
            <style
                key={registry.cache.key}
                data-emotion={`${registry.cache.key} ${names.join(" ")}`}
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        );
    });

    return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}
