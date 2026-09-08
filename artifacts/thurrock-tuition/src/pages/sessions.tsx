import { useState } from "react";
import { useListSessions, getListSessionsQueryKey, useCreateSession, useGetSessionAvailability, getGetSessionAvailabilityQueryKey, useListStaff } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, Clock } from "lucide-react";
import { Kpi } from "@/components/dashboard/primitives";

const SLOT_LABELS = ["Morning Session 1", "Morning Session 2", "Afternoon Session 1", "Afternoon Session 2"];
const SLOT_TIMES: Record<string, { start: string; end: string }> = {
  "Morning Session 1": { start: "09:00", end: "11:00" },
  "Morning Session 2": { start: "11:00", end: "13:00" },
  "Afternoon Session 1": { start: "13:00", end: "15:00" },
  "Afternoon Session 2": { start: "15:00", end: "17:00" },
};

export default function SessionsPage() {
  const { data: sessions, isLoading } = useListSessions();
  const { data: availability } = useGetSessionAvailability({ query: { queryKey: getGetSessionAvailabilityQueryKey() } });
  const createSession = useCreateSession();
  const { data: staffList } = useListStaff();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ date: "", slotLabel: "Morning Session 1", capacity: "8", staffId: "" });

  const handleCreate = async () => {
    if (!form.date) { toast({ title: "Please select a date", variant: "destructive" }); return; }
    const times = SLOT_TIMES[form.slotLabel];
    await createSession.mutateAsync(
      { data: { date: form.date, slotLabel: form.slotLabel, startTime: times.start, endTime: times.end, capacity: Number(form.capacity), staffId: form.staffId ? Number(form.staffId) : null } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSessionsQueryKey() });
          toast({ title: "Session created" });
          setShowAdd(false);
          setForm({ date: "", slotLabel: "Morning Session 1", capacity: "8", staffId: "" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="dash-page-title">Sessions</h1>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    );
  }

  // Figures for this screen's strip, derived from data already loaded.
  const list = sessions ?? [];
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart.getTime() + 7 * 86400000);
  const thisWeek = list.filter((s) => {
    const d = new Date(s.date);
    return d >= weekStart && d < weekEnd;
  }).length;
  const unassigned = list.filter((s) => s.staffId == null).length;
  const places = list.reduce((n, s) => n + (s.capacity ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="dash-page-title">Sessions</h1>
        <Button onClick={() => setShowAdd(true)} data-testid="button-add-session">
          <Plus size={16} className="mr-2" /> Schedule Session
        </Button>
      </div>

      <div className="kpi-strip">
        <Kpi ground="navy" label="Sessions" value={String(list.length)} note="On the timetable" />
        <Kpi ground="cobalt" label="This week" value={String(thisWeek)} note="Scheduled" />
        <Kpi ground={unassigned > 0 ? "amber" : "teal"} label="Unassigned" value={String(unassigned)} note={unassigned > 0 ? "No tutor set" : "All covered"} />
        <Kpi ground="purple" label="Places" value={String(places)} note="Total capacity" />
      </div>

      {/* Slot Availability Overview */}
      {availability && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availability.map((slot) => (
            <Card key={slot.slotLabel} className={`shadow-sm ${!slot.available ? "border-red-200" : "border-green-200"}`} data-testid={`card-slot-${slot.slotLabel}`}>
              <CardContent className="p-4 text-center">
                <p className="text-xs font-medium text-muted-foreground">{slot.slotLabel}</p>
                <p className="text-xs text-muted-foreground">{slot.startTime}–{slot.endTime}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Users size={12} className="text-muted-foreground" />
                  <span className="text-sm font-semibold">{slot.enrolled}/{slot.capacity}</span>
                </div>
                <Badge className={`text-xs mt-1 ${slot.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {slot.available ? "Available" : "Full"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-4">
        {sessions?.map((session) => (
          <Card key={session.id} className="shadow-sm" data-testid={`card-session-${session.id}`}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{new Date(session.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                    <Badge variant="outline" className="text-xs">{session.slotLabel}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={13} /> {session.startTime}–{session.endTime}</span>
                    <span className="flex items-center gap-1"><Users size={13} /> {session.studentIds?.length ?? 0}/{session.capacity} students</span>
                    <span>{session.staffId ? ((staffList ?? []).find(m => m.id === session.staffId)?.name ?? "Tutor set") : "No tutor assigned"}</span>
                  </div>
                  {session.notes && <p className="text-sm text-muted-foreground italic">{session.notes}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {sessions?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">No sessions scheduled yet.</div>
        )}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Schedule a Session</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} data-testid="input-session-date" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Time Slot</label>
              <Select value={form.slotLabel} onValueChange={v => setForm(f => ({ ...f, slotLabel: v }))}>
                <SelectTrigger data-testid="select-session-slot"><SelectValue /></SelectTrigger>
                <SelectContent>{SLOT_LABELS.map(s => <SelectItem key={s} value={s}>{s} ({SLOT_TIMES[s].start}–{SLOT_TIMES[s].end})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Capacity</label>
              <Input type="number" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} data-testid="input-session-capacity" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Tutor</label>
              <select
                value={form.staffId}
                onChange={e => setForm(f => ({ ...f, staffId: e.target.value }))}
                data-testid="select-session-tutor"
              >
                <option value="">Unassigned</option>
                {(staffList ?? []).map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={createSession.isPending} data-testid="button-save-session">
              {createSession.isPending ? "Saving..." : "Schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
