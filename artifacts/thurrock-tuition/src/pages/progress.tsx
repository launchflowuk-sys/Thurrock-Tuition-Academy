import { useState } from "react";
import { useListProgressNotes, getListProgressNotesQueryKey, useCreateProgressNote, useListStudents } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

const SUBJECTS = ["Maths", "English", "Science"];

export default function ProgressPage() {
  const { data: notes, isLoading } = useListProgressNotes(undefined, { query: { queryKey: getListProgressNotesQueryKey() } });
  const { data: students } = useListStudents();
  const createNote = useCreateProgressNote();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ studentId: "", content: "", subject: "Maths", sessionDate: new Date().toISOString().split("T")[0] });

  const studentMap = Object.fromEntries(students?.map(s => [s.id, s.name]) ?? []);

  const handleCreate = async () => {
    if (!form.studentId || !form.content) { toast({ title: "Please fill in all fields", variant: "destructive" }); return; }
    await createNote.mutateAsync(
      { data: { studentId: Number(form.studentId), content: form.content, subject: form.subject, sessionDate: form.sessionDate } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListProgressNotesQueryKey() });
          toast({ title: "Progress note added" });
          setShowAdd(false);
          setForm({ studentId: "", content: "", subject: "Maths", sessionDate: new Date().toISOString().split("T")[0] });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-serif text-primary">Progress Notes</h1>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  const sorted = [...(notes ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-primary">Progress Notes</h1>
        <Button onClick={() => setShowAdd(true)} data-testid="button-add-progress-note">
          <Plus size={16} className="mr-2" /> Add Note
        </Button>
      </div>

      <div className="grid gap-4">
        {sorted.map((note) => (
          <Card key={note.id} className="shadow-sm" data-testid={`card-progress-${note.id}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-semibold text-sm">{studentMap[note.studentId] ?? `Student #${note.studentId}`}</span>
                <Badge variant="outline" className="text-xs">{note.subject}</Badge>
                <span className="text-xs text-muted-foreground ml-auto">{new Date(note.sessionDate).toLocaleDateString("en-GB")}</span>
              </div>
              <p className="text-sm text-foreground">{note.content}</p>
            </CardContent>
          </Card>
        ))}
        {sorted.length === 0 && <div className="text-center py-12 text-muted-foreground">No progress notes yet.</div>}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Add Progress Note</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Select value={form.studentId} onValueChange={v => setForm(f => ({ ...f, studentId: v }))}>
              <SelectTrigger data-testid="select-note-student"><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>
                {students?.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={form.subject} onValueChange={v => setForm(f => ({ ...f, subject: v }))}>
              <SelectTrigger data-testid="select-note-subject"><SelectValue /></SelectTrigger>
              <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={form.sessionDate} onChange={e => setForm(f => ({ ...f, sessionDate: e.target.value }))} data-testid="input-note-date" />
            <Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write the progress note here..." rows={5} data-testid="textarea-note-content" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createNote.isPending} data-testid="button-save-progress-note">
              {createNote.isPending ? "Saving..." : "Add Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
