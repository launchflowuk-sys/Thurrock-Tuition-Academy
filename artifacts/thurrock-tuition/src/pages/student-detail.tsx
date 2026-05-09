import { useState } from "react";
import { Link } from "wouter";
import {
  useGetStudent, getGetStudentQueryKey,
  useListProgressNotes, getListProgressNotesQueryKey, useCreateProgressNote,
  useListTasks, getListTasksQueryKey, useCreateTask, useUpdateTask,
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
import { ArrowLeft, Plus, CheckCircle2, Circle, CreditCard } from "lucide-react";

const SUBJECTS = ["Maths", "English", "Science"];

interface Props { id: number; }

export default function StudentDetailPage({ id }: Props) {
  const { data: student, isLoading } = useGetStudent(id, { query: { enabled: !!id, queryKey: getGetStudentQueryKey(id) } });
  const { data: notes } = useListProgressNotes({ studentId: id }, { query: { queryKey: getListProgressNotesQueryKey({ studentId: id }) } });
  const { data: tasks } = useListTasks({ studentId: id }, { query: { queryKey: getListTasksQueryKey({ studentId: id }) } });
  const { data: payments } = useListPayments({ studentId: id }, { query: { queryKey: getListPaymentsQueryKey({ studentId: id }) } });

  const createNote = useCreateProgressNote();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const createPayment = useCreatePayment();
  const updatePayment = useUpdatePayment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [noteForm, setNoteForm] = useState({ content: "", subject: "Maths", sessionDate: new Date().toISOString().split("T")[0] });
  const [taskForm, setTaskForm] = useState({ title: "", description: "", subject: "Maths", dueDate: "" });
  const [paymentForm, setPaymentForm] = useState({ sessionDate: new Date().toISOString().split("T")[0], amount: "" });

  const handleAddNote = async () => {
    await createNote.mutateAsync(
      { data: { ...noteForm, studentId: id } },
      { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListProgressNotesQueryKey({ studentId: id }) }); toast({ title: "Progress note added" }); setShowNoteDialog(false); setNoteForm({ content: "", subject: "Maths", sessionDate: new Date().toISOString().split("T")[0] }); } }
    );
  };

  const handleAddTask = async () => {
    await createTask.mutateAsync(
      { data: { ...taskForm, studentId: id } },
      { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListTasksQueryKey({ studentId: id }) }); toast({ title: "Task assigned" }); setShowTaskDialog(false); setTaskForm({ title: "", description: "", subject: "Maths", dueDate: "" }); } }
    );
  };

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    await updateTask.mutateAsync(
      { id: taskId, data: { completed } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListTasksQueryKey({ studentId: id }) }) }
    );
  };

  const handleAddPayment = async () => {
    await createPayment.mutateAsync(
      { data: { studentId: id, sessionDate: paymentForm.sessionDate, amount: Number(paymentForm.amount), paid: false } },
      { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey({ studentId: id }) }); toast({ title: "Payment record added" }); setShowPaymentDialog(false); setPaymentForm({ sessionDate: new Date().toISOString().split("T")[0], amount: "" }); } }
    );
  };

  const handleMarkPaid = async (paymentId: number) => {
    await updatePayment.mutateAsync(
      { id: paymentId, data: { paid: true } },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListPaymentsQueryKey({ studentId: id }) }) }
    );
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/students">
          <Button variant="ghost" size="sm" data-testid="button-back-students"><ArrowLeft size={16} className="mr-1" /> Students</Button>
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-serif">{student.name}</CardTitle>
              <p className="text-muted-foreground mt-1">Age {student.age} · {student.subject} · {student.level}</p>
            </div>
            <Badge variant="outline" className="text-xs">{student.sessionSlot}</Badge>
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

        <TabsContent value="progress" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowNoteDialog(true)} data-testid="button-add-note"><Plus size={14} className="mr-1" /> Add Note</Button>
          </div>
          {notes?.length === 0 && <div className="text-center py-8 text-muted-foreground">No progress notes yet.</div>}
          {notes?.map((note) => (
            <Card key={note.id} className="shadow-sm" data-testid={`card-note-${note.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">{note.subject}</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(note.sessionDate).toLocaleDateString("en-GB")}</span>
                </div>
                <p className="text-sm">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowTaskDialog(true)} data-testid="button-add-task"><Plus size={14} className="mr-1" /> Assign Task</Button>
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
              </CardContent>
            </Card>
          ))}
        </TabsContent>

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

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Add Progress Note</DialogTitle></DialogHeader>
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
            <Button onClick={handleAddNote} disabled={createNote.isPending} data-testid="button-save-note">{createNote.isPending ? "Saving..." : "Add Note"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Assign Task</DialogTitle></DialogHeader>
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
            <Button onClick={handleAddTask} disabled={createTask.isPending} data-testid="button-save-task">{createTask.isPending ? "Saving..." : "Assign Task"}</Button>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Cancel</Button>
            <Button onClick={handleAddPayment} disabled={createPayment.isPending} data-testid="button-save-payment">{createPayment.isPending ? "Saving..." : "Add Record"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
