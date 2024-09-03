import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddGamesToListForm from "./AddGamesToListForm";
import { SteamGames } from "@/lib/db_interface";
import { useState } from "react";

interface AddGamesToListDialogButtonProps {
  gamesList: SteamGames[];
}

const AddGamesToListDialogButton = ({
  gamesList,
}: AddGamesToListDialogButtonProps) => {
  const [addGameDialogOpen, setAddGameDialogOpen] = useState(false);
  return (
    <Dialog
      open={addGameDialogOpen}
      onOpenChange={(e) => setAddGameDialogOpen(e)}
    >
      <DialogTrigger asChild>
        <Button>+ Add Game to Scraper List</Button>
      </DialogTrigger>
      <DialogContent className="bg-secondary-foreground text-primary-foreground w-full max-h-screen overflow-auto">
        {
          <AddGamesToListForm
            setAddGameDialogOpen={setAddGameDialogOpen}
            gamesList={gamesList}
          />
        }
      </DialogContent>
    </Dialog>
  );
};

export default AddGamesToListDialogButton;
