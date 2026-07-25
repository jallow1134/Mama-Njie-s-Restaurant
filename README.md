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
- Date
- Time
- Number of guests
- Notes / special requests

When the form is submitted, reservation details are stored on the backend and restaurant staff receive notification emails.

## 🔧 Future Enhancements

- Add online ordering
- Add a photo gallery
- Add customer testimonials

## 🔐 Admin Dashboard

- Admin dashboard available at `/admin`
- Protected by HTTP Basic Auth
- Default credentials are `admin` / `password`
- Use `.env` to configure `ADMIN_USERNAME` and `ADMIN_PASSWORD`
- Admin dashboard supports deleting reservations and logging out

## Environment Variables

Create a `.env` file with:

```text
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
OWNER_EMAIL=owner@example.com
FROM_EMAIL=mamanjies@example.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
```

---

**Updated for Mama Njie's Restaurant** | 2026
