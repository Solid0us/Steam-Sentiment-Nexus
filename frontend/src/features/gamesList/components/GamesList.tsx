import { SteamGames } from "../../../lib/db_interface";
import { Label } from "../../../components/ui/label";
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

interface GamesListProps {
  gamesList: SteamGames[];
}
const GAMES_LIST_HEADERS = ["ID", "Name", "Scraper Activated?"];
const GamesList = ({ gamesList }: GamesListProps) => {
  const [gameActivity, setGameActivity] = useState<{
    [key: string]: {
      current: boolean;
      defaultActivity: boolean;
    };
  }>({});
  const [isChanged, setIsChanged] = useState(false);
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
    <div className="flex flex-col gap-3 p-3">
      <h1 className="text-primary text-lg text-center font-bold">Games List</h1>
      <Table>
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
        <TableBody>
          {gamesList?.map((val) => (
            <TableRow key={val.id}>
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
      </Table>
      {isChanged && (
        <Button className="ml-auto mr-auto bg-slate-500 hover:bg-slate-600">
          Save Changes
        </Button>
      )}
    </div>
  );
};

export default GamesList;
