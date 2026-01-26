
import os
import re

# List of files in public/images-product
image_dir = '/home/deo/Desktop/bois/public/images-product'
existing_images = set(os.listdir(image_dir))

# Read products.ts
products_file = '/home/deo/Desktop/bois/lib/data/products.ts'
with open(products_file, 'r') as f:
    content = f.read()

# Find all image paths
referenced_images = re.findall(r"image: '/images-product/(.*?)'", content)

print("Checking referenced images in products.ts:")
missing = []
for img in referenced_images:
    if img not in existing_images:
        missing.append(img)
        print(f"MISSING: {img}")
    else:
        # print(f"OK: {img}")
        pass

if not missing:
    print("No missing images found in products.ts")
else:
    print(f"\nTotal missing: {len(missing)}")

# Check other files for image references
print("\nChecking other files for image references...")
search_dirs = ['/home/deo/Desktop/bois/components', '/home/deo/Desktop/bois/app']
for root_dir in search_dirs:
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', errors='ignore') as f:
                    file_content = f.read()
                    matches = re.findall(r"['\"]/images-product/(.*?)['\"]", file_content)
                    for img in matches:
                        if img not in existing_images and img not in missing:
                            print(f"MISSING in {filepath}: {img}")
                            missing.append(img)
