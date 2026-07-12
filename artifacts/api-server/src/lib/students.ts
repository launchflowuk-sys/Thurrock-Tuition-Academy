import { eq } from "drizzle-orm";
import { db, studentsTable } from "@workspace/db";

export interface StudentContact {
  studentName: string;
  parentName: string;
  parentEmail: string;
}

// Used by every "notify the parent" email trigger to avoid repeating the
// same lookup + missing-email guard at each call site.
export async function getStudentContact(studentId: number): Promise<StudentContact | null> {
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, studentId));
  if (!student || !student.parentEmail) return null;
  return { studentName: student.name, parentName: student.parentName, parentEmail: student.parentEmail };
}
