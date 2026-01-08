# A React hook that lets you consume a context only within its provider, it throws an error otherwise

## Highlights
- Offers a hook called useSafeContext
- Detects a context used outside its provider
- Same API as use or useContext
- No extra dependencies
- Written in react with typescript
- Typescript support
- Small bundle size

## Install

```sh
    yarn add use-safe-context
```
or
```sh
    npm install use-safe-context
```

## Usage

```typescript
// ---------- ContextProvider.tsx
import {createContext, type PropsWithChildren, useState} from "react";
import {useSafeContext} from 'use-safe-context'

// the initial value of the context should be undefined
const CounterCtx = createContext<number | undefined>(undefined);

// you should export a custom hook that consumes the context (for the error message to be accurate)
export const useCounter = () => useSafeContext(CounterCtx);

// the error message contains the file name (ContextProvider in this case)
// the file name and the ContextProvider name should match
export default function ContextProvider({children}: PropsWithChildren) {
  const [counter, setCounter] = useState(0);

  return <CounterCtx.Provider value={counter}>{children}</CounterCtx.Provider>;
}

// ---------- ConsumerComponent.tsx
import {useCounter} from "./ContextProvider.tsx";

export default function ConsumerComponent() {
  // this will throw an error if the ConsumerComponent is used outside the ContextProvider
  const counter = useCounter();
  // ...
}
```

## Description
A React hook that lets you consume a context only within its provider, it throws an error otherwise. It ensures that 
the component consuming the context should be a descendent of the context provider. In order to do that
(and to display an accurate error message), this hook requires you to follow these steps:
- initialize your context with undefined (eg: createContext(undefined))
- create a provider component and define a consumer hook for the context
- export both the context provider component and the consumer hook from the same file
- use the same name for the file and for the context provider component
- wrap your consumer component within the context provider and you are good to go

The error message is composed based on the browser error stack. This mechanism was chosen to simplify the hook's api,
so you are not required to pass explicitly the provider name and the consumer hook's name. The error message
has the following form:
```
    Uncaught Error: useCounter must be used within ContextProvider
    at useSafeContext (use-safe-context.js?v=766d6ed6:11:138)
    at useCounter (ContextProvider.tsx:8:33)
    at ConsumerComponent (ConsumerComponent.tsx:4:21)
```

The useSafeContext hook uses the "use" hook behind the scenes if it is available, if not it falls back to useContext. It
adds a new layer of safety and offers you an architecture to follow.


## License
MIT




