import qrcode

url = "https://mamanjiesrestaurant.com"
img = qrcode.make(url)
img.save("mama-njie-qr.png")
print("Done! QR code saved as mama-njie-qr.png")