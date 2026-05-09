export default function Slide09PlanDivider() {
  return (
    <div
      className="w-screen h-screen overflow-hidden relative flex flex-col justify-center"
      style={{ backgroundColor: '#1B2B6B', paddingLeft: '10vw', paddingRight: '10vw' }}
    >
      <div className="absolute right-0 top-0 bottom-0" style={{ width: '0.55vw', backgroundColor: '#C9973A' }} />

      <div
        style={{
          position: 'absolute',
          right: '5vw',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '30vw',
          height: '30vw',
          borderRadius: '50%',
          border: '0.15vh solid rgba(201,151,58,0.2)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '8vw',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '20vw',
          height: '20vw',
          borderRadius: '50%',
          border: '0.15vh solid rgba(201,151,58,0.12)',
        }}
      />

      <p
        className="font-body"
        style={{ color: '#C9973A', fontSize: '1.6vw', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2.5vh' }}
      >
        Section 2
      </p>
      <h2
        className="font-display"
        style={{ color: '#FFFFFF', fontSize: '6.5vw', fontWeight: 700, lineHeight: 1.05, textWrap: 'balance', marginBottom: '3vh' }}
      >
        The 8-Week
      </h2>
      <h2
        className="font-display"
        style={{ color: '#C9973A', fontSize: '6.5vw', fontWeight: 700, lineHeight: 1.05, textWrap: 'balance', marginBottom: '4vh' }}
      >
        Launch Plan
      </h2>
      <div style={{ width: '6vw', height: '0.3vh', backgroundColor: '#C9973A', marginBottom: '3vh' }} />
      <p
        className="font-body"
        style={{ color: 'rgba(255,255,255,0.6)', fontSize: '2vw', fontWeight: 300, lineHeight: 1.5 }}
      >
        Week-by-week actions, channels, and success indicators
      </p>
    </div>
  );
}
