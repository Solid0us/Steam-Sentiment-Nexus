import {
  getAllSteamGames,
  GetAllSteamGamesData,
} from "@/services/steamApiService";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdDelete } from "react-icons/md";
import { Separator } from "@/components/ui/separator";
import { SteamGames } from "@/lib/db_interface";
import { Button } from "@/components/ui/button";
import { createGames } from "@/services/gameServices";
import { GameListContext } from "@/pages/HomePage";
import { useToast } from "@/components/hooks/use-toast";
import { useAuth } from "@/components/hooks/useAuth";

type GamesToAdd = {
  gameId: string;
  name: string;
}[];

const GAME_HEADERS = ["ID", "Name", ""];

interface AddGamesToListFormProps {
  gamesList: SteamGames[];
  setAddGameDialogOpen: (val: boolean) => void;
}

const AddGamesToListForm = ({
  gamesList,
  setAddGameDialogOpen,
}: AddGamesToListFormProps) => {
  const { toast } = useToast();

  const gameListContext = useContext(GameListContext);
  if (!gameListContext) {
    return <></>;
  }
  const { refetchGamesList } = gameListContext;
  const [filterQuery, setFilterQuery] = useState("");
  const [gamesToAdd, setGamesToAdd] = useState<GamesToAdd>([]);
  const { data: steamGames } = useQuery({
    queryKey: ["steamGames"],
    queryFn: () => getAllSteamGames(),
    staleTime: 60 * 60 * 24 * 1000,
  });
  const [token] = useAuth();
  const filteredSteamGames = useMemo(
    () =>
      filterSteamGamesByName({
        steamGames,
        filters: { filterQuery, existingGameList: gamesList },
      }),
    [filterQuery]
  );

  const isAlreadyAddedOrInDb = (gameId: string) => {
    for (let i = 0; i < gamesToAdd.length; i++) {
      if (gamesToAdd[i].gameId === gameId) {
        return true;
      }
    }

    return false;
  };

  const handleRemoveRow = (gameId: string) => {
    const removedRow = gamesToAdd.filter((game) => game.gameId !== gameId);
    setGamesToAdd(removedRow);
  };
  const handleSubmit = async () => {
    try {
      await createGames(
        {
          games: gamesToAdd.map((game) => ({
            id: game.gameId,
            isActive: true,
            name: game.name,
          })),
        },
        token ?? ""
      );
      setAddGameDialogOpen(false);
      refetchGamesList();
      toast({
        title: "Game(s) Added",
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 justify-center items-center">
          <Label className="text-primary-foreground">
            Search Games to Add to Database
          </Label>
          <Input
            className="max-w-48 text-black"
            placeholder="Search"
            onChange={(e) => setFilterQuery(e.target.value)}
          />
        </div>
        <div className="border rounded-lg w-full overflow-auto h-96 p-2">
          <ul>
            {filteredSteamGames.length === 0 ? (
              <p className="text-center">No Results</p>
            ) : (
              filteredSteamGames.slice(0, 500).map((game) => (
                <li
                  key={game.gameId}
                  className={`hover:cursor-pointer border-b hover:bg-slate-500 ${
                    isAlreadyAddedOrInDb(String(game.gameId)) &&
                    "pointer-events-none text-primary bg-slate-800"
                  }`}
                  onClick={() =>
                    setGamesToAdd((prevState) => [
                      ...prevState,
                      {
                        gameId: String(game.gameId),
                        name: game.name,
                      },
                    ])
                  }
                >
                  {game.name}
                </li>
              ))
            )}
          </ul>
        </div>
        <Separator className="bg-primary h-0.5" />
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                {GAME_HEADERS.map((header) => (
                  <TableHead className="text-center text-bold" key={header}>
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {gamesToAdd.map((game) => (
                <TableRow>
                  <TableCell className="text-center">{game.gameId}</TableCell>
                  <TableCell className="text-center">{game.name}</TableCell>
                  <TableCell className="text-center">
                    <MdDelete
                      onClick={() => handleRemoveRow(game.gameId)}
                      className="text-2xl text-secondary hover:cursor-pointer"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button
          onClick={handleSubmit}
          className={`ml-auto mr-auto ${
            gamesToAdd.length === 0 && "opacity-45 pointer-events-none"
          }`}
        >
          Add to Database
        </Button>
      </div>
    </>
  );
};

const filterSteamGamesByName = ({
  steamGames,
  filters,
}: {
  steamGames: GetAllSteamGamesData | undefined;
  filters: {
    filterQuery?: string;
    existingGameList: SteamGames[];
  };
}) => {
  let gamesList: { gameId: number; name: string }[] = [];
  const { filterQuery, existingGameList } = filters;
  if (steamGames) {
    const { apps } = steamGames.applist;
    for (let i = 0; i < apps.length; i++) {
      if (
        filterQuery &&
        apps[i].name.toLowerCase().includes(filterQuery.toLowerCase()) &&
        !existingGameList.map((game) => game.id).includes(String(apps[i].appid))
      ) {
        gamesList.push({
          gameId: apps[i].appid,
          name: apps[i].name,
        });
      }
    }
  }
  return gamesList;
};
export default AddGamesToListForm;
