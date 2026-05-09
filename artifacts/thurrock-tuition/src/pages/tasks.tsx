import { useState } from "react";
import { useListTasks, getListTasksQueryKey, useCreateTask, useUpdateTask, useDeleteTask, useListStudents } from "@workspace/api-client-react";
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
import { Plus, CheckCircle2, Circle, Trash2 } from "lucide-react";

const SUBJECTS = ["Maths", "English", "Science"];

export default function TasksPage() {
  const { data: tasks, isLoading } = useListTasks(undefined, { query: { queryKey: getListTasksQueryKey() } });
  const { data: students } = useListStudents();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ studentId: "", title: "", description: "", subject: "Maths", dueDate: "" });
  const [filterCompleted, setFilterCompleted] = useState<"all" | "pending" | "done">("all");

  const studentMap = Object.fromEntries(students?.map(s => [s.id, s.name]) ?? []);

  const filtered = tasks?.filter(t => {
    if (filterCompleted === "pending") return !t.completed;
    if (filterCompleted === "done") return t.completed;
    return true;
  }) ?? [];

  const handleCreate = async () => {
    if (!form.studentId || !form.title || !form.dueDate) { toast({ title: "Please fill in all required fields", variant: "destructive" }); return; }
    await createTask.mutateAsync(
      { data: { studentId: Number(form.studentId), title: form.title, description: form.description, subject: form.subject, dueDate: form.dueDate } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
          toast({ title: "Task assigned" });
          setShowAdd(false);
          setForm({ studentId: "", title: "", description: "", subject: "Maths", dueDate: "" });
        },
      }
    );
  };

  const handleToggle = async (id: number, completed: boolean) => {
    await updateTask.mutateAsync({ id, data: { completed } }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() }) });
  };

  const handleDelete = async (id: number) => {
    await deleteTask.mutateAsync({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() }); toast({ title: "Task deleted" }); } });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-serif text-primary">Tasks</h1>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-serif text-primary">Tasks</h1>
        <Button onClick={() => setShowAdd(true)} data-testid="button-assign-task"><Plus size={16} className="mr-2" /> Assign Task</Button>
      </div>

      <div className="flex gap-2">
        {(["all", "pending", "done"] as const).map(f => (
          <Button key={f} size="sm" variant={filterCompleted === f ? "default" : "outline"} onClick={() => setFilterCompleted(f)} data-testid={`button-filter-${f}`}>
            {f === "all" ? "All" : f === "pending" ? "Pending" : "Completed"}
          </Button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((task) => (
          <Card key={task.id} className={`shadow-sm ${task.completed ? "opacity-60" : ""}`} data-testid={`card-task-${task.id}`}>
            <CardContent className="p-4 flex items-start gap-3">
              <button onClick={() => handleToggle(task.id, !task.completed)} className="mt-0.5 shrink-0" data-testid={`button-toggle-task-${task.id}`}>
                {task.completed ? <CheckCircle2 size={20} className="text-green-500" /> : <Circle size={20} className="text-muted-foreground" />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</span>
                  <Badge variant="outline" className="text-xs">{task.subject}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{studentMap[task.studentId] ?? `Student #${task.studentId}`} · Due: {new Date(task.dueDate).toLocaleDateString("en-GB")}</p>
                {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
              </div>
              <button onClick={() => handleDelete(task.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0" data-testid={`button-delete-task-${task.id}`}>
                <Trash2 size={16} />
              </button>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No tasks found.</div>}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Assign Task</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Select value={form.studentId} onValueChange={v => setForm(f => ({ ...f, studentId: v }))}>
              <SelectTrigger data-testid="select-task-student"><SelectValue placeholder="Select student *" /></SelectTrigger>
              <SelectContent>{students?.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
            <Input placeholder="Task title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} data-testid="input-task-title" />
            <Select value={form.subject} onValueChange={v => setForm(f => ({ ...f, subject: v }))}>
              <SelectTrigger data-testid="select-task-subject"><SelectValue /></SelectTrigger>
              <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} data-testid="input-task-due-date" />
            <Textarea placeholder="Description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} data-testid="textarea-task-description" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createTask.isPending} data-testid="button-save-task">{createTask.isPending ? "Saving..." : "Assign Task"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
