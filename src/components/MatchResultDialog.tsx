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
import { ChartBar, Code, Factory, FileText } from "lucide-react";
import CVViewDialog from "./CVViewDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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

  const ScoreCard = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex-1 bg-secondary/50 rounded-lg p-3 transition-all hover:bg-secondary/70">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="text-lg font-bold">{value}%</div>
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="md:max-w-[860px] max-h-[calc(100vh-40px)] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(100vh-160px)]">
            <div className="space-y-6 p-6 pt-2">
              {(data as MatchingCV[]).map((match, index) => (
                <div
                  key={index}
                  className={`rounded-lg transition-all duration-200 ${
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary/30"
                  }`}
                >
                  {/* Header Section */}
                  <div className="p-4 border-b border-primary-foreground/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{match.cv.name}</h3>
                        <Button
                          variant={index === 0 ? "secondary" : "default"}
                          size="sm"
                          onClick={() => setSelectedCV(match)}
                          className="gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          View CV
                        </Button>
                      </div>
                      <Badge
                        variant={index === 0 ? "secondary" : "default"}
                        className={`px-4 py-1 text-base font-bold ${
                          index === 0
                            ? "bg-primary-foreground text-primary"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {match.finalScore}%
                      </Badge>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 space-y-4">
                    {/* Scores Grid */}
                    <div className="flex gap-3 mb-4">
                      <ScoreCard icon={Factory} label="Industry Match" value={match.industryScore} />
                      <ScoreCard icon={Code} label="Technical Match" value={match.technicalScore} />
                      <ScoreCard icon={ChartBar} label="Overall Match" value={match.overallScore} />
                    </div>

                    <Separator className="bg-primary-foreground/20" />

                    {/* Industries Section */}
                    <div className="bg-background/10 rounded-lg p-3">
                      <h4 className="text-sm font-semibold mb-2">Industries</h4>
                      <div className="flex flex-wrap gap-2">
                        {match.cv.industries.map((industry) => (
                          <Badge
                            key={industry}
                            variant={index === 0 ? "secondary" : "outline"}
                            className="text-xs"
                          >
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-3">
                      <div className="bg-background/10 rounded-lg p-3">
                        <h4 className="text-sm font-semibold mb-2">Matched Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.technicalSkillsMatched.map((skill) => (
                            <Badge key={skill} variant="success" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-background/10 rounded-lg p-3">
                        <h4 className="text-sm font-semibold mb-2">Missing Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {match.technicalSkillsMissing.map((skill) => (
                            <Badge key={skill} variant="danger" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Analysis Section */}
                    <div className="bg-background/10 rounded-lg p-3">
                      <h4 className="text-sm font-semibold mb-2">
                        {index === 0 ? "Best Match Reasoning" : "AI Analysis"}
                      </h4>
                      <p className="text-sm">
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
