import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground py-4 px-6 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={`${basePath}/logo.svg`} alt="TTA Logo" className="h-12 w-auto" />
            <span className="font-serif text-xl font-bold hidden sm:inline-block">Thurrock Tuition Academy</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium hover:text-secondary transition-colors" data-testid="link-signin">
              Sign In
            </Link>
            <Button asChild className="bg-secondary hover:bg-secondary/90 text-primary font-semibold" data-testid="button-book-assessment">
              <a href="#assessment">Book Free Assessment</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-primary py-24 px-6 text-center text-primary-foreground">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight text-primary-foreground">
            Helping Students Build Confidence, Achieve Higher Grades & Reach Their Full Potential
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Professional tuition in Grays, Thurrock. Specializing in Maths, English, and Science for SATs, 11+, KS3, GCSE, and A-Level.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-primary w-full sm:w-auto text-lg px-8">
              <a href="#assessment">Book Your Free Assessment</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10 w-full sm:w-auto text-lg px-8">
              <a href="#pricing">View Pricing</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Areas */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        
        {/* Why Choose Us */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-serif text-primary mb-6">Why Choose TTA?</h2>
            <ul className="space-y-4">
              {[
                "Qualified & DBS Checked Teachers",
                "Small Group Sessions (Max 6 students)",
                "Structured Learning Plans",
                "Regular Progress Tracking",
                "Exam Preparation & Technique"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 bg-secondary text-primary rounded-full p-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-lg text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-muted p-8 rounded-lg border border-border shadow-sm">
             <h3 className="text-2xl font-bold font-serif text-primary mb-4">Subjects & Levels</h3>
             <div className="space-y-6">
               <div>
                 <h4 className="font-bold text-lg mb-2">Subjects</h4>
                 <div className="flex gap-2 flex-wrap">
                   {["Maths", "English", "Science"].map((subject) => (
                     <span key={subject} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">{subject}</span>
                   ))}
                 </div>
               </div>
               <div>
                 <h4 className="font-bold text-lg mb-2">Levels</h4>
                 <div className="flex gap-2 flex-wrap">
                   {["SATs", "11+", "KS3", "GCSE", "A-Level"].map((level) => (
                     <span key={level} className="bg-secondary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">{level}</span>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="text-center">
          <h2 className="text-3xl font-bold font-serif text-primary mb-12">Session Pricing</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { level: "SATs", price: "£35-40" },
              { level: "11+", price: "£40-45" },
              { level: "KS3", price: "£45-50" },
              { level: "GCSE", price: "£50-60" },
              { level: "A-Level", price: "£70-80" }
            ].map((tier, i) => (
              <div key={i} className="bg-card p-6 rounded-lg border border-border shadow-sm flex flex-col items-center justify-center">
                <h3 className="font-bold text-xl text-primary mb-2">{tier.level}</h3>
                <p className="text-2xl font-bold text-secondary">{tier.price}</p>
                <p className="text-xs text-muted-foreground mt-2">per 2hr session</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section id="assessment" className="bg-primary text-primary-foreground p-8 md:p-12 rounded-2xl text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-secondary"></div>
          <h2 className="text-3xl font-bold font-serif mb-4">Book Your Free Assessment</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Includes an initial test, personal review, strength & weakness analysis, and a structured study plan tailored to your child.
          </p>
          <div className="bg-background text-foreground max-w-xl mx-auto p-6 rounded-lg text-left shadow-xl">
             <p className="text-center text-muted-foreground mb-4">Contact us on WhatsApp to secure your slot</p>
             <div className="flex justify-center">
               <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#20bd5a] text-white w-full text-lg">
                 <a href="https://wa.me/447480413679" target="_blank" rel="noopener noreferrer">
                   Chat on WhatsApp: 07480413679
                 </a>
               </Button>
             </div>
          </div>
        </section>

      </div>
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground/60 py-12 mt-20 border-t border-primary-foreground/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={`${basePath}/logo.svg`} alt="TTA Logo" className="h-8 w-auto opacity-80" />
              <span className="font-serif text-lg font-bold text-primary-foreground">Thurrock Tuition Academy</span>
            </div>
            <p className="text-sm max-w-sm">Professional tuition for students aiming higher. Building confidence and achieving results.</p>
          </div>
          <div className="md:text-right">
            <h4 className="text-primary-foreground font-bold mb-4">Location</h4>
            <p className="text-sm">Suite 1, Queensgate Centre</p>
            <p className="text-sm">Orsett Road, Grays</p>
            <p className="text-sm">Thurrock</p>
          </div>
        </div>
      </footer>
    </div>
  );
}