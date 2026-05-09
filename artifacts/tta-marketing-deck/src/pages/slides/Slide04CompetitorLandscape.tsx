export default function Slide04CompetitorLandscape() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg flex flex-col" style={{ paddingLeft: '7vw', paddingRight: '7vw', paddingTop: '6vh', paddingBottom: '6vh' }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.4vw', backgroundColor: '#C9973A' }} />

      <p
        className="font-body"
        style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1vh' }}
      >
        Competitive Landscape
      </p>
      <h2
        className="font-display"
        style={{ color: '#1B2B6B', fontSize: '3.8vw', fontWeight: 700, lineHeight: 1.1, marginBottom: '3.5vh' }}
      >
        Who Dominates the Local Rankings
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2vh 2.5vw', flex: 1 }}>

        <div style={{ backgroundColor: '#1B2B6B', borderRadius: '0.6vw', padding: '2.5vh 2vw' }}>
          <p className="font-display" style={{ color: '#C9973A', fontSize: '2.2vw', fontWeight: 700, marginBottom: '1vh' }}>Grays Tuition Centre</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.7vw', lineHeight: 1.45 }}>London Road, Grays · Est. 2012 · 5,000+ students · Maths, English &amp; Science · Primary to GCSE · Small groups + free assessment</p>
        </div>

        <div style={{ backgroundColor: '#1B2B6B', borderRadius: '0.6vw', padding: '2.5vh 2vw' }}>
          <p className="font-display" style={{ color: '#C9973A', fontSize: '2.2vw', fontWeight: 700, marginBottom: '1vh' }}>AMRA Academy</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.7vw', lineHeight: 1.45 }}>High Street, Grays · Est. 2018 · Year 3–11 · Maths, English &amp; Science · 11+ &amp; GCSE · Dedicated subject teachers</p>
        </div>

        <div style={{ backgroundColor: '#1B2B6B', borderRadius: '0.6vw', padding: '2.5vh 2vw' }}>
          <p className="font-display" style={{ color: '#C9973A', fontSize: '2.2vw', fontWeight: 700, marginBottom: '1vh' }}>Frobel Education</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.7vw', lineHeight: 1.45 }}>National brand · Grays campus · KS1 to A-Level · Maths, English &amp; Science · 11+ prep &amp; revision sessions</p>
        </div>

        <div style={{ backgroundColor: '#EEF0F8', borderRadius: '0.6vw', padding: '2.5vh 2vw' }}>
          <p className="font-display" style={{ color: '#1B2B6B', fontSize: '2.2vw', fontWeight: 700, marginBottom: '1vh' }}>11 Plus Tutors Essex</p>
          <p className="font-body" style={{ color: '#3A3A4A', fontSize: '1.7vw', lineHeight: 1.45 }}>Thurrock-wide · Weekly Saturday sessions 14:30–16:30 · 1-to-1 specialist · Yr 4–5 focus · Chafford Hundred &amp; Stanford-le-Hope</p>
        </div>

        <div style={{ backgroundColor: '#EEF0F8', borderRadius: '0.6vw', padding: '2.5vh 2vw' }}>
          <p className="font-display" style={{ color: '#1B2B6B', fontSize: '2.2vw', fontWeight: 700, marginBottom: '1vh' }}>Kumon Grays</p>
          <p className="font-body" style={{ color: '#3A3A4A', fontSize: '1.7vw', lineHeight: 1.45 }}>West Street, Grays · Friday sessions only · Maths &amp; English · Worksheet-based self-learning method · All ages</p>
        </div>

        <div style={{ backgroundColor: '#EEF0F8', borderRadius: '0.6vw', padding: '2.5vh 2vw' }}>
          <p className="font-display" style={{ color: '#1B2B6B', fontSize: '2.2vw', fontWeight: 700, marginBottom: '1vh' }}>Private Tutor Grays</p>
          <p className="font-body" style={{ color: '#3A3A4A', fontSize: '1.7vw', lineHeight: 1.45 }}>privatetutorgrays.co.uk · 1-to-1 · Ages 5–18 · English, Maths, Sciences · GCSE, A-Level &amp; entrance exams · Phone lessons available</p>
        </div>

      </div>
    </div>
  );
}
