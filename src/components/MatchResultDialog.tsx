import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchingCV } from "@/types/MatchResult";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  frontmatterPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import CVViewDialog from "./CVViewDialog";
import dynamic from "next/dynamic";
import { Skeleton } from "./ui/skeleton";

interface MatchResultDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "cv" | "job";
  data: MatchingCV[];
  title: string;
}

// Dynamically import MDXEditor with SSR disabled
const MDXEditor = dynamic(
  () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] space-y-2 p-4">
        <Skeleton className="h-[400px] w-full animate-pulse" />
      </div>
    ),
  }
);

const MatchResultDialog: React.FC<MatchResultDialogProps> = ({
  isOpen,
  onOpenChange,
  mode,
  data,
  title,
}) => {
  const [selectedCV, setSelectedCV] = useState<MatchingCV | null>(null);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="md:max-w-[800px] max-h-screen overflow-y-auto md:pb-6 pb-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4 overflow-y-auto">
            {mode === "cv" ? (
              // CV Matching Mode
              (data as MatchingCV[]).map((match, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg transition-all duration-200 ${
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{match.cv.name}</h3>
                    <Badge
                      variant={index === 0 ? "secondary" : "outline"}
                      className={`w-16 justify-center ${
                        index === 0
                          ? "bg-primary-foreground text-primary"
                          : "border-primary text-primary"
                      }`}
                    >
                      {match.finalScore}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Industries:</span>{" "}
                      {match.cv.industries.join(", ")}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Matched Skills:</span>{" "}
                      {match.technicalSkillsMatched.join(", ")}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Missing Skills:</span>{" "}
                      {match.technicalSkillsMissing.join(", ")}
                    </p>
                  </div>
                  <p className="text-sm mt-2">
                    <span className="font-medium">AI Analysis:</span>{" "}
                    {match.overallAnalysis.aiReasoning}
                  </p>
                  {index === 0 && (
                    <p className="text-sm mt-2">
                      <span className="font-medium">Best Match Reasoning:</span>{" "}
                      {match.bestMatchReasoning}
                    </p>
                  )}
                  <div className="mt-3 pt-3 border-t border-primary-foreground/20">
                    <div className="flex justify-between text-xs mb-2">
                      <span>Industry: {match.industryScore}%</span>
                      <span>
                        Technical: {(match.technicalScore * 100).toFixed(2)}%
                      </span>
                      <span>Overall: {match.overallScore.toFixed(2)}%</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCV(match)}
                    className="mt-2"
                  >
                    View CV
                  </Button>
                </div>
              ))
            ) : (
              // Job Matching Mode
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    {(data as JobMatch).job_title}
                  </h3>
                </div>
                <div>
                  <span className="font-medium">Industry:</span>{" "}
                  <span className="font-normal">
                    {(data as JobMatch).industry}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2 font-medium">
                    {(data as JobMatch).skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="border-black dark:border-white dark:text-white"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Job Description:</h4>
                  <MDXEditor
                    markdown={(data as JobMatch).detailed_description}
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
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <CVViewDialog
        isOpen={!!selectedCV}
        onOpenChange={() => setSelectedCV(null)}
        content={selectedCV?.cv.full_content || null}
      />
    </>
  );
};

export default MatchResultDialog;
