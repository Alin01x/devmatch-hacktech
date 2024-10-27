import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Trophy,
  Briefcase,
  Code,
  Star,
  Handshake,
  X,
} from "lucide-react";
import CVViewDialog from "./CVViewDialog";
import { DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MatchingCV } from "@/types/MatchResult";

interface CandidatesResultDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: MatchingCV[];
  title: string;
}

const CandidatesResultDialog: React.FC<CandidatesResultDialogProps> = ({
  isOpen,
  onOpenChange,
  data,
  title,
}) => {
  const [selectedCV, setSelectedCV] = useState<MatchingCV | null>(null);

  const ScoreCard = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }) => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 min-w-24">
        <Icon className="w-4 h-4 brand-light-blue dark:text-brand-light-blue" />
        <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 bg-gray-100 dark:bg-gray-300 rounded-full h-1.5">
          <div
            className="bg-brand-light-blue rounded-full h-1.5 transition-all duration-300"
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-sm font-medium brand-light-blue dark:text-brand-light-blue min-w-12 text-right">
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl p-0 w-[95vw]">
          <ScrollArea className="h-[calc(100vh-100px)] sm:h-[calc(100vh-200px)] rounded-lg">
            <DialogHeader className="w-full sticky top-0 z-10 p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
              <DialogTitle className="w-full flex items-center justify-between text-xl sm:text-2xl font-bold gap-2 text-gray-600 dark:text-gray-200">
                <div className="truncate">{title}</div>
                <DialogClose asChild>
                  <div className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out transform hover:scale-110">
                    <X className="h-4 w-4 cursor-pointer" />
                  </div>
                </DialogClose>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 p-4">
              {data.map((match, index) => (
                <div
                  key={index}
                  className={`rounded-lg border ${
                    index === 0
                      ? "border-primary border-2 border-l-primary border-l-8 shadow-md mt-20 sm:mt-24"
                      : "border-gray-200 dark:border-gray-700 shadow-sm"
                  } p-4 sm:p-6 dark:bg-gray-800`}
                >
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg sm:text-xl font-semibold dark:text-white truncate">
                          {match.cv.name}
                        </h3>
                        <Button
                          variant="link"
                          onClick={() => setSelectedCV(match)}
                        >
                          <FileText className="w-4 h-4" />
                          View CV
                        </Button>
                      </div>

                      <div className="flex flex-col gap-4 sm:gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center flex-wrap gap-x-2 gap-y-0 text-gray-400 dark:text-gray-300 font-semibold">
                            {match.cv.industries.map((industry, idx) => (
                              <React.Fragment key={industry}>
                                <span className="text-sm lg:text-nowrap">{industry} {industry} {industry}</span>
                                {idx < match.cv.industries.length - 1 && (
                                  <span className="text-md py-0 my-0 hidden xl:block">•</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>

                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              Matched Skills
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {match.technicalSkillsMatched.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 rounded text-sm"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {match.technicalSkillsMissing.length > 0 && (
                            <div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                Missing Skills
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {match.technicalSkillsMissing.map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 rounded text-sm"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 sm:space-y-6 w-full sm:w-auto sm:min-w-64">
                      <TotalScoreDisplay value={match.finalScore} />

                      <div className="space-y-3 bg-secondary dark:bg-gray-700 rounded-lg p-4">
                        <ScoreCard
                          label="Industry"
                          value={match.industryScore}
                          icon={Briefcase}
                        />
                        <ScoreCard
                          label="Technical"
                          value={match.technicalScore}
                          icon={Code}
                        />
                        <ScoreCard
                          label="Overall"
                          value={match.overallScore}
                          icon={Star}
                        />
                      </div>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="flex flex-col items-start gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">Best Match</span>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                        {match.bestMatchReasoning}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
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

export default CandidatesResultDialog;
