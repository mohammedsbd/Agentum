"use client";

import SectionFormFields from "@/components/dashboard/sections/sectionFormFields";
import SectionsTable from "@/components/dashboard/sections/sectionTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

interface KnowledgeSource {
  id: string;
  name: string;
  type: string;
  status: string;
  extraction_status?: string | null;
}

const INITIAL_FORM_DATA: SectionFormData = {
  name: "",
  description: "",
  tone: "neutral",
  allowedTopics: "",
  blockedTopics: "",
  fallbackBehavior: "escalate",
};

const Page = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>(
    []
  );
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState(true);
  const [formData, setFormData] = useState<SectionFormData>(INITIAL_FORM_DATA);

  useEffect(() => {
    fetchSections();
  }, []);

  const handleCreateSection = async () => {
    setSelectedSection({
      id: "new",
      name: "",
      description: "",
      sourceCount: 0,
      tone: "neutral",
      scopeLabel: "",
      status: "draft",
    });
    setSelectedSources([]);
    setFormData(INITIAL_FORM_DATA);
    setIsSheetOpen(true);
  };

  useEffect(() => {
    const fetchKnowledgeSources = async () => {
      try {
        const res = await fetch("/api/knowledge/fetch");
        const data = await res.json();
        setKnowledgeSources(
          (data.sources || []).filter(
            (source: KnowledgeSource) =>
              source.status === "active" && source.extraction_status === "ready"
          )
        );
      } catch (error) {
        console.error("Failed to fetch knowledge sources:", error);
      } finally {
        setIsLoadingSources(false);
      }
    };
    fetchKnowledgeSources();
  }, []);

  const fetchSections = async () => {
    try {
      setIsLoadingSections(true);
      const res = await fetch("/api/section/fetch");
      const data = await res.json();

      const transformedSections: Section[] = data.map((section: any) => ({
        id: section.id,
        name: section.name,
        description: section.description,
        sourceCount: section.source_ids?.length || 0,
        source_ids: section.source_ids || [],
        tone: section.tone as Tone,
        scopeLabel: section.allowed_topics || "General",
        allowed_topics: section.allowed_topics,
        blocked_topics: section.blocked_topics,
        status: section.status as SectionStatus,
      }));

      setSections(transformedSections);
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    } finally {
      setIsLoadingSections(false);
    }
  };

  const handleSaveSection = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a section name!");
      return;
    }
    if (!formData.description.trim()) {
      alert("Please enter a description");
      return;
    }
    if (selectedSources.length === 0) {
      alert("Please select at least one knowledge source");
      return;
    }

    setIsSaving(true);

    try {
      const sectionData = {
        ...formData,
        sourceIds: selectedSources,
        status: "active",
      };

      const response = await fetch("/api/section/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionData),
      });

      if (!response.ok) {
        throw new Error("Failed to create section");
      }

      await fetchSections();
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Failed to save section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSection = async () => {
    if (!selectedSection || selectedSection.id === "new") return;

    if (
      !confirm(
        `Are you sure you want to delete "${selectedSection.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(`/api/section/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedSection.id }),
      });
      if (!response.ok) throw new Error("Failed to delete section");

      await fetchSections();
      setIsSheetOpen(false);
    } catch (error) {
      console.error("Failed to delete section:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewSection = async (section: Section) => {
    setSelectedSection(section);
    setFormData({
      name: section.name,
      description: section.description,
      tone: section.tone,
      allowedTopics: section.allowed_topics || "",
      blockedTopics: section.blocked_topics || "",
      fallbackBehavior: "escalate",
    });
    const readySourceIds = new Set(knowledgeSources.map((source) => source.id));
    setSelectedSources(
      (section.source_ids || []).filter((sourceId) => readySourceIds.has(sourceId))
    );
    setIsSheetOpen(true);
  };

  const isPreviewMode = selectedSection?.id !== "new";

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Sections</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Define behavior and tone for different topics.
          </p>
        </div>
        <Button
          onClick={handleCreateSection}
          className="font-bold px-6 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Section
        </Button>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-0">
          <SectionsTable
            sections={sections}
            isLoading={isLoadingSections}
            onPreview={handlePreviewSection}
            onCreateSection={handleCreateSection}
          />
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg border-l border-border bg-card p-0 shadow-2xl flex flex-col h-full">
          {selectedSection && (
            <>
              <SheetHeader className="p-6 border-b border-border">
                <SheetTitle className="text-2xl font-bold text-foreground">
                  {selectedSection.id === "new"
                    ? "Create Section"
                    : "View Section"}
                </SheetTitle>
                <SheetDescription className="text-muted-foreground font-medium">
                  {selectedSection.id === "new"
                    ? "Configure how the AI behaves for this specific topic."
                    : "Review section configuration and data sources."}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                <SectionFormFields
                  formData={formData}
                  setFormData={setFormData}
                  selectedSources={selectedSources}
                  setSelectedSources={setSelectedSources}
                  knowledgeSources={knowledgeSources}
                  isLoadingSources={isLoadingSources}
                  isDisabled={isPreviewMode}
                />
              </div>

              {selectedSection.id === "new" && (
                <div className="p-6 border-t border-border bg-muted/20">
                  <Button
                    className="w-full font-bold h-12 text-base"
                    onClick={handleSaveSection}
                    disabled={isSaving}
                  >
                    {isSaving ? "Creating..." : "Create Section"}
                  </Button>
                </div>
              )}

              {selectedSection.id !== "new" && (
                <div className="p-6 bg-destructive/5 border-t border-destructive/10">
                  <h5 className="text-sm font-bold text-destructive mb-1 uppercase tracking-wider">
                    Danger Zone
                  </h5>
                  <p className="text-xs text-destructive/70 mb-4 font-medium">
                    Deleting this section will remove all associated routing
                    rules.
                  </p>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full font-bold"
                    onClick={handleDeleteSection}
                    disabled={isSaving}
                  >
                    {isSaving ? "Deleting..." : "Delete Section"}
                  </Button>
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Page;
