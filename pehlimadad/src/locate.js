'use strict';

const { verifyToken } = require('./token');
const { getSession, saveSession } = require('./session');
const { sendMessage } = require('./whatsapp');
const { getMapsMessage } = require('./triage');
const { getDoctorSummary } = require('./bedrock');
const { getEmergencyFooter } = require('./facilities');

/**
 * GET /locate?t=TOKEN           → serve the location capture HTML page
 * GET /locate?t=TOKEN&lat=X&lng=Y → process location, send WhatsApp messages, return JSON
 */
async function handler(event) {
  const params = event.queryStringParameters || {};
  const token = params.t;
  const lat = params.lat ? parseFloat(params.lat) : null;
  const lng = params.lng ? parseFloat(params.lng) : null;

  // Verify token
  const phone = verifyToken(token);
  if (!phone) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid or expired link. Please ask PehliMadad again.' }),
    };
  }

  // If lat/lng provided → process location and send WhatsApp messages
  if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
    return processLocation(phone, lat, lng);
  }

  // Otherwise → serve the HTML location capture page
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: buildLocationPage(token),
  };
}

async function processLocation(phone, lat, lng) {
  try {
    const session = await getSession(phone);
    const facility = session.facility || 'DISTRICT_HOSPITAL';

    // Detect language from history
    const historyText = session.history.map((m) => m.content).join(' ');
    const lang = /[\u0900-\u097F]/.test(historyText) ? 'hi' : 'en';

    // Mark as located
    await saveSession(phone, { ...session, stage: 'located' });

    // Send Maps link
    const mapsMsg = getMapsMessage(lat, lng, facility, lang);
    await sendMessage(phone, mapsMsg);

    // Small delay, then send doctor summary
    await new Promise((r) => setTimeout(r, 800));

    if (session.history && session.history.length >= 2) {
      const summary = await getDoctorSummary(session.history);
      await sendMessage(phone, summary);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error('processLocation error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to process location' }),
    };
  }
}

/**
 * Build the location capture HTML page.
 * Designed for low-literacy rural users:
 * - Big buttons, simple Hindi text
 * - Auto-requests location on load
 * - Cell tower / GPS / WiFi all work via browser Geolocation API
 */
function buildLocationPage(token) {
  const apiBase = process.env.API_BASE_URL || '';

  return `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
  <meta name="theme-color" content="#075e54"/>
  <title>पहली मदद — लोकेशन</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Noto Sans', 'Segoe UI', sans-serif;
      background: #075e54;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      color: white;
    }
    .card {
      background: white;
      color: #1a1a1a;
      border-radius: 20px;
      padding: 36px 28px;
      width: 100%;
      max-width: 380px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .icon { font-size: 72px; margin-bottom: 16px; display: block; }
    h1 { font-size: 1.6rem; font-weight: 800; color: #075e54; margin-bottom: 8px; }
    .subtitle { font-size: 1rem; color: #555; margin-bottom: 28px; line-height: 1.5; }
    .btn {
      width: 100%;
      padding: 18px;
      background: #25D366;
      color: white;
      border: none;
      border-radius: 14px;
      font-size: 1.2rem;
      font-weight: 700;
      cursor: pointer;
      margin-bottom: 12px;
      transition: background 0.2s;
    }
    .btn:active { background: #1aab52; }
    .btn:disabled { background: #a0d4b0; cursor: not-allowed; }
    .status {
      margin-top: 20px;
      font-size: 1rem;
      color: #333;
      min-height: 60px;
      line-height: 1.6;
    }
    .status.success { color: #075e54; font-weight: 700; font-size: 1.1rem; }
    .status.error { color: #c0392b; }
    .spinner {
      display: none;
      width: 40px;
      height: 40px;
      border: 4px solid #eee;
      border-top: 4px solid #25D366;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 16px auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .whatsapp-note {
      margin-top: 20px;
      font-size: 0.8rem;
      color: #999;
    }
  </style>
</head>
<body>
<div class="card">
  <span class="icon" id="mainIcon">📍</span>
  <h1>पहली मदद</h1>
  <p class="subtitle" id="subtitle">
    नज़दीकी अस्पताल ढूंढने के लिए<br/>
    <strong>लोकेशन दें</strong>
  </p>

  <button class="btn" id="locBtn" onclick="getLocation()">
    📍 लोकेशन दें
  </button>

  <div class="spinner" id="spinner"></div>
  <div class="status" id="status"></div>
  <div class="whatsapp-note">WhatsApp पर नतीजा भेजा जाएगा</div>
</div>

<script>
  const TOKEN = ${JSON.stringify(token)};
  const API = ${JSON.stringify(apiBase)};

  // Auto-attempt on load (many browsers allow this on user gesture from WhatsApp tap)
  window.addEventListener('load', () => {
    // Small delay to let page render, then auto-request
    setTimeout(getLocation, 600);
  });

  function getLocation() {
    const btn = document.getElementById('locBtn');
    const status = document.getElementById('status');
    const spinner = document.getElementById('spinner');

    btn.disabled = true;
    btn.textContent = '⌛ लोकेशन ले रहे हैं...';
    spinner.style.display = 'block';
    status.textContent = '';
    status.className = 'status';

    if (!navigator.geolocation) {
      showError('आपके फोन में लोकेशन सुविधा नहीं है।\\nWhatsApp पर लोकेशन मैन्युअल शेयर करें।');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      onError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  }

  async function onSuccess(pos) {
    const { latitude: lat, longitude: lng, accuracy } = pos.coords;
    const spinner = document.getElementById('spinner');
    const status = document.getElementById('status');

    status.textContent = 'लोकेशन मिल गई! WhatsApp पर भेज रहे हैं...';

    try {
      const url = API + '/locate?t=' + encodeURIComponent(TOKEN) + '&lat=' + lat + '&lng=' + lng;
      const res = await fetch(url);
      const data = await res.json();

      spinner.style.display = 'none';

      if (data.success) {
        document.getElementById('mainIcon').textContent = '✅';
        document.getElementById('subtitle').innerHTML = '<strong>हो गया!</strong>';
        status.className = 'status success';
        status.innerHTML = 'WhatsApp पर नज़दीकी अस्पताल<br/>और डॉक्टर की पर्ची भेज दी है।<br/><br/>📱 WhatsApp खोलें';
        document.getElementById('locBtn').style.display = 'none';
      } else {
        showError('कुछ गड़बड़ हुई। WhatsApp पर लोकेशन मैन्युअल शेयर करें।');
      }
    } catch (err) {
      spinner.style.display = 'none';
      showError('इंटरनेट की समस्या। WhatsApp खोलें और लोकेशन शेयर करें।');
    }
  }

  function onError(err) {
    document.getElementById('spinner').style.display = 'none';
    const btn = document.getElementById('locBtn');
    btn.disabled = false;
    btn.textContent = '📍 फिर से कोशिश करें';

    let msg = 'लोकेशन नहीं मिली।';
    if (err.code === 1) {
      // PERMISSION_DENIED
      msg = '⚠️ लोकेशन की अनुमति दें।\\n\\nSettings → Browser → Location → Allow';
    } else if (err.code === 2) {
      // POSITION_UNAVAILABLE
      msg = 'GPS सिग्नल नहीं मिला।\\nबाहर जाकर फिर कोशिश करें।';
    } else if (err.code === 3) {
      // TIMEOUT
      msg = 'समय निकल गया। फिर से कोशिश करें।';
    }
    showError(msg);
  }

  function showError(msg) {
    const status = document.getElementById('status');
    status.className = 'status error';
    status.textContent = msg;
    document.getElementById('locBtn').disabled = false;
    document.getElementById('locBtn').textContent = '📍 फिर से कोशिश करें';
  }
</script>
</body>
</html>`;
}

module.exports = { handler };
