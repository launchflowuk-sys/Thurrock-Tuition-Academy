export default function Slide14Closing() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col justify-center"
      style={{ backgroundColor: '#1B2B6B', paddingLeft: '9vw', paddingRight: '9vw' }}
    >
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.55vw', backgroundColor: '#C9973A' }} />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '-5vw',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          backgroundColor: 'rgba(201,151,58,0.06)',
          transform: 'translateX(-50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '-2vw',
          width: '25vw',
          height: '25vw',
          borderRadius: '50%',
          backgroundColor: 'rgba(201,151,58,0.08)',
          transform: 'translateX(-50%)',
        }}
      />

      <p
        className="font-body"
        style={{ color: '#C9973A', fontSize: '1.6vw', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2vh' }}
      >
        Thurrock Tuition Academy
      </p>
      <h2
        className="font-display"
        style={{ color: '#FFFFFF', fontSize: '6vw', fontWeight: 700, lineHeight: 1.05, marginBottom: '5vh' }}
      >
        The plan starts now.
      </h2>

      <div style={{ width: '7vw', height: '0.35vh', backgroundColor: '#C9973A', marginBottom: '5vh' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3vw', maxWidth: '70vw' }}>
        <div>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1vh' }}>Location</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.9vw', lineHeight: 1.5 }}>Suite 1, Queensgate Centre</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.9vw', lineHeight: 1.5 }}>Orsett Road, Grays</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.9vw', lineHeight: 1.5 }}>Thurrock, Essex</p>
        </div>
        <div>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1vh' }}>WhatsApp</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.9vw', lineHeight: 1.5 }}>07480 413679</p>
        </div>
        <div>
          <p className="font-body" style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1vh' }}>Week 1 Priority</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.9vw', lineHeight: 1.5 }}>Google Business Profile live</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.9vw', lineHeight: 1.5 }}>WhatsApp Business active</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.9vw', lineHeight: 1.5 }}>First 3 social posts published</p>
        </div>
      </div>
    </div>
  );
}
