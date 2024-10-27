import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Trophy, Briefcase, Code, Star, Target, Gauge, CheckCircle2, Sparkles, UsersRound, Percent } from "lucide-react";
import CVViewDialog from "./CVViewDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MatchingCV } from "@/types/MatchResult";
 
interface MatchResultDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: MatchingCV[];
  title: string;
}
  
const MatchResultDialog: React.FC<MatchResultDialogProps> = ({
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
    icon: React.ComponentType<any>;
  }) => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 min-w-24">
        <Icon className="w-4 h-4   brand-light-blue" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-brand-light-blue rounded-full h-1.5 transition-all duration-300"
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-sm font-medium brand-light-blue min-w-12 text-right">
          {value}%
        </span>
      </div>
    </div>
  );

  const TotalScoreDisplay = ({ value }: { value: number }) => (
    <div className="bg-gradient-to-br bg-brand-orange rounded-lg p-4 text-white">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
 
          <Gauge className="w-5 h-5 text-yellow-400" />
          <span className="font-medium">Final Score</span>
        </div>
        <div className="text-2xl font-bold">{value}%</div>
      </div>
      <div className="w-full bg-blue-400/30 rounded-full h-2">
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
        <DialogContent className="max-w-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-6 flex items-center gap-2">
              {title}
              <Trophy className="ml-1 w-6 h-6 text-yellow-400" />
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-6">
              {data.map((match, index) => (
                <div
                  key={match.cv.name}
                  className={`rounded-lg border ${
                    index === 0
                      ? "border-primary border-2 bg-secondary border-l-primary border-l-8 shadow-md"
                      : "border-gray-200 shadow-sm"
                  } p-6`}
                >
                  <div className="flex flex-col gap-6">
                    <div className="relative flex items-center">
                      <div className="flex items-center gap-4">
                        <h3 className="text-xl font-semibold">{match.cv.name}</h3>
                        <Button
                          variant="link"
                          onClick={() => setSelectedCV(match)}
                        >
                          <FileText className="w-4 h-4" />
                          View CV
                        </Button>
                      </div>

                      {index === 0 && (
                        <div className="absolute right-0 flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full shadow-sm">
                          <Trophy className="w-4 h-4" />
                          <span className="font-medium">Best Match</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-[2fr,1fr] gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          {match.cv.industries.map((industry, idx) => (
                            <React.Fragment key={industry}>
                              <span className="text-sm">{industry}</span>
                              {idx < match.cv.industries.length - 1 && (
                                <span className="text-lg">•</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-2">
                            Matched Skills
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {match.technicalSkillsMatched.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-gray-600 mb-2">
                            Missing Skills
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {match.technicalSkillsMissing.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 w-72">
                        <TotalScoreDisplay value={match.finalScore} />

                        <div className="space-y-3 bg-gray-50 rounded-lg p-4">
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

                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">Analysis</div>
                      <p className="text-gray-700">
                        {index === 0
                          ? match.bestMatchReasoning
                          : match.overallAnalysis.aiReasoning}
                      </p>
                    </div>
                  </div>
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

export default MatchResultDialog;