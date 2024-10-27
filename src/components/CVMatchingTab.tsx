"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileText, Search, Upload, Loader2 } from "lucide-react";
import mammoth from "mammoth";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { MatchingJob } from "@/types/MatchResult";
import NoResultsDialog from "./NoResultsDialog";
import BestJobResultDialog from "./BestJobResultDialog";

const CVMatchingTab = () => {
  const [cvContent, setCvContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [matchingJob, setMatchingJob] = useState<MatchingJob | null>(null);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

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

  const handleFindMatchingJob = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cv-matching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullContent: cvContent }),
      });
      const data = await response.json();

      if (data.data) {
        setMatchingJob(data.data);
        setIsResultsOpen(true);
      } else {
        setShowNoResults(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while finding a matching job.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  File added:{" "}
                </p>
                <p className="text font-medium text-gray-600 dark:text-gray-200">
                  {fileName}
                </p>
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
            <Button
              onClick={handleFindMatchingJob}
              disabled={!cvContent || loading}
            >
              {loading ? (
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

          {/* Custom Modal for Matching Job */}
          <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
            {matchingJob && <BestJobResultDialog matchingJob={matchingJob} />}
          </Dialog>
          <NoResultsDialog
            isOpen={showNoResults}
            onOpenChange={setShowNoResults}
            type="jobs"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CVMatchingTab;
