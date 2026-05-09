export default function Slide07SWOT() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg flex flex-col" style={{ paddingLeft: '7vw', paddingRight: '7vw', paddingTop: '6vh', paddingBottom: '6vh' }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.4vw', backgroundColor: '#C9973A' }} />

      <p
        className="font-body"
        style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.8vh' }}
      >
        Strategic Analysis
      </p>
      <h2
        className="font-display"
        style={{ color: '#1B2B6B', fontSize: '3.8vw', fontWeight: 700, lineHeight: 1.1, marginBottom: '3vh' }}
      >
        SWOT Analysis — Thurrock Tuition Academy
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2vh 2.5vw', flex: 1 }}>

        <div style={{ backgroundColor: '#1B2B6B', borderRadius: '0.6vw', padding: '2.5vh 2.5vw' }}>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5vh' }}>Strengths</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.8vw', lineHeight: 1.55 }}>
            WhatsApp-first &amp; personal service
          </p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Premium Queensgate Centre location
          </p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Boutique 1-to-1 model — no class sizes
          </p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Low overhead enables competitive pricing
          </p>
        </div>

        <div style={{ backgroundColor: '#FBF3E2', border: '0.2vh solid #C9973A', borderRadius: '0.6vw', padding: '2.5vh 2.5vw' }}>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5vh' }}>Weaknesses</p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            No Google footprint or reviews yet
          </p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            New brand — no existing parent network
          </p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Sole tutor — natural capacity ceiling
          </p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Parents default to proven track records
          </p>
        </div>

        <div style={{ backgroundColor: '#EEF0F8', borderRadius: '0.6vw', padding: '2.5vh 2.5vw' }}>
          <p className="font-body" style={{ color: '#1B2B6B', fontSize: '1.5vw', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5vh' }}>Opportunities</p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Growing 11+ demand (KEGS &amp; Torreills pipeline)
          </p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            No WhatsApp-first competitor in the market
          </p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Tilbury &amp; South Ockendon underserved
          </p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Active Facebook parent groups in Thurrock
          </p>
        </div>

        <div style={{ backgroundColor: '#F3F0F0', borderRadius: '0.6vw', padding: '2.5vh 2.5vw' }}>
          <p className="font-body" style={{ color: '#8B2020', fontSize: '1.5vw', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5vh' }}>Threats</p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Grays Tuition Centre's 13-year head start
          </p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Platform tutors (TutorHunt) at £15/hr on price
          </p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Parents favour centres with visible reviews
          </p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.8vw', lineHeight: 1.55 }}>
            Seasonal demand peaks — slow summer months
          </p>
        </div>

      </div>
    </div>
  );
}
