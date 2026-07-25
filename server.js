const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');
const PDFDocument = require('pdfkit');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
const reservationsFile = path.join(dataDir, 'reservations.json');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';
const OWNER_EMAIL = process.env.OWNER_EMAIL || 'owner@example.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@mamanjies.com';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || ''; 

const mailTransport = SMTP_HOST && SMTP_USER && SMTP_PASS
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : null;

function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required');
  }

  const base64Credentials = authHeader.split(' ')[1] || '';
  const [username, password] = Buffer.from(base64Credentials, 'base64').toString().split(':');

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Invalid credentials');
}

async function sendReservationNotification(reservation) {
  if (!mailTransport) {
    console.warn('SMTP is not configured. Skipping email notification.');
    return;
  }

  const mailOptions = {
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `New Reservation from ${reservation.name}`,
    text: `New reservation received:\n\nName: ${reservation.name}\nEmail: ${reservation.email}\nPhone: ${reservation.phone}\nDish: ${reservation.dish}\nTime: ${reservation.time}\nGuests: ${reservation.guests}\nNotes: ${reservation.notes || 'None'}\nCreated: ${reservation.createdAt}`,
  };

  try {
    await mailTransport.sendMail(mailOptions);
    console.log('Reservation notification sent to', OWNER_EMAIL);
  } catch (error) {
    console.error('Failed to send reservation email:', error);
  }
}

function escapeCsv(value) {
  if (value == null) return '';
  const stringValue = String(value);
  if (/[",\n,\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

async function sendWhatsAppAlert(reservation) {
  const alertMessage = `🍽️ NEW BOOKING! Name: ${reservation.name} | Phone: ${reservation.phone} | Dish: ${reservation.dish} | Date: ${reservation.date || 'N/A'} | Time: ${reservation.time} | Guests: ${reservation.guests} | Notes: ${reservation.notes || 'None'}`;
  const apiUrl = `https://api.callmebot.com/whatsapp.php?phone=+2205169685&text=${encodeURIComponent(alertMessage)}&apikey=123456`;

  try {
    await axios.get(apiUrl);
    console.log('WhatsApp alert sent successfully');
  } catch (error) {
    console.error('WhatsApp alert failed:', error.message || error);
  }
}

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(reservationsFile)) {
    fs.writeFileSync(reservationsFile, '[]', 'utf8');
  }
}

function loadReservations() {
  try {
    return JSON.parse(fs.readFileSync(reservationsFile, 'utf8')) || [];
  } catch (error) {
    console.error('Failed to read reservations:', error);
    return [];
  }
}

function saveReservations(reservations) {
  fs.writeFileSync(reservationsFile, JSON.stringify(reservations, null, 2), 'utf8');
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Enable CORS for all origins (simpler setup)
app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get('/reserve', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reservation API</title>
  <style>
    body { font-family: Arial, sans-serif; background: #0f2438; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
    .box { max-width: 520px; padding: 32px; border-radius: 16px; background: rgba(15, 36, 56, 0.94); box-shadow: 0 18px 40px rgba(0,0,0,.25); text-align: center; }
    .box h1 { margin-top: 0; color: #ffa500; }
    .box p { line-height: 1.7; }
    .box code { display: block; margin: 16px auto; padding: 14px 18px; background: #10273b; border-radius: 10px; color: #a5f3fc; max-width: 100%; overflow-x: auto; }
    .box a { color: #facc15; text-decoration: none; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Reservation API</h1>
    <p>This endpoint accepts POST requests with reservation data.</p>
    <p>Use the reservation form or send JSON to:</p>
    <code>POST https://mama-njie-s-restaurant-7kv7.onrender.com/reserve</code>
    <p>If you are seeing this page, the backend is running properly.</p>
    <p><a href="/">Go back to homepage</a></p>
  </div>
</body>
</html>`);
});

// Public endpoint for frontend live-server to submit reservations
app.post('/reserve', async (req, res) => {
  const { name, phone, dish, time, guests, notes } = req.body;

  if (!name || !phone || !time || !guests) {
    return res.status(400).json({ success: false, message: 'Name, phone, time, and guest count are required.' });
  }

  const reservation = {
    id: Date.now().toString(),
    name: name.trim(),
    email: '',
    phone: phone.trim(),
    dish: dish ? dish.trim() : 'Not specified',
    time: time.trim(),
    guests: Number(guests),
    notes: notes ? notes.trim() : '',
    createdAt: new Date().toISOString(),
  };

  ensureDataFile();
  const reservations = loadReservations();
  reservations.push(reservation);
  saveReservations(reservations);

  sendReservationNotification(reservation).catch(() => {});

  return res.status(201).json({ success: true, reservation });
});

app.post('/api/reservations', async (req, res) => {
  const { name, email, phone, dish, time, guests, notes } = req.body;

  if (!name || !email || !phone || !time || !guests) {
    return res.status(400).json({ success: false, message: 'Name, email, phone, time, and guest count are required.' });
  }

  const reservation = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    dish: dish ? dish.trim() : 'Not specified',
    time: time.trim(),
    guests: Number(guests),
    notes: notes ? notes.trim() : '',
    createdAt: new Date().toISOString(),
  };

  ensureDataFile();
  const reservations = loadReservations();
  reservations.push(reservation);
  saveReservations(reservations);

  sendWhatsAppAlert(reservation).catch(() => {});
  sendReservationNotification(reservation).catch(() => {});

  return res.status(201).json({ success: true, reservation });
});

app.get('/api/reservations', basicAuth, (req, res) => {
  ensureDataFile();
  const reservations = loadReservations();
  res.json({ success: true, reservations });
});

app.delete('/api/reservations/:id', basicAuth, (req, res) => {
  const { id } = req.params;
  ensureDataFile();
  const reservations = loadReservations();
  const index = reservations.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Reservation not found.' });
  }

  reservations.splice(index, 1);
  saveReservations(reservations);
  return res.json({ success: true });
});

app.get('/logout', (req, res) => {
  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Logged out');
});

app.get('/admin', (req, res) => {
  const key = req.query.key;
  if (key !== '5169685') {
    return res.status(401).send('401 Unauthorized');
  }

  const reservationsPath = path.join(dataDir, 'reservations.json');
  if (!fs.existsSync(reservationsPath)) {
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Bookings - Mama Njie's Restaurant</title>
  <style>
    body { margin: 0; min-height: 100vh; background: #0f2438; color: #f8fafc; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif; }
    .box { width: min(95vw, 760px); padding: 32px; text-align: center; border-radius: 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); }
    h1 { color: #ffa500; margin-bottom: 16px; }
    p { color: #f8fafc; font-size: 1rem; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="box">
    <h1>No bookings yet</h1>
    <p>Reservation storage has not been created yet.</p>
  </div>
</body>
</html>`);
  }

  let reservations = [];
  try {
    const raw = fs.readFileSync(reservationsPath, 'utf8');
    reservations = JSON.parse(raw || '[]');
  } catch (error) {
    console.error('Failed to read reservations:', error);
    return res.status(500).send('Unable to load reservations.');
  }

  if (!Array.isArray(reservations) || reservations.length === 0) {
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Bookings - Mama Njie's Restaurant</title>
  <style>
    body { margin: 0; min-height: 100vh; background: #0f2438; color: #f8fafc; display: flex; align-items: center; justify-content: center; font-family: Arial, sans-serif; }
    .box { width: min(95vw, 760px); padding: 32px; text-align: center; border-radius: 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.16); }
    h1 { color: #ffa500; margin-bottom: 16px; }
    p { color: #f8fafc; font-size: 1rem; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="box">
    <h1>No bookings yet</h1>
    <p>There are currently no saved reservations.</p>
  </div>
</body>
</html>`);
  }

  reservations = reservations.slice().reverse();

  const rows = reservations.map(r => {
    const dateValue = r.date || 'N/A';
    const notesValue = r.notes ? r.notes.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '—';
    return `<tr>
      <td>${r.name || ''}</td>
      <td>${r.phone || ''}</td>
      <td>${r.dish || ''}</td>
      <td>${dateValue}</td>
      <td>${r.time || ''}</td>
      <td>${r.guests != null ? r.guests : ''}</td>
      <td>${notesValue}</td>
    </tr>`;
  }).join('');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Bookings - Mama Njie's Restaurant</title>
  <style>
    body { margin: 0; min-height: 100vh; background: #0f2438; color: #f8fafc; font-family: Arial, sans-serif; }
    .page { width: min(98vw, 1200px); margin: 0 auto; padding: 24px; }
    h1 { margin-bottom: 16px; color: #ffa500; }
    .subtitle { color: #e2e8f0; margin-bottom: 16px; }
    .download-buttons { margin-bottom: 20px; }
    .download-btn { background: #ffa500; color: #0f2438; padding: 10px 20px; border-radius: 5px; margin-right: 10px; margin-bottom: 10px; text-decoration: none; font-weight: bold; display: inline-block; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 14px 16px; border: 1px solid rgba(255,255,255,0.14); }
    th { background: #ffa500; color: #0f2438; text-align: left; }
    tbody tr:nth-child(odd) { background: rgba(255,255,255,0.04); }
    tbody tr:nth-child(even) { background: rgba(255,255,255,0.08); }
    td { color: #f8fafc; }
  </style>
</head>
<body>
  <div class="page">
    <h1>Reservation Bookings</h1>
    <p class="subtitle">Newest bookings appear first.</p>
    <div class="download-buttons">
      <a class="download-btn" href="/admin/download/csv?key=5169685">Download CSV</a>
      <a class="download-btn" href="/admin/download/pdf?key=5169685">Download PDF</a>
    </div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Dish</th>
          <th>Date</th>
          <th>Time</th>
          <th>Guests</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>
</body>
</html>`);
});

app.get('/admin/download/csv', (req, res) => {
  const key = req.query.key;
  if (key !== '5169685') {
    return res.status(401).send('401 Unauthorized');
  }

  const reservationsPath = path.join(dataDir, 'reservations.json');
  if (!fs.existsSync(reservationsPath)) {
    return res.status(404).send('No bookings yet');
  }

  let reservations = [];
  try {
    reservations = JSON.parse(fs.readFileSync(reservationsPath, 'utf8') || '[]');
  } catch (error) {
    console.error('Failed to read reservations:', error);
    return res.status(500).send('Unable to load reservations.');
  }

  const csvLines = [
    'Name,Phone,Dish,Date,Time,Guests,Notes',
    ...reservations.slice().reverse().map(r => {
      return [
        escapeCsv(r.name),
        escapeCsv(r.phone),
        escapeCsv(r.dish),
        escapeCsv(r.date || 'N/A'),
        escapeCsv(r.time),
        escapeCsv(r.guests),
        escapeCsv(r.notes || 'None')
      ].join(',');
    })
  ];

  const csvContent = csvLines.join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="reservations.csv"');
  res.send(csvContent);
});

app.get('/admin/download/pdf', (req, res) => {
  const key = req.query.key;
  if (key !== '5169685') {
    return res.status(401).send('401 Unauthorized');
  }

  const reservationsPath = path.join(dataDir, 'reservations.json');
  if (!fs.existsSync(reservationsPath)) {
    return res.status(404).send('No bookings yet');
  }

  let reservations = [];
  try {
    reservations = JSON.parse(fs.readFileSync(reservationsPath, 'utf8') || '[]');
  } catch (error) {
    console.error('Failed to read reservations:', error);
    return res.status(500).send('Unable to load reservations.');
  }

  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="reservations.pdf"');

  doc.fontSize(18).fillColor('#ffa500').text('Reservation Bookings', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor('#f8fafc').text('Newest bookings appear first.');
  doc.moveDown(1);

  const tableTop = doc.y;
  const columnWidths = [100, 80, 90, 60, 60, 50, 120];
  const columns = ['Name', 'Phone', 'Dish', 'Date', 'Time', 'Guests', 'Notes'];

  let x = doc.page.margins.left;
  columns.forEach((header, index) => {
    doc.font('Helvetica-Bold').fillColor('#0f2438').fontSize(10).text(header, x, tableTop, { width: columnWidths[index], continued: index !== columns.length - 1 });
    x += columnWidths[index];
  });

  let rowY = tableTop + 20;
  reservations.slice().reverse().forEach(r => {
    x = doc.page.margins.left;
    const rowValues = [
      r.name || '',
      r.phone || '',
      r.dish || '',
      r.date || 'N/A',
      r.time || '',
      r.guests != null ? String(r.guests) : '',
      r.notes || ''
    ];

    rowValues.forEach((value, index) => {
      doc.font('Helvetica').fillColor('#f8fafc').fontSize(9).text(value, x, rowY, { width: columnWidths[index], continued: index !== columns.length - 1 });
      x += columnWidths[index];
    });
    rowY += 18;
    if (rowY > doc.page.height - 80) {
      doc.addPage();
      rowY = doc.page.margins.top;
    }
  });

  doc.pipe(res);
  doc.end();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Simple root endpoint to verify the backend is running
app.get('/', (req, res) => {
  res.send('Mama Njie Backend is Running');
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, () => {
  console.log(`Mama Njie's Restaurant backend running at http://localhost:${port}`);
});
