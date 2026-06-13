"use client";

import TeamSection from "@/components/dashboard/settings/teamSection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface OrganizationData {
  id: string;
  business_name: string;
  website_url: string;
  created_at: string;
}

const SettingPage = () => {
  const [organizationData, setOrganizationData] = useState<OrganizationData>();

  useEffect(() => {
    const fetchOrganizationData = async () => {
      const response = await fetch("/api/organization/fetch");
      const data = await response.json();
      setOrganizationData(data.organization);
    };
    fetchOrganizationData();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1 font-medium">
          Manage workspace preferences, security, and billing.
        </p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">
            Workspace Settings
          </CardTitle>
          <CardDescription className="text-sm font-medium">
            General settings for your organization. (Read Only)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Workspace Name</Label>
              <div className="p-4 rounded-xl bg-muted/20 border border-border text-foreground text-sm font-bold shadow-inner">
                {organizationData?.business_name}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Primary Website</Label>
              <div className="p-4 rounded-xl bg-muted/20 border border-border text-foreground text-sm font-bold shadow-inner">
                {organizationData?.website_url}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Default Language</Label>
              <div className="p-4 rounded-xl bg-muted/20 border border-border text-foreground text-sm font-bold shadow-inner">
                English
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Timezone</Label>
              <div className="p-4 rounded-xl bg-muted/20 border border-border text-foreground text-sm font-bold shadow-inner">
                UTC (GMT+0)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TeamSection />

      <Card className="border-destructive/10 bg-destructive/5 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-destructive">
            Danger Zone
          </CardTitle>
          <CardDescription className="text-destructive/70 font-medium">
            Irreversible actions for this workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">
                Delete Workspace
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                Permanently delete all knowledge, conversations, and settings.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="font-bold px-6"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border text-foreground shadow-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground font-medium">
                    This action cannot be undone. This will permanently delete
                    your workspace and remove all associated data from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                  <AlertDialogCancel className="font-bold border-border">
                    Cancel
                  </AlertDialogCancel>
                  <form action="/api/organization/delete" method="POST" style={{ display: "contents" }}>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold border-none"
                      type="submit"
                    >
                      Delete Workspace
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingPage;
