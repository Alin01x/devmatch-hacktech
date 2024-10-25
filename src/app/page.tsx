"use client";

import React from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobMatchingTab from "@/components/JobMatchingTab";
import CVMatchingTab from "@/components/CVMatchingTab";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

const DevMatchUI = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/icons/browsing.png"
            alt="DevMatch Logo"
            width={72}
            height={72}
            className="mr-4"
          />
          <div>
            <h1 className="text-5xl font-bold brand-orange font-pixelated">
              #DevMatch
            </h1>
            <p className="text-slate-500 text-lg font-medium mediumGray">
              Intelligent Talent Allocation System
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <Tabs defaultValue="jobs">
        <TabsList className="mb-4">
          <TabsTrigger value="jobs">Job Description Matching</TabsTrigger>
          <TabsTrigger value="cv">CV Matching</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <JobMatchingTab />
        </TabsContent>

        <TabsContent value="cv">
          <CVMatchingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevMatchUI;
