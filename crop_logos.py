import os
import sys
import glob

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
    
    # Calculate cell width and height
    cell_w = width // 3
    cell_h = height // 3
    
    count = 1
    for r in range(3):
        for c in range(3):
            left = c * cell_w
            upper = r * cell_h
            right = (c + 1) * cell_w
            lower = (r + 1) * cell_h
            
            # Crop
            box = (left, upper, right, lower)
            cropped = img.crop(box)
            
            # Save as WebP
            out_name = f"{prefix}_{count}.webp"
            out_path = os.path.join(output_dir, out_name)
            cropped.save(out_path, "WEBP", quality=85)
            print(f"Saved WebP: {out_path} ({cropped.size})")
            count += 1

def main():
    workspace = os.path.dirname(os.path.abspath(__file__))
    logos_dir = os.path.join(workspace, "logos")
    output_dir = os.path.join(logos_dir, "cropped")
    
    # Remove old PNGs to avoid confusion
    old_pngs = glob.glob(os.path.join(output_dir, "*.png"))
    for png in old_pngs:
        try:
            os.remove(png)
            print(f"Deleted old PNG: {png}")
        except Exception as e:
            print(f"Failed to delete {png}: {e}")

    grid1 = os.path.join(logos_dir, "17362aac-1aac-4a17-9da5-d7ca07860168.png")
    grid2 = os.path.join(logos_dir, "ChatGPT Image Jul 16, 2026, 12_59_21 AM.png")
    
    print("Cropping Grid 1...")
    crop_grid(grid1, output_dir, "logo_a")
    
    print("Cropping Grid 2...")
    crop_grid(grid2, output_dir, "logo_b")
    
    # Copy main logo to cropped dir as WebP
    main_logo_src = os.path.join(logos_dir, "ChatGPT Image Jul 16, 2026, 12_58_00 AM.png")
    if os.path.exists(main_logo_src):
        from PIL import Image
        img = Image.open(main_logo_src)
        out_path = os.path.join(output_dir, "logo_main.webp")
        img.save(out_path, "WEBP", quality=85)
        print(f"Saved Main Logo as WebP: {out_path}")
    else:
        print("Error: Main logo not found.")

if __name__ == "__main__":
    main()
