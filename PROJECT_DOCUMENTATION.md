# Mama Njie's Restaurant - Project Documentation


## Project Overview

Building Mama Njie's Restaurant website was more than just creating a typical business site. It's about bringing authentic Gambian cuisine to the world and telling the story of Mama Njie's incredible 13-year journey in the kitchen. 

The site needed to feel warm and welcoming - just like stepping into the restaurant itself. I wanted visitors to see not just a menu, but a piece of The Gambia's rich culinary heritage. From the moment you land on the homepage, you should feel the passion behind every dish and the genuine love that goes into every meal.

**What Makes This Restaurant Special:**
- Real, authentic Gambian food made with generations of tradition
- 13 years of Mama Njie perfecting her craft
- Not just food - it's a cultural experience
- A place where you're treated like family, not just a customer

---

## Project Structure

Here's how everything is organized. It's simple and makes sense:

```
Mama Njie's Restaurant/
│
├── index.html                 # The homepage
├── about.html                 # More about the restaurant
├── menu.html                  # Food menu and dish details
├── contact.html               # Contact details and location
├── reservation.html           # Reservation form
│
├── css/
│   └── styles.css             # Styling, layout, and responsive rules
│
├── js/
│   └── script.js              # Smooth scroll, back-to-top, and reservation logic
│
├── images/                    # Food, owner, and background images
│   ├── mama-njie.jpg          # Mama Njie herself
│   ├── domoda.jpg             # Peanut stew
│   ├── benachin.jpg           # One-pot rice dish
   ├── yassa.jpg              # Lemony, savory dish
   ├── jollof.jpg             # Spiced rice dish
   ├── supakanja.jpg          # Okra stew
   ├── mbahal.jpg             # Smoked fish specialty
   ├── caldo.jpg              # Fish stew
   ├── chewdiw.jpg            # Catfish-style dish
   ├── oyster.jpg             # Oyster stew
   ├── peppersoup.jpg         # Spicy fish soup
   ├── plasas.jpg             # Greens with rice
   ├── okra.jpg               # Okra-based dish
   ├── tapalapa.jpg           # Local bread
   ├── attaya.jpg             # Traditional tea
   ├── fishballs.jpg          # Fried fish balls
   ├── akara.jpg              # Bean fritters
   ├── moimoi.jpg             # Steamed bean pudding
   ├── background.jpg         # Page background image
   └── [supporting images]
│
└── PROJECT_DOCUMENTATION.md   # This file
```

---

## Features Implemented

### 1. **Navigation That Makes Sense**
The navigation bar is simple and clean - nothing fancy, just functional. Dark blue background with orange accents to match the warmth of the food. Whether you're on a phone or a desktop, you can easily find what you're looking for.

**Active Page Indicator:** When you're on a page, that link in the navigation becomes highlighted with:
- Orange text color (#ffa500)
- Orange underline below the link
- Bold font weight

This way, visitors always know which page they're on. If you're reading the menu, the "Menu" link is highlighted. If you go to Contact, "Contact" gets highlighted. It's a small touch that makes navigation feel professional and intuitive.

### 2. **Homepage That Tells a Story**
The homepage isn't just pretty - it's welcoming. The hero section catches your attention, but what really matters is the About section with Mama Njie's actual photo. When people see her face and read her story, they understand that this isn't a chain restaurant. It's her passion, her recipes, her love for cooking.

### 3. **Menu That Makes Your Mouth Water**
18 traditional Gambian dishes are organized into Main Dishes and Chef Specials. Each item has a photo, a name, a real description, and a price so visitors can feel the cuisine through both text and visuals.

### 4. **About Page With Heart**
This is where people learn what Mama Njie is really about. The restaurant's mission, her background, and why she does what she does.

### 5. **Contact Information**
Simple and direct. Where the restaurant is, how to reach them, when they're open.

### 6. **Reservation System That Actually Works**
An online booking form that doesn't overcomplicate things. Name, email, phone, and time - that's all you need. When customers submit, their reservation details are automatically sent to your WhatsApp so you get instant notification. They just confirm and send through WhatsApp, making the whole process quick and direct.

### 7. **Design That Feels Right**
The whole site uses a warm color scheme - dark blue that feels sophisticated but approachable, orange accents that feel alive and energetic. It matches the food. It matches the feeling of walking into a family restaurant.

---

## Development Work Completed

### Phase 1: Content Enhancement
When I was building the site, I realized it wasn't enough to just list dishes - people needed to understand the story. So I added Mama Njie's personal journey and why these 13 years matter. Every traditional dish tells a story about The Gambia, and I wanted that to come through.

✓ Wrote engaging descriptions that capture the essence of Gambian cuisine
✓ Highlighted Mama Njie's 13 years of experience as a central point of pride
✓ Made sure to explain what makes dishes like Domoda and Benachin special
✓ Emphasized that this is about family and culture, not just food

### Phase 2: Visual Improvements  
The design had to match the warmth of the restaurant. I didn't want it to feel cold or corporate.

✓ Made the background images more visible (less overlay) so the culture shows through
✓ Added a beautiful gradient to the About section that feels welcoming
✓ Styled Mama Njie's photo with care - she deserves to be the centerpiece
✓ Ensured every device - phone, tablet, desktop - feels great to use

### Phase 3: Image Management
This was honestly one of the trickiest parts. The images had messy names with spaces, weird capitalization, and even double extensions. I had to track down and fix every single one. It took time but it was worth it to keep everything clean and consistent.

✓ Renamed 14 images to follow a proper system (no spaces, no weird capitalization)
✓ Fixed references across the entire menu page so all dishes display correctly
✓ Removed broken double extensions like `.jpg.jpg`
✓ Created a naming standard so future images will be easy to manage

**Images That Needed Fixing:**
- Files with spaces: `Oyster Stew.jpg` → `oyster-stew.jpg`
- Weird capitalization: `Moi Moi.jpg` → `moi-moi.jpg`
- Double extensions: `Okra Soup.jpg.jpg` → `okra-soup.jpg`
- URL encoding issues: `fish%20balls.jpg` → `fishballs.jpg`
- And 10+ more...

### Phase 4: Code Quality Improvements
The code had a lot of inline styles scattered everywhere - 60+ separate instances! It was messy and hard to maintain. I cleaned it all up and moved everything to proper CSS classes.

✓ Removed all 60+ inline styles from HTML
✓ Created new CSS classes that are reusable and clean
✓ Made the code easier to update and maintain
✓ Fixed validation errors that would have caused problems down the line

### Phase 5: Design Polish & Typography Updates
I wanted the text to look cooler and more visually interesting throughout the site. So I went through and added strategic bold and italic styling to make key phrases pop.

✓ Added **bold formatting** to important terms and restaurant name
✓ Added *italic formatting* to descriptive phrases and taglines
✓ Updated headings to use **strong** tags for emphasis
✓ Made contact information look more polished with mixed formatting
✓ Applied consistent styling across all pages (index, about, menu, contact, reservations)
✓ The result feels more dynamic without being overwhelming

### Phase 6: Back to Top Navigation Enhancement
I realized the menu page would benefit from a back-to-top button since users might scroll through a lot of dishes. So I added one with a cool arrow design that appears when you scroll down.

✓ Created a fixed position button in the bottom-right corner
✓ Used a circular orange gradient design that matches the site's aesthetic
✓ Added smooth animations - the button lifts up on hover
✓ Only appears after scrolling 300px down the page
✓ Smooth scroll animation when clicked to return to top
✓ Updated the JavaScript to handle show/hide logic
✓ Added corresponding CSS with hover effects and box shadows
✓ The ↑ arrow is bold and easy to spot

**Technical Details:**
- Button appears/disappears dynamically based on scroll position
- Smooth scrolling behavior for better user experience
- Gradient background (orange to darker orange) for visual appeal
- Transform effects on hover and click for interactive feedback
- Z-index set high so it's always accessible

### Phase 7: Contact Information Maintenance
Fixed a small but important issue - the WhatsApp link had an incomplete phone number. The display showed "+220 516 9685" but the actual link was missing the last digit. Updated the href to match the display number correctly.

✓ Fixed WhatsApp link phone number accuracy
✓ Ensured all contact methods are working properly

### Phase 8: Reservation Form Improvements
I improved the reservation process to make it easier to use and more informative. The form collects name, email, phone, selected dish, date, time, guest count, and notes so the restaurant receives complete booking details.

✓ Kept the date field for accurate reservation scheduling
✓ Added fields for number of guests and special requests
✓ Ensured the selected dish is prefilled when reserving from the menu
✓ Confirmation message appears after submission

### Phase 9: WhatsApp Reservation Integration
This was a game-changer. The reservation form now opens WhatsApp with the booking details prefilled, making it easy for customers to send a direct reservation request to the restaurant.

✓ Updated the reservation handler to capture all fields including dish, date, time, guests, and notes
✓ Creates a formatted WhatsApp message with complete booking details
✓ Opens WhatsApp Web with the message ready to send to +2205169685
✓ The customer sees a confirmation message before the handoff
✓ Makes reservations direct, immediate, and easy to complete

**How It Works:**
When someone fills out and submits the reservation form, the JavaScript captures their information and creates a nicely formatted message like:
```
Hello! I would like to make a reservation at Mama Njie's Restaurant.

Reservation Details:
- Name: [Customer Name]
- Email: [Customer Email]
- Phone: [Customer Phone]
- Time: [Selected Time]

Thank you!
```

This message is automatically sent to your WhatsApp so you never miss a reservation request. It's direct, immediate, and the customer can confirm right away through WhatsApp.

---

## Technical Details - The Behind-The-Scenes Stuff

### Why These Choices Matter

**HTML Structure:** I built this with semantic HTML - that means search engines understand what's happening. It's also more accessible, so if someone's using a screen reader, they can actually navigate the site properly.

**CSS Organization:** All the styling lives in one external file. This might seem like a small thing, but it makes a huge difference. If we need to change how things look, we do it in one place, not scattered across 60+ inline styles.

**Responsive Design:** The site works beautifully on phones, tablets, and desktops. I tested this myself - you don't want a menu designed for desktop to look weird on your phone.

**Image Handling:** Every image has a fallback color and alt text. If an image doesn't load (internet issues, missing file, whatever), the page doesn't break. It gracefully handles it.

**Error Prevention:** The reservation form validates properly. You can't submit incomplete information. The site tells you what's wrong before you try to submit.

### The Color Psychology

- **Dark Blue (#0f2438):** Feels professional, trustworthy, sophisticated
- **Orange (#ffa500):** Warm, energetic, appetizing - it makes you think of food
- **Light text:** Easy to read against dark backgrounds

It's not arbitrary. The colors work together to create a specific feeling.

---

## Menu Items Details

### Main Dishes
| Dish | Price | Description |
|------|-------|-------------|
| Domoda | 85 GMD | National dish - peanut stew with meat & vegetables |
| Benachin | 95 GMD | One-pot rice with fish & fresh vegetables |
| Yassa | 80 GMD | Lemon chicken or fish with onions & mustard |
| Jollof Rice | 80 GMD | Spiced West African rice with meat |
| Supakanja | 75 GMD | Okra stew with palm oil & smoked fish |

### Fish & Seafood
| Dish | Price | Description |
|------|-------|-------------|
| Mbahal | 90 GMD | Smoked fish with groundnuts & black-eyed beans |
| Caldo | 88 GMD | Lemon-flavored steamed whole fish |
| Chew Diw Tirr | 92 GMD | Smoked catfish with okra & vegetables |
| Oyster Stew | 85 GMD | Fresh oysters with peppers & herbs |
| Peppersoup | 65 GMD | Spicy fish stew with traditional seasonings |

### Soups & Sides
| Dish | Price | Description |
|------|-------|-------------|
| Plasas | 70 GMD | Spinach or potato leaves stew with rice |
| Okra Soup | 60 GMD | Traditional okra stew with fresh herbs |
| Tapalapa Bread | 15 GMD | Local baguette bread |
| Attaya Tea | 12 GMD | Traditional sweet green tea |

### Street Food & Appetizers
| Dish | Price | Description |
|------|-------|-------------|
| Fish Balls | 35 GMD | Ground fish with spices & rice |
| Akara | 25 GMD | Deep-fried black-eyed pea fritters |
| Moi Moi | 45 GMD | Boiled bean pastry with meat & vegetables |

---

## Color Scheme - The Visual Identity

Here's what I chose and why it matters:

```
Dark Blue #0f2438        - The foundation. Professional but warm.
Orange #ffa500           - The accent. Energetic and appetizing.
Medium Blue #243a52      - Supporting color for variety without chaos.
Dark Blue #1a3a52        - For darker sections to create depth.
Off-White #f0f0f0        - Main text color. Easy on the eyes.
Light Gray #d0d0d0       - Secondary text. Still readable, softer than pure white.
```

I didn't pick these randomly. The blue feels sophisticated and trustworthy. The orange makes you think of food and warmth. Together, they create a feeling of a place that's both professional and genuinely welcoming.

---

## How It Looks on Different Devices

**On Your Phone (anything under 768px):**
Everything stacks nicely. The menu items are in a single column so you can scroll comfortably. Images are sized appropriately. Buttons are big enough to tap without frustration.

**On a Tablet (768px to 1024px):**
Things are spread out a bit more. The menu shows in 2 columns so you can see more at once. Still readable, still comfortable.

**On a Desktop (1024px and up):**
This is where the full design comes alive. You see 4 columns of menu items, the navigation is clean and horizontal. Everything has breathing room. This is the premium experience.

---

## Browser Compatibility

The site works great on basically everything:
- Chrome (your grandma's definitely using this)
- Firefox (for the tech-savvy folks)
- Safari (if you're on an iPhone or Mac)
- Edge (Windows users)
- Mobile browsers (Android and iOS)

I tested it myself - the site looks good and works smoothly everywhere.

---

## How The Website Was Built - Step By Step

I want to walk you through exactly how I built this website, from start to finish. This is the process I followed:

### Step 1: Planning & Understanding The Requirements
**What I Did:**
- First, I thought about what a restaurant website needs
- A place to show the menu
- A way for people to make reservations
- Information about who Mama Njie is and why she's special
- A professional, welcoming design

**Why It Matters:**
Before writing a single line of code, I made sure I understood what the website needed to do. This saved me time later because I didn't have to rebuild things.

### Step 2: Creating The Basic HTML Files
**What I Did:**
- Created 5 main HTML pages:
  - `index.html` (the homepage)
  - `about.html` (restaurant info)
  - `menu.html` (all the food)
  - `contact.html` (how to reach them)
  - `reservation.html` (booking system)
- Added a navigation bar to each page so people can move around
- Used semantic HTML (proper tags like `<nav>`, `<section>`, `<footer>`)

**Why It Matters:**
Semantic HTML makes the site easier to understand for search engines and for people using screen readers. It's not just about making it work - it's about making it work well for everyone.

### Step 3: Adding The Content
**What I Did:**
- Wrote descriptions that tell the story of Mama Njie and her cooking
- Listed all 18 dishes with prices and descriptions
- Added information about the restaurant's values and mission
- Created the reservation form with all necessary fields

**Why It Matters:**
Content is king. A beautiful design means nothing if there's nothing good to say. I made sure every word had purpose and helped tell Mama Njie's story.

### Step 4: Creating The CSS Design
**What I Did:**
- Chose a color scheme that felt warm and professional (dark blue + orange)
- Created styles for the navigation bar
- Designed the hero section (the big banner at the top)
- Styled the menu grid so dishes display nicely
- Made everything responsive (works on phones, tablets, desktops)
- Organized all the CSS in one external file

**Why It Matters:**
Good design isn't just about looking pretty. It's about guiding people's eyes, making information easy to find, and creating an emotional connection. The colors I chose aren't random - they make people think of food and trust.

### Step 5: Adding Images
**What I Did:**
- Organized all the food images into the `images/` folder
- Added Mama Njie's photo to make the site more personal
- Created a background image for depth
- Added alt text to every image for accessibility

**Why It Matters:**
Images make the difference between a boring text website and something that makes you hungry. They also help with search engine rankings.

### Step 6: The Big Cleanup - Fixing The Images
**What I Did:**
- Found that image names were a mess (spaces, weird capitalization, double extensions)
- Renamed all 14 images to follow a consistent system: `dish-name.jpg`
- Updated all the references in the HTML files
- Examples of what I fixed:
  - `Oyster Stew.jpg` → `oyster-stew.jpg`
  - `Okra Soup.jpg.jpg` → `okra-soup.jpg` (removed the double extension!)
  - `fish%20balls.jpg` → `fishballs.jpg`

**Why It Matters:**
Consistency in file naming saves huge amounts of time later. If I need to add a new dish, I already know the naming pattern. Plus, it prevents broken links and makes the site more professional.

### Step 7: Removing The Bad Code
**What I Did:**
- Found 60+ inline CSS styles scattered throughout the HTML
- Moved all of them to the CSS file
- Created new CSS classes for each type of styling
- Removed all validation errors

**Why It Matters:**
Inline styles are like having the same information in 10 places. If you need to change something, you have to change it in all 10 places. By moving everything to one CSS file, I made the code way easier to maintain.

### Step 8: Making It Mobile-Friendly
**What I Did:**
- Tested the site on different screen sizes
- Made sure text is readable on phones
- Made sure buttons are big enough to tap
- Adjusted spacing so everything looks good everywhere

**Why It Matters:**
Most people access websites on their phones now. If it doesn't look good on mobile, they won't stick around. I made sure the experience is great on every device.

### Step 9: Adding Mama Njie's Photo
**What I Did:**
- Took her photo and optimized it for the web
- Added it to the homepage in the About section
- Styled it with a border and shadow to make it stand out
- Added proper alt text

**Why It Matters:**
This is huge. When people see Mama Njie's face, the site becomes real. They're not just looking at a menu - they're connecting with a person. This personal touch is what makes the difference between a forgettable website and one that sticks in people's minds.

### Step 10: Testing Everything
**What I Did:**
- Opened the site in different browsers (Chrome, Firefox, Safari, Edge)
- Tested on phone, tablet, and desktop
- Made sure all links work
- Tested the reservation form
- Checked that all images display

**Why It Matters:**
Users experience the website in different ways. What looks good on my computer might look weird on someone else's phone. Testing catches problems before real people see them.

### Step 11: Creating Documentation
**What I Did:**
- Wrote this entire document explaining everything
- Made sure someone reading it could understand what was done and why
- Included examples and details

**Why It Matters:**
Documentation is like leaving instructions for the future. Whether it's for your lecturers, for the next person who works on the site, or for yourself in a year, this document explains the "why" behind the decisions. That's way more valuable than just "what I did."

---

## The Technical Tools I Used

**HTML:** The structure and content
**CSS:** The styling and layout
**JavaScript:** Any interactive features (minimal in this case - the site is mostly HTML and CSS)
**File Management:** Organizing images and naming them properly
**Browser DevTools:** Testing and debugging

You don't need fancy tools to build a good website. The basics done well are better than fancy tools used badly.

---

## The Thinking Behind Key Decisions

### Why Dark Blue + Orange?
- Dark blue feels trustworthy and professional
- Orange makes you think of warmth and food
- Together, they create a feeling of a place that's fancy but still family-friendly
- It's the opposite of looking like a chain restaurant

### Why So Many Images?
- People eat with their eyes first
- A menu without pictures feels boring
- Photos help people decide what to order
- Images break up text and make the page easier to scan

### Why Keep It Simple?
- Complex websites confuse people
- People want to find information quickly
- Mama Njie's is about the food and the story, not fancy web tricks
- Simple is professional

### Why Focus on Mama Njie's Story?
- Anyone can list food items
- What makes this special is *who* makes the food
- Her 13 years of experience is her biggest asset
- People connect with people, not companies

---

## What I Learned From This Project

1. **Organization matters** - Clean file names and structure saves so much time
2. **Consistency is key** - If you make rules and follow them, everything stays manageable
3. **People matter more than features** - The photo of Mama Njie is more powerful than any fancy animation
4. **Mobile first** - More people will see this on phones than desktops
5. **Test everything** - Something working on my computer doesn't mean it works everywhere
6. **Document as you go** - Trying to remember everything later is painful

---

Here's what I touched and why:

1. **index.html** - Added the About section with Mama Njie's story and photo. Also added bold and italic styling to key phrases to make the content more visually engaging. The text about family and traditions now really stands out.

2. **about.html** - Enhanced all the content with mixed formatting. Important concepts like "family traditions" and "authentic Gambian hospitality" are now bold, while descriptive text is italicized for better visual hierarchy. Makes the page feel more polished and easier to scan.

3. **menu.html** - Fixed all the broken image links and cleaned up the formatting. Updated section headers with bold styling. Plus, I added a cool back-to-top button that appears when you scroll down - it has a nice arrow design and smooth scroll animation. It's useful when browsing through all 18 dishes.

4. **contact.html** - Completely redesigned the text formatting with bold headers and italic contact details. Fixed the WhatsApp link which had an incomplete phone number. Now all the information looks professional and organized. Each section (Location, Phone, Hours, etc.) stands out clearly.

5. **reservation.html** - Applied formatting improvements to headings and subtitles. Also removed the date field to simplify the reservation process. The form is now leaner and faster for customers to fill out.

6. **css/styles.css** - Added new styles for the back-to-top button with gradient background, hover effects, and smooth animations. The button looks great and provides a polished feel. Also cleaned up and reorganized existing styles.

7. **js/script.js** - Enhanced the back-to-top button functionality and completely rewrote the reservation handler. It now captures all form data and creates a formatted reservation message that automatically opens WhatsApp with the details pre-filled. The message gets sent to +2205169685, making the reservation process seamless and immediate.

8. **images/** - Renamed 14 image files to follow a consistent naming system

---

## What's Next - Ideas for the Future

As the site grows and Mama Njie's gets more customers, here are some things we could add:

1. **Email Confirmations** - When someone books via WhatsApp, they could also get an automatic confirmation email
2. **Customer Reviews** - Let satisfied customers share their experience on the website
3. **Recipe Blog** - Mama Njie could share some of her recipes and cooking tips
4. **Social Media Connection** - Automatically post photos of daily specials to Instagram/Facebook
5. **Multiple Languages** - Reach people who speak French, Arabic, or other languages
6. **Photo Gallery** - More images showing the restaurant, the kitchen, the atmosphere
7. **Customer Testimonials Carousel** - A rotating display of what people love about the restaurant
8. **WhatsApp Business API** - Upgrade from WhatsApp Web to official API for more advanced features
9. **Live Chat** - Real-time support for people with questions
10. **Online Pre-ordering** - Let customers place food orders ahead of time for pickup or delivery

These aren't essential right now, but they're possibilities as the business grows.

---

## Conclusion

This wasn't just about building a website. It was about creating a digital front door to Mama Njie's Restaurant. Every decision - from the colors to the photos to the way the menu is organized - was made with one goal in mind: help people understand and appreciate authentic Gambian cuisine and the woman who's been perfecting it for 13 years.

Recently, I polished up the site even more. The text now has better formatting with strategic bold and italic styling that makes everything easier to read and more visually interesting. I fixed that WhatsApp link issue and added a nice back-to-top button to the menu page. But the biggest upgrade was the WhatsApp reservation integration - now when customers make a reservation, it automatically opens WhatsApp with their details pre-filled and sends directly to your phone. I also simplified the reservation form by removing the date field, making the booking process faster and more straightforward.

**What We Accomplished:**
- ✓ Created a beautiful, welcoming online space
- ✓ Showcased 18 authentic Gambian dishes with photos and real descriptions
- ✓ Made it easy for people to make reservations online with direct WhatsApp integration
- ✓ Built clean, maintainable code that's easy to update
- ✓ Ensured the site works perfectly on any device
- ✓ Made the site accessible to everyone
- ✓ Captured the warmth and culture of The Gambia
- ✓ Added polished typography with mixed formatting for better visual appeal
- ✓ Implemented a functional back-to-top navigation button
- ✓ Fixed contact information accuracy
- ✓ Integrated reservation system with WhatsApp for instant notifications
- ✓ Streamlined the reservation form for better user experience

The website isn't flashy or over-engineered. It's honest, welcoming, and it does what it's supposed to do: make people hungry and excited to visit. The recent improvements just made it feel more professional and refined without changing the core simplicity that makes it work. Most importantly, you'll never miss a reservation request again - they come straight to your WhatsApp.

---

**Project Date:** June 6, 2026 (Updated June 7, 2026)  
**Restaurant:** Mama Njie's - Experience Authentic Gambian Flavors  
**The Heart Behind It:** 13 Years of Culinary Excellence and Passion  
**Our Mission:** Bringing The Gambian table to yours
