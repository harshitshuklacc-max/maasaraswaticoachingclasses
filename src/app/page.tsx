import { readDb } from "@/lib/db";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AdmissionModal } from "@/components/home/admission-modal";
import { GallerySection } from "@/components/home/gallery-section";
import { NoticeBoard } from "@/components/home/notice-board";
import { BRAND, FAKE_REVIEWS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Trophy, BookOpen, Users, Award, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const db = await readDb();

  return (
    <>
      <SiteHeader />
      <main>
        {/* Hero */}
        <section id="home" className="bg-gradient-to-br from-sky-100 via-sky-50 to-white py-20 md:py-28">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">{BRAND.tagline}</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-sky-900">{BRAND.name}</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">{BRAND.address}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <AdmissionModal trigger={<Button size="lg" className="text-base px-8">Apply for Admission</Button>} />
              <Button asChild size="lg" variant="outline"><Link href="/student/login">Student Portal</Link></Button>
              <Button asChild size="lg" variant="secondary"><Link href="/admin/login">Admin Login</Link></Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
              {[
                { icon: Users, label: "Expert Faculty" },
                { icon: BookOpen, label: "Study Material" },
                { icon: Trophy, label: "Top Results" },
                { icon: Award, label: "Since Years" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-sky-100">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses */}
        <section id="courses" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2 text-sky-900">Our Courses</h2>
            <p className="text-center text-muted-foreground mb-10">Comprehensive programs for every class</p>
            <div className="grid md:grid-cols-3 gap-6">
              {db.courses.map((c) => (
                <Card key={c.id} className="border-sky-100 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg text-primary mb-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{c.description}</p>
                    <p className="text-xs text-muted-foreground">Duration: {c.duration} · Faculty: {c.faculty}</p>
                    <AdmissionModal trigger={<Button size="sm" className="mt-4">Enroll Now</Button>} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Toppers */}
        <section className="py-16 bg-sky-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 text-sky-900">Our Toppers</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {db.toppers.map((t) => (
                <Card key={t.id} className="text-center border-sky-100">
                  <CardContent className="pt-6">
                    <Trophy className="h-10 w-10 text-secondary mx-auto mb-2" />
                    <h3 className="font-bold">{t.name}</h3>
                    <p className="text-sm text-muted-foreground">{t.class_name}</p>
                    <p className="text-primary font-bold text-xl mt-1">{t.percentage}%</p>
                    <p className="text-xs text-muted-foreground">{t.exam_name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <GallerySection items={db.gallery} />

        {/* Notice Board */}
        <NoticeBoard notices={db.notices} />

        {/* Reviews */}
        <section id="reviews" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2 text-sky-900">What Students & Parents Say</h2>
            <p className="text-center text-muted-foreground mb-10">Real feedback from our coaching family</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FAKE_REVIEWS.map((r) => (
                <Card key={r.id} className="border-sky-100">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">&ldquo;{r.content}&rdquo;</p>
                    <p className="font-semibold text-sky-900">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.relation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-sky-50">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-10 text-sky-900">FAQs</h2>
            <div className="space-y-4">
              {db.faqs.map((f) => (
                <Card key={f.id} className="border-sky-100">
                  <CardContent className="pt-5 pb-4">
                    <h3 className="font-semibold text-sky-900 mb-1">{f.question}</h3>
                    <p className="text-sm text-muted-foreground">{f.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact + Map */}
        <section id="contact" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 text-sky-900">Visit Us</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-sky-100">
                <CardContent className="pt-6 space-y-4">
                  <a href={`tel:${BRAND.phone}`} className="flex items-center gap-3 hover:text-primary">
                    <Phone className="h-5 w-5 text-primary" />{BRAND.phone}
                  </a>
                  <a href={`mailto:${BRAND.email}`} className="flex items-center gap-3 hover:text-primary">
                    <Mail className="h-5 w-5 text-primary" />{BRAND.email}
                  </a>
                  <p className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />{BRAND.address}
                  </p>
                  <AdmissionModal trigger={<Button className="w-full mt-2">Apply for Admission</Button>} />
                </CardContent>
              </Card>
              <div className="rounded-xl overflow-hidden border border-sky-100 shadow-sm h-80 lg:h-auto min-h-[320px]">
                <iframe
                  title="Maa Saraswati Coaching Classes Location"
                  src={BRAND.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 320 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
