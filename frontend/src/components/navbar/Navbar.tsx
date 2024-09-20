import { SteamGames } from "@/lib/db_interface";
import { useContext, useEffect, useState } from "react";
import { GameListContext } from "@/pages/HomePage";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  selectedGame: SteamGames | undefined;
  setSelectedGame: (val: SteamGames | undefined) => void;
}

const Navbar = ({ selectedGame, setSelectedGame }: NavbarProps) => {
  const gameListContext = useContext(GameListContext);
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="sticky top-0 w-full h-16 z-50 bg-slate-700 p-2 opacity-95">
        <div className="flex flex-row items-center justify-between gap-3 h-full">
          <h1 className="text-primary text-bold lg:text-2xl text-center ">
            Steam Sentiment Nexus
          </h1>
          <div className="flex flex-row justify-center items-center gap-3">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between text-black overflow-hidden"
                >
                  {gameListContext?.gamesList
                    ? gameListContext.gamesList.find(
                        (game) => game === selectedGame
                      )?.name
                    : "Select game..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search game..." />
                  <CommandList>
                    <CommandEmpty>No game found.</CommandEmpty>
                    <CommandGroup>
                      {gameListContext?.gamesList?.map((game) => (
                        <CommandItem
                          key={game.id}
                          value={game.name}
                          onSelect={(currentValue) => {
                            setSelectedGame(game);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedGame === game
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {game.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
