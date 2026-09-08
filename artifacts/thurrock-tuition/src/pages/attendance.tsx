import { useState, useMemo } from "react";
import {
  useListSessions,
  useListStudents,
  useListAttendance,
  useMarkAttendance,
  useListStudentsAtRisk,
  getListAttendanceQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Kpi, Panel, Pill, AttendanceStrip } from "@/components/dashboard/primitives";
import { useToast } from "@/hooks/use-toast";

/**
 * The register.
 *
 * This is the screen that makes the dashboard's best figures possible —
 * attendance this week, and students at risk. Without it those two are
 * guesses, which is why they were left blank before this existed.
 */

const STATUSES = ["present", "late", "excused", "absent"] as const;
type Status = (typeof STATUSES)[number];

const STATUS_GROUND: Record<Status, "teal" | "amber" | "grey" | "coral"> = {
  present: "teal",
  late: "amber",
  excused: "grey",
  absent: "coral",
};

export default function AttendancePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: sessions } = useListSessions();
  const { data: students } = useListStudents();
  const { data: atRisk } = useListStudentsAtRisk();
  const markAttendance = useMarkAttendance();

  // Default to the most recent session that has already happened — that is the
  // one someone is standing there wanting to mark.
  const sorted = useMemo(
    () =>
      (sessions ?? [])
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [sessions],
  );
  const [sessionId, setSessionId] = useState<number | null>(null);
  const activeId = sessionId ?? sorted[0]?.id ?? null;
  const activeSession = sorted.find((s) => s.id === activeId) ?? null;

  const { data: existing } = useListAttendance(
    activeId ? { sessionId: activeId } : undefined,
  );

  const [draft, setDraft] = useState<Record<number, Status>>({});

  // Students booked into this session.
  const roster = useMemo(() => {
    if (!activeSession || !students) return [];
    const ids = new Set(activeSession.studentIds ?? []);
    return students.filter((s) => ids.has(s.id));
  }, [activeSession, students]);

  const statusFor = (studentId: number): Status => {
    if (draft[studentId]) return draft[studentId];
    const row = existing?.find((a) => a.studentId === studentId);
    return (row?.status as Status) ?? "present";
  };

  const marked = existing?.length ?? 0;
  const present = (existing ?? []).filter((a) => a.status !== "absent" && a.status !== "excused").length;
  const counted = (existing ?? []).filter((a) => a.status !== "excused").length;
  const rate = counted > 0 ? Math.round((present / counted) * 100) : null;

  const save = async () => {
    if (!activeId) return;
    try {
      await markAttendance.mutateAsync({
        data: {
          sessionId: activeId,
          entries: roster.map((s) => ({ studentId: s.id, status: statusFor(s.id) })),
        },
      });
      setDraft({});
      queryClient.invalidateQueries({ queryKey: getListAttendanceQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      toast({ title: "Register saved" });
    } catch {
      toast({ title: "Could not save the register", variant: "destructive" });
    }
  };

  return (
    <>
      <h1 className="dash-page-title">Register</h1>
      <p className="dash-page-sub">
        Mark who attended. This is what drives attendance and the at-risk list.
      </p>

      <div className="kpi-strip">
        <Kpi
          ground={rate == null ? "navy" : rate >= 85 ? "teal" : rate >= 67 ? "amber" : "coral"}
          label="This session"
          value={rate == null ? "—" : `${rate}%`}
          note={marked === 0 ? "Not marked yet" : `${marked} of ${roster.length} marked`}
        />
        <Kpi ground="cobalt" label="On the register" value={String(roster.length)} note="Students booked in" />
        <Kpi
          ground={(atRisk?.length ?? 0) > 0 ? "coral" : "teal"}
          label="Students at risk"
          value={String(atRisk?.length ?? 0)}
          note="2+ absences in 4 weeks"
        />
        <Kpi ground="purple" label="Sessions" value={String(sorted.length)} note="On the timetable" />
      </div>

      <Panel
        title="Mark the register"
        subtitle={activeSession ? `${activeSession.date} · ${activeSession.slotLabel}` : undefined}
        actions={
          <button type="button" className="btn-d" onClick={save} disabled={!activeId || markAttendance.isPending}>
            {markAttendance.isPending ? "Saving…" : "Save register"}
          </button>
        }
      >
        <div className="field-l" style={{ maxWidth: 420, marginBottom: 18 }}>
          <label htmlFor="session">Session</label>
          <select
            id="session"
            value={activeId ?? ""}
            onChange={(e) => {
              setSessionId(Number(e.target.value));
              setDraft({});
            }}
          >
            {sorted.map((s) => (
              <option key={s.id} value={s.id}>
                {s.date} — {s.slotLabel}
              </option>
            ))}
          </select>
        </div>

        {roster.length === 0 ? (
          <p className="empty">
            No students are booked into this session yet. Add them under Sessions.
          </p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((student) => {
                  const current = statusFor(student.id);
                  return (
                    <tr key={student.id}>
                      <td>
                        <strong>{student.name}</strong>
                      </td>
                      <td>
                        {student.subject} · {student.level}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {STATUSES.map((status) => (
                            <button
                              key={status}
                              type="button"
                              className={current === status ? "btn-d sm" : "btn-d ghost sm"}
                              onClick={() => setDraft({ ...draft, [student.id]: status })}
                              style={
                                current === status
                                  ? { background: `var(--${STATUS_GROUND[status] === "grey" ? "ink-3" : STATUS_GROUND[status]})` }
                                  : undefined
                              }
                            >
                              {status[0].toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Panel
        title="Students at risk"
        subtitle="Two or more absences in a rolling four weeks. The card that earns the dashboard."
      >
        {(atRisk?.length ?? 0) === 0 ? (
          <p className="empty">Nobody is at risk right now.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Subject</th>
                  <th>Last 4 weeks</th>
                  <th>Absences</th>
                </tr>
              </thead>
              <tbody>
                {(atRisk ?? []).map((student) => (
                  <tr key={student.studentId}>
                    <td>
                      <strong>{student.name}</strong>
                    </td>
                    <td>
                      {student.subject} · {student.level}
                    </td>
                    <td>
                      <AttendanceStrip weeks={student.weeks} />
                    </td>
                    <td>
                      <Pill ground="coral">{student.absences} missed</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
