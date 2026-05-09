const base = import.meta.env.BASE_URL;

export default function Slide01Cover() {
  return (
    <div className="w-screen h-screen overflow-hidden relative" style={{ backgroundColor: '#1B2B6B' }}>
      <img
        src={`${base}hero.png`}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover"
        alt=""
        style={{ opacity: 0.15 }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(120deg, rgba(27,43,107,0.95) 55%, rgba(27,43,107,0.75) 100%)' }}
      />
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.55vw', backgroundColor: '#C9973A' }} />
      <div className="absolute inset-0 flex flex-col justify-center" style={{ paddingLeft: '9vw', paddingRight: '12vw' }}>
        <p
          className="font-body"
          style={{
            color: '#C9973A',
            fontSize: '1.6vw',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '3vh',
          }}
        >
          Thurrock Tuition Academy
        </p>
        <h1
          className="font-display"
          style={{
            color: '#FFFFFF',
            fontSize: '6.8vw',
            fontWeight: 700,
            lineHeight: 1.05,
            textWrap: 'balance',
            marginBottom: '0.5vh',
          }}
        >
          Market Research
        </h1>
        <h1
          className="font-display"
          style={{
            color: '#C9973A',
            fontSize: '6.8vw',
            fontWeight: 700,
            lineHeight: 1.05,
            textWrap: 'balance',
            marginBottom: '4vh',
          }}
        >
          &amp; 8-Week Launch Plan
        </h1>
        <div style={{ width: '7vw', height: '0.35vh', backgroundColor: '#C9973A', marginBottom: '3.5vh' }} />
        <p
          className="font-body"
          style={{ color: 'rgba(255,255,255,0.65)', fontSize: '2vw', fontWeight: 300 }}
        >
          Khadija · May 2026
        </p>
      </div>
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: '28vw',
          height: '28vw',
          borderRadius: '50%',
          backgroundColor: 'rgba(201,151,58,0.07)',
          transform: 'translate(35%, 35%)',
        }}
      />
      <div
        className="absolute bottom-0 right-0"
        style={{
          width: '18vw',
          height: '18vw',
          borderRadius: '50%',
          backgroundColor: 'rgba(201,151,58,0.1)',
          transform: 'translate(20%, 20%)',
        }}
      />
    </div>
  );
}
