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
import { Briefcase, Plus, X, Search } from "lucide-react";
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

const JobMatchingTab = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [skillWeights, setSkillWeights] = useState({});
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setSkillWeights({
        ...skillWeights,
        [newSkill]: 0,
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
    const { [skillToRemove]: _, ...remainingWeights } = skillWeights;
    setSkillWeights(remainingWeights);
  };

  const handleWeightChange = (skill, value) => {
    setSkillWeights({
      ...skillWeights,
      [skill]: value[0],
    });
  };

  const handleJobDescriptionChange = (content: string) => {
    setJobDescription(content);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Here you would integrate with your backend API
    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
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
    } finally {
      setLoading(false);
    }
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
        <div className="space-y-6">
          {/* Job Description Input Section */}
          <div className="p-4 border rounded-lg dark:bg-gray-800 bg-gray-50">
            <h3 className="font-medium mb-2">Job Details</h3>
            <div className="space-y-4">
              <Input
                placeholder="Job Title"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <Combobox
                items={INDUSTRIES}
                placeholder="Select industry..."
                emptyMessage="No industry found."
                className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onChange={setIndustry}
                value={industry}
              />
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
            </div>
          </div>

          {/* Technical Skills Section */}
          <div className="p-4 border rounded-lg dark:bg-gray-800">
            <h3 className="font-medium mb-2">Technical Skills</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add Technical Skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                />
                <Button
                  onClick={handleAddSkill}
                  className="whitespace-nowrap"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </Button>
              </div>

              <div className="space-y-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-4 p-2 bg-gray-50 rounded"
                  >
                    <Badge>{skill}</Badge>
                    <div className="flex-1">
                      <Slider
                        value={[skillWeights[skill] || 0]}
                        onValueChange={(value) =>
                          handleWeightChange(skill, value)
                        }
                        max={100}
                        step={1}
                      />
                    </div>
                    <span className="w-12 text-sm">
                      {skillWeights[skill] || 0}%
                    </span>
                    <Button
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
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                "Finding matching candidates..."
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find Matching Candidates
                </>
              )}
            </Button>
          </div>

          {/* Results Section */}
          {matches.length > 0 && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-4">Top 5 Matching Candidates</h3>
              <div className="space-y-3">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded"
                  >
                    <div>
                      <h3 className="font-medium">{match.name}</h3>
                      <p className="text-sm text-gray-600">
                        {match.explanation}
                      </p>
                    </div>
                    <Badge
                      variant={match.score >= 90 ? "default" : "secondary"}
                    >
                      {match.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobMatchingTab;
