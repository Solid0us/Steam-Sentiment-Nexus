import { SteamGames } from "../../../lib/db_interface";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { updateGames, UpdateGamesData } from "@/services/gameServices";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useToast } from "@/components/hooks/use-toast";
import { usePagination } from "@/hooks/usePagination";
import CustomPaginationBlocks from "@/components/pagination/CustomPaginationBlocks";
import AddGamesToListDialogButton from "@/features/addGamesToList/AddGamesToListDialogButton";
import { Separator } from "@/components/ui/separator";

interface GamesListProps {
  gamesList: SteamGames[];
  refetchGamesList: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<SteamGames[], Error>>;
}
const GAMES_LIST_HEADERS = ["ID", "Name", "Scraper Activated?"];
const GamesList = ({ gamesList, refetchGamesList }: GamesListProps) => {
  const { toast } = useToast();
  const [gameActivity, setGameActivity] = useState<{
    [key: string]: {
      current: boolean;
      defaultActivity: boolean;
    };
  }>({});
  const [isChanged, setIsChanged] = useState(false);
  const {
    currentPage,
    endIndex,
    startIndex,
    nextPage,
    prevPage,
    goToPage,
    totalPages,
  } = usePagination({
    itemsPerPage: 10,
    totalItems: gamesList.length,
  });

  const handleCheckChange = (
    e: CheckedState,
    gameId: string,
    defaultActivity: boolean
  ) => {
    setGameActivity((prevState) => ({
      ...prevState,
      [gameId]: {
        current: e as boolean,
        defaultActivity,
      },
    }));
  };

  const handleUpdate = async () => {
    let data: UpdateGamesData = { games: [] };
    for (const [key, value] of Object.entries(gameActivity)) {
      data.games.push({
        id: key,
        isActive: value.current,
      });
    }
    try {
      await updateGames(data);
      refetchGamesList();
      setGameActivity({});
      setIsChanged(false);
      toast({
        title: "Game(s) Updated",
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    for (const [key, value] of Object.entries(gameActivity)) {
      if (value.current !== value.defaultActivity) {
        setIsChanged(true);
        return;
      }
      setIsChanged(false);
    }
  }, [gameActivity]);
  return (
    <div className="flex flex-col gap-3 p-3 bg-secondary-foreground max-w-4xl">
      <h1 className="text-primary text-2xl text-center font-bold">
        Games Scraper List
      </h1>
      <h4 className="text-center text-sm text-primary-foreground">
        View and toggle which Steam games the web scraper should collect data
        for. You can add more games to the database by clicking the "Add Game to
        Scraper List" button to browse Steam's catalog,
      </h4>
      <div className="ml-auto p-1">
        <CustomPaginationBlocks
          currentPage={currentPage}
          goToPage={goToPage}
          nextPage={nextPage}
          prevPage={prevPage}
          totalPages={totalPages}
        />
      </div>
      <Separator />
      <Table className="bg-slate-800">
        <TableHeader>
          <TableRow>
            {GAMES_LIST_HEADERS.map((header) => (
              <TableHead
                key={header}
                className="text-center font-bold text-primary-foreground"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="text-primary-foreground">
          {gamesList?.slice(startIndex, endIndex + 1).map((val) => (
            <TableRow
              key={val.id}
              className={`${
                gameActivity[val.id]?.current !==
                  gameActivity[val.id]?.defaultActivity &&
                "bg-slate-300 hover:bg-slate-400 text-secondary-foreground"
              }`}
            >
              <TableCell className="text-center">{val.id}</TableCell>
              <TableCell className="text-center">{val.name}</TableCell>
              <TableCell className="text-center">
                <Checkbox
                  onCheckedChange={(e) =>
                    handleCheckChange(e, val.id, val.isActive)
                  }
                  defaultChecked={val.isActive ? true : false}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="text-primary-foreground">
          <TableRow>
            <TableCell
              colSpan={2}
              className="text-left bg-secondary-foreground"
            >
              Page {currentPage}/{Math.max(totalPages, 1)}
            </TableCell>
            <TableCell className="text-right bg-secondary-foreground">
              {gamesList.length} Games
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {isChanged && (
        <Button
          onClick={handleUpdate}
          className="ml-auto mr-auto  bg-slate-500 hover:bg-slate-600"
        >
          Save Changes
        </Button>
      )}
      <div className="w-full flex justify-center mt-auto">
        <AddGamesToListDialogButton gamesList={gamesList ?? []} />
      </div>
    </div>
  );
};

export default GamesList;
