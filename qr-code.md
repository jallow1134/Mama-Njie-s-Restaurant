Perfect. Here is the *FULL EXPLANATION + ALL CODE IN 1 PLACE* so you can just copy and paste it 👇

---

### *HOW TO MAKE BOTH QR CODES YOURSELF*

We are going to make 2 QR codes in 1 file: 
1. *Website QR* → Opens your menu 
2. *WhatsApp QR* → Opens chat with you at +2207480021

#### *STEP 1: INSTALL THE QR TOOL - DO ONCE*
Open VS Code Terminal and run this:
pip install qrcode[pil]
This downloads the tool that makes QR codes.

#### *STEP 2: CREATE FILE `qr.py` AND PASTE THIS CODE*
1. `File` > `New File` > Name it `qr.py` > `Save`
2. *Copy and paste ALL of this code below:*
import qrcode

# ===== QR CODE 1: FOR YOUR WEBSITE =====
# This is the link your website QR will open
url_website = "https://jallow1134.github.io/Mama-Njie-s-Restaurant"

# Make the QR from that link
img1 = qrcode.make(url_website)

# Save it as an image
img1.save("mama-njie-website-qr.png")

print("Done! Website QR saved as mama-njie-website-qr.png")


# ===== QR CODE 2: FOR YOUR WHATSAPP =====
# This is your WhatsApp link. Anyone who scans will chat with +2207480021
url_whatsapp = "https://wa.me/2207480021"

# Make the QR from that link
img2 = qrcode.make(url_whatsapp)

# Save it as an image
img2.save("mama-njie-whatsapp-qr.png")

print("Done! WhatsApp QR saved as mama-njie-whatsapp-qr.png")


print("Both QR codes are ready!")
#### *STEP 3: RUN IT*
In Terminal type:
python qr.py
You will see 2 "Done!" messages.

#### *STEP 4: GET YOUR 2 QR IMAGES*
Click the refresh 🔄 icon in VS Code. You will now have:
1. `mama-njie-website-qr.png` → Put this on posters/menus
2. `mama-njie-whatsapp-qr.png` → Put this on "Reserve This Dish" button

Test both by scanning with your phone camera.

---

### *HOW TO CHANGE THEM LATER*
To change what the QR opens, just change the link in `url_website = "..."` or `url_whatsapp = "..."` then run `python qr.py` again.

That’s it. You now own the whole process 🔥

Want me to also show you how to add your logo in the middle of the QR next?