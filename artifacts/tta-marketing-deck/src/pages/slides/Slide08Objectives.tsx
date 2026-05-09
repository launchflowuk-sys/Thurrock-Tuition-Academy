export default function Slide08Objectives() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg flex flex-col" style={{ paddingLeft: '8vw', paddingRight: '8vw', paddingTop: '6.5vh', paddingBottom: '6.5vh' }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.4vw', backgroundColor: '#C9973A' }} />

      <p
        className="font-body"
        style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1vh' }}
      >
        First 8 Weeks
      </p>
      <h2
        className="font-display"
        style={{ color: '#1B2B6B', fontSize: '3.8vw', fontWeight: 700, lineHeight: 1.1, marginBottom: '4vh' }}
      >
        6 Strategic Objectives
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2vh 4vw', flex: 1 }}>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.8vw' }}>
          <div style={{ minWidth: '4.5vw', height: '4.5vw', backgroundColor: '#1B2B6B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.3vh' }}>
            <span className="font-display" style={{ color: '#C9973A', fontSize: '2.2vw', fontWeight: 700 }}>1</span>
          </div>
          <div>
            <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.9vw', fontWeight: 600, marginBottom: '0.5vh' }}>Google Business Profile live</p>
            <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', lineHeight: 1.4 }}>Fully optimised with photos, description, and WhatsApp link — by end of Week 1</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.8vw' }}>
          <div style={{ minWidth: '4.5vw', height: '4.5vw', backgroundColor: '#1B2B6B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.3vh' }}>
            <span className="font-display" style={{ color: '#C9973A', fontSize: '2.2vw', fontWeight: 700 }}>2</span>
          </div>
          <div>
            <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.9vw', fontWeight: 600, marginBottom: '0.5vh' }}>10 Google reviews received</p>
            <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', lineHeight: 1.4 }}>Minimum 10 verified reviews on GBP — by end of Week 6</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.8vw' }}>
          <div style={{ minWidth: '4.5vw', height: '4.5vw', backgroundColor: '#1B2B6B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.3vh' }}>
            <span className="font-display" style={{ color: '#C9973A', fontSize: '2.2vw', fontWeight: 700 }}>3</span>
          </div>
          <div>
            <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.9vw', fontWeight: 600, marginBottom: '0.5vh' }}>20 WhatsApp enquiries</p>
            <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', lineHeight: 1.4 }}>20 genuine parent enquiries received via WhatsApp Business — by end of Week 8</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.8vw' }}>
          <div style={{ minWidth: '4.5vw', height: '4.5vw', backgroundColor: '#1B2B6B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.3vh' }}>
            <span className="font-display" style={{ color: '#C9973A', fontSize: '2.2vw', fontWeight: 700 }}>4</span>
          </div>
          <div>
            <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.9vw', fontWeight: 600, marginBottom: '0.5vh' }}>Social media presence established</p>
            <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', lineHeight: 1.4 }}>Facebook &amp; Instagram live with 10 posts published — by end of Week 4</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.8vw' }}>
          <div style={{ minWidth: '4.5vw', height: '4.5vw', backgroundColor: '#1B2B6B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.3vh' }}>
            <span className="font-display" style={{ color: '#C9973A', fontSize: '2.2vw', fontWeight: 700 }}>5</span>
          </div>
          <div>
            <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.9vw', fontWeight: 600, marginBottom: '0.5vh' }}>3 community partnerships</p>
            <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', lineHeight: 1.4 }}>Schools, community centres, or mosques in Grays/Thurrock distributing TTA materials — by Week 6</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.8vw' }}>
          <div style={{ minWidth: '4.5vw', height: '4.5vw', backgroundColor: '#C9973A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.3vh' }}>
            <span className="font-display" style={{ color: '#FFFFFF', fontSize: '2.2vw', fontWeight: 700 }}>6</span>
          </div>
          <div>
            <p className="font-body" style={{ color: '#1A1A2E', fontSize: '1.9vw', fontWeight: 600, marginBottom: '0.5vh' }}>Google local 3-pack visibility</p>
            <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', lineHeight: 1.4 }}>TTA appearing in Google's local results for "tuition Grays" — by end of Week 8</p>
          </div>
        </div>

      </div>
    </div>
  );
}
