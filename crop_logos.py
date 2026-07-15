import os
import sys

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
            
            # Save
            out_name = f"{prefix}_{count}.png"
            out_path = os.path.join(output_dir, out_name)
            cropped.save(out_path)
            print(f"Saved: {out_path} ({cropped.size})")
            count += 1

def main():
    workspace = os.path.dirname(os.path.abspath(__file__))
    logos_dir = os.path.join(workspace, "logos")
    output_dir = os.path.join(logos_dir, "cropped")
    
    grid1 = os.path.join(logos_dir, "17362aac-1aac-4a17-9da5-d7ca07860168.png")
    grid2 = os.path.join(logos_dir, "ChatGPT Image Jul 16, 2026, 12_59_21 AM.png")
    
    print("Cropping Grid 1...")
    crop_grid(grid1, output_dir, "logo_a")
    
    print("Cropping Grid 2...")
    crop_grid(grid2, output_dir, "logo_b")
    
    # Copy main logo to cropped dir with a standard name
    main_logo_src = os.path.join(logos_dir, "ChatGPT Image Jul 16, 2026, 12_58_00 AM.png")
    if os.path.exists(main_logo_src):
        from PIL import Image
        img = Image.open(main_logo_src)
        out_path = os.path.join(output_dir, "logo_main.png")
        img.save(out_path)
        print(f"Copied Main Logo to: {out_path}")
    else:
        print("Error: Main logo not found.")

if __name__ == "__main__":
    main()
