"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileText, Search, Upload, Briefcase, Loader2 } from "lucide-react";
import mammoth from "mammoth";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SAMPLE_JOB_MATCH } from "@/types/constants";
import { JobDescription } from "@/types/JobDescription";
import { toast } from "@/hooks/use-toast";

const CVMatchingTab = () => {
  const [cvContent, setCvContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [matchingJob, setMatchingJob] = useState<JobDescription | null>(null);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith(".docx")) {
      setFileName(file.name);
      const arrayBuffer = await file.arrayBuffer();
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        setCvContent(text);
      } catch (error) {
        toast({
          title: "Error",
          description:
            "Error extracting text from docx. Please try with a different document.",
          variant: "destructive",
        });
        console.error("Error extracting text from docx:", error);
      }
    } else {
      toast({
        title: "Error",
        description: "Unsupported file format. Please upload a .docx file.",
        variant: "destructive",
      });
      console.error("Unsupported file format. Please upload a .docx file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: false,
  });

  const handleFindMatchingJob = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMatchingJob(SAMPLE_JOB_MATCH);
      setIsResultsOpen(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          CV Matching
        </CardTitle>
        <CardDescription>
          Upload a CV to find the best matching job requirement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Upload Section */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center dark:bg-gray-800 cursor-pointer
              ${isDragActive ? "border-primary" : "border-gray-300"}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            {fileName ? (
              <div>
                <p className="text-sm text-gray-600">File added: </p>
                <p className="text font-medium text-gray-600">{fileName}</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? "Drop the file here"
                    : "Drag and drop your CV here, or click to select"}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Supported format: .docx (Microsoft Word)
                </p>
              </>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={submit} disabled={!cvContent || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding matching job...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find Matching Job
                </>
              )}
            </Button>
          </div>

          {/* CV Content Display */}
          {cvContent && (
            <div className="p-4 border rounded-lg dark:bg-gray-800 light:bg-gray-50">
              <h3 className="font-medium mb-4">CV Content</h3>
              <pre className="whitespace-pre-wrap text-sm">{cvContent}</pre>
            </div>
          )}

          {/* Results Dialog */}
          <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
            <DialogContent className="md:max-w-[800px]  max-h-screen overflow-y-auto md:pb-6 pb-10">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="w-6 h-6" />
                  Best Matching Job
                </DialogTitle>
              </DialogHeader>
              {/* {matchingJob && ( */}
              {SAMPLE_JOB_MATCH && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">
                      {SAMPLE_JOB_MATCH.jobTitle}
                    </h3>
                    <Badge variant="secondary" className="text-sm">
                      {SAMPLE_JOB_MATCH.experienceLevel}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Industry:</span>{" "}
                    <span className="font-normal">
                      {SAMPLE_JOB_MATCH.industry}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2 font-medium">
                      {SAMPLE_JOB_MATCH.skills.map((skill) => (
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
                    <p className="text-sm whitespace-pre-wrap font-normal">
                      {SAMPLE_JOB_MATCH.detailedDescription}
                    </p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVMatchingTab;
