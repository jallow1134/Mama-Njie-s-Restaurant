require('./backend/server');const express = require('express');
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { createClient } = require('redis');
const nodemailer = require('nodemailer');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const REDIS_URL = process.env.REDIS_URL || '';
const DB_SSL_CA = process.env.DB_SSL_CA || '';

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_NAME) {
  throw new Error('Set DB_HOST, DB_USER, DB_PASS, and DB_NAME.');
}
if (isProduction && process.env.DB_SSL !== 'true') {
  throw new Error('Production requires DB_SSL=true with certificate verification enabled.');
}
if (isProduction && !REDIS_URL.startsWith('rediss://')) {
  throw new Error('Production requires REDIS_URL to use rediss:// for shared rate limiting.');
}

const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
const minimumAdminPasswordLength = isProduction ? 24 : 16;
if (!ADMIN_USERNAME || !ADMIN_PASSWORD_RENDER || ADMIN_PASSWORD_RENDER.length < minimumAdminPasswordLength) {
  throw new Error(`Set ADMIN_USERNAME and an ADMIN_PASSWORD_RENDER with at least ${minimumAdminPasswordLength} characters.`);
}

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'owner@example.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@mamanjies.com';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587;
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE || '';
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY || '';

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
  ssl: process.env.DB_SSL === 'true'
    ? { rejectUnauthorized: true, ...(DB_SSL_CA ? { ca: DB_SSL_CA } : {}) }
    : undefined,
  waitForConnections: true,
  connectionLimit: 10
});

// Schema initialization is for local development; production uses a restricted DB account.
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

    await db.execute(`
      CREATE TABLE IF NOT EXISTS menu (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,  /* ADDED UNIQUE HERE */
        category VARCHAR(50),
        price DECIMAL(10,2) NOT NULL
      )
    `);

    await db.execute(`
  INSERT IGNORE INTO menu (name, category, price) VALUES
  /* Chef Specials */
  ('Mama Njie\'s Special', 'Chef Specials', 120),
  ('Mama Njie\'s Grilled Fish', 'Chef Specials', 95),
  ('Mama Njie\'s Peanut Stew', 'Chef Specials', 85),
  ('Mama Njie\'s Jollof Feast', 'Chef Specials', 80),
  /* Main Dishes */
  ('Jollof Rice', 'Main Dishes', 80),
  ('Seafood Okra', 'Main Dishes', 95),
  ('Pepper Soup', 'Main Dishes', 75),
  ('Benachin', 'Main Dishes', 95),
  ('Caldo', 'Main Dishes', 88),
  ('Chewdiw', 'Main Dishes', 90),
  ('Domoda', 'Main Dishes', 85),
  ('Mbahal', 'Main Dishes', 90),
  ('Moimoi', 'Main Dishes', 65),
  ('Oyster Stew', 'Main Dishes', 85),
  ('Plasas', 'Main Dishes', 70),
  ('Supakanja', 'Main Dishes', 75),
  ('Yassa', 'Main Dishes', 80),
  /* Sides & Drinks */
  ('Vegetable Platter', 'Sides & Drinks', 65),
  ('Attaya', 'Sides & Drinks', 12),
  ('Fish Balls', 'Sides & Drinks', 35),
  ('Tapalapa', 'Sides & Drinks', 15)
`);
    console.log("Menu seeded with your exact 17 dishes");
    console.log("MySQL Connected & Tables Ready");
  } catch (err) {
    console.error("DB Error:", err);
    throw err;
  }
}

const initializeSchemaOnStart = !isProduction && process.env.DB_INIT_ON_START !== 'false';
if (isProduction && process.env.DB_INIT_ON_START === 'true') {
  throw new Error('Production schema changes must be applied separately, not by the app process.');
}

const redisClient = REDIS_URL ? createClient({ url: REDIS_URL }) : null;
if (redisClient) {
  redisClient.on('error', error => console.error('Rate-limit Redis error:', error.message));
}
function basicAuth(req, res, next) {
  return adminAuthLimiter(req, res, () => {
    const match = /^Basic\s+([A-Za-z0-9+/]+={0,2})$/i.exec(req.headers.authorization || '');
    if (match) {
      const credentials = Buffer.from(match[1], 'base64').toString('utf8');
      const separator = credentials.indexOf(':');
      if (separator > 0) {
        const username = credentials.slice(0, separator);
        const password = credentials.slice(separator + 1);
        const expectedUsername = Buffer.from(ADMIN_USERNAME);
        const actualUsername = Buffer.from(username);
        const expectedPassword = Buffer.from(ADMIN_PASSWORD_RENDER);
        const actualPassword = Buffer.from(password);
        const usernameMatches = expectedUsername.length === actualUsername.length && crypto.timingSafeEqual(expectedUsername, actualUsername);
        const passwordMatches = expectedPassword.length === actualPassword.length && crypto.timingSafeEqual(expectedPassword, actualPassword);
        if (usernameMatches && passwordMatches) return next();
      }
    }
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area", charset="UTF-8"');
    return res.status(401).send('Authentication required');
  });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function validateReservation(body, requireEmail = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const time = typeof body.time === 'string' ? body.time.trim() : '';
  const dish = body.dish == null ? 'Not specified' : typeof body.dish === 'string' ? body.dish.trim() : null;
  const notes = body.notes == null ? '' : typeof body.notes === 'string' ? body.notes.trim() : null;
  const email = body.email == null ? '' : typeof body.email === 'string' ? body.email.trim() : null;
  const guests = Number(body.guests);
  const phoneDigits = phone.replace(/\D/g, '');

  if (!name || name.length > 100 || !phone || phone.length > 20 || phoneDigits.length < 7 || phoneDigits.length > 15 || !/^[+()\d\s.-]+$/.test(phone) ||
      !time || time.length > 20 || !Number.isInteger(guests) || guests < 1 || guests > 20 ||
      dish === null || dish.length > 100 || notes === null || notes.length > 2000 || email === null ||
      (requireEmail && (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))) {
    return null;
  }

  return { name, email, phone, dish, time, guests, notes };
}

async function sendReservationNotification(reservation) {
  if (!mailTransport) return;
  const mailOptions = {
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `New Reservation from ${reservation.name}`,
    text: `New reservation received:\n\nName: ${reservation.name}\nEmail: ${reservation.email}\nPhone: ${reservation.phone}\nDish: ${reservation.dish}\nTime: ${reservation.time}\nGuests: ${reservation.guests}\nNotes: ${reservation.notes || 'None'}\nCreated: ${reservation.createdAt}`,
  };
  try {
    await mailTransport.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send reservation email:', error);
  }
}

function escapeCsv(value) {
  if (value == null) return '';
  const rawValue = String(value);
  const stringValue = /^[\s]*[=+\-@]/.test(rawValue) ? `'${rawValue}` : rawValue;
  if (/[",\n,\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function requireJson(req, res, next) {
  if (!req.is('application/json')) {
    return res.status(415).json({ success: false, message: 'Send this request as JSON.' });
  }
  next();
}

async function sendWhatsAppAlert(reservation) {
  if (!WHATSAPP_PHONE || !CALLMEBOT_API_KEY) return;
  const alertMessage = `🍽️ NEW BOOKING! Name: ${reservation.name} | Phone: ${reservation.phone} | Dish: ${reservation.dish} | Date: ${reservation.date || 'N/A'} | Time: ${reservation.time} | Guests: ${reservation.guests} | Notes: ${reservation.notes || 'None'}`;
  const query = new URLSearchParams({ phone: `+${WHATSAPP_PHONE}`, text: alertMessage, apikey: CALLMEBOT_API_KEY });
  try {
    await axios.get(`https://api.callmebot.com/whatsapp.php?${query}`);
  } catch (error) {
    console.error('WhatsApp alert failed:', error.message || error);
  }
}

app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://mama-njie-s-restaurant-7kv7.onrender.com']
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));

const allowedOrigins = new Set([
  'https://jallow1134.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  ...(process.env.ALLOWED_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean)
]);
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.has(origin));
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600
}));

const reservationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  store: redisClient ? new RedisStore({
    prefix: 'reservations:',
    sendCommand: (...args) => redisClient.sendCommand(args)
  }) : undefined,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many booking attempts. Please try again later.' }
});
const adminAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  store: redisClient ? new RedisStore({
    prefix: 'admin-auth:',
    sendCommand: (...args) => redisClient.sendCommand(args)
  }) : undefined,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts. Please try again later.'
});

app.get('/admin-menu.html', basicAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-menu.html'));
});

app.use((req, res, next) => {
  const requestPath = req.path.toLowerCase();
  const privatePath = requestPath === '/server.js' || requestPath === '/qr.py' ||
    requestPath === '/package.json' || requestPath === '/package-lock.json' ||
    requestPath.startsWith('/data/') || requestPath.startsWith('/database/') || requestPath.startsWith('/node_modules/') ||
    requestPath.endsWith('.md') || requestPath.startsWith('/.git/');
  if (privatePath) return res.sendStatus(404);
  next();
});
app.use(express.static(path.join(__dirname), { dotfiles: 'deny' }));

app.get('/reserve', (req, res) => {
  res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Reservation API</title></head><body><h1>API Running</h1></body></html>`);
});

// POST /reserve
app.post('/reserve', reservationLimiter, requireJson, async (req, res) => {
  const reservationData = validateReservation(req.body);
  if (!reservationData) {
    return res.status(400).json({ success: false, message: 'Enter a valid name, phone, time, guest count, and optional booking details.' });
  }
  try {
    const [existing] = await db.execute(
      'SELECT id FROM reservations WHERE phone = ? AND time = ? LIMIT 1',
      [reservationData.phone, reservationData.time]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'You already have a booking for this time.' });
    }
    const [result] = await db.execute(
      'INSERT INTO reservations (name, email, phone, dish, time, guests, notes) VALUES (?,?,?,?,?,?,?)',
      [reservationData.name, '', reservationData.phone, reservationData.dish, reservationData.time, reservationData.guests, reservationData.notes]
    );
    const reservation = { id: result.insertId, ...reservationData, createdAt: new Date().toISOString() };
    sendWhatsAppAlert(reservation).catch(() => {});
    sendReservationNotification(reservation).catch(() => {});
    return res.status(201).json({ success: true, reservation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

// POST /api/reservations
app.post('/api/reservations', reservationLimiter, requireJson, async (req, res) => {
  const reservationData = validateReservation(req.body, true);
  if (!reservationData) {
    return res.status(400).json({ success: false, message: 'Enter valid reservation details, including a valid email address.' });
  }
  try {
    const [existing] = await db.execute('SELECT id FROM reservations WHERE phone = ? AND time = ? LIMIT 1', [reservationData.phone, reservationData.time]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Duplicate booking' });
    }
    const [result] = await db.execute('INSERT INTO reservations (name, email, phone, dish, time, guests, notes) VALUES (?,?,?,?,?,?,?)', [reservationData.name, reservationData.email, reservationData.phone, reservationData.dish, reservationData.time, reservationData.guests, reservationData.notes]);
    const reservation = { id: result.insertId, ...reservationData, createdAt: new Date().toISOString() };
    sendWhatsAppAlert(reservation).catch(() => {});
    sendReservationNotification(reservation).catch(() => {});
    return res.status(201).json({ success: true, reservation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

// GET /api/reservations
app.get('/api/reservations', basicAuth, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM reservations ORDER BY createdAt DESC');
    res.json({ success: true, reservations: rows });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ===== MENU API =====
app.get('/api/menu', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menu ORDER BY category, name');
    res.json(rows);
  } catch (err) {
    console.error('Menu read failed:', err);
    res.status(500).json({ error: 'Unable to load the menu.' });
  }
});

app.post('/api/menu/update', basicAuth, requireJson, async (req, res) => {
  try {
    const id = Number(req.body?.id);
    const price = Number(req.body?.price);
    if (!Number.isInteger(id) || id < 1 || !Number.isFinite(price) || price < 0 || price > 1000000) {
      return res.status(400).json({ success: false, error: 'Enter a valid dish and price.' });
    }
    const [result] = await db.execute('UPDATE menu SET price = ? WHERE id = ?', [price, id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, error: 'Dish not found.' });
    return res.json({ success: true });
  } catch (err) {
    console.error('Menu update failed:', err);
    res.status(500).json({ error: 'Unable to update the menu.' });
  }
});
// ===== END MENU API =====

// DELETE
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

// GET /admin
app.get('/admin', basicAuth, async (req, res) => {
  try {
    const [reservations] = await db.execute('SELECT * FROM reservations ORDER BY createdAt DESC');
    if (!reservations.length) {
      return res.send(`<html><body style="background:#0f2438;color:#fff;text-align:center;padding:50px"><h1>No bookings yet</h1></body></html>`);
    }
    const rows = reservations.map(r => `<tr><td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.phone)}</td><td>${escapeHtml(r.dish)}</td><td>${escapeHtml(r.date || 'N/A')}</td><td>${escapeHtml(r.time)}</td><td>${escapeHtml(r.guests)}</td><td>${escapeHtml(r.notes || '')}</td></tr>`).join('');
    res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Admin</title><style>body{background:#0f2438;color:#fff;font-family:Arial} table{width:100%;border-collapse:collapse} th,td{padding:10px;border:1px solid #fff} th{background:#ffa500;color:#000}.download-btn{background:#ffa500;color:#000;padding:10px;text-decoration:none;margin:5px}</style></head><body><div style="padding:20px"><h1>Reservation Bookings</h1><a class="download-btn" href="/admin/download/csv">Download CSV</a><a class="download-btn" href="/admin/download/pdf">Download PDF</a><table><thead><tr><th>Name</th><th>Phone</th><th>Dish</th><th>Date</th><th>Time</th><th>Guests</th><th>Notes</th></tr></thead><tbody>${rows}</tbody></table></div></body></html>`);
  } catch (err) {
    res.status(500).send('DB Error');
  }
});

// CSV
app.get('/admin/download/csv', basicAuth, async (req, res) => {
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

// PDF
app.get('/admin/download/pdf', basicAuth, async (req, res) => {
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

// 404 must be last
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

async function startServer() {
  if (initializeSchemaOnStart) {
    await initDB();
  } else {
    await db.query('SELECT 1');
  }
  if (redisClient) await redisClient.connect();

  const server = app.listen(port, () => {
    console.log(`Mama Njie's Restaurant backend listening on port ${port}`);
  });

  const shutdown = async () => {
    server.close();
    if (redisClient?.isOpen) await redisClient.quit();
    await db.end();
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}

startServer().catch(error => {
  console.error('Server startup failed:', error.message);
  process.exitCode = 1;
});