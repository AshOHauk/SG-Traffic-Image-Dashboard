import { createContext, createSignal, useContext, JSX } from "solid-js";

interface SearchProviderProps {
    children: JSX.Element;
}

const SearchContext = createContext<{ search: () => string; setSearch: (value: string) => void }>();

export function SearchProvider(props: SearchProviderProps) {
    const [search, setSearch] = createSignal('');

    const store = {
        search,
        setSearch,
    };

    return (
        <SearchContext.Provider value={store}>
            {props.children}
        </SearchContext.Provider>
    );
}
  
  export function useSearch() {
    return useContext(SearchContext);
  }
  