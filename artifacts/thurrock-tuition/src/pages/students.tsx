import { useState } from "react";
import { Link } from "wouter";
import { useListStudents, getListStudentsQueryKey, useCreateStudent } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, ChevronRight } from "lucide-react";

const SUBJECTS = ["Maths", "English", "Science"];
const LEVELS = ["SATs", "11+", "KS3", "GCSE", "A-Level"];
const SLOTS = ["Morning Session 1", "Morning Session 2", "Afternoon Session 1", "Afternoon Session 2"];

export default function StudentsPage() {
  const { data: students, isLoading } = useListStudents();
  const createStudent = useCreateStudent();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", parentName: "", contactNumber: "", subject: "Maths", level: "GCSE", sessionSlot: "Morning Session 1" });

  const filtered = students?.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.parentName.toLowerCase().includes(search.toLowerCase()) ||
    s.subject.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleCreate = async () => {
    if (!form.name || !form.parentName || !form.contactNumber || !form.age) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    await createStudent.mutateAsync(
      { data: { ...form, age: Number(form.age) } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListStudentsQueryKey() });
          toast({ title: "Student added successfully" });
          setShowAdd(false);
          setForm({ name: "", age: "", parentName: "", contactNumber: "", subject: "Maths", level: "GCSE", sessionSlot: "Morning Session 1" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-serif text-primary">Students</h1>
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-primary">Students</h1>
        <Button onClick={() => setShowAdd(true)} data-testid="button-add-student">
          <UserPlus size={16} className="mr-2" /> Add Student
        </Button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, parent, or subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="input-search-students"
        />
      </div>

      <div className="grid gap-3">
        {filtered.map((student) => (
          <Link key={student.id} href={`/students/${student.id}`}>
            <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-testid={`card-student-${student.id}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{student.name}</span>
                    <span className="text-muted-foreground text-sm">age {student.age}</span>
                    <Badge variant="outline" className="text-xs">{student.level}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {student.subject} · {student.sessionSlot} · Parent: {student.parentName}
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No students found.</div>
        )}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Add New Student</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Input placeholder="Student name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} data-testid="input-student-name" />
            <Input placeholder="Age *" type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} data-testid="input-student-age" />
            <Input placeholder="Parent/Guardian name *" value={form.parentName} onChange={e => setForm(f => ({ ...f, parentName: e.target.value }))} data-testid="input-parent-name" />
            <Input placeholder="Contact number *" value={form.contactNumber} onChange={e => setForm(f => ({ ...f, contactNumber: e.target.value }))} data-testid="input-contact-number" />
            <Select value={form.subject} onValueChange={v => setForm(f => ({ ...f, subject: v }))}>
              <SelectTrigger data-testid="select-subject"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={form.level} onValueChange={v => setForm(f => ({ ...f, level: v }))}>
              <SelectTrigger data-testid="select-level"><SelectValue placeholder="Level" /></SelectTrigger>
              <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={form.sessionSlot} onValueChange={v => setForm(f => ({ ...f, sessionSlot: v }))}>
              <SelectTrigger data-testid="select-session-slot"><SelectValue placeholder="Session Slot" /></SelectTrigger>
              <SelectContent>{SLOTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createStudent.isPending} data-testid="button-save-student">
              {createStudent.isPending ? "Adding..." : "Add Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
