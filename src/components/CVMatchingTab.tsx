import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";

const CVMatchingTab = () => {
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
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600">
              Drag and drop your CV here, or click to browse
            </p>
          </div>

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
