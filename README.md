# Mama Njie's Restaurant Website

A responsive Gambian restaurant website with home, about, menu, contact, and reservation pages.

## 📁 Project Structure

```
Mama Njie's Restaurant/
├── index.html             # Main homepage
├── about.html             # Restaurant story and owner profile
├── menu.html              # Food menu with categories and images
├── contact.html           # Contact details and location
├── reservation.html       # Reservation form and WhatsApp integration
├── css/
│   └── styles.css         # Styling and responsive design
├── js/
│   └── script.js          # Smooth scroll, back-to-top, and reservation handling
└── images/                # Food and brand images
```

## ✨ Features

- **Responsive Design** - Works smoothly on desktop, tablet, and mobile devices
- **Navigation Bar** - Simple site navigation with active page styling
- **Back-to-Top Button** - Appears after scrolling down the menu page
- **Hero Section** - Welcoming homepage with restaurant branding
- **About Section** - Story-driven content about Mama Njie and the cuisine
- **Menu Section** - Organized menu with Main Dishes and Chef Specials
- **Reservation System** - Reservation form that opens WhatsApp with booking details
- **Contact Information** - Clear restaurant details and phone contact
- **Accessible Images** - Alt text and fallback handling for menu images

## 🚀 How to Use

1. **Run the backend**: From the project root, use `npm start`
2. **Open the website**: Browse to `http://localhost:3000`
3. **Navigate sections**: Use the navigation menu to move between pages
4. **Review the menu**: See dish details and images on `menu.html`
5. **Book a table**: Use `reservation.html` to submit a reservation request
6. **Admin dashboard**: Visit `http://localhost:3000/admin` and authenticate with the admin credentials
7. **Contact the restaurant**: Use `contact.html` for location, phone, and hours

## 🎨 Customization

### Colors
Edit the CSS variables in `css/styles.css`:
```css
:root {
    --primary-color: #0f2438;
    --accent-color: #ffa500;
    --light-bg: #243a52;
}
```

### Restaurant Information
Edit the HTML files to update:
- Restaurant name and story
- Menu items, prices, and descriptions
- Contact information
- Reservation details

### Images
Add or replace image files in the `images/` folder and update the menu item image paths in `menu.html`.

## 📱 Responsive Breakpoints

- **Desktop**: Full layout with wide content areas
- **Tablet**: Responsive grid with flexible column widths
- **Mobile**: Single column stacks with readable text and buttons

## 💡 JavaScript Features

- Smooth scroll for in-page links
- Back-to-top button behavior on scroll
- Reservation form handling and WhatsApp handoff

## 📧 Reservation Form

The reservation page includes:
- Full Name
- Email
- Phone number
- Selected dish
- Time
- Number of guests
- Notes / special requests

When the form is submitted, reservation details are stored on the backend and the restaurant receives a prefilled WhatsApp message with the booking details.

## 🔧 Future Enhancements

- Add online ordering
- Add a photo gallery
- Add customer testimonials

## 🔐 Admin Dashboard

- Admin dashboard is available at `/admin` and the menu manager at `/admin-menu.html`.
- Both are protected by HTTP Basic Auth and require credentials from the environment.
- There are no default admin credentials. The server will refuse to start unless `ADMIN_USERNAME` and an `ADMIN_PASSWORD` of at least 16 characters are configured.
- Admin API and export requests are authenticated and rate limited. Do not put credentials or API keys in HTML, query strings, or source control.

## Environment Variables

Create an untracked `.env` file for local development and set the same values in the production host's secret/environment settings:
The backend requires Node.js 20 or newer.

```text
ADMIN_USERNAME=choose-a-private-username
ADMIN_PASSWORD=replace-with-a-long-random-secret-at-least-24-characters
NODE_ENV=production
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your-limited-database-user
DB_PASS=your-database-password
DB_NAME=your-database-name
DB_SSL=true
DB_SSL_CA=
DB_INIT_ON_START=false
REDIS_URL=rediss://your-redis-provider-connection-url
ALLOWED_ORIGINS=https://jallow1134.github.io
WHATSAPP_PHONE=2200000000
CALLMEBOT_API_KEY=your-callmebot-api-key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
OWNER_EMAIL=owner@example.com
FROM_EMAIL=mamanjies@example.com
```

Before deploying, run `database/schema.sql` once using a database owner/migration account. Create a separate runtime account and grant it only `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on the `reservations` and `menu` tables. Do not grant the runtime account `CREATE`, `ALTER`, `DROP`, or global privileges.

Set `NODE_ENV=production` and all required secrets in the Render environment settings. Production startup requires MySQL TLS verification (`DB_SSL=true`) and a TLS Redis URL (`rediss://`); startup fails rather than falling back to unencrypted database access or per-instance rate limits. Use the CA certificate supplied by the database host for `DB_SSL_CA` when required. Configure Redis as a private service and use its TLS connection URL. Set a unique random admin password and rotate any credentials that may have been committed or deployed previously. The API permits the published GitHub Pages origin and local development by default; add any other exact website origins to `ALLOWED_ORIGINS` as a comma-separated list.

---

**Updated for Mama Njie's Restaurant** | 2026
