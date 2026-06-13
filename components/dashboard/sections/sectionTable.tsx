import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import { getStatusBadge, getToneBadge } from "./sectionBadges";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

interface SectionTableProps {
  sections: Section[];
  isLoading: boolean;
  onPreview: (section: Section) => void;
  onCreateSection: () => void;
}

const SectionsTable = ({
  sections,
  isLoading,
  onPreview,
  onCreateSection,
}: SectionTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
            Name
          </TableHead>
          <TableHead className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
            Sources
          </TableHead>
          <TableHead className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
            Tone
          </TableHead>
          <TableHead className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
            Scope
          </TableHead>
          <TableHead className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
            Status
          </TableHead>
          <TableHead className="text-xs uppercase font-bold text-muted-foreground tracking-wider text-right">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="h-48 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-muted-foreground border-t-primary rounded-full animate-spin" />
                <span>Loading sections...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : sections?.length > 0 ? (
          sections.map((section) => (
            <TableRow
              key={section.id}
              className="border-border group transition-colors hover:bg-muted/50"
            >
              <TableCell className="font-bold text-foreground group-hover:text-primary transition-colors">
                {section.name}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm font-medium">
                {section.sourceCount}
                <span className="ml-1 text-muted-foreground/60">sources</span>
              </TableCell>
              <TableCell>{getToneBadge(section.tone)}</TableCell>
              <TableCell className="text-muted-foreground text-sm font-medium">
                {section.scopeLabel}
              </TableCell>
              <TableCell>{getStatusBadge(section.status)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => onPreview(section)}
                >
                  Preview
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-48 text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <ShieldAlert className="w-8 h-8 text-muted-foreground/40" />
                <span className="text-muted-foreground font-medium">No sections defined yet.</span>
                <Button
                  variant="link"
                  className="text-primary font-bold"
                  onClick={onCreateSection}
                >
                  Create your first section
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SectionsTable;
