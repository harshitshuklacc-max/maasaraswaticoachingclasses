-- Maa Saraswati Coaching Classes - Database Schema
-- Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE admission_status AS ENUM ('pending', 'contacted', 'enrolled', 'rejected');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE gallery_category AS ENUM ('building', 'classrooms', 'office', 'library', 'seminars', 'events');
CREATE TYPE notice_audience AS ENUM ('all', 'students', 'teachers', 'class');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  username TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Classes (Class 6, Class 7, etc.)
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sections (A, B, C - optional per class)
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(class_id, name)
);

-- Teachers
CREATE TABLE teachers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE,
  qualification TEXT,
  subjects TEXT[] DEFAULT '{}',
  join_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Students
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  admission_number TEXT UNIQUE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  date_of_birth DATE,
  parent_name TEXT,
  parent_phone TEXT,
  address TEXT,
  admission_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admissions (inquiry form)
CREATE TABLE admissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  parent_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  desired_class TEXT,
  message TEXT,
  status admission_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  syllabus TEXT,
  faculty TEXT,
  duration TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Gallery
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  category gallery_category NOT NULL DEFAULT 'building',
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Toppers
CREATE TABLE toppers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  class_name TEXT,
  exam_name TEXT,
  rank INT,
  percentage DECIMAL(5,2),
  image_url TEXT,
  year INT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  relation TEXT,
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Notices
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience notice_audience DEFAULT 'all',
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FAQs
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blogs
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Downloads
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Study Materials (teacher notes)
CREATE TABLE study_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  file_url TEXT NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Homework
CREATE TABLE homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  file_url TEXT,
  due_date DATE,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Assignments
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  file_url TEXT,
  due_date DATE,
  max_marks INT,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Results
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_name TEXT NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  subject TEXT,
  marks_obtained DECIMAL(7,2),
  max_marks DECIMAL(7,2),
  percentage DECIMAL(5,2),
  grade TEXT,
  exam_date DATE,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Attendance
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  status attendance_status NOT NULL DEFAULT 'present',
  marked_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, date)
);

-- Fee Records
CREATE TABLE fee_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  total_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
  paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  academic_year TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Fee Payment History (offline only)
CREATE TABLE fee_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fee_record_id UUID NOT NULL REFERENCES fee_records(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  receipt_number TEXT,
  remarks TEXT,
  recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  issued_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Timetable
CREATE TABLE timetable (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id) ON DELETE SET NULL,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  period INT NOT NULL,
  subject TEXT NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Website Settings
CREATE TABLE website_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SEO Settings
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  keywords TEXT,
  og_image TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_notices_class ON notices(class_id);
CREATE INDEX idx_homework_class ON homework(class_id);
CREATE INDEX idx_assignments_class ON assignments(class_id);
CREATE INDEX idx_results_student ON results(student_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_fee_records_student ON fee_records(student_id);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Helper: get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is teacher
CREATE OR REPLACE FUNCTION is_teacher()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: is student
CREATE OR REPLACE FUNCTION is_student()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'student');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE toppers ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (active content)
CREATE POLICY "Public read active courses" ON courses FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active gallery" ON gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active toppers" ON toppers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active notices" ON notices FOR SELECT USING (is_active = true AND target_audience = 'all');
CREATE POLICY "Public read active faqs" ON faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read published blogs" ON blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Public read active downloads" ON downloads FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active classes" ON classes FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active sections" ON sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public insert admissions" ON admissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read website settings" ON website_settings FOR SELECT USING (true);
CREATE POLICY "Public read seo settings" ON seo_settings FOR SELECT USING (true);

-- Profile policies
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Admin manage profiles" ON profiles FOR ALL USING (is_admin());

-- Admin full access
CREATE POLICY "Admin all classes" ON classes FOR ALL USING (is_admin());
CREATE POLICY "Admin all sections" ON sections FOR ALL USING (is_admin());
CREATE POLICY "Admin all teachers" ON teachers FOR ALL USING (is_admin());
CREATE POLICY "Admin all students" ON students FOR ALL USING (is_admin());
CREATE POLICY "Admin all admissions" ON admissions FOR ALL USING (is_admin());
CREATE POLICY "Admin all courses" ON courses FOR ALL USING (is_admin());
CREATE POLICY "Admin all gallery" ON gallery FOR ALL USING (is_admin());
CREATE POLICY "Admin all toppers" ON toppers FOR ALL USING (is_admin());
CREATE POLICY "Admin all testimonials" ON testimonials FOR ALL USING (is_admin());
CREATE POLICY "Admin all notices" ON notices FOR ALL USING (is_admin());
CREATE POLICY "Admin all faqs" ON faqs FOR ALL USING (is_admin());
CREATE POLICY "Admin all blogs" ON blogs FOR ALL USING (is_admin());
CREATE POLICY "Admin all downloads" ON downloads FOR ALL USING (is_admin());
CREATE POLICY "Admin all study_materials" ON study_materials FOR ALL USING (is_admin());
CREATE POLICY "Admin all homework" ON homework FOR ALL USING (is_admin());
CREATE POLICY "Admin all assignments" ON assignments FOR ALL USING (is_admin());
CREATE POLICY "Admin all results" ON results FOR ALL USING (is_admin());
CREATE POLICY "Admin all attendance" ON attendance FOR ALL USING (is_admin());
CREATE POLICY "Admin all fee_records" ON fee_records FOR ALL USING (is_admin());
CREATE POLICY "Admin all fee_payments" ON fee_payments FOR ALL USING (is_admin());
CREATE POLICY "Admin all certificates" ON certificates FOR ALL USING (is_admin());
CREATE POLICY "Admin all timetable" ON timetable FOR ALL USING (is_admin());
CREATE POLICY "Admin all website_settings" ON website_settings FOR ALL USING (is_admin());
CREATE POLICY "Admin all seo_settings" ON seo_settings FOR ALL USING (is_admin());

-- Teacher policies
CREATE POLICY "Teachers read own record" ON teachers FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "Teachers manage study_materials" ON study_materials FOR ALL USING (is_teacher() AND teacher_id = auth.uid() OR is_admin());
CREATE POLICY "Teachers manage homework" ON homework FOR ALL USING (is_teacher() AND teacher_id = auth.uid() OR is_admin());
CREATE POLICY "Teachers manage assignments" ON assignments FOR ALL USING (is_teacher() AND teacher_id = auth.uid() OR is_admin());
CREATE POLICY "Teachers manage notices" ON notices FOR ALL USING (is_teacher() OR is_admin());
CREATE POLICY "Teachers manage results" ON results FOR ALL USING (is_teacher() OR is_admin());
CREATE POLICY "Teachers manage attendance" ON attendance FOR ALL USING (is_teacher() OR is_admin());

-- Student policies
CREATE POLICY "Students read own record" ON students FOR SELECT USING (id = auth.uid() OR is_admin());
CREATE POLICY "Students read class homework" ON homework FOR SELECT USING (
  is_student() AND class_id IN (SELECT class_id FROM students WHERE id = auth.uid())
  AND (section_id IS NULL OR section_id IN (SELECT section_id FROM students WHERE id = auth.uid()))
);
CREATE POLICY "Students read class assignments" ON assignments FOR SELECT USING (
  is_student() AND class_id IN (SELECT class_id FROM students WHERE id = auth.uid())
  AND (section_id IS NULL OR section_id IN (SELECT section_id FROM students WHERE id = auth.uid()))
);
CREATE POLICY "Students read class study_materials" ON study_materials FOR SELECT USING (
  is_student() AND class_id IN (SELECT class_id FROM students WHERE id = auth.uid())
  AND (section_id IS NULL OR section_id IN (SELECT section_id FROM students WHERE id = auth.uid()))
);
CREATE POLICY "Students read own results" ON results FOR SELECT USING (
  is_student() AND student_id = auth.uid()
);
CREATE POLICY "Students read own notices" ON notices FOR SELECT USING (
  is_active = true AND (
    target_audience IN ('all', 'students')
    OR (target_audience = 'class' AND class_id IN (SELECT class_id FROM students WHERE id = auth.uid()))
  )
);
CREATE POLICY "Students read own fees" ON fee_records FOR SELECT USING (is_student() AND student_id = auth.uid());
CREATE POLICY "Students read own fee payments" ON fee_payments FOR SELECT USING (
  is_student() AND fee_record_id IN (SELECT id FROM fee_records WHERE student_id = auth.uid())
);
CREATE POLICY "Students read own certificates" ON certificates FOR SELECT USING (is_student() AND student_id = auth.uid());
CREATE POLICY "Students read own attendance" ON attendance FOR SELECT USING (is_student() AND student_id = auth.uid());
CREATE POLICY "Students read class timetable" ON timetable FOR SELECT USING (
  is_student() AND class_id IN (SELECT class_id FROM students WHERE id = auth.uid())
);

-- Storage buckets (run separately in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Default website settings
INSERT INTO website_settings (key, value) VALUES
  ('brand', '{"name":"Maa Saraswati Coaching Classes","tagline":"Excellence in Education","phone":"09981430788","address":"Kumharpara Road, near Rajiv Gandhi Chowk, in front of Ravi Heights, Bilaspur, Chhattisgarh 495001","email":"info@maasaraswati.com","map_embed":"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.5!2d82.15!3d22.08!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDA0JzQ4LjAiTiA4MsKwMDknMDAuMCJF!5e0!3m2!1sen!2sin!4v1"}'),
  ('footer', '{"developer":"HKS Web Development Company","developer_phone":"9406112110"}'),
  ('hero', '{"title":"Welcome to Maa Saraswati Coaching Classes","subtitle":"Nurturing minds, shaping futures in Bilaspur","cta_text":"Apply for Admission","cta_link":"#admissions"}')
ON CONFLICT (key) DO NOTHING;

-- Default SEO
INSERT INTO seo_settings (page_path, title, description, keywords) VALUES
  ('/', 'Maa Saraswati Coaching Classes | Best Coaching in Bilaspur', 'Premier coaching institute in Bilaspur, Chhattisgarh. Classes 6-12, competitive exam preparation, experienced faculty.', 'coaching classes bilaspur, maa saraswati coaching, tuition bilaspur')
ON CONFLICT (page_path) DO NOTHING;
