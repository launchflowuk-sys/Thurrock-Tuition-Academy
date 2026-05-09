import { useState, useRef, useEffect } from "react";
import { useUser, useClerk } from "@clerk/react";
import {
  useListStudents,
  useListProgressNotes, getListProgressNotesQueryKey,
  useListTasks, getListTasksQueryKey,
  useListPayments, getListPaymentsQueryKey,
  useListMessages, getListMessagesQueryKey, useSendMessage, useMarkMessageRead,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Circle, CreditCard, LogOut, BookOpen, ClipboardList, MessageSquare, Send } from "lucide-react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function ParentPortalPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const { data: students } = useListStudents();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("progress");

  // Match student by parent email (Option A)
  const parentEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const myStudent = students?.find(s => s.parentEmail?.toLowerCase() === parentEmail);
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
  const { data: messages } = useListMessages(
    { studentId: studentId ?? 0 },
    { query: { enabled: !!studentId, queryKey: getListMessagesQueryKey({ studentId: studentId ?? 0 }) } }
  );

  const sendMessage = useSendMessage();
  const markRead = useMarkMessageRead();

  // Auto-scroll and mark admin messages as read when on messages tab
  useEffect(() => {
    if (activeTab !== "messages" || !messages || !studentId) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    const sid = studentId ?? 0;
    messages
      .filter(m => m.senderRole === "admin" && !m.readAt)
      .forEach(m => markRead.mutate({ id: m.id }, { onSuccess: () => queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({ studentId: sid }) }) }));
  }, [activeTab, messages]);

  const handleSendMessage = async () => {
    if (!studentId || !newMessage.trim()) return;
    await sendMessage.mutateAsync(
      { data: { studentId: studentId!, senderRole: "parent", content: newMessage.trim() } },
      { onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey({ studentId: studentId! }) });
        setNewMessage("");
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } }
    );
  };

  const unreadAdminMessages = messages?.filter(m => m.senderRole === "admin" && !m.readAt).length ?? 0;

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
            <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-sm text-amber-800 font-medium">Your child's profile has not been linked to this account yet.</p>
              <p className="text-sm text-amber-700 mt-1">Please contact Khadija so she can activate your portal access. Make sure she has your email address: <strong>{parentEmail}</strong></p>
              <div className="flex gap-3 mt-3">
                <a href="https://wa.me/447480413679" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#25D366] text-white px-3 py-1.5 rounded-lg">WhatsApp Khadija</a>
                <a href="mailto:bookings@thurrocktuitionacademy.co.uk" className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg">Email Us</a>
              </div>
            </div>
          )}
        </div>

        {myStudent && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="progress"><BookOpen size={14} className="mr-1.5" />Progress</TabsTrigger>
              <TabsTrigger value="tasks"><ClipboardList size={14} className="mr-1.5" />Tasks</TabsTrigger>
              <TabsTrigger value="payments"><CreditCard size={14} className="mr-1.5" />Payments</TabsTrigger>
              <TabsTrigger value="messages" className="relative">
                <MessageSquare size={14} className="mr-1.5" />Messages
                {unreadAdminMessages > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{unreadAdminMessages}</span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Progress Notes */}
            <TabsContent value="progress" className="mt-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-serif text-primary">
                    <BookOpen size={18} /> Progress Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loadingNotes && <Skeleton className="h-16 w-full" />}
                  {notes?.length === 0 && <p className="text-sm text-muted-foreground">No progress notes yet.</p>}
                  {notes?.slice().sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()).map((note) => (
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
            </TabsContent>

            {/* Tasks */}
            <TabsContent value="tasks" className="mt-4">
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
            </TabsContent>

            {/* Payments */}
            <TabsContent value="payments" className="mt-4">
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
                        {payment.notes && <p className="text-xs text-muted-foreground">{payment.notes}</p>}
                      </div>
                      <Badge className={payment.paid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                        {payment.paid ? "Paid" : "Outstanding"}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages */}
            <TabsContent value="messages" className="mt-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-serif text-primary">
                    <MessageSquare size={18} /> Messages from TTA
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Send a message to Khadija — she'll reply here shortly.</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 min-h-[200px] max-h-[400px] overflow-y-auto pr-1 mb-4">
                    {messages?.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground text-sm">No messages yet. You can send one below.</div>
                    )}
                    {messages?.map((msg) => {
                      const isParent = msg.senderRole === "parent";
                      return (
                        <div key={msg.id} className={`flex ${isParent ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${isParent ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-[10px] mt-1 ${isParent ? "text-primary-foreground/60 text-right" : "text-muted-foreground"}`}>
                              {isParent ? "You" : "Khadija · TTA"} · {new Date(msg.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} {new Date(msg.createdAt).toLocaleDateString("en-GB")}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="flex gap-2 border-t pt-3">
                    <Textarea
                      placeholder="Type a message to Khadija..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      rows={2}
                      className="resize-none"
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                      data-testid="textarea-parent-message"
                    />
                    <Button onClick={handleSendMessage} disabled={sendMessage.isPending || !newMessage.trim()} size="icon" className="self-end h-10 w-10 shrink-0" data-testid="button-parent-send">
                      <Send size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <p className="text-center text-xs text-muted-foreground pb-4">
          Thurrock Tuition Academy · Suite 1, Queensgate Centre, Orsett Road, Grays, Thurrock · 07480 413679 · bookings@thurrocktuitionacademy.co.uk
        </p>
      </main>
    </div>
  );
}
