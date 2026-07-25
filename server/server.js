const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173', // For local development
  process.env.CLIENT_URL,   // For live Vercel production
].filter(Boolean);          // Removes empty values if CLIENT_URL isn't set yet



app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
  })
);
app.use(express.json());

app.post('/api/audit', async (req, res) => {
  const startTime = Date.now();
  let { url } = req.body;

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'URL is required' });
  }

  url = url.trim();

  // Auto-prefix protocol if missed
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  // Quick hostname & format check
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
      return res.status(400).json({ error: 'Invalid url format' });
    }
  } catch (err) {
    return res.status(400).json({ error: 'Invalid url format' });
  }

  try {
    const response = await axios.get(url, {
      timeout: 7000,
      headers: {
        'User-Agent': 'PagePulse/1.0',
        'Accept': 'text/html,application/xhtml+xml',
      },
      maxRedirects: 5,
    });

    const contentType = response.headers['content-type'] || '';
    if (!contentType.includes('text/html')) {
      return res.status(422).json({
        error: `Target URL returned non-HTML content (${contentType || 'Unknown'}). Page Pulse only audits HTML pages.`,
        status: response.status,
      });
    }

    const $ = cheerio.load(response.data);

    // Extract metadata
    const title = $('title').first().text().trim() || 'No title found';
    const metaDescription =
      $('meta[name="description"]').attr('content')?.trim() ||
      $('meta[property="og:description"]').attr('content')?.trim() ||
      'No description for the url';

    const h1Count = $('h1').length;

    // Count missing alt attributes
    const imagesMissingAlt = $('img').filter((_, img) => {
      const alt = $(img).attr('alt');
      return alt === undefined || alt.trim() === '';
    }).length;

    // Strip non-content elements for word count estimate
    $('script, style, noscript, svg, nav, footer').remove();
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const wordCount = bodyText ? bodyText.split(' ').filter(Boolean).length : 0;

    return res.json({
      url,
      status: response.status,
      responseTimeMs: Date.now() - startTime,
      title,
      metaDescription,
      h1Count,
      imagesMissingAlt,
      wordCount,
    });

  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Request timed out after 7 seconds.' });
    }

    const statusCode = err.response?.status || 500;
    const message = err.response
      ? `Failed to fetch page. HTTP Status: ${err.response.status}`
      : 'Could not connect to the provided URL. Ensure the domain is active.';

    return res.status(statusCode).json({ error: message });
  }
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

module.exports = app;