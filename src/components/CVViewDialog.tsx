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
import { ScrollArea } from "@/components/ui/scroll-area";

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
      <DialogContent className="max-w-4xl p-0 w-[95vw]">
        <ScrollArea className="h-[calc(100vh-100px)] sm:h-[calc(100vh-200px)] rounded-lg">
          <DialogHeader className="sticky top-0 z-10 p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md">
            <DialogTitle className="flex items-center justify-between text-xl sm:text-2xl font-bold">
              <span>CV Content</span>
              <DialogClose asChild>
                <div className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out transform hover:scale-110">
                  <X className="h-4 w-4 cursor-pointer" />
                </div>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 sm:p-6">
            <MDXEditor
              markdown={content}
              readOnly
              contentEditableClassName="prose dark:prose-invert max-w-none dark:text-white"
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CVViewDialog;
