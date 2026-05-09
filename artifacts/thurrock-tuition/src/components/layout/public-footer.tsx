import { Link } from "wouter";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function PublicFooter() {
  return (
    <footer className="bg-[#111827] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src={`${basePath}/logo.svg`} alt="TTA" className="h-12 w-auto opacity-90" />
              <div>
                <p className="font-serif text-white font-bold text-lg leading-tight">Thurrock Tuition</p>
                <p className="text-[#C9973A] text-sm">Academy</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              Expert group tuition in Grays, Thurrock — serving families from Tilbury, Chafford Hundred, Stanford-le-Hope, Corringham, South Ockendon, Aveley and across Essex. We help every child build confidence, master their subjects, and reach their full potential.
            </p>
            <a
              href="https://wa.me/447480413679"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ab553] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 shadow"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L.057 23.571a.5.5 0 00.611.611l5.72-1.47A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.878 0-3.638-.49-5.163-1.348l-.37-.213-3.398.873.89-3.328-.23-.38A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WhatsApp Us
            </a>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Our Services" },
                { href: "/services#subjects", label: "Subjects We Teach" },
                { href: "/services#pricing", label: "Session Pricing" },
                { href: "/about", label: "About Us" },
                { href: "/about#mission", label: "Our Mission" },
                { href: "/about#vision", label: "Our Vision" },
                { href: "/contact", label: "Book Assessment" },
                { href: "/contact#faq", label: "FAQs" },
              ].map(({ href, label }) => (
                <li key={href}>
                  {href.includes("#") ? (
                    <a href={`${basePath}${href}`} className="text-sm text-gray-400 hover:text-[#C9973A] transition-colors">
                      {label}
                    </a>
                  ) : (
                    <Link href={href} className="text-sm text-gray-400 hover:text-[#C9973A] transition-colors">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-3">
              {[
                "SATs Preparation (KS2)",
                "11+ Entrance Exams",
                "KS3 Core Support",
                "GCSE Maths Tuition",
                "GCSE English Tuition",
                "GCSE Science Tuition",
                "A-Level Maths",
                "Free Assessment Session",
                "Progress Tracking",
                "Homework Support",
              ].map((service) => (
                <li key={service}>
                  <Link href="/services" className="text-sm text-gray-400 hover:text-[#C9973A] transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Areas Served</h4>
            <ul className="space-y-2">
              {[
                "Tuition in Grays",
                "Tuition in Tilbury",
                "Tuition in Chafford Hundred",
                "Tuition in Stanford-le-Hope",
                "Tuition in Corringham",
                "Tuition in South Ockendon",
                "Tuition in Aveley",
                "Tuition in West Thurrock",
                "Tuition in Purfleet",
                "Tuition in Chadwell St Mary",
              ].map((area) => (
                <li key={area}>
                  <Link href="/contact" className="text-sm text-gray-400 hover:text-[#C9973A] transition-colors">
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#C9973A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Suite 1, Queensgate Centre<br />Orsett Road, Grays<br />Thurrock, Essex</span>
              </li>
              <li className="flex gap-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#C9973A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <a href="tel:07480413679" className="hover:text-[#C9973A] transition-colors">07480 413679</a>
              </li>
              <li className="flex gap-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#C9973A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <a href="mailto:bookings@thurrocktuitionacademy.co.uk" className="hover:text-[#C9973A] transition-colors break-all">bookings@thurrocktuitionacademy.co.uk</a>
              </li>
              <li className="flex gap-3">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#C9973A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Mon–Sat: 9am – 6pm<br />Sunday: Closed</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Parent Portal</h4>
              <Link href="/sign-in" className="inline-block bg-[#1B2B6B] hover:bg-[#243580] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 border border-white/10">
                Sign In to Portal →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Thurrock Tuition Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Registered in England & Wales</span>
            <span>·</span>
            <span>DBS Checked Tutors</span>
            <span>·</span>
            <span>Grays, Thurrock</span>
            <span>·</span>
            <span>
              Website by{" "}
              <a
                href="https://launchflow.co.uk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C9973A] hover:text-[#d4a84a] transition-colors"
              >
                LaunchFlow
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
