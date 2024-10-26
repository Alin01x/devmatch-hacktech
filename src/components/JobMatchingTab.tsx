"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

// Define the Zod schema
const jobMatchingSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  industry: z.string().min(1, "Industry is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  skills: z
    .array(
      z.object({
        name: z.string(),
        weight: z.number(),
      })
    )
    .min(1, "At least one technical skill is required"),
});

// Infer the TypeScript type from the schema
type JobMatchingFormData = z.infer<typeof jobMatchingSchema>;

// Update the type definition
type Skill = {
  name: string;
  weight: number;
};

const JobMatchingTab: React.FC = () => {
  const [jobTitle, setJobTitle] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    clearErrors,
  } = useForm<JobMatchingFormData>({
    resolver: zodResolver(jobMatchingSchema),
    defaultValues: {
      jobTitle: "",
      industry: "",
      jobDescription: "",
      skills: [],
    },
  });

  useEffect(() => {
    if (jobTitle) clearErrors("jobTitle");
    if (skills.length > 0) clearErrors("skills");
    if (industry) clearErrors("industry");
    if (jobDescription) clearErrors("jobDescription");
  }, [jobTitle, skills, industry, jobDescription, clearErrors]);

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value);
    setValue("jobDescription", value);
  };

  const handleIndustryChange = (value: string) => {
    setIndustry(value);
    setValue("industry", value);
  };

  const handleAddSkill = (): void => {
    const trimmedSkill = newSkill.trim();
    const skillExists = skills.some(
      (skill) => skill.name.toLowerCase() === trimmedSkill.toLowerCase()
    );

    if (trimmedSkill && !skillExists) {
      const initialWeight = skills.length === 0 ? 100 : 0;
      const updatedSkills = [
        ...skills,
        { name: trimmedSkill, weight: initialWeight },
      ];
      setSkills(updatedSkills);
      setValue("skills", updatedSkills);
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string): void => {
    const updatedSkills = skills.filter(
      (skill) => skill.name !== skillToRemove
    );

    // If there's only one skill left, set its weight to 100
    if (updatedSkills.length === 1) {
      updatedSkills[0].weight = 100;
    }

    setSkills(updatedSkills);
    setValue("skills", updatedSkills);
  };

  const handleWeightChange = (skillName: string, value: number[]): void => {
    const updatedSkills = skills.map((skill) =>
      skill.name === skillName ? { ...skill, weight: value[0] } : skill
    );
    setSkills(updatedSkills);
    setValue("skills", updatedSkills);
  };

  const onSubmit = async (data: JobMatchingFormData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(data);
      setMatches([
        {
          name: "John Doe",
          score: 92,
          explanation: "Strong match in banking domain & React expertise",
        },
        {
          name: "Jane Smith",
          score: 88,
          explanation: "Excellent technical skills match",
        },
        {
          name: "Bob Johnson",
          score: 85,
          explanation: "Similar industry experience",
        },
        {
          name: "Alice Brown",
          score: 82,
          explanation: "Good overall skill alignment",
        },
        {
          name: "Chris Wilson",
          score: 78,
          explanation: "Matching domain knowledge",
        },
      ]);
      setIsResultsOpen(true); // Open the results dialog
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalWeight = (): number => {
    return skills.reduce((sum, skill) => sum + skill.weight, 0);
  };

  const totalWeight = calculateTotalWeight();
  const isWeightValid = skills.length === 0 || totalWeight === 100;

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="p-4 border rounded-lg dark:bg-gray-800 bg-gray-50">
            <h3 className="font-medium mb-2">Job Details</h3>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Job Title"
                  {...register("jobTitle")}
                  value={jobTitle}
                  onChange={(e) => {
                    setJobTitle(e.target.value);
                    setValue("jobTitle", e.target.value);
                  }}
                />
                {errors.jobTitle && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
              <div>
                <Combobox
                  items={INDUSTRIES}
                  placeholder="Select industry..."
                  emptyMessage="No industry found."
                  className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onChange={handleIndustryChange}
                  value={industry}
                />
                {errors.industry && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.industry.message}
                  </p>
                )}
              </div>
              <div>
                <div className="editorWrapper border border-input rounded-lg h-[462px]">
                  <MDXEditor
                    onChange={handleJobDescriptionChange}
                    markdown={jobDescription}
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
                    contentEditableClassName="prose text-sm dark:prose-invert max-w-none h-[420px] overflow-y-auto"
                  />
                </div>
                {errors.jobDescription && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.jobDescription.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Technical Skills Section */}
          <div className="p-4 border rounded-lg dark:bg-gray-800">
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <h3 className="font-medium">Technical Skills</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-4 text-black dark:text-white cursor-pointer ml-2" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Example: React, Python, SQL</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-sm font-medium mb-2">
                Total Weight:{" "}
                <span
                  className={
                    skills.length === 0
                      ? "text-black dark:text-white"
                      : isWeightValid
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {totalWeight}%
                </span>
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add Technical Skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                />
                <Button
                  type="button"
                  onClick={handleAddSkill}
                  className="whitespace-nowrap text-black dark:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>

              <div className="space-y-2">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-4 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <Badge className="justify-center dark:text-white w-48 block text-center py-1 bg-slate-">
                      {skill.name}
                    </Badge>
                    <div className="flex-1">
                      <Slider
                        value={[skill.weight]}
                        onValueChange={(value) =>
                          handleWeightChange(skill.name, value)
                        }
                        max={100}
                        className="text-white"
                        step={1}
                      />
                    </div>
                    <span className="text-sm">{skill.weight}%</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSkill(skill.name)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            {errors.skills && (
              <p className="text-red-500 text-sm mt-2">
                {errors.skills.message?.toString() ?? "Invalid skills"}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              disabled={isSubmitting || loading || !isWeightValid}
              className="w-full dark:text-white"
            >
              {isSubmitting || loading ? (
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
        </form>
      </CardContent>
    </Card>
  );
};

export default JobMatchingTab;
