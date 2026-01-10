// @ts-ignore
import { Context, use, useContext } from 'react';


const useHook = use ?? useContext;

/**
 * A React hook that lets you consume a context only within its provider, it throws an error otherwise.
 * It ensures that the component consuming the context should be a descendent of the context provider.
 * Uses the "use" hook behind the scenes if it is available, if not it falls back to useContext
 *
 * @example
 * // ---------- ContextProvider.tsx
 * import {createContext, type PropsWithChildren, useState} from "react";
 * import {useSafeContext} from 'use-safe-context'
 *
 * // the initial value of the context should be undefined
 * const CounterCtx = createContext<number | undefined>(undefined);
 *
 * // you should export a custom hook that consumes the context (for the error message to be accurate)
 * export const useCounter = () => useSafeContext(CounterCtx);
 *
 * // the error message contains the file name (ContextProvider in this case)
 * // the file name and the ContextProvider name should match
 * export default function ContextProvider({children}: PropsWithChildren) {
 *   const [counter, setCounter] = useState(0);
 *
 *   return <CounterCtx.Provider value={counter}>{children}</CounterCtx.Provider>;
 * }
 *
 * // ---------- ConsumerComponent.tsx
 * import {useCounter} from "./ContextProvider.tsx";
 *
 * export default function ConsumerComponent() {
 *   // this will throw an error if the ConsumerComponent is used outside the ContextProvider
 *   const counter = useCounter();
 *   // ...
 * }
 *
 * @param context - the context that you want to consume
 * @return the exact same output as use or useContext
 */
export function useSafeContext<T>(context: Context<T | undefined>): T {
    const contextVal = useHook(context);

    if (contextVal === undefined) {
        const errorLine = new Error().stack!.split('at ')[2];
        const hookName = errorLine.split(' ')[0];
        const splitBySlash =  errorLine.split('/');
        const contextProviderName = splitBySlash[splitBySlash.length - 1]!.split('.')[0];
        throw new Error(`${hookName} must be used within ${contextProviderName}`);
    }

    return contextVal;
}