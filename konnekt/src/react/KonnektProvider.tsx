import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import type { KonnektConfig, KonnektState } from '../types';
import type { KonnektInstance } from '../core/connector';
import { createKonnekt } from '../core/connector';
import { KonnektModal } from './KonnektModal';

export interface KonnektContextValue {
  instance: KonnektInstance;
  state: KonnektState;
}

export const KonnektContext = createContext<KonnektContextValue | null>(null);

interface Props {
  config: KonnektConfig;
  children: React.ReactNode;
}

export function KonnektProvider({ config, children }: Props) {
  const instanceRef = useRef<KonnektInstance | null>(null);

  if (!instanceRef.current) {
    instanceRef.current = createKonnekt(config);
  }

  const instance = instanceRef.current;
  const [state, setState] = useState<KonnektState>(instance.store.getState());

  useEffect(() => {
    return instance.store.subscribe((s) => setState(s));
  }, [instance]);

  useEffect(() => {
    return () => {
      instance.destroy();
    };
  }, [instance]);

  const value = useMemo(() => ({ instance, state }), [instance, state]);

  return (
    <KonnektContext.Provider value={value}>
      {children}
      <KonnektModal theme={config.theme} />
    </KonnektContext.Provider>
  );
}
