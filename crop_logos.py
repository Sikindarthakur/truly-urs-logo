import os
import sys
import glob

def make_transparent(img, bg_color):
    # Ensure in RGBA mode
    img = img.convert("RGBA")
    bg_r, bg_g, bg_b = bg_color[:3]
    
    # Check if the background is a light color (near white/cream)
    is_light = bg_r > 200 and bg_g > 200 and bg_b > 200
    if not is_light:
        return img
        
    datas = img.getdata()
    newData = []
    tolerance = 25
    
    for item in datas:
        r, g, b, a = item
        dist = ((r - bg_r) ** 2 + (g - bg_g) ** 2 + (b - bg_b) ** 2) ** 0.5
        if dist < tolerance:
            newData.append((r, g, b, 0))
        else:
            newData.append((r, g, b, a))
            
    img.putdata(newData)
    return img

def crop_grid(image_path, output_dir, prefix):
    try:
        from PIL import Image
    except ImportError:
        print("Pillow is not installed. Installing Pillow...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
        from PIL import Image

    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return

    os.makedirs(output_dir, exist_ok=True)
    img = Image.open(image_path)
    width, height = img.size
    
    # Calculate cell width and height for 3x3 grid
    cell_w = width // 3
    cell_h = height // 3
    
    count = 1
    for r in range(3):
        for c in range(3):
            left = c * cell_w
            upper = r * cell_h
            right = (c + 1) * cell_w
            lower = (r + 1) * cell_h
            
            box = (left, upper, right, lower)
            cropped = img.crop(box)
            
            # Sample background color at (0, 0)
            bg_color = cropped.getpixel((0, 0))
            # Apply transparentizing
            cropped = make_transparent(cropped, bg_color)
            
            out_name = f"{prefix}_{count}.png"
            out_path = os.path.join(output_dir, out_name)
            cropped.save(out_path, "PNG")
            print(f"Saved Cropped PNG: {out_path} ({cropped.size})")
            count += 1

def process_single_logo(image_path, output_dir, out_name):
    from PIL import Image
    if not os.path.exists(image_path):
        return
        
    img = Image.open(image_path)
    bg_color = img.getpixel((0, 0))
    img = make_transparent(img, bg_color)
    
    out_path = os.path.join(output_dir, out_name)
    img.save(out_path, "PNG")
    print(f"Saved Single PNG: {out_path} ({img.size})")

def main():
    workspace = os.path.dirname(os.path.abspath(__file__))
    logos_dir = os.path.join(workspace, "logos")
    output_dir = os.path.join(logos_dir, "cropped")
    
    # Delete all webp files in workspace and subdirectories
    print("Deleting all WebP files...")
    all_webps = glob.glob(os.path.join(workspace, "**", "*.webp"), recursive=True)
    for webp in all_webps:
        try:
            os.remove(webp)
            print(f"Deleted WebP: {webp}")
        except Exception as e:
            print(f"Failed to delete WebP {webp}: {e}")

    # Remove old PNGs in cropped dir to rebuild cleanly
    old_pngs = glob.glob(os.path.join(output_dir, "*.png"))
    for png in old_pngs:
        try:
            os.remove(png)
            print(f"Deleted old PNG: {png}")
        except Exception as e:
            print(f"Failed to delete PNG {png}: {e}")

    grid1 = os.path.join(logos_dir, "17362aac-1aac-4a17-9da5-d7ca07860168.png")
    grid2 = os.path.join(logos_dir, "ChatGPT Image Jul 16, 2026, 12_59_21 AM.png")
    
    print("Cropping Grid 1...")
    crop_grid(grid1, output_dir, "logo_a")
    
    print("Cropping Grid 2...")
    crop_grid(grid2, output_dir, "logo_b")
    
    # Identify single PNGs in the logos directory
    # Grids are grid1 and grid2. Other files are single logos.
    all_pngs = glob.glob(os.path.join(logos_dir, "*.png"))
    
    # Map of specific clean names for main logo if available
    main_logo_name = "ChatGPT Image Jul 16, 2026, 12_58_00 AM.png"
    
    single_count = 1
    for png_path in all_pngs:
        filename = os.path.basename(png_path)
        if png_path in [grid1, grid2]:
            continue
            
        if filename == main_logo_name:
            process_single_logo(png_path, output_dir, "logo_main.png")
        else:
            # Clean filename to generate a standard name
            clean_name = "".join(c for c in filename.split(".")[0] if c.isalnum() or c in ("-", "_"))
            # Truncate clean_name if too long
            if len(clean_name) > 15:
                clean_name = clean_name[:15]
            out_name = f"logo_single_{single_count}_{clean_name}.png"
            process_single_logo(png_path, output_dir, out_name)
            single_count += 1

if __name__ == "__main__":
    main()
