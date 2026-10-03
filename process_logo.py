import sys
import os
from PIL import Image

def process_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    # We want to remove the white background and the green outline.
    # A simple way to remove the green outline is to crop it or replace it.
    # Let's crop 10% from the edges if it's a border, or just find the inner content.
    # Actually, let's just make white (#FFFFFF) transparent.
    # And we can crop out the outer border. Let's find the bounding box of the non-white, non-green content.
    
    # Or simply:
    new_data = []
    for item in data:
        r, g, b, a = item
        # If it's very close to white, make transparent
        if r > 240 and g > 240 and b > 240:
            new_data.append((255, 255, 255, 0))
        # If it's the specific green of the border, make transparent
        # We might not know the exact green, let's just do a naive crop for the border.
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # To remove the green border, we can crop out the edges (e.g., 5% of the image)
    width, height = img.size
    crop_amount_w = int(width * 0.05)
    crop_amount_h = int(height * 0.05)
    
    cropped = img.crop((crop_amount_w, crop_amount_h, width - crop_amount_w, height - crop_amount_h))
    
    # Trim remaining transparent space
    bbox = cropped.getbbox()
    if bbox:
        cropped = cropped.crop(bbox)
        
    cropped.save(output_path, "PNG")
    print(f"Saved processed logo to {output_path}")

if __name__ == '__main__':
    input_file = r"C:\Users\user\.gemini\antigravity-ide\brain\a24e6f3f-d7c6-43cf-b117-061ae6b696d3\.user_uploaded\media_1791034543751.jpg"
    output_file = r"d:\Salamatek\apps\web\public\images\new-logo-transparent.png"
    process_logo(input_file, output_file)
