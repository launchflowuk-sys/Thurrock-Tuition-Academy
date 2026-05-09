import { useState } from "react";
import {
  useListIntakeSubmissions, getListIntakeSubmissionsQueryKey,
  useUpdateIntakeSubmission, useDeleteIntakeSubmission,
  useReplyToIntakeSubmission,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Mail, Phone, School, Trash2, User, Target, ChevronDown, ChevronUp, Send, Info } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  reviewing: "bg-amber-100 text-amber-800 border-amber-200",
  enrolled: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  enrolled: "Enrolled",
  declined: "Declined",
};

type Submission = {
  id: number;
  parentName: string;
  childName: string;
  childAge: number;
  email: string;
  contactNumber: string;
  subject: string;
  level: string;
  currentSchool?: string | null;
  currentAttainment?: string | null;
  goals?: string | null;
  previousTutoring?: string | null;
  howDidYouHear?: string | null;
  preferredSlot?: string | null;
  additionalInfo?: string | null;
  status: string;
  createdAt: string;
};

function ProfileRow({ label, value, icon: Icon }: { label: string; value?: string | null; icon?: React.ElementType }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      {Icon && <Icon size={13} className="text-muted-foreground shrink-0 mt-0.5" />}
      <div>
        <span className="text-muted-foreground text-xs">{label}: </span>
        <span className="text-foreground">{value}</span>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const { data: submissions, isLoading } = useListIntakeSubmissions({ query: { queryKey: getListIntakeSubmissionsQueryKey() } });
  const updateSubmission = useUpdateIntakeSubmission();
  const deleteSubmission = useDeleteIntakeSubmission();
  const replyToSubmission = useReplyToIntakeSubmission();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [replyingTo, setReplyingTo] = useState<Submission | null>(null);
  const [replyForm, setReplyForm] = useState({ subject: "", body: "" });
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleExpand = (id: number) => setExpandedIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const handleStatusChange = async (id: number, status: string) => {
    await updateSubmission.mutateAsync({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListIntakeSubmissionsQueryKey() });
        toast({ title: `Status updated to ${STATUS_LABELS[status] ?? status}` });
      },
    });
  };

  const handleDelete = async (id: number) => {
    await deleteSubmission.mutateAsync({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListIntakeSubmissionsQueryKey() });
        toast({ title: "Application deleted" });
      },
    });
  };

  const openReply = (sub: Submission) => {
    setReplyingTo(sub);
    setReplyForm({
      subject: `Re: Application for ${sub.childName} – Thurrock Tuition Academy`,
      body: `Dear ${sub.parentName},\n\nThank you for applying to Thurrock Tuition Academy for ${sub.childName}.\n\n`,
    });
  };

  const handleSendReply = async () => {
    if (!replyingTo || !replyForm.subject || !replyForm.body) {
      toast({ title: "Please complete both the subject and message", variant: "destructive" });
      return;
    }
    try {
      await replyToSubmission.mutateAsync({
        id: replyingTo.id,
        data: { subject: replyForm.subject, body: replyForm.body },
      });
      toast({ title: "Email sent!", description: `Reply sent to ${replyingTo.email}` });
      setReplyingTo(null);
      setReplyForm({ subject: "", body: "" });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast({
        title: "Failed to send email",
        description: msg ?? "Please check your SMTP settings in Settings → Email.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-serif text-primary">Applications</h1>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
      </div>
    );
  }

  const sorted = [...(submissions ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const filtered = statusFilter === "all" ? sorted : sorted.filter(s => s.status === statusFilter);
  const newCount = sorted.filter(s => s.status === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Applications</h1>
          {newCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              <span className="font-semibold text-blue-600">{newCount} new</span> application{newCount !== 1 ? "s" : ""} awaiting review
            </p>
          )}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ({sorted.length})</SelectItem>
            {["new", "reviewing", "enrolled", "declined"].map(s => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]} ({sorted.filter(x => x.status === s).length})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ClipboardList size={40} className="mx-auto mb-4 opacity-30" />
          <p>No applications found. They'll appear here when parents complete the application form on the website.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((sub) => {
            const isExpanded = expandedIds.has(sub.id);
            return (
              <Card key={sub.id} className={`shadow-sm transition-all ${sub.status === "new" ? "border-blue-200 bg-blue-50/30" : ""}`} data-testid={`card-intake-${sub.id}`}>
                <CardContent className="p-5">
                  {/* Header row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base">{sub.childName}</span>
                        <Badge className="text-xs">Age {sub.childAge}</Badge>
                        <Badge variant="outline" className="text-xs">{sub.subject} · {sub.level}</Badge>
                        <Badge className={`text-xs border ${STATUS_STYLES[sub.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {STATUS_LABELS[sub.status] ?? sub.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><User size={12} />{sub.parentName}</span>
                        <a href={`tel:${sub.contactNumber}`} className="flex items-center gap-1 text-primary hover:underline"><Phone size={12} />{sub.contactNumber}</a>
                        <a href={`mailto:${sub.email}`} className="flex items-center gap-1 text-primary hover:underline"><Mail size={12} />{sub.email}</a>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Submitted {new Date(sub.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => openReply(sub)}>
                        <Mail size={12} /> Reply
                      </Button>
                      <Select value={sub.status} onValueChange={(val) => handleStatusChange(sub.id, val)}>
                        <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["new", "reviewing", "enrolled", "declined"].map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(sub.id)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  {/* Goals preview */}
                  {sub.goals && (
                    <div className="mt-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Target size={13} className="text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-foreground leading-relaxed"><span className="font-medium text-primary">Goal:</span> {sub.goals}</p>
                      </div>
                    </div>
                  )}

                  {/* Expand toggle */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(sub.id)}
                    className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {isExpanded ? "Hide" : "View"} full profile
                  </button>

                  {/* Expanded profile */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-2 gap-3">
                      <ProfileRow label="Current school" value={sub.currentSchool} icon={School} />
                      <ProfileRow label="Preferred slot" value={sub.preferredSlot} icon={Info} />
                      <ProfileRow label="Current attainment" value={sub.currentAttainment} icon={Info} />
                      <ProfileRow label="How they heard" value={sub.howDidYouHear} icon={Info} />
                      {sub.previousTutoring && (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Struggles / previous tutoring:</p>
                          <p className="text-sm text-foreground leading-relaxed">{sub.previousTutoring}</p>
                        </div>
                      )}
                      {sub.additionalInfo && (
                        <div className="sm:col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Additional info:</p>
                          <p className="text-sm text-foreground leading-relaxed italic">&ldquo;{sub.additionalInfo}&rdquo;</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reply Dialog */}
      <Dialog open={!!replyingTo} onOpenChange={(open) => { if (!open) setReplyingTo(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif">Reply to {replyingTo?.parentName}</DialogTitle>
            <p className="text-sm text-muted-foreground">Sending to: <strong>{replyingTo?.email}</strong></p>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Subject</label>
              <Input value={replyForm.subject} onChange={e => setReplyForm(f => ({ ...f, subject: e.target.value }))} placeholder="Email subject" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Message</label>
              <Textarea
                value={replyForm.body}
                onChange={e => setReplyForm(f => ({ ...f, body: e.target.value }))}
                rows={12}
                placeholder="Write your reply here..."
                className="font-mono text-sm resize-y"
              />
            </div>
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <Info size={13} className="shrink-0 mt-0.5" />
              <span>This email will be sent directly from your configured SMTP email address. Make sure email is configured in <strong>Settings → Email</strong> before sending.</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyingTo(null)}>Cancel</Button>
            <Button onClick={handleSendReply} disabled={replyToSubmission.isPending} className="gap-2">
              <Send size={15} />
              {replyToSubmission.isPending ? "Sending…" : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
