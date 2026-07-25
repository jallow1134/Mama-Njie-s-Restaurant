const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');

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
    text: `New reservation received:\n\nName: ${reservation.name}\nEmail: ${reservation.email}\nPhone: ${reservation.phone}\nDish: ${reservation.dish}\nDate: ${reservation.date}\nTime: ${reservation.time}\nGuests: ${reservation.guests}\nNotes: ${reservation.notes || 'None'}\nCreated: ${reservation.createdAt}`,
  };

  try {
    await mailTransport.sendMail(mailOptions);
    console.log('Reservation notification sent to', OWNER_EMAIL);
  } catch (error) {
    console.error('Failed to send reservation email:', error);
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
// Allow Live Server and the production Render domain to access this backend
const allowedOrigins = [
  'http://localhost:5500',
  'https://mama-njie-s-restaurant-7kv7.onrender.com'
];
app.use(cors({ origin: function(origin, cb) {
  // allow requests with no origin (like curl, Postman)
  if (!origin) return cb(null, true);
  if (allowedOrigins.indexOf(origin) !== -1) return cb(null, true);
  return cb(new Error('CORS policy: Origin not allowed'), false);
}}));
app.use(express.static(path.join(__dirname)));

// Public endpoint for frontend live-server to submit reservations
app.post('/reserve', async (req, res) => {
  const { name, phone, dish, date, time, guests, notes } = req.body;

  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ success: false, message: 'Name, phone, date, time, and guest count are required.' });
  }

  const reservation = {
    id: Date.now().toString(),
    name: name.trim(),
    email: '',
    phone: phone.trim(),
    dish: dish ? dish.trim() : 'Not specified',
    date: date.trim(),
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
  const { name, email, phone, dish, date, time, guests, notes } = req.body;

  if (!name || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({ success: false, message: 'Name, email, phone, date, time, and guest count are required.' });
  }

  const reservation = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    dish: dish ? dish.trim() : 'Not specified',
    date: date.trim(),
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

app.get('/admin', basicAuth, (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Dashboard - Mama Njie's Restaurant</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 24px; background: #f8fafc; color: #0f2438; }
    h1 { margin-bottom: 16px; }
    .actions { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
    .actions a, .actions button { background: #0f2438; color: #fff; padding: 10px 16px; border: none; border-radius: 6px; text-decoration: none; cursor: pointer; }
    .actions button { display: inline-flex; align-items: center; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 12px 10px; border: 1px solid #cbd5e1; text-align: left; }
    th { background: #0f2438; color: #fff; }
    tbody tr:nth-child(odd) { background: #fff; }
    tbody tr:nth-child(even) { background: #f1f5f9; }
    .status { margin: 16px 0; color: #334155; }
    .delete-btn { background: #dc2626; }
    .message { margin-top: 12px; color: #0f2438; }
  </style>
</head>
<body>
  <h1>Admin Dashboard</h1>
  <div class="actions">
    <a href="/logout">Logout</a>
    <span class="status">Viewing all reservations saved on the site.</span>
  </div>
  <div id="message" class="message"></div>
  <div id="content">Loading reservations...</div>
  <script>
    async function loadReservations() {
      try {
        const response = await fetch('/api/reservations', { headers: { 'Accept': 'application/json' }});
        if (!response.ok) {
          throw new Error('Failed to load reservations');
        }
        const data = await response.json();
        const { reservations } = data;

        if (!reservations.length) {
          document.getElementById('content').innerHTML = '<p>No reservations yet.</p>';
          return;
        }

        const rows = reservations.map(r =>
          '<tr>' +
            '<td>' + r.createdAt + '</td>' +
            '<td>' + r.name + '</td>' +
            '<td>' + r.email + '</td>' +
            '<td>' + r.phone + '</td>' +
            '<td>' + r.dish + '</td>' +
            '<td>' + r.date + '</td>' +
            '<td>' + r.time + '</td>' +
            '<td>' + r.guests + '</td>' +
            '<td>' + (r.notes || '—') + '</td>' +
            '<td><button class="delete-btn" data-id="' + r.id + '">Delete</button></td>' +
          '</tr>'
        ).join('');

        document.getElementById('content').innerHTML =
          '<table>' +
            '<thead>' +
              '<tr>' +
                '<th>Created</th>' +
                '<th>Name</th>' +
                '<th>Email</th>' +
                '<th>Phone</th>' +
                '<th>Dish</th>' +
                '<th>Date</th>' +
                '<th>Time</th>' +
                '<th>Guests</th>' +
                '<th>Notes</th>' +
                '<th>Actions</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' + rows + '</tbody>' +
          '</table>';

        document.querySelectorAll('.delete-btn').forEach(button => {
          button.addEventListener('click', async () => {
            const id = button.dataset.id;
            if (!confirm('Delete this reservation?')) return;
            try {
              const deleteResponse = await fetch('/api/reservations/' + encodeURIComponent(id), { method: 'DELETE' });
              if (!deleteResponse.ok) {
                throw new Error('Delete failed');
              }
              document.getElementById('message').textContent = 'Reservation deleted successfully.';
              loadReservations();
            } catch (error) {
              document.getElementById('message').textContent = 'Unable to delete reservation. Please try again.';
              console.error(error);
            }
          });
        });
      } catch (error) {
        document.getElementById('content').innerHTML = '<p>Unable to load reservations. Please refresh the page.</p>';
        console.error(error);
      }
    }
    loadReservations();
  </script>
</body>
</html>`);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(port, () => {
  console.log(`Mama Njie's Restaurant backend running at http://localhost:${port}`);
});
