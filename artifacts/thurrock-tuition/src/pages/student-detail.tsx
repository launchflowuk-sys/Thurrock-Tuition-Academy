import { useState, useRef } from "react";
import { Link } from "wouter";
import {
  useGetStudent, getGetStudentQueryKey, getListStudentsQueryKey,
  useUpdateStudent,
  useListProgressNotes, getListProgressNotesQueryKey, useCreateProgressNote, useUpdateProgressNote, useDeleteProgressNote,
  useListTasks, getListTasksQueryKey, useCreateTask, useUpdateTask, useDeleteTask,
  useListPayments, getListPaymentsQueryKey, useCreatePayment, useUpdatePayment,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, CheckCircle2, Circle, CreditCard, Pencil, Camera, Trash2 } from "lucide-react";

const SUBJECTS = ["Maths", "English", "Science"];
const LEVELS = ["KS2", "KS3", "GCSE", "A-Level", "11+", "Other"];

interface Props { id: number; }

export default function StudentDetailPage({ id }: Props) {
  const { data: student, isLoading } = useGetStudent(id, { query: { enabled: !!id, queryKey: getGetStudentQueryKey(id) } });
  const { data: notes } = useListProgressNotes({ studentId: id }, { query: { queryKey: getListProgressNotesQueryKey({ studentId: id }) } });
  const { data: tasks } = useListTasks({ studentId: id }, { query: { queryKey: getListTasksQueryKey({ studentId: id }) } });
  const { data: payments } = useListPayments({ studentId: id }, { query: { queryKey: getListPaymentsQueryKey({ studentId: id }) } });

  const updateStudent = useUpdateStudent();
  const createNote = useCreateProgressNote();
  const updateNote = useUpdateProgressNote();
  const deleteNote = useDeleteProgressNote();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Edit profile dialog
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", age: "", parentName: "", contactNumber: "", subject: "Maths", level: "GCSE", sessionSlot: "", notes: "" });

  // Note dialogs
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [noteForm, setNoteForm] = useState({ content: "", subject: "Maths", sessionDate: new Date().toISOString().split("T")[0] });

  // Task dialogs
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", subject: "Maths", dueDate: "" });

  // Payment dialogs
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ sessionDate: new Date().toISOString().split("T")[0], amount: "", notes: "" });

  const openEditProfile = () => {
    if (!student) return;
    setEditForm({
      name: student.name,
      age: String(student.age),
      parentName: student.parentName,
      contactNumber: student.contactNumber,
      subject: student.subject,
      level: student.level,
      sessionSlot: student.sessionSlot,
      notes: student.notes ?? "",
    });
    setShowEditDialog(true);
  };

  const handleSaveProfile = async () => {
    await updateStudent.mutateAsync(
      { id, data: { name: editForm.name, age: Number(editForm.age), parentName: editForm.parentName, contactNumber: editForm.contactNumber, subject: editForm.subject, level: editForm.level, sessionSlot: editForm.sessionSlot, notes: editForm.notes || undefined } },
      { onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetStudentQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getListStudentsQueryKey() });
        toast({ title: "Profile updated" });
        setShowEditDialog(false);
      } }
    );
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      const { uploadURL, objectPath } = await urlRes.json() as { uploadURL: string; objectPath: string };
      await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      await updateStudent.mutateAsync(
        { id, data: { photoUrl: objectPath } },
        { onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetStudentQueryKey(id) });
          toast({ title: "Photo updated" });
        } }
      );
    } catch {
      toast({ title: "Photo upload failed", variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Notes
  const openAddNote = () => { setEditingNote(null); setNoteForm({ content: "", subject: "Maths", sessionDate: new Date().toISOString().split("T")[0] }); setShowNoteDialog(true); };
  const openEditNote = (note: { id: number; content: string; subject: string; sessionDate: string }) => { setEditingNote(note.id); setNoteForm({ content: note.content, subject: note.subject, sessionDate: note.sessionDate }); setShowNoteDialog(true); };
  const handleSaveNote = async () => {
    if (editingNote) {
      await updateNote.mutateAsync({ id: editingNote, data: noteForm }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProgressNotesQueryKey({ studentId: id }) }); toast({ title: "Note updated" }); setShowNoteDialog(false); } });
    } else {
      await createNote.mutateAsync({ data: { ...noteForm, studentId: id } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProgressNotesQueryKey({ studentId: id }) }); toast({ title: "Progress note added" }); setShowNoteDialog(false); } });
    }
  };
  const handleDeleteNote = async (noteId: number) => {
    await deleteNote.mutateAsync({ id: noteId }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProgressNotesQueryKey({ studentId: id }) }); toast({ title: "Note deleted" }); } });
  };

  // Tasks
  const openAddTask = () => { setEditingTask(null); setTaskForm({ title: "", description: "", subject: "Maths", dueDate: "" }); setShowTaskDialog(true); };
  const openEditTask = (task: { id: number; title: string; description: string | null; subject: string; dueDate: string }) => { setEditingTask(task.id); setTaskForm({ title: task.title, description: task.description ?? "", subject: task.subject, dueDate: task.dueDate }); setShowTaskDialog(true); };
  const handleSaveTask = async () => {
    if (editingTask) {
      await updateTask.mutateAsync({ id: editingTask, data: taskForm }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListTasksQueryKey({ studentId: id }) }); toast({ title: "Task updated" }); setShowTaskDialog(false); } });
    } else {
      await createTask.mutateAsync({ data: { ...taskForm, studentId: id } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListTasksQueryKey({ studentId: id }) }); toast({ title: "Task assigned" }); setShowTaskDialog(false); } });
    }
  };
  const handleToggleTask = async (taskId: number, completed: boolean) => {
    await updateTask.mutateAsync({ id: taskId, data: { completed } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListTasksQueryKey({ studentId: id }) }) });
  };
  const handleDeleteTask = async (taskId: number) => {
    await deleteTask.mutateAsync({ id: taskId }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListTasksQueryKey({ studentId: id }) }); toast({ title: "Task deleted" }); } });
  };

  // Payments
  const handleAddPayment = async () => {
    await createPayment.mutateAsync(
      { data: { studentId: id, sessionDate: paymentForm.sessionDate, amount: Number(paymentForm.amount), paid: false, notes: paymentForm.notes || undefined } },
      { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey({ studentId: id }) }); toast({ title: "Payment record added" }); setShowPaymentDialog(false); setPaymentForm({ sessionDate: new Date().toISOString().split("T")[0], amount: "", notes: "" }); } }
    );
  };
  const handleMarkPaid = async (paymentId: number) => {
    await updatePayment.mutateAsync({ id: paymentId, data: { paid: true } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey({ studentId: id }) }) });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!student) {
    return <div className="text-center py-16 text-muted-foreground">Student not found.</div>;
  }

  const photoSrc = student.photoUrl ? `/api/storage${student.photoUrl}` : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/students">
          <Button variant="ghost" size="sm" data-testid="button-back-students"><ArrowLeft size={16} className="mr-1" /> Students</Button>
        </Link>
      </div>

      {/* Profile Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Photo */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center border-2 border-border">
                  {photoSrc ? (
                    <img src={photoSrc} alt={student.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-primary/40">{student.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/80 transition-colors"
                  title="Upload photo"
                >
                  {uploadingPhoto ? <span className="text-[8px]">…</span> : <Camera size={11} />}
                </button>
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])} />
              </div>

              <div>
                <CardTitle className="text-2xl font-serif">{student.name}</CardTitle>
                <p className="text-muted-foreground mt-1">Age {student.age} · {student.subject} · {student.level}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="text-xs hidden sm:flex">{student.sessionSlot}</Badge>
              <Button variant="outline" size="sm" onClick={openEditProfile} data-testid="button-edit-profile">
                <Pencil size={14} className="mr-1" /> Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground">Parent</span><p className="font-medium">{student.parentName}</p></div>
            <div><span className="text-muted-foreground">Contact</span><p className="font-medium">{student.contactNumber}</p></div>
            <div><span className="text-muted-foreground">Joined</span><p className="font-medium">{new Date(student.joinedAt).toLocaleDateString("en-GB")}</p></div>
          </div>
          {student.notes && <p className="mt-4 text-sm text-muted-foreground italic border-t pt-3">{student.notes}</p>}
        </CardContent>
      </Card>

      <Tabs defaultValue="progress">
        <TabsList data-testid="tabs-student-detail">
          <TabsTrigger value="progress">Progress Notes</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        {/* Progress Notes */}
        <TabsContent value="progress" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={openAddNote} data-testid="button-add-note"><Plus size={14} className="mr-1" /> Add Note</Button>
          </div>
          {notes?.length === 0 && <div className="text-center py-8 text-muted-foreground">No progress notes yet.</div>}
          {notes?.map((note) => (
            <Card key={note.id} className="shadow-sm" data-testid={`card-note-${note.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">{note.subject}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(note.sessionDate).toLocaleDateString("en-GB")}</span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditNote(note)}><Pencil size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteNote(note.id)}><Trash2 size={13} /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tasks */}
        <TabsContent value="tasks" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={openAddTask} data-testid="button-add-task"><Plus size={14} className="mr-1" /> Assign Task</Button>
          </div>
          {tasks?.length === 0 && <div className="text-center py-8 text-muted-foreground">No tasks assigned yet.</div>}
          {tasks?.map((task) => (
            <Card key={task.id} className={`shadow-sm ${task.completed ? "opacity-60" : ""}`} data-testid={`card-task-${task.id}`}>
              <CardContent className="p-4 flex items-start gap-3">
                <button onClick={() => handleToggleTask(task.id, !task.completed)} className="mt-0.5 shrink-0" data-testid={`button-toggle-task-${task.id}`}>
                  {task.completed ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} className="text-muted-foreground" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</span>
                    <Badge variant="outline" className="text-xs">{task.subject}</Badge>
                  </div>
                  {task.description && <p className="text-sm text-muted-foreground mt-0.5">{task.description}</p>}
                  <p className="text-xs text-muted-foreground mt-1">Due: {new Date(task.dueDate).toLocaleDateString("en-GB")}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditTask(task)}><Pencil size={13} /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDeleteTask(task.id)}><Trash2 size={13} /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowPaymentDialog(true)} data-testid="button-add-payment"><Plus size={14} className="mr-1" /> Add Record</Button>
          </div>
          {payments?.length === 0 && <div className="text-center py-8 text-muted-foreground">No payment records yet.</div>}
          {payments?.map((payment) => (
            <Card key={payment.id} className="shadow-sm" data-testid={`card-payment-${payment.id}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CreditCard size={14} className="text-muted-foreground" />
                    <span className="font-medium">£{Number(payment.amount).toFixed(2)}</span>
                    <Badge className={payment.paid ? "bg-green-100 text-green-800 border-green-200" : "bg-amber-100 text-amber-800 border-amber-200"}>
                      {payment.paid ? "Paid" : "Outstanding"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Session: {new Date(payment.sessionDate).toLocaleDateString("en-GB")}</p>
                  {payment.notes && <p className="text-xs text-muted-foreground">{payment.notes}</p>}
                </div>
                {!payment.paid && (
                  <Button size="sm" variant="outline" onClick={() => handleMarkPaid(payment.id)} data-testid={`button-mark-paid-${payment.id}`}>
                    Mark Paid
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="font-serif">Edit Student Profile</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Full name *" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} data-testid="input-edit-name" />
            <Input placeholder="Age" type="number" value={editForm.age} onChange={e => setEditForm(f => ({ ...f, age: e.target.value }))} data-testid="input-edit-age" />
            <Input placeholder="Parent / guardian name *" value={editForm.parentName} onChange={e => setEditForm(f => ({ ...f, parentName: e.target.value }))} data-testid="input-edit-parent" />
            <Input placeholder="Contact number *" value={editForm.contactNumber} onChange={e => setEditForm(f => ({ ...f, contactNumber: e.target.value }))} data-testid="input-edit-contact" />
            <div className="grid grid-cols-2 gap-3">
              <Select value={editForm.subject} onValueChange={v => setEditForm(f => ({ ...f, subject: v }))}>
                <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={editForm.level} onValueChange={v => setEditForm(f => ({ ...f, level: v }))}>
                <SelectTrigger><SelectValue placeholder="Level" /></SelectTrigger>
                <SelectContent>{LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <Input placeholder="Session slot (e.g. Sat 10:00–11:00)" value={editForm.sessionSlot} onChange={e => setEditForm(f => ({ ...f, sessionSlot: e.target.value }))} data-testid="input-edit-slot" />
            <Textarea placeholder="Internal notes (optional)" value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} rows={3} data-testid="textarea-edit-notes" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile} disabled={updateStudent.isPending} data-testid="button-save-profile">
              {updateStudent.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">{editingNote ? "Edit Progress Note" : "Add Progress Note"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Select value={noteForm.subject} onValueChange={v => setNoteForm(f => ({ ...f, subject: v }))}>
              <SelectTrigger data-testid="select-note-subject"><SelectValue /></SelectTrigger>
              <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={noteForm.sessionDate} onChange={e => setNoteForm(f => ({ ...f, sessionDate: e.target.value }))} data-testid="input-note-date" />
            <Textarea value={noteForm.content} onChange={e => setNoteForm(f => ({ ...f, content: e.target.value }))} placeholder="What was covered today? How did the student perform?" rows={5} data-testid="textarea-note-content" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveNote} disabled={createNote.isPending || updateNote.isPending} data-testid="button-save-note">
              {(createNote.isPending || updateNote.isPending) ? "Saving..." : editingNote ? "Save Changes" : "Add Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">{editingTask ? "Edit Task" : "Assign Task"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input placeholder="Task title *" value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))} data-testid="input-task-title" />
            <Textarea placeholder="Description (optional)" value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))} rows={3} data-testid="textarea-task-description" />
            <Select value={taskForm.subject} onValueChange={v => setTaskForm(f => ({ ...f, subject: v }))}>
              <SelectTrigger data-testid="select-task-subject"><SelectValue /></SelectTrigger>
              <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={taskForm.dueDate} onChange={e => setTaskForm(f => ({ ...f, dueDate: e.target.value }))} data-testid="input-task-due-date" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveTask} disabled={createTask.isPending || updateTask.isPending} data-testid="button-save-task">
              {(createTask.isPending || updateTask.isPending) ? "Saving..." : editingTask ? "Save Changes" : "Assign Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Add Payment Record</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Input type="date" value={paymentForm.sessionDate} onChange={e => setPaymentForm(f => ({ ...f, sessionDate: e.target.value }))} data-testid="input-payment-date" />
            <Input type="number" placeholder="Amount (£)" value={paymentForm.amount} onChange={e => setPaymentForm(f => ({ ...f, amount: e.target.value }))} data-testid="input-payment-amount" />
            <Input placeholder="Notes (optional)" value={paymentForm.notes} onChange={e => setPaymentForm(f => ({ ...f, notes: e.target.value }))} data-testid="input-payment-notes" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
            <Button onClick={handleAddPayment} disabled={createPayment.isPending} data-testid="button-save-payment">
              {createPayment.isPending ? "Saving..." : "Add Record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
