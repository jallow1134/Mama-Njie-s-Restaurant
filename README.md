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

1. **Open the website**: Open `index.html` in your browser
2. **Navigate sections**: Use the navigation menu to move between pages
3. **Review the menu**: See dish details and images on `menu.html`
4. **Book a table**: Use `reservation.html` to send reservation details through WhatsApp
5. **Contact the restaurant**: Use `contact.html` for location, phone, and hours

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

When the form is submitted, the customer sees a confirmation message and the reservation details are opened in WhatsApp for direct contact.

## 🔧 Future Enhancements

- Connect the reservation form to a backend service
- Add online ordering
- Add a photo gallery
- Implement email notifications
- Add customer testimonials

---

**Updated for Mama Njie's Restaurant** | 2026
