import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  diffSourcePlugin,
  frontmatterPlugin,
  headingsPlugin,
  listsPlugin,
  MDXEditor,
  quotePlugin,
} from "@mdxeditor/editor";
import { X, Briefcase, Code, Star, Handshake } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { MatchingJob } from "@/types/MatchResult";

const ScoreCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<any>;
}) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2 min-w-24">
      <Icon className="w-4 h-4 text-brand-light-blue" />
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
    </div>
    <div className="flex-1 flex items-center gap-2">
      <div className="flex-1 bg-gray-100 dark:bg-gray-300 rounded-full h-1.5">
        <div
          className="bg-brand-light-blue rounded-full h-1.5 transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm font-medium text-brand-light-blue min-w-12 text-right">
        {value}%
      </span>
    </div>
  </div>
);

const TotalScoreDisplay = ({ value }: { value: number }) => (
  <div className="bg-gradient-to-br bg-brand-orange rounded-lg p-4 text-white">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <Handshake className="w-5 h-5 text-white" />
        <span className="font-medium">Final Score</span>
      </div>
      <div className="text-2xl font-bold">{value}%</div>
    </div>
    <div className="w-full bg-[#cccccc] rounded-full h-2">
      <div
        className="bg-white rounded-full h-2 transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

interface BestJobResultDialogProps {
  matchingJob: MatchingJob;
}

const BestJobResultDialog: React.FC<BestJobResultDialogProps> = ({
  matchingJob,
}) => {
  if (!matchingJob) return null;

  return (
    <DialogContent className="max-w-4xl p-0">
      <ScrollArea className="h-[calc(100vh-200px)] rounded-lg">
        <DialogHeader className="w-full fixed p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg z-20">
          <DialogTitle className="w-full flex items-center justify-between text-2xl font-bold gap-2 text-gray-600 dark:text-gray-200">
            <div>Best Matching Job</div>
            <DialogClose asChild>
              <div className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out transform hover:scale-110">
                <X className="h-4 w-4 cursor-pointer" />
              </div>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6 mt-20">
          <div className="rounded-lg border-2 border-primary border-l-8 shadow-md p-6 dark:bg-gray-800">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              <div className="flex flex-col gap-4 flex-1 w-full lg:w-auto">
                <div>
                  <h3 className="text-xl font-semibold dark:text-white mb-2">
                    {matchingJob.jobDescription.job_title}
                  </h3>
                  <div className="text-gray-400 dark:text-gray-300 font-semibold">
                    {matchingJob.jobDescription.industry}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Required Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(matchingJob.jobDescription.skills).map(
                        ([skill, weight]) => (
                          <Badge key={skill} variant="secondary">
                            {skill} ({weight}%)
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 w-full lg:w-72">
                <TotalScoreDisplay value={matchingJob.finalScore} />

                <div className="space-y-3 bg-secondary dark:bg-gray-700 rounded-lg p-4">
                  <ScoreCard
                    label="Industry"
                    value={matchingJob.industryScore}
                    icon={Briefcase}
                  />
                  <ScoreCard
                    label="Technical"
                    value={matchingJob.technicalScore}
                    icon={Code}
                  />
                  <ScoreCard
                    label="Overall"
                    value={matchingJob.overallScore}
                    icon={Star}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-200 dark:bg-slate-800 mt-6 rounded-sm">
              <MDXEditor
                markdown={matchingJob.jobDescription.detailed_description}
                contentEditableClassName="prose dark:prose-invert text-sm"
                readOnly
                plugins={[
                  listsPlugin(),
                  quotePlugin(),
                  headingsPlugin(),
                  frontmatterPlugin(),
                  diffSourcePlugin(),
                ]}
              />
            </div>
            <div className="flex flex-col items-start gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2 font-semibold">
                Reasoning
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                {matchingJob.bestMatchReasoning}
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  );
};

export default BestJobResultDialog;
