export default function Slide12Weeks56() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg" style={{ display: 'grid', gridTemplateColumns: '28% 72%', gridTemplateRows: '1fr' }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.4vw', backgroundColor: '#C9973A' }} />

      <div
        className="flex flex-col justify-center items-center"
        style={{ backgroundColor: '#1B2B6B', paddingTop: '8vh', paddingBottom: '8vh' }}
      >
        <p className="font-display" style={{ color: '#C9973A', fontSize: '8vw', fontWeight: 700, lineHeight: 1 }}>5</p>
        <div style={{ width: '3vw', height: '0.3vh', backgroundColor: 'rgba(201,151,58,0.5)', margin: '1.5vh 0' }} />
        <p className="font-display" style={{ color: '#C9973A', fontSize: '8vw', fontWeight: 700, lineHeight: 1 }}>6</p>
        <p className="font-body" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.7vw', fontWeight: 300, marginTop: '2.5vh', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Community</p>
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
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>School Outreach</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Approach 3 local primary schools to distribute TTA flyers to Year 4 and Year 5 parents ahead of the 11+ registration season. Focus on Grays and Tilbury primaries.</p>
        </div>

        <div style={{ marginBottom: '2.8vh', paddingBottom: '2.8vh', borderBottom: '0.15vh solid #D4CDBF' }}>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Parent Referral Scheme</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Launch referral programme: £10 session discount for each successfully referred new student. Announce via WhatsApp broadcast to all existing contacts.</p>
        </div>

        <div style={{ marginBottom: '2.8vh', paddingBottom: '2.8vh', borderBottom: '0.15vh solid #D4CDBF' }}>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Community Notice Boards</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Place printed A5 flyers on community centre and mosque notice boards in Grays and Tilbury. Include WhatsApp number prominently — no website needed.</p>
        </div>

        <div>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>WhatsApp Broadcast — Term Dates</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Send a broadcast to the full enquiry list with upcoming term dates, subject availability, and a direct booking prompt. Keep it under 3 sentences.</p>
        </div>

        <div style={{ marginTop: '3vh', paddingTop: '2vh', borderTop: '0.2vh solid #C9973A' }}>
          <p className="font-body" style={{ color: '#1B2B6B', fontSize: '1.75vw', fontWeight: 600 }}>
            Week 6 target: 3 school partnerships · referral scheme live · 10 enquiries received
          </p>
        </div>
      </div>
    </div>
  );
}
