export default function Slide11Weeks34() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg" style={{ display: 'grid', gridTemplateColumns: '28% 72%', gridTemplateRows: '1fr' }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.4vw', backgroundColor: '#C9973A' }} />

      <div
        className="flex flex-col justify-center items-center"
        style={{ backgroundColor: '#1B2B6B', paddingTop: '8vh', paddingBottom: '8vh' }}
      >
        <p className="font-display" style={{ color: '#C9973A', fontSize: '8vw', fontWeight: 700, lineHeight: 1 }}>3</p>
        <div style={{ width: '3vw', height: '0.3vh', backgroundColor: 'rgba(201,151,58,0.5)', margin: '1.5vh 0' }} />
        <p className="font-display" style={{ color: '#C9973A', fontSize: '8vw', fontWeight: 700, lineHeight: 1 }}>4</p>
        <p className="font-body" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.7vw', fontWeight: 300, marginTop: '2.5vh', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Visibility</p>
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
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>First Google Reviews</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Personally ask 5 known contacts — friends, family, or early students — to leave an honest Google review. Send each a direct review link via WhatsApp.</p>
        </div>

        <div style={{ marginBottom: '2.8vh', paddingBottom: '2.8vh', borderBottom: '0.15vh solid #D4CDBF' }}>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Local Facebook Group Activity</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Join and post in Grays Parents, Thurrock Mums, and Chafford Hundred Facebook groups. Share helpful 11+ tips — not ads. Mention TTA naturally.</p>
        </div>

        <div style={{ marginBottom: '2.8vh', paddingBottom: '2.8vh', borderBottom: '0.15vh solid #D4CDBF' }}>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Location Pages on Website</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Publish dedicated pages: "Tuition in Grays", "11+ Tuition Thurrock", "GCSE Tuition Grays". Each should be 300+ words with local keywords.</p>
        </div>

        <div>
          <p className="font-body" style={{ color: '#1A1A2E', fontSize: '2.1vw', fontWeight: 600, marginBottom: '0.6vh' }}>Weekly Content Posts</p>
          <p className="font-body" style={{ color: '#6B6B7A', fontSize: '1.85vw', lineHeight: 1.45 }}>Post weekly on Facebook and Instagram: 11+ FAQs, GCSE revision tips, student success stories. Aim for 2 posts per week minimum.</p>
        </div>

        <div style={{ marginTop: '3vh', paddingTop: '2vh', borderTop: '0.2vh solid #C9973A' }}>
          <p className="font-body" style={{ color: '#1B2B6B', fontSize: '1.75vw', fontWeight: 600 }}>
            Week 4 target: 5 Google reviews · active in 3+ local groups · location pages live
          </p>
        </div>
      </div>
    </div>
  );
}
