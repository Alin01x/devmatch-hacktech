"use client";

import React, { useState, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileText, Search, Upload } from "lucide-react";
import mammoth from "mammoth";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

const CVMatchingTab = () => {
  const [cvContent, setCvContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith(".docx")) {
      setFileName(file.name);
      const arrayBuffer = await file.arrayBuffer();
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        const text = result.value;
        setCvContent(text);
        console.log("CV Content:", text);
      } catch (error) {
        console.error("Error extracting text from docx:", error);
      }
    } else {
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
    // Add your matching logic here
    console.log("Finding matching job...");
    // Simulate processing time
    setTimeout(() => {
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
            <Button
              onClick={handleFindMatchingJob}
              disabled={!cvContent || loading}
            >
              {loading ? (
                "Finding matching job..."
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

          {/* Best Match Section */}
          <div className="p-4 border rounded-lg dark:bg-gray-800 light:bg-gray-50">
            <h3 className="font-medium mb-4">Best Matching Job</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-md dark:bg-gray-800 light:bg-gray-50">
                <div className="flex justify-between items-center mb-3 ">
                  <span className="font-medium">Job Title</span>
                  <span className="text-sm bg-primary px-2 py-1 rounded">
                    Score: 92%
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">Industry match: 90%</p>
                  <p className="text-sm">Technical skills match: 95%</p>
                  <p className="text-sm">Overall description match: 91%</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Match explanation placeholder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CVMatchingTab;
