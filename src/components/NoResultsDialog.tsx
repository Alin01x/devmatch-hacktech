import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@/components/ui/dialog";
import { X, Search } from "lucide-react";

interface NoResultsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: "candidates" | "jobs";
}

const NoResultsDialog: React.FC<NoResultsDialogProps> = ({
  isOpen,
  onOpenChange,
  type,
}) => {
  const message =
    type === "candidates"
      ? "Ooops! No matching candidates have been found."
      : "Ooops! No matching jobs have been found.";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="w-full p-6 bg-white shadow-md rounded-t-lg">
          <DialogTitle className="w-full flex items-center justify-between text-2xl font-bold gap-2 text-gray-600">
            <div>No Results</div>
            <DialogClose asChild>
              <div className="rounded-full p-2 hover:bg-gray-100 transition-all duration-200 ease-in-out transform hover:scale-110">
                <X className="h-4 w-4 cursor-pointer" />
              </div>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 flex flex-col items-center text-center">
          <Search className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-lg text-gray-600 mb-4">{message}</p>
          <p className="text-sm text-gray-500">
            {
                type === "candidates"
                    ? "Try uploading a different job description."
                    : "Try uploading a different CV."
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoResultsDialog;
