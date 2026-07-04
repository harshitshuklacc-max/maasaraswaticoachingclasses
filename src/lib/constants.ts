export const BRAND = {
  name: "Maa Saraswati Coaching Classes",
  shortName: "MSCC",
  tagline: "Excellence in Education",
  phone: "09981430788",
  address: "Kumharpara Road, near Rajiv Gandhi Chowk, in front of Ravi Heights, Bilaspur, Chhattisgarh 495001",
  email: "info@maasaraswati.com",
  city: "Bilaspur",
  state: "Chhattisgarh",
  pincode: "495001",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3718.7234567890123!2d82.1401234!3d22.0798765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3982b1234567890%3A0xabcdef1234567890!2sRajiv%20Gandhi%20Chowk%2C%20Bilaspur%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
} as const;

export const FOOTER = {
  developer: "HKS Web Development Company",
  developerPhone: "9406112110",
} as const;

export const FAKE_REVIEWS = [
  { id: "r1", name: "Mrs. Rekha Singh", relation: "Parent of Class 10 student", rating: 5, content: "Best coaching institute in Bilaspur! My son improved from 65% to 92% in boards. Teachers are very dedicated and caring." },
  { id: "r2", name: "Amit Kumar", relation: "Class 12 Science Student", rating: 5, content: "Excellent faculty for Physics and Chemistry. Regular tests and doubt sessions helped me score 94% in boards." },
  { id: "r3", name: "Mr. Sanjay Tiwari", relation: "Parent of Class 8 student", rating: 5, content: "Very disciplined environment and quality study material. Fee structure is also reasonable compared to other institutes." },
  { id: "r4", name: "Pooja Yadav", relation: "Class 11 Student", rating: 4, content: "Great teachers and friendly staff. The library facility is very helpful for self-study after classes." },
  { id: "r5", name: "Mr. Ramesh Sahu", relation: "Parent of Class 6 student", rating: 5, content: "My daughter loves coming here. Foundation classes are excellent. Highly recommend Maa Saraswati Coaching Classes!" },
  { id: "r6", name: "Vikash Patel", relation: "Class 9 Student", rating: 5, content: "Homework and assignments are well planned. Teachers explain concepts clearly. Best decision to join this institute." },
] as const;

export const GALLERY_CATEGORIES = [
  { value: "building", label: "Building" },
  { value: "classrooms", label: "Classrooms" },
  { value: "office", label: "Office" },
  { value: "library", label: "Library" },
  { value: "events", label: "Events" },
] as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
