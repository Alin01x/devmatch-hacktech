"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileText, Loader2, Search, Upload } from "lucide-react";
import mammoth from "mammoth";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CVMatchingTab = () => {
  const [cvContent, setCvContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

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

  const submit = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cv-matching", {
        method: "POST",
        body: JSON.stringify({
          fullContent: cvContent,
        }),
      });

      const data = await response.json();
      console.log("received response", data);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "An error occurred while finding matching job.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
        </div>
      </CardContent>
    </Card>
  );
};

export default CVMatchingTab;
