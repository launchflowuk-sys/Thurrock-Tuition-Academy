import { useGetDashboardSummary, useGetRecentActivity } from "@workspace/api-client-react";
import { Kpi, Panel, Pill } from "@/components/dashboard/primitives";
import { currentTerm, examCountdown } from "@/lib/terms";

/**
 * The dashboard leads with the four figures a tuition centre actually asks at
 * 8am — not the agency's clients/revenue/projects. Underneath sits the
 * attention row: the things that need a person today.
 */

export default function Dashboard() {
  const { data: summary } = useGetDashboardSummary();
  const { data: activity } = useGetRecentActivity();

  const term = currentTerm(new Date());
  const exams = examCountdown(new Date());

  const students = summary?.totalStudents ?? 0;
  const startedThisMonth = summary?.studentsStartedThisMonth ?? 0;
  const outstanding = summary?.outstandingPayments ?? 0;
  const sessionsThisWeek = summary?.sessionsThisWeek ?? 0;
  const newApplications = summary?.newIntakeSubmissions ?? 0;
  const awaitingFollowUp = summary?.applicationsAwaitingFollowUp ?? 0;
  const dbsExpiring = summary?.dbsExpiringSoon ?? 0;
  const dbsMissing = summary?.dbsNotRecorded ?? 0;
  const attendance = summary?.attendanceThisWeek ?? null;
  const atRisk = summary?.studentsAtRisk ?? 0;
  const unassigned = summary?.unassignedSessions ?? 0;

  // Attendance is the single best predictor of a student leaving, so it is the
  // figure allowed to switch ground: teal / amber / coral.
  const attendanceGround =
    attendance == null ? "cobalt" : attendance >= 85 ? "teal" : attendance >= 67 ? "amber" : "coral";

  // Safeguarding and money are the two that switch ground when they need a
  // person. Everything else keeps its ground so the strip stays legible.
  const feesGround = outstanding > 0 ? "coral" : "teal";
  const dbsGround = dbsExpiring > 0 ? "coral" : dbsMissing > 0 ? "amber" : "teal";

  return (
    <>
      <h1 className="dash-page-title">Today at the academy</h1>
      <p className="dash-page-sub">
        {term.label} · week {term.week} of {term.totalWeeks}
      </p>

      <div className="kpi-strip">
        <Kpi
          ground="navy"
          label="Active students"
          value={String(students)}
          note={
            startedThisMonth > 0
              ? `${startedThisMonth} started this month`
              : "None started this month"
          }
          href="/students"
        />
        <Kpi
          ground={attendanceGround}
          label="Attendance this week"
          value={attendance == null ? "—" : `${attendance}%`}
          note={
            attendance == null
              ? "No register marked yet"
              : `${sessionsThisWeek} session${sessionsThisWeek === 1 ? "" : "s"} this week`
          }
          href="/attendance"
        />
        <Kpi
          ground={feesGround}
          label="Fees outstanding"
          value={String(outstanding)}
          note={outstanding > 0 ? "Chase gently and early" : "Nothing to chase"}
          href="/payments"
        />
        <Kpi
          ground="purple"
          label="New applications"
          value={String(newApplications)}
          // A count of unanswered applications must never be captioned "All
          // followed up" — the figure and its note contradicted each other.
          note={
            newApplications > 0
              ? "Not yet answered"
              : awaitingFollowUp > 0
                ? `${awaitingFollowUp} awaiting follow-up`
                : "All followed up"
          }
          href="/intake"
        />
      </div>

      {/* The attention row: things that need a person today. */}
      <div className="kpi-strip">
        <Kpi
          ground={dbsGround}
          label="Safeguarding — DBS"
          value={String(dbsExpiring + dbsMissing)}
          note={
            dbsExpiring > 0
              ? `${dbsExpiring} expiring within 60 days`
              : dbsMissing > 0
                ? `${dbsMissing} with no DBS recorded`
                : "All tutors in date"
          }
          href="/staff"
        />
        <Kpi
          ground={atRisk > 0 ? "coral" : "teal"}
          label="Students at risk"
          value={String(atRisk)}
          note="2+ absences in a rolling 4 weeks"
          href="/attendance"
        />
        <Panel title="Next exam" subtitle={exams.subtitle}>
          <p className="panel-figure">{exams.headline}</p>
          <p className="panel-sub" style={{ marginTop: 8 }}>
            {exams.detail}
          </p>
        </Panel>
        <Kpi
          ground={unassigned > 0 ? "amber" : "teal"}
          label="Unassigned sessions"
          value={String(unassigned)}
          note={unassigned > 0 ? "On the timetable with no tutor" : "Every session has a tutor"}
          href="/sessions"
        />
      </div>

      <Panel title="Recent activity" subtitle="Progress notes and tasks across all students">
        {activity && activity.length > 0 ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>What happened</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Pill ground={item.type === "progress" ? "teal" : "cobalt"}>
                        {item.type === "progress" ? "Progress" : "Task"}
                      </Pill>
                    </td>
                    <td>{item.description}</td>
                    <td className="num">
                      {new Date(item.timestamp).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty">Nothing recorded yet.</p>
        )}
      </Panel>
    </>
  );
}
