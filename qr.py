import qrcode

url = "https://jallow1134.github.io/Mama-Njie-s-Restaurant"
img = qrcode.make(url)
img.save("mama-njie-qr.png")
print("Done! QR code saved as mama-njie-qr.png")