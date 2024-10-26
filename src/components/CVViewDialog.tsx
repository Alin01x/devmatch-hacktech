import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MatchingCV } from "@/types/MatchResult";
import { MDXEditor } from "@mdxeditor/editor";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  frontmatterPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";

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
        <DialogTitle className="text-2xl font-bold mb-4">
          {/* {title} */}
        </DialogTitle>
      </DialogHeader>
      <DialogContent className="min-w-full h-screen overflow-y-auto md:pb-6 pb-10 rounded-none">
        <div className="mt-4">
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
