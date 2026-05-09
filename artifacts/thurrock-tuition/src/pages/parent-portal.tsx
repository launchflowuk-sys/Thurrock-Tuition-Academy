import { useUser, useClerk } from "@clerk/react";
import { useListStudents, useListProgressNotes, getListProgressNotesQueryKey, useListTasks, getListTasksQueryKey, useListPayments, getListPaymentsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, CreditCard, LogOut, BookOpen, ClipboardList } from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function ParentPortalPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { data: students } = useListStudents();

  const myStudent = students?.find(s => s.clerkUserId === user?.id);
  const studentId = myStudent?.id;

  const { data: notes, isLoading: loadingNotes } = useListProgressNotes(
    studentId ? { studentId } : undefined,
    { query: { enabled: !!studentId, queryKey: getListProgressNotesQueryKey(studentId ? { studentId } : undefined) } }
  );
  const { data: tasks, isLoading: loadingTasks } = useListTasks(
    studentId ? { studentId } : undefined,
    { query: { enabled: !!studentId, queryKey: getListTasksQueryKey(studentId ? { studentId } : undefined) } }
  );
  const { data: payments, isLoading: loadingPayments } = useListPayments(
    studentId ? { studentId } : undefined,
    { query: { enabled: !!studentId, queryKey: getListPaymentsQueryKey(studentId ? { studentId } : undefined) } }
  );

  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Skeleton className="h-16 w-64" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <img src={`${basePath}/logo.svg`} alt="TTA" className="h-10 w-auto" />
          <div>
            <span className="font-serif text-lg font-bold">Thurrock Tuition Academy</span>
            <p className="text-xs text-primary-foreground/70">Parent Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm hidden sm:block">{user?.fullName}</span>
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80" onClick={() => signOut({ redirectUrl: basePath || "/" })} data-testid="button-parent-logout">
            <LogOut size={16} className="mr-1" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold font-serif text-primary">Welcome, {user?.firstName}</h1>
          {myStudent ? (
            <p className="text-muted-foreground mt-1">Viewing progress for <strong>{myStudent.name}</strong> — {myStudent.subject} · {myStudent.level} · {myStudent.sessionSlot}</p>
          ) : (
            <p className="text-muted-foreground mt-1">Your child's profile is being set up. Please contact Khadija at 07480413679.</p>
          )}
        </div>

        {myStudent && (
          <>
            {/* Progress Notes */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-primary">
                  <BookOpen size={18} /> Progress Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingNotes && <Skeleton className="h-16 w-full" />}
                {notes?.length === 0 && <p className="text-sm text-muted-foreground">No progress notes yet.</p>}
                {notes?.slice().sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()).slice(0, 5).map((note) => (
                  <div key={note.id} className="border-l-2 border-primary/30 pl-3 py-1" data-testid={`note-${note.id}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{note.subject}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(note.sessionDate).toLocaleDateString("en-GB")}</span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-primary">
                  <ClipboardList size={18} /> Tasks &amp; Homework
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingTasks && <Skeleton className="h-16 w-full" />}
                {tasks?.length === 0 && <p className="text-sm text-muted-foreground">No tasks assigned yet.</p>}
                {tasks?.map((task) => (
                  <div key={task.id} className={`flex items-start gap-3 ${task.completed ? "opacity-60" : ""}`} data-testid={`task-${task.id}`}>
                    {task.completed ? <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" /> : <Circle size={18} className="text-muted-foreground mt-0.5 shrink-0" />}
                    <div>
                      <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
                      {task.description && <p className="text-xs text-muted-foreground">{task.description}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">Due: {new Date(task.dueDate).toLocaleDateString("en-GB")} · {task.subject}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payments */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-serif text-primary">
                  <CreditCard size={18} /> Payment History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loadingPayments && <Skeleton className="h-16 w-full" />}
                {payments?.length === 0 && <p className="text-sm text-muted-foreground">No payment records yet.</p>}
                {payments?.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between" data-testid={`payment-${payment.id}`}>
                    <div>
                      <p className="text-sm font-medium">£{Number(payment.amount).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Session: {new Date(payment.sessionDate).toLocaleDateString("en-GB")}</p>
                    </div>
                    <Badge className={payment.paid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                      {payment.paid ? "Paid" : "Outstanding"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        <p className="text-center text-xs text-muted-foreground pb-4">
          Thurrock Tuition Academy · Suite 1, Queensgate Centre, Orsett Road, Grays, Thurrock · 07480413679
        </p>
      </main>
    </div>
  );
}
