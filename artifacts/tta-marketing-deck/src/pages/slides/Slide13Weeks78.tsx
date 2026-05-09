export default function Slide13Weeks78() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg" style={{ display: 'grid', gridTemplateColumns: '28% 72%', gridTemplateRows: '1fr' }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.4vw', backgroundColor: '#C9973A' }} />

      <div
        className="flex flex-col justify-center items-center"
        style={{ backgroundColor: '#1B2B6B', paddingTop: '8vh', paddingBottom: '8vh' }}
      >
        <p className="font-display" style={{ color: '#C9973A', fontSize: '8vw', fontWeight: 700, lineHeight: 1 }}>7</p>
        <div style={{ width: '3vw', height: '0.3vh', backgroundColor: 'rgba(201,151,58,0.5)', margin: '1.5vh 0' }} />
        <p className="font-display" style={{ color: '#C9973A', fontSize: '8vw', fontWeight: 700, lineHeight: 1 }}>8</p>
        <p className="font-body" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.7vw', fontWeight: 300, marginTop: '2.5vh', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Momentum</p>
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
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Review Progress Against Objectives</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Check Google Business Profile insights — profile views, calls, direction requests, and website clicks. Compare enquiry count against the 20-enquiry target.</p>
        </div>

        <div style={{ marginBottom: '2.8vh', paddingBottom: '2.8vh', borderBottom: '0.15vh solid #D4CDBF' }}>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Second Review Push</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Request second batch of Google reviews from current students and any new contacts. Target: 10 total reviews on GBP by end of Week 8.</p>
        </div>

        <div style={{ marginBottom: '2.8vh', paddingBottom: '2.8vh', borderBottom: '0.15vh solid #D4CDBF' }}>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Availability Post — Create Urgency</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Post an "only 2 slots remaining" Instagram story and Facebook post. Limited availability messaging drives enquiries faster than general awareness posts.</p>
        </div>

        <div>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Prepare for September Term</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Confirm September timetable and pricing. Send WhatsApp broadcast to full leads list with term start date and booking deadline.</p>
        </div>

        <div style={{ marginTop: '3vh', paddingTop: '2vh', borderTop: '0.2vh solid #C9973A' }}>
          <p className="font-body" style={{ color: '#1B2B6B', fontSize: '1.75vw', fontWeight: 600 }}>
            Week 8 target: 10 Google reviews · 20 enquiries · September bookings confirmed
          </p>
        </div>
      </div>
    </div>
  );
}
