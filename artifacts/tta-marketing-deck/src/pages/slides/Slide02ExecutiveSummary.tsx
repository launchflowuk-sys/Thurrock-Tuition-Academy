export default function Slide02ExecutiveSummary() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr' }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.4vw', backgroundColor: '#C9973A' }} />

      <div
        className="flex flex-col justify-center"
        style={{ paddingLeft: '8vw', paddingRight: '4vw', paddingTop: '8vh', paddingBottom: '8vh' }}
      >
        <p
          className="font-body"
          style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2.5vh' }}
        >
          Executive Summary
        </p>
        <h2
          className="font-display"
          style={{ color: '#1B2B6B', fontSize: '4.2vw', fontWeight: 700, lineHeight: 1.1, textWrap: 'balance', marginBottom: '5vh' }}
        >
          A clear market, a clear opportunity.
        </h2>

        <div style={{ borderLeft: '0.3vw solid #C9973A', paddingLeft: '2vw', marginBottom: '3vh' }}>
          <p className="font-body" style={{ color: '#1B2B6B', fontSize: '2.8vw', fontWeight: 700, lineHeight: 1 }}>6</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.8vw', fontWeight: 400, marginTop: '0.5vh' }}>competitors identified on page 1 of Google for Thurrock tuition searches</p>
        </div>

        <div style={{ borderLeft: '0.3vw solid #C9973A', paddingLeft: '2vw', marginBottom: '3vh' }}>
          <p className="font-body" style={{ color: '#1B2B6B', fontSize: '2.8vw', fontWeight: 700, lineHeight: 1 }}>£15–£32/hr</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.8vw', fontWeight: 400, marginTop: '0.5vh' }}>visible market rate range; centre fees are largely unpublished</p>
        </div>

        <div style={{ borderLeft: '0.3vw solid #C9973A', paddingLeft: '2vw' }}>
          <p className="font-body" style={{ color: '#1B2B6B', fontSize: '2.8vw', fontWeight: 700, lineHeight: 1 }}>0</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.8vw', fontWeight: 400, marginTop: '0.5vh' }}>WhatsApp-first booking providers currently in the Grays market</p>
        </div>
      </div>

      <div
        className="flex flex-col justify-center"
        style={{ backgroundColor: '#1B2B6B', paddingLeft: '5vw', paddingRight: '7vw', paddingTop: '8vh', paddingBottom: '8vh' }}
      >
        <p
          className="font-display"
          style={{ color: '#FFFFFF', fontSize: '2.2vw', fontWeight: 400, lineHeight: 1.6, marginBottom: '4vh', textWrap: 'pretty' }}
        >
          TTA enters a market with established centres — but none offer a boutique, personal, WhatsApp-first experience from a premium Queensgate Centre address.
        </p>
        <p
          className="font-body"
          style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.9vw', fontWeight: 300, lineHeight: 1.6, textWrap: 'pretty' }}
        >
          An 8-week focused launch plan can establish TTA's Google footprint, generate the first 10 reviews, build a referral pipeline, and position TTA as Grays' most personal tuition provider.
        </p>
        <div style={{ marginTop: '5vh', paddingTop: '3vh', borderTop: '0.15vh solid rgba(201,151,58,0.4)' }}>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '1.6vw', fontWeight: 500 }}>
            Suite 1, Queensgate Centre, Grays, Thurrock
          </p>
        </div>
      </div>
    </div>
  );
}
