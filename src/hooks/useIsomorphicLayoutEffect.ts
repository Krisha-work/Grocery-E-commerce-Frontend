'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * A hook that uses useLayoutEffect on the client side and useEffect during SSR
 * to prevent "useLayoutEffect does nothing on the server" warnings
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;