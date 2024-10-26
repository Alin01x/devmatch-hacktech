"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Briefcase, Plus, X, Search, Info, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import "@mdxeditor/editor/style.css";
import {
  UndoRedo,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  frontmatterPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import { Combobox } from "@/components/ui/combobox";
import { INDUSTRIES } from "@/constants/industries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skills } from "@/types/JobDescription";
import { useToast } from "@/hooks/use-toast";

// Dynamically import MDXEditor with SSR disabled
const MDXEditor = dynamic(
  () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[420px] space-y-2 p-4">
        <Skeleton className="h-4 w-[260px] animate-pulse" />
        <Skeleton className="h-4 w-[260px] animate-pulse" />
        <Skeleton className="h-[366px] w-full animate-pulse" />
      </div>
    ),
  }
);

// Define the Match type
type Match = {
  name: string;
  score: number;
  explanation: string;
};

const JobMatchingTab: React.FC = () => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [skills, setSkills] = useState<Skills>({});
  const [newSkill, setNewSkill] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const { toast } = useToast();
  const [errors, setErrors] = useState<{
    jobTitle: string;
    industry: string;
    jobDescription: string;
    skills: string;
  }>({
    jobTitle: "",
    industry: "",
    jobDescription: "",
    skills: "",
  });

  const handleAddSkill = (): void => {
    const trimmedSkill = newSkill.trim();

    if (!skills.hasOwnProperty(trimmedSkill)) {
      // If it's the first skill, set its weight to 100
      const weight = Object.keys(skills).length === 0 ? 100 : 0;
      setSkills({
        ...skills,
        [trimmedSkill]: weight,
      });
    }

    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string): void => {
    const auxSkills = { ...skills };
    delete auxSkills[skillToRemove];

    // If there's only one skill left, set its weight to 100
    if (Object.keys(auxSkills).length === 1) {
      auxSkills[Object.keys(auxSkills)[0]] = 100;
    }

    setSkills(auxSkills);
  };

  const validate = () => {
    const errors = {
      jobTitle: jobTitle.trim() === "" ? "Job title is required." : "",
      industry: industry.trim() === "" ? "Industry is required." : "",
      skills:
        Object.keys(skills).length === 0
          ? "At least one technical skill is required."
          : totalWeight !== 100
          ? "Total weight must be 100."
          : "",
      jobDescription:
        jobDescription.trim() === ""
          ? "Job description is required."
          : jobDescription.trim().length < 100
          ? "Job description must be at least 100 characters."
          : "",
    };

    setErrors(errors);
    return {
      isValid: Object.values(errors).every((error) => error === ""),
      errors,
    };
  };

  const submit = async () => {
    const { isValid, errors } = validate();
    if (!isValid) {
      if (
        errors.jobTitle !== "" ||
        errors.industry !== "" ||
        errors.jobDescription !== ""
      ) {
        document.getElementById("job-matching-form")?.scrollIntoView({
          behavior: "smooth",
        });
      }
      return;
    }

    console.log("Submitting Job Description...");

    try {
      setIsLoading(true);
      const response = await fetch("/api/job-matching", {
        method: "POST",
        body: JSON.stringify({
          job_title: jobTitle,
          industry,
          detailed_description: jobDescription,
          skills,
        }),
      });

      const data = await response.json();
      console.log("received response", data);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "An error occurred while finding matching candidates.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalWeight = Object.values(skills).reduce(
    (sum, weight) => sum + weight,
    0
  );

  const renderErrorLine = (error: string) => {
    return error !== "" && <p className="text-red-500 text-sm mt-1">{error}</p>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Job Requirements Matching
        </CardTitle>
        <CardDescription>
          Enter a job description to find the top 5 matching candidates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6" id="job-matching-form">
          <div className="p-4 border rounded-lg dark:bg-gray-800 bg-gray-50">
            <h3 className="font-medium mb-2">Job Details</h3>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  disabled={isLoading}
                />
                {renderErrorLine(errors.jobTitle)}
              </div>
              <div>
                <Combobox
                  items={INDUSTRIES}
                  placeholder="Select industry..."
                  emptyMessage="No industry found."
                  className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onChange={setIndustry}
                  value={industry}
                  disabled={isLoading}
                />
                {renderErrorLine(errors.industry)}
              </div>
              <div>
                <div className="editorWrapper border border-input rounded-lg h-[462px]">
                  <MDXEditor
                    onChange={setJobDescription}
                    markdown={jobDescription}
                    readOnly={isLoading}
                    plugins={[
                      toolbarPlugin({
                        toolbarContents: () => (
                          <>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                          </>
                        ),
                      }),
                      listsPlugin(),
                      quotePlugin(),
                      headingsPlugin(),
                      frontmatterPlugin(),
                      diffSourcePlugin(),
                    ]}
                    contentEditableClassName={`prose text-sm dark:prose-invert max-w-none h-[420px] overflow-y-auto ${
                      isLoading ? "cursor-not-allowed" : ""
                    }`}
                  />
                </div>
                {renderErrorLine(errors.jobDescription)}
              </div>
            </div>
          </div>

          {/* Technical Skills Section */}
          <div className="p-4 border rounded-lg dark:bg-gray-800">
            <div className="flex flex-col gap-2">
              <div className="flex items-center mb-2">
                <h3 className="font-medium">Technical Skills</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-4 text-black dark:text-white cursor-pointer ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Example: React, Python, SQL...</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add Technical Skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  className="whitespace-nowrap text-black dark:text-white"
                  variant="secondary"
                  disabled={newSkill.trim() === "" || isLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>

              <div className="space-y-2">
                {Object.keys(skills).map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <Badge className="justify-center dark:text-white w-40 block text-center py-1 bg-secondary hover:bg-secondary/90">
                      {skill}
                    </Badge>
                    <div className="flex-1">
                      <Slider
                        value={[skills[skill]]}
                        onValueChange={(value) => {
                          setSkills({
                            ...skills,
                            [skill]: value[0],
                          });
                        }}
                        min={0}
                        max={100}
                        className="text-white"
                        step={1}
                      />
                    </div>

                    <div className="w-8 text-right font-medium text-sm">
                      <span>{skills[skill]}%</span>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {renderErrorLine(errors.skills)}

            {Object.keys(skills).length > 0 && (
              <div className="text-md font-medium text-slate-500 dark:text-slate-200 text-right mt-4">
                <span>Total Weight: </span>
                <span
                  className={
                    totalWeight === 100 ? "text-green-500" : "text-red-500"
                  }
                >
                  {totalWeight}%
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              disabled={isLoading}
              className="dark:text-white"
              onClick={submit}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding Candidates...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find Matching Candidates
                </>
              )}
            </Button>
          </div>

          {/* Results Dialog */}
          <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Top 5 Matching Candidates</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{match.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {match.explanation}
                      </p>
                    </div>
                    <Badge
                      variant={match.score >= 90 ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {match.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobMatchingTab;
