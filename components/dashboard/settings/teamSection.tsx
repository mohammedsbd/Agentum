import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  user_email: string;
  image?: string;
  role?: string;
  status?: string;
}

const TeamSection = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [openDiaog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/team/fetch");
      if (res.ok) {
        const data = await res.json();
        setTeam(data.team);
      }
    } catch (error) {
      console.log(error, "Team member fetching error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail) return;

    setIsAdding(true);
    try {
      const res = await fetch("/api/team/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newMemberEmail, name: newMemberName }),
      });

      if (res.ok) {
        setNewMemberEmail("");
        setNewMemberName("");
        setOpenDialog(false);
        fetchTeam();
      }
    } catch (error) {
      console.error("Failed to add member:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            Team Members
          </CardTitle>
          <CardDescription className="text-sm font-medium">Manage your team and their access.</CardDescription>
        </div>
        <Dialog open={openDiaog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="font-bold">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border text-foreground sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-bold">Add Team Member</DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                Add a new member to your organization. They will be added
                immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-foreground font-bold text-xs uppercase tracking-wider">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="bg-muted/20 border-border text-foreground font-medium"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-foreground font-bold text-xs uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="john@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="bg-muted/20 border-border text-foreground font-medium"
                />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setOpenDialog(false)}
                  className="font-bold border-border"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddMember}
                  disabled={isAdding}
                  className="font-bold"
                >
                  {isAdding ? "Adding..." : "Add Member"}
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground text-sm font-medium">
              Loading team...
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm font-medium">
              No team members found.
            </div>
          ) : (
            <div className="grid gap-4">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border shadow-inner">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                        {member.name?.slice(0, 2).toUpperCase() || "UN"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">
                          {member.name || "Unknown"}
                        </p>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "capitalize font-bold text-[10px]",
                            member.status === "active"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          )}
                        >
                          {member.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {member.user_email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={"outline"}
                      className="capitalize text-muted-foreground font-bold text-[10px] border-border"
                    >
                      {member.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamSection;
