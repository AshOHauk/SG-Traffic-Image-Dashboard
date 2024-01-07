import { ArrowLeft, Bell, Menu, Search, TrafficCone, User } from "lucide-solid"
import { Button } from "../components/Button"
import { Show, createSignal } from "solid-js"
import { useSearch } from '../contexts/SearchContext';

export function PageHeader() {
    const [showFullWidthSearch, setShowFullWidthSearch] = createSignal(false);
    const { setSearch } = useSearch()!;
    const handleSearchChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        setSearch(target.value);
      };

    return (
        <div class="flex gap-10 lg:gap-20 justify-between pt-2 pb-2 mb-6 px-4 fixed top-0 left-0 w-full z-10 bg-neutral-200 shadow-md">
            <div class={`flex gap-4 items-center flex-shrink-0 ${showFullWidthSearch() ? "hidden" : ""}`}>

                <a href="/">
                    <Button type="button" size="icon" variant="ghost">
                    <TrafficCone/>
                    </Button>
                </a>
                <div class="text-center text-xl hidden lg:block font-bold">SG Traffic Images</div>
            </div>

            <form class={`gap-4 flex-grow justify-center ${showFullWidthSearch() ? "flex" : "hidden md:flex"}`}>
                <Show when={showFullWidthSearch()}>
                    <Button
                        onClick={() => setShowFullWidthSearch(false)}
                        type="button"
                        size="icon"
                        variant="ghost"
                        class="flex-shrink-0"
                    >
                        <ArrowLeft />
                    </Button>
                </Show>
                <div class="flex flex-grow max-w-[600px]">
                    <input
                        type="search"
                        placeholder="Search"
                        class="rounded-full border border-secondary-border shadow-inner shadow-secondary py-1 px-4 text-lg w-full focus:border-blue-500 outline-none"
                        onInput={handleSearchChange}
                    />
                </div>
            </form>

            <div class={`flex-shrink-0 md:gap-2 ${showFullWidthSearch() ? "hidden" : "flex"}`}>
                <Button
                    onClick={() => setShowFullWidthSearch(true)}
                    size="icon"
                    variant="ghost"
                    class="md:hidden"
                >
                    <Search />
                </Button>
                <Button size="icon" variant="ghost">
                    <Bell />
                </Button>
                <Button size="icon" variant="ghost">
                    <User />
                </Button>
                <Button variant="ghost" size="icon">
                    <Menu />
                </Button>
            </div>
        </div>
    )
}