import { promises as fs } from "fs";
import path from "path";
import { createServiceClientSafe } from "@/lib/supabase/admin";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface LocalAdmission {
  id: string;
  student_name: string;
  parent_name?: string;
  phone: string;
  email?: string;
  desired_class?: string;
  message?: string;
  status: "pending" | "contacted" | "enrolled" | "rejected";
  created_at: string;
}

export interface LocalUser {
  id: string;
  username: string;
  password: string;
  full_name: string;
  role: "student" | "teacher";
  phone?: string;
  class_id?: string;
  section_id?: string;
  admission_number?: string;
  parent_name?: string;
  parent_phone?: string;
}

export interface LocalClass {
  id: string;
  name: string;
  sort_order: number;
}

export interface LocalSection {
  id: string;
  class_id: string;
  name: string;
}

export interface LocalNotice {
  id: string;
  title: string;
  content: string;
  target_audience: string;
  class_id?: string;
  is_pinned: boolean;
  published_at: string;
}

export interface LocalHomework {
  id: string;
  title: string;
  description?: string;
  class_id: string;
  section_id?: string;
  file_url?: string;
  due_date?: string;
  teacher_id?: string;
  created_at: string;
}

export interface LocalAssignment {
  id: string;
  title: string;
  description?: string;
  class_id: string;
  section_id?: string;
  due_date?: string;
  max_marks?: number;
  teacher_id?: string;
  created_at: string;
}

export interface LocalStudyMaterial {
  id: string;
  title: string;
  description?: string;
  class_id: string;
  section_id?: string;
  file_url?: string;
  teacher_id?: string;
  created_at: string;
}

export interface LocalResult {
  id: string;
  student_id: string;
  exam_name: string;
  subject?: string;
  marks_obtained?: number;
  max_marks?: number;
  percentage?: number;
  grade?: string;
  exam_date?: string;
}

export interface LocalFeeRecord {
  id: string;
  student_id: string;
  total_fee: number;
  paid_amount: number;
  academic_year?: string;
}

export interface LocalFeePayment {
  id: string;
  fee_record_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  receipt_number?: string;
}

export interface LocalCertificate {
  id: string;
  student_id: string;
  title: string;
  file_url: string;
  issued_date?: string;
}

export interface LocalCourse {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  faculty?: string;
}

export interface LocalGallery {
  id: string;
  title?: string;
  category: string;
  image_url: string;
}

export interface LocalTopper {
  id: string;
  name: string;
  class_name?: string;
  percentage?: number;
  exam_name?: string;
}

export interface DbSchema {
  admissions: LocalAdmission[];
  users: LocalUser[];
  classes: LocalClass[];
  sections: LocalSection[];
  notices: LocalNotice[];
  homework: LocalHomework[];
  assignments: LocalAssignment[];
  study_materials: LocalStudyMaterial[];
  results: LocalResult[];
  fee_records: LocalFeeRecord[];
  fee_payments: LocalFeePayment[];
  certificates: LocalCertificate[];
  courses: LocalCourse[];
  gallery: LocalGallery[];
  toppers: LocalTopper[];
  faqs: { id: string; question: string; answer: string }[];
}

const DEFAULT_DB: DbSchema = {
  admissions: [],
  users: [
    { id: "student1", username: "student1", password: "student123", full_name: "Rahul Sharma", role: "student", class_id: "class10", admission_number: "MSCC2024001", parent_name: "Mr. Sharma", parent_phone: "9876543210" },
    { id: "teacher1", username: "teacher1", password: "teacher123", full_name: "Priya Verma", role: "teacher" },
  ],
  classes: [
    { id: "class6", name: "Class 6", sort_order: 1 },
    { id: "class7", name: "Class 7", sort_order: 2 },
    { id: "class8", name: "Class 8", sort_order: 3 },
    { id: "class9", name: "Class 9", sort_order: 4 },
    { id: "class10", name: "Class 10", sort_order: 5 },
    { id: "class11", name: "Class 11", sort_order: 6 },
    { id: "class12", name: "Class 12", sort_order: 7 },
  ],
  sections: [
    { id: "sec6a", class_id: "class6", name: "A" },
    { id: "sec10a", class_id: "class10", name: "A" },
  ],
  notices: [
    { id: "n1", title: "New Session Begins", content: "Classes for the new academic session start from 15th July.", target_audience: "all", is_pinned: true, published_at: new Date().toISOString() },
  ],
  homework: [],
  assignments: [],
  study_materials: [],
  results: [],
  fee_records: [{ id: "fee1", student_id: "student1", total_fee: 25000, paid_amount: 15000, academic_year: "2025-26" }],
  fee_payments: [{ id: "pay1", fee_record_id: "fee1", amount: 15000, payment_date: "2025-06-01", payment_method: "cash", receipt_number: "RCP001" }],
  certificates: [],
  courses: [
    { id: "c1", title: "Class 6-8 Foundation", description: "Strong foundation in Maths, Science and English", duration: "1 Year", faculty: "Expert Faculty" },
    { id: "c2", title: "Class 9-10 Board Prep", description: "Complete board exam preparation with test series", duration: "2 Years", faculty: "Senior Teachers" },
    { id: "c3", title: "Class 11-12 Science", description: "Physics, Chemistry, Maths/Biology for competitive exams", duration: "2 Years", faculty: "IIT Alumni" },
  ],
  gallery: [],
  toppers: [
    { id: "t1", name: "Ankit Patel", class_name: "Class 10", percentage: 96.5, exam_name: "Board Exam 2025" },
    { id: "t2", name: "Sneha Dubey", class_name: "Class 12", percentage: 94.2, exam_name: "Board Exam 2025" },
  ],
  faqs: [
    { id: "f1", question: "What are the admission timings?", answer: "Admissions are open Monday to Saturday, 9 AM to 6 PM." },
    { id: "f2", question: "Do you provide study material?", answer: "Yes, comprehensive study material is provided to all enrolled students." },
  ],
};

async function ensureDb(): Promise<DbSchema> {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return { ...DEFAULT_DB, ...JSON.parse(raw) };
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
    return DEFAULT_DB;
  }
}

async function saveDb(db: DbSchema) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export async function readDb(): Promise<DbSchema> {
  const db = await ensureDb();
  const supabase = createServiceClientSafe();
  if (!supabase) return db;

  const [admissionsRes] = await Promise.all([
    supabase.from("admissions").select("*").order("created_at", { ascending: false }),
  ]);

  return {
    ...db,
    admissions: admissionsRes.error
      ? db.admissions
      : (admissionsRes.data || []).map((a) => ({
          id: a.id,
          student_name: a.student_name,
          parent_name: a.parent_name ?? undefined,
          phone: a.phone,
          email: a.email ?? undefined,
          desired_class: a.desired_class ?? undefined,
          message: a.message ?? undefined,
          status: a.status,
          created_at: a.created_at,
        })),
    // Gallery always from local JSON — avoids Supabase schema dependency
    gallery: db.gallery,
  };
}

export async function writeDb(updater: (db: DbSchema) => DbSchema) {
  const db = await ensureDb();
  await saveDb(updater(db));
}

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function useSupabase() {
  return !!createServiceClientSafe();
}
