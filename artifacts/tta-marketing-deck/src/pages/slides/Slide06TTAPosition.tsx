export default function Slide06TTAPosition() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.4vw', backgroundColor: '#C9973A' }} />

      <div
        className="flex flex-col"
        style={{ paddingLeft: '8vw', paddingRight: '3.5vw', paddingTop: '7vh', paddingBottom: '7vh' }}
      >
        <p
          className="font-body"
          style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5vh' }}
        >
          What We Face
        </p>
        <h2
          className="font-display"
          style={{ color: '#1B2B6B', fontSize: '3.5vw', fontWeight: 700, lineHeight: 1.1, marginBottom: '4vh' }}
        >
          Competitor Strengths
        </h2>

        <div style={{ marginBottom: '2.5vh', paddingBottom: '2.5vh', borderBottom: '0.15vh solid #D4CDBF' }}>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2vw', fontWeight: 600, marginBottom: '0.5vh' }}>13-year established brand</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.8vw', lineHeight: 1.5 }}>Grays Tuition Centre's alumni network of 5,000+ creates deep word-of-mouth that takes years to replicate.</p>
        </div>

        <div style={{ marginBottom: '2.5vh', paddingBottom: '2.5vh', borderBottom: '0.15vh solid #D4CDBF' }}>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2vw', fontWeight: 600, marginBottom: '0.5vh' }}>Google footprint &amp; reviews</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.8vw', lineHeight: 1.5 }}>Established centres rank on page 1 for every key local search term, backed by verified Google reviews.</p>
        </div>

        <div>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2vw', fontWeight: 600, marginBottom: '0.5vh' }}>Group session scale</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.8vw', lineHeight: 1.5 }}>Multiple tutors running parallel groups across Maths, English, and Science simultaneously.</p>
        </div>
      </div>

      <div
        className="flex flex-col"
        style={{ backgroundColor: '#1B2B6B', paddingLeft: '5vw', paddingRight: '7vw', paddingTop: '7vh', paddingBottom: '7vh' }}
      >
        <p
          className="font-body"
          style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5vh' }}
        >
          What We Own
        </p>
        <h2
          className="font-display"
          style={{ color: '#FFFFFF', fontSize: '3.5vw', fontWeight: 700, lineHeight: 1.1, marginBottom: '4vh' }}
        >
          TTA Differentiation
        </h2>

        <div style={{ marginBottom: '2.5vh', paddingBottom: '2.5vh', borderBottom: '0.15vh solid rgba(201,151,58,0.25)' }}>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '2vw', fontWeight: 600, marginBottom: '0.5vh' }}>WhatsApp-first booking</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.8vw', lineHeight: 1.5 }}>No competitor offers this. Every parent in Thurrock uses WhatsApp — TTA meets them there.</p>
        </div>

        <div style={{ marginBottom: '2.5vh', paddingBottom: '2.5vh', borderBottom: '0.15vh solid rgba(201,151,58,0.25)' }}>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '2vw', fontWeight: 600, marginBottom: '0.5vh' }}>Premium Queensgate address</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.8vw', lineHeight: 1.5 }}>A professional, central, accessible location that signals quality without the high-street price tag.</p>
        </div>

        <div>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '2vw', fontWeight: 600, marginBottom: '0.5vh' }}>Boutique personal relationship</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.8vw', lineHeight: 1.5 }}>Khadija knows every student personally — responsive, flexible, and genuinely invested in each child.</p>
        </div>
      </div>
    </div>
  );
}
