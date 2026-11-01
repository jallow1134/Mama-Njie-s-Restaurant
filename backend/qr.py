import qrcode
from pathlib import Path

url = "https://jallow1134.github.io/Mama-Njie-s-Restaurant"
img = qrcode.make(url)
output_path = Path(__file__).resolve().parent.parent / "frontend" / "images" / "mama-njie-qr.png"
img.save(output_path)
print(f"Done! QR code saved as {output_path}")