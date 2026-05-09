export default function Slide05CompetitorTable() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-bg flex flex-col" style={{ paddingLeft: '6vw', paddingRight: '6vw', paddingTop: '6vh', paddingBottom: '6vh' }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: '0.4vw', backgroundColor: '#C9973A' }} />

      <p
        className="font-body"
        style={{ color: '#C9973A', fontSize: '1.5vw', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1vh' }}
      >
        Head-to-Head Comparison
      </p>
      <h2
        className="font-display"
        style={{ color: '#1B2B6B', fontSize: '3.8vw', fontWeight: 700, lineHeight: 1.1, marginBottom: '3vh' }}
      >
        TTA vs. the Field
      </h2>

      <div style={{ flex: 1, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ backgroundColor: '#1B2B6B' }}>
              <th className="font-body" style={{ color: '#FFFFFF', fontSize: '1.55vw', fontWeight: 600, padding: '1.5vh 1.2vw', textAlign: 'left', width: '20%' }}>Provider</th>
              <th className="font-body" style={{ color: '#FFFFFF', fontSize: '1.55vw', fontWeight: 600, padding: '1.5vh 1vw', textAlign: 'center', width: '13%' }}>11+ Prep</th>
              <th className="font-body" style={{ color: '#FFFFFF', fontSize: '1.55vw', fontWeight: 600, padding: '1.5vh 1vw', textAlign: 'center', width: '10%' }}>GCSE</th>
              <th className="font-body" style={{ color: '#FFFFFF', fontSize: '1.55vw', fontWeight: 600, padding: '1.5vh 1vw', textAlign: 'center', width: '12%' }}>1-to-1</th>
              <th className="font-body" style={{ color: '#FFFFFF', fontSize: '1.55vw', fontWeight: 600, padding: '1.5vh 1vw', textAlign: 'center', width: '15%' }}>WhatsApp</th>
              <th className="font-body" style={{ color: '#FFFFFF', fontSize: '1.55vw', fontWeight: 600, padding: '1.5vh 1vw', textAlign: 'center', width: '15%' }}>Google Reviews</th>
              <th className="font-body" style={{ color: '#FFFFFF', fontSize: '1.55vw', fontWeight: 600, padding: '1.5vh 1vw', textAlign: 'center', width: '15%' }}>Est.</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#EEF0F8' }}>
              <td className="font-body" style={{ color: '#1A1A2E', fontSize: '1.7vw', fontWeight: 600, padding: '1.6vh 1.2vw' }}>Grays Tuition Centre</td>
              <td className="font-body" style={{ color: '#1B2B6B', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>Yes</td>
              <td className="font-body" style={{ color: '#1B2B6B', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>Yes</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#1B2B6B', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>Strong</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>2012</td>
            </tr>
            <tr style={{ backgroundColor: '#F8F4EC' }}>
              <td className="font-body" style={{ color: '#1A1A2E', fontSize: '1.7vw', fontWeight: 600, padding: '1.6vh 1.2vw' }}>AMRA Academy</td>
              <td className="font-body" style={{ color: '#1B2B6B', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>Yes</td>
              <td className="font-body" style={{ color: '#1B2B6B', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>Yes</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>Limited</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>2018</td>
            </tr>
            <tr style={{ backgroundColor: '#EEF0F8' }}>
              <td className="font-body" style={{ color: '#1A1A2E', fontSize: '1.7vw', fontWeight: 600, padding: '1.6vh 1.2vw' }}>Frobel Education</td>
              <td className="font-body" style={{ color: '#1B2B6B', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>Yes</td>
              <td className="font-body" style={{ color: '#1B2B6B', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>Yes</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>Limited</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>National</td>
            </tr>
            <tr style={{ backgroundColor: '#F8F4EC' }}>
              <td className="font-body" style={{ color: '#1A1A2E', fontSize: '1.7vw', fontWeight: 600, padding: '1.6vh 1.2vw' }}>11 Plus Tutors Essex</td>
              <td className="font-body" style={{ color: '#1B2B6B', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>Yes</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#1B2B6B', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>Yes</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>Some</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>Est.</td>
            </tr>
            <tr style={{ backgroundColor: '#EEF0F8' }}>
              <td className="font-body" style={{ color: '#1A1A2E', fontSize: '1.7vw', fontWeight: 600, padding: '1.6vh 1.2vw' }}>Kumon Grays</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>No</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>Limited</td>
              <td className="font-body" style={{ color: '#6B6B7A', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>Franchise</td>
            </tr>
            <tr style={{ backgroundColor: '#1B2B6B' }}>
              <td className="font-body" style={{ color: '#C9973A', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1.2vw' }}>TTA (Target State)</td>
              <td className="font-body" style={{ color: '#C9973A', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>Yes</td>
              <td className="font-body" style={{ color: '#C9973A', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>Yes</td>
              <td className="font-body" style={{ color: '#C9973A', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>Yes</td>
              <td className="font-body" style={{ color: '#C9973A', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>YES</td>
              <td className="font-body" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.7vw', padding: '1.6vh 1vw', textAlign: 'center' }}>Building</td>
              <td className="font-body" style={{ color: '#C9973A', fontSize: '1.8vw', fontWeight: 700, padding: '1.6vh 1vw', textAlign: 'center' }}>2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
