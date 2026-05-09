export default function Slide10Weeks12() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg" style={{ display: 'grid', gridTemplateColumns: '28% 72%', gridTemplateRows: '1fr' }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.4vw', backgroundColor: '#C9973A' }} />

      <div
        className="flex flex-col justify-center items-center"
        style={{ backgroundColor: '#1B2B6B', paddingTop: '8vh', paddingBottom: '8vh' }}
      >
        <p className="font-display" style={{ color: '#C9973A', fontSize: '8vw', fontWeight: 700, lineHeight: 1 }}>1</p>
        <div style={{ width: '3vw', height: '0.3vh', backgroundColor: 'rgba(201,151,58,0.5)', margin: '1.5vh 0' }} />
        <p className="font-display" style={{ color: '#C9973A', fontSize: '8vw', fontWeight: 700, lineHeight: 1 }}>2</p>
        <p className="font-body" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.7vw', fontWeight: 300, marginTop: '2.5vh', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Foundations</p>
      </div>

      <div
        className="flex flex-col justify-center"
        style={{ paddingLeft: '5vw', paddingRight: '7vw', paddingTop: '7vh', paddingBottom: '7vh' }}
      >
        <p
          className="font-body"
          style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2.5vh' }}
        >
          Priority Actions
        </p>

        <div style={{ marginBottom: '2.8vh', paddingBottom: '2.8vh', borderBottom: '0.15vh solid #D4CDBF' }}>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Google Business Profile</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Create and fully optimise GBP listing — name, address, description, photos, opening hours, WhatsApp click-to-chat link, and business category.</p>
        </div>

        <div style={{ marginBottom: '2.8vh', paddingBottom: '2.8vh', borderBottom: '0.15vh solid #D4CDBF' }}>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>WhatsApp Business Setup</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Activate WhatsApp Business with welcome message, quick replies for common questions, and away message for out-of-hours. Add click-to-chat button to website.</p>
        </div>

        <div style={{ marginBottom: '2.8vh', paddingBottom: '2.8vh', borderBottom: '0.15vh solid #D4CDBF' }}>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Local SEO Website Audit</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Add LocalBusiness schema markup, embed Grays/Thurrock keywords in headings and meta tags, ensure NAP consistency across all pages.</p>
        </div>

        <div>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Social Media Launch</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Create Facebook and Instagram pages. Publish intro post, subjects &amp; availability post, and first parent tip post by end of Week 2.</p>
        </div>

        <div style={{ marginTop: '3vh', paddingTop: '2vh', borderTop: '0.2vh solid #C9973A' }}>
          <p className="font-body" style={{ color: '#1B2B6B', fontSize: '1.75vw', fontWeight: 600 }}>
            Week 2 target: GBP live · WhatsApp Business active · 3 social posts published
          </p>
        </div>
      </div>
    </div>
  );
}
