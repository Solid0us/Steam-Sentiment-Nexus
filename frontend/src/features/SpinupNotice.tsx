import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SpinupNoticeProps {
  spinUpNotice: boolean;
  setSpinUpNotice: (val: boolean) => void;
}

const SpinupNotice = ({ spinUpNotice, setSpinUpNotice }: SpinupNoticeProps) => {
  return (
    <Dialog open={spinUpNotice} onOpenChange={(e) => setSpinUpNotice(e)}>
      <DialogContent
        className="bg-secondary-foreground w-11/12 rounded-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-center text-2xl text-primary">Welcome!</h1>
          <p>
            Thank you for your interest in this project! Before you explore, I
            would like to inform you that the backend server may take up to a
            couple of minutes to spin up due to the free plan that I am on, and
            no data will be visible until it's ready. I appreciate your patience
            and hope you enjoy your experience!
          </p>
          {/* <Button onClick={() => setReadSpinUpNotice(true)}>Close</Button> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpinupNotice;
