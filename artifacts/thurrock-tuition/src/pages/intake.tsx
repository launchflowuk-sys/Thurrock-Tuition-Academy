import { useListIntakeSubmissions, getListIntakeSubmissionsQueryKey, useUpdateIntakeSubmission, useDeleteIntakeSubmission } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Mail, Phone, School, Trash2, User } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  reviewing: "bg-amber-100 text-amber-800 border-amber-200",
  enrolled: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
};

export default function IntakePage() {
  const { data: submissions, isLoading } = useListIntakeSubmissions({ query: { queryKey: getListIntakeSubmissionsQueryKey() } });
  const updateSubmission = useUpdateIntakeSubmission();
  const deleteSubmission = useDeleteIntakeSubmission();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = async (id: number, status: string) => {
    await updateSubmission.mutateAsync({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListIntakeSubmissionsQueryKey() });
        toast({ title: `Status updated to ${status}` });
      },
    });
  };

  const handleDelete = async (id: number) => {
    await deleteSubmission.mutateAsync({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListIntakeSubmissionsQueryKey() });
        toast({ title: "Submission deleted" });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-serif text-primary">Intake Forms</h1>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
      </div>
    );
  }

  const sorted = [...(submissions ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const newCount = sorted.filter(s => s.status === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Intake Forms</h1>
          {newCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-semibold text-blue-600">{newCount} new</span> submission{newCount !== 1 ? "s" : ""} awaiting review
            </p>
          )}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ClipboardList size={40} className="mx-auto mb-4 opacity-30" />
          <p>No intake submissions yet. They'll appear here when parents complete the enrolment form.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sorted.map((sub) => (
            <Card key={sub.id} className={`shadow-sm ${sub.status === "new" ? "border-blue-200 bg-blue-50/30" : ""}`} data-testid={`card-intake-${sub.id}`}>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base">{sub.childName}</span>
                      <Badge className="text-xs">Age {sub.childAge}</Badge>
                      <Badge variant="outline" className="text-xs">{sub.subject} · {sub.level}</Badge>
                      <Badge className={`text-xs border ${STATUS_STYLES[sub.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User size={13} />
                        <span>Parent: <strong className="text-foreground">{sub.parentName}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} />
                        <a href={`tel:${sub.contactNumber}`} className="text-primary hover:underline">{sub.contactNumber}</a>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} />
                        <a href={`mailto:${sub.email}`} className="text-primary hover:underline">{sub.email}</a>
                      </div>
                      {sub.currentSchool && (
                        <div className="flex items-center gap-1.5">
                          <School size={13} />
                          <span>{sub.currentSchool}</span>
                        </div>
                      )}
                    </div>

                    {sub.additionalInfo && (
                      <p className="text-sm text-muted-foreground italic border-t pt-2">
                        &ldquo;{sub.additionalInfo}&rdquo;
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date(sub.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Select value={sub.status} onValueChange={(val) => handleStatusChange(sub.id, val)}>
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="enrolled">Enrolled</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(sub.id)}
                      data-testid={`button-delete-intake-${sub.id}`}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
