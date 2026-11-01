Perfect. Here is the *FULL EXPLANATION + ALL CODE IN 1 PLACE* so you can just copy and paste it 👇

---

### *HOW TO GENERATE THE WEBSITE QR CODE*

The existing utility generates a QR code that opens the restaurant website.

#### *STEP 1: INSTALL THE QR TOOL - DO ONCE*
Open VS Code Terminal and run this:
pip install qrcode[pil]
This downloads the tool that makes QR codes.

#### *STEP 2: RUN THE EXISTING SCRIPT*
From the repository root, run:
python backend/qr.py
The generated website QR image is saved to `frontend/images/mama-njie-qr.png`.

To change its destination, update the URL in `backend/qr.py` and run the script again.