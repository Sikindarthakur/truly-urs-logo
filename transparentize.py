import os
import sys
import glob

def make_transparent(img_path):
    try:
        from PIL import Image
    except ImportError:
        print("Pillow not installed.")
        return

    img = Image.open(img_path)
    img = img.convert("RGBA")
    
    # Get corner pixel as reference background color
    bg_color = img.getpixel((0, 0))
    bg_r, bg_g, bg_b, _ = bg_color
    
    # Check if the background is a light color (near white/cream)
    # R, G, B should all be high
    is_light = bg_r > 200 and bg_g > 200 and bg_b > 200
    
    if not is_light:
        print(f"Skipping transparentizing for {os.path.basename(img_path)} (dark background: {bg_color[:3]})")
        return False
        
    datas = img.getdata()
    newData = []
    
    # Tolerance distance
    tolerance = 25
    
    for item in datas:
        r, g, b, a = item
        # Calculate Euclidean distance in RGB color space
        dist = ((r - bg_r) ** 2 + (g - bg_g) ** 2 + (b - bg_b) ** 2) ** 0.5
        
        if dist < tolerance:
            # Make it fully transparent
            newData.append((r, g, b, 0))
        else:
            newData.append((r, g, b, a))
            
    img.putdata(newData)
    img.save(img_path, "WEBP", quality=85)
    print(f"Successfully transparentized: {os.path.basename(img_path)} (removed bg: {bg_color[:3]})")
    return True

def main():
    workspace = os.path.dirname(os.path.abspath(__file__))
    cropped_dir = os.path.join(workspace, "logos", "cropped")
    
    webps = glob.glob(os.path.join(cropped_dir, "*.webp"))
    print(f"Found {len(webps)} WebP images to process...")
    
    count = 0
    for webp in webps:
        if make_transparent(webp):
            count += 1
            
    print(f"Processed {count} images successfully.")

if __name__ == "__main__":
    main()
