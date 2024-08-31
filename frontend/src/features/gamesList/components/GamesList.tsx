import { SteamGames } from "../../../lib/db_interface";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";

interface GamesListProps {
  gamesList: SteamGames[];
}
const GamesList = ({ gamesList }: GamesListProps) => {
  return (
    <div className="flex flex-col gap-3 p-3">
      <h1 className="text-primary text-lg text-center font-bold">Games List</h1>
      {gamesList?.map((val) => (
        <div key={val.id} className="flex flex-row gap-3">
          <Label>{val.name}</Label>
          <Checkbox defaultChecked={val.isActive ? true : false} />
        </div>
      ))}
    </div>
  );
};

export default GamesList;
