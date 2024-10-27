import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MDXEditor } from "@mdxeditor/editor";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  frontmatterPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import { X } from "lucide-react";

interface CVViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: string | null;
}

const CVViewDialog: React.FC<CVViewDialogProps> = ({
  isOpen,
  onOpenChange,
  content,
}) => {
  if (!content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold mb-4"></DialogTitle>
      </DialogHeader>
      <DialogContent className="h-[calc(100vh-200px)] min-w-[calc(80vw)] overflow-y-auto md:pb-6 pb-10 rounded-none">
        <DialogClose className="absolute right-4 top-4">
          <X className="h-6 w-6 cursor-pointer" />
        </DialogClose>
        <div className="mt-6 flex-1">
          <MDXEditor
            markdown={content}
            readOnly
            contentEditableClassName="prose max-w-none dark:text-white"
            className="bg-gray-100 dark:bg-gray-800 rounded-md dark:text-white"
            plugins={[
              listsPlugin(),
              quotePlugin(),
              headingsPlugin(),
              frontmatterPlugin(),
              diffSourcePlugin(),
            ]}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CVViewDialog;
