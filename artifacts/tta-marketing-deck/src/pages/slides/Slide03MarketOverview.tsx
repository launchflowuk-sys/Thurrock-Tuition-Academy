export default function Slide03MarketOverview() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg flex flex-col" style={{ paddingLeft: '8vw', paddingRight: '8vw', paddingTop: '7vh', paddingBottom: '7vh' }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.4vw', backgroundColor: '#C9973A' }} />

      <p
        className="font-body"
        style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5vh' }}
      >
        Market Context
      </p>
      <h2
        className="font-display"
        style={{ color: '#1B2B6B', fontSize: '4vw', fontWeight: 700, lineHeight: 1.1, marginBottom: '5vh' }}
      >
        The Thurrock Tuition Market
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5vh 4vw', flex: 1 }}>

        <div style={{ backgroundColor: '#EEF0F8', borderRadius: '0.6vw', padding: '3vh 2.5vw' }}>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.2vh' }}>Grammar School Pipeline</p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2vw', fontWeight: 400, lineHeight: 1.5 }}>Two selective schools — KEGS and Torreills — drive year-round 11+ preparation demand across Grays, Chafford Hundred, and Stanford-le-Hope.</p>
        </div>

        <div style={{ backgroundColor: '#EEF0F8', borderRadius: '0.6vw', padding: '3vh 2.5vw' }}>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.2vh' }}>Parent Communication Channels</p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2vw', fontWeight: 400, lineHeight: 1.5 }}>Facebook parent groups and WhatsApp chains are the dominant local word-of-mouth channels in Grays and Thurrock.</p>
        </div>

        <div style={{ backgroundColor: '#EEF0F8', borderRadius: '0.6vw', padding: '3vh 2.5vw' }}>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.2vh' }}>Underserved Micro-Areas</p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2vw', fontWeight: 400, lineHeight: 1.5 }}>Tilbury, South Ockendon, and Chadwell St Mary have very few listed local providers — demand exists but supply is thin.</p>
        </div>

        <div style={{ backgroundColor: '#EEF0F8', borderRadius: '0.6vw', padding: '3vh 2.5vw' }}>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.2vh' }}>Visible Market Rates</p>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2vw', fontWeight: 400, lineHeight: 1.5 }}>92+ tutors listed on TutorHunt in Grays at £15–£32/hr. Tutorful's Thurrock average is £32/hr. Centre fees are private.</p>
        </div>

      </div>
    </div>
  );
}
