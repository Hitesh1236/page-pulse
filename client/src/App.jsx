import { useState } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const handleAudit = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setReport(null);

    try { 
      const res = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze page.');
      }

      setReport(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1> Page Pulse</h1>
        <p>Instant URL & SEO Audit Tool</p>
      </header>

      <main style={styles.main}>
        <form onSubmit={handleAudit} style={styles.form}>
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Auditing...' : 'Run Audit'}
          </button>
        </form>

        {error && (
          <div style={styles.errorCard}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {report && (
          <div style={styles.reportContainer}>
            <h2>Audit Results for <span style={styles.urlHighlight}>{report.url}</span></h2>
            
            <div style={styles.grid}>
              <div style={styles.card}>
                <h3>HTTP Status</h3>
                <p style={{ ...styles.cardVal, color: report.status === 200 ? '#2e7d32' : '#d32f2f' }}>
                  {report.status}
                </p>
              </div>

              <div style={styles.card}>
                <h3>Response Time</h3>
                <p style={styles.cardVal}>{report.responseTimeMs} ms</p>
              </div>

              <div style={styles.card}>
                <h3>H1 Tags Count</h3>
                <p style={styles.cardVal}>{report.h1Count}</p>
              </div>

              <div style={styles.card}>
                <h3>Images Missing Alt</h3>
                <p style={{ ...styles.cardVal, color: report.imagesMissingAlt > 0 ? '#d32f2f' : '#2e7d32' }}>
                  {report.imagesMissingAlt}
                </p>
              </div>

              <div style={styles.card}>
                <h3>Word Count</h3>
                <p style={styles.cardVal}>~{report.wordCount}</p>
              </div>
            </div>

            <div style={styles.detailBox}>
              <p><strong>Page Title:</strong> {report.title}</p>
              <p><strong>Meta Description:</strong> {report.metaDescription}</p>
            </div>
          </div>
        )}
      </main>

      {/* MANDATORY LIVE BUILD REQUIREMENT */}
      <footer style={styles.footer}>
        <p>
          <a 
            href="https://digitalheroesco.com" 
            target="_blank" 
            rel="noopener noreferrer"
            style={styles.footerLink}
          >
            Built for Digital Heroes Training Task
          </a>
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: { fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: { textAlign: 'center', marginBottom: '30px' },
  main: { flex: 1 },
  form: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flex: 1, padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '6px' },
  button: { padding: '12px 24px', fontSize: '16px', backgroundColor: '#0066ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  errorCard: { padding: '15px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '6px', marginBottom: '20px' },
  reportContainer: { marginTop: '20px' },
  urlHighlight: { color: '#0066ff', fontSize: '18px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', marginTop: '15px' },
  card: { padding: '15px', background: '#f5f5f5', borderRadius: '8px', textAlign: 'center' },
  cardVal: { fontSize: '22px', fontWeight: 'bold', margin: '5px 0 0 0' },
  detailBox: { marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px', lineHeight: '1.6' },
  footer: { marginTop: '40px', textAlign: 'center', padding: '20px 0', borderTop: '1px solid #eee' },
  footerLink: { color: '#666', textDecoration: 'none', fontWeight: 'bold' }
};