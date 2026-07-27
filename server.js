const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const mysql = require('mysql2/promise'); // <-- ADDED

// WhatsApp function
async function sendWhatsApp(name, dish, date, time, guests, phone) {
  const message = `🔔 New Booking!\n\nName: ${name}\nDish: ${dish}\nDate: ${date}\nTime: ${time}\nGuests: ${guests}\nPhone: ${phone}`;
  const url = `https://api.callmebot.com/whatsapp.php?phone=2207678645&text=${encodeURIComponent(message)}&apikey=YOUR_KEY_HERE`;
  try { await axios.get(url); } catch(e){ console.log("WhatsApp Error:", e) }
}

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

// 1. MYSQL CONNECTION POOL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10
});

// 2. CREATE TABLE ON START
async function initDB() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        dish VARCHAR(100),
        date VARCHAR(50),
        time VARCHAR(20),
        guests INT,
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("MySQL Connected & Table Ready");
  } catch (err) {
    console.error("DB Error:", err);
  }
}
initDB();

function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader ||!authHeader.startsWith('Basic ')) {
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get('/reserve', (req, res) => {
  res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Reservation API</title></head><body><h1>API Running</h1></body></html>`);
});

// POST /reserve - CHANGED TO MYSQL
app.post('/reserve', async (req, res) => {
  const { name, phone, dish, time, guests, notes } = req.body;
  if (!name ||!phone ||!time ||!guests) {
    return res.status(400).json({ success: false, message: 'Name, phone, time, and guest count are required.' });
  }
  try {
    const [result] = await db.execute(
      'INSERT INTO reservations (name, email, phone, dish, time, guests, notes) VALUES (?,?,?,?,?,?,?)',
      [name.trim(), '', phone.trim(), dish? dish.trim() : 'Not specified', time.trim(), Number(guests), notes? notes.trim() : '']
    );
    const reservation = { id: result.insertId, name, phone, dish, time, guests, notes, createdAt: new Date().toISOString() };
    sendWhatsAppAlert(reservation).catch(() => {});
    sendReservationNotification(reservation).catch(() => {});
    return res.status(201).json({ success: true, reservation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const { name, phone, dish, date, time, guests, notes } = req.body;

    // 1. ANTI-DUPLICATE CHECK - stops double clicks
    const [dup] = await db.execute(
      'SELECT id FROM reservations WHERE phone =? AND date =? AND time =? AND createdAt > NOW() - INTERVAL 10 MINUTE',
      [phone, date, time]
    );
    if(dup.length > 0) {
      return res.status(400).json({ success: false, message: 'You already booked this slot' });
    }

    // 2. INSERT NEW BOOKING
    const [result] = await db.execute(
      'INSERT INTO reservations (name, phone, dish, date, time, guests, notes) VALUES (?,?,?,?,?,?,?)',
      [name, phone, dish, date, time, guests, notes]
    );

    const reservation = { id: result.insertId, name, phone, dish, date, time, guests, notes };

    // 3. SEND WHATSAPP TO MAMA NJIE
    await sendWhatsApp(name, dish, date, time, guests, phone);

    return res.status(201).json({ success: true, reservation });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

// GET /api/reservations - CHANGED TO MYSQL
app.get('/api/reservations', basicAuth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM reservations ORDER BY createdAt DESC');
    res.json({ success: true, reservations: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// DELETE - CHANGED TO MYSQL
app.delete('/api/reservations/:id', basicAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM reservations WHERE id =?', [id]);
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.get('/logout', (req, res) => {
  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Logged out');
});

// GET /admin - CHANGED TO MYSQL
app.get('/admin', async (req, res) => {
  const key = req.query.key;
  if (key!== '5169685') {
    return res.status(401).send('401 Unauthorized');
  }
  try {
    const [reservations] = await db.execute('SELECT * FROM reservations ORDER BY createdAt DESC');
    if (!reservations.length) {
      return res.send(`<html><body style="background:#0f2438;color:#fff;text-align:center;padding:50px"><h1>No bookings yet</h1></body></html>`);
    }
    const rows = reservations.map(r => `<tr><td>${r.name || ''}</td><td>${r.phone || ''}</td><td>${r.dish || ''}</td><td>${r.date || 'N/A'}</td><td>${r.time || ''}</td><td>${r.guests!= null? r.guests : ''}</td><td>${r.notes || '—'}</td></tr>`).join('');
    res.send(`<!DOCTYPE html><html><head><title>Admin</title><style>body{background:#0f2438;color:#fff;font-family:Arial} table{width:100%;border-collapse:collapse} th,td{padding:10px;border:1px solid #fff} th{background:#ffa500;color:#000}.download-btn{background:#ffa500;color:#000;padding:10px;text-decoration:none;margin:5px}</style></head><body><div style="padding:20px"><h1>Reservation Bookings</h1><a class="download-btn" href="/admin/download/csv?key=5169685">Download CSV</a><a class="download-btn" href="/admin/download/pdf?key=5169685">Download PDF</a><table><thead><tr><th>Name</th><th>Phone</th><th>Dish</th><th>Date</th><th>Time</th><th>Guests</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table></div></body></html>`);
  } catch (err) {
    res.status(500).send('DB Error');
  }
});

// CSV - CHANGED TO MYSQL
app.get('/admin/download/csv', async (req, res) => {
  if (req.query.key!== '5169685') return res.status(401).send('401 Unauthorized');
  try {
    const [reservations] = await db.execute('SELECT * FROM reservations ORDER BY createdAt DESC');
    const csvLines = ['Name,Phone,Dish,Date,Time,Guests,Notes',...reservations.map(r => [escapeCsv(r.name), escapeCsv(r.phone), escapeCsv(r.dish), escapeCsv(r.date || 'N/A'), escapeCsv(r.time), escapeCsv(r.guests), escapeCsv(r.notes || '')].join(','))];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="reservations.csv"');
    res.send(csvLines.join('\n'));
  } catch (err) {
    res.status(500).send("Error");
  }
});

// PDF - CHANGED TO MYSQL + BLACK TEXT
app.get('/admin/download/pdf', async (req, res) => {
  if (req.query.key!== '5169685') return res.status(401).send('401 Unauthorized');
  try {
    const [reservations] = await db.execute('SELECT * FROM reservations ORDER BY createdAt DESC');
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="reservations.pdf"');
    doc.pipe(res);
    doc.fontSize(18).fillColor('black').text("Mama Njie's Reservations", { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('black');
    reservations.forEach(r => {
      doc.text(`Name: ${r.name} | Phone: ${r.phone} | Dish: ${r.dish} | Date: ${r.date || 'N/A'} | Time: ${r.time} | Guests: ${r.guests}`);
      doc.moveDown(0.5);
    });
    doc.end();
  } catch (err) {
    res.status(500).send("Error");
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.get('/', (req, res) => {
  res.send('Mama Njie Backend is Running with MySQL');
});
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});
app.listen(port, () => {
  console.log(`Mama Njie's Restaurant backend running at http://localhost:${port}`);
});