import os
import json

# Path to your wales_photos folder
base_path = '/Users/dominiquedang/Documents/GitHub/dom-dang.github.io/wales_photos'

photo_structure = {}

# Scan each subfolder
for folder in os.listdir(base_path):
    folder_path = os.path.join(base_path, folder)
    
    # Skip if not a directory
    if not os.path.isdir(folder_path):
        continue
    
    # Get all image files in this folder
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG'}
    files = []
    
    for file in os.listdir(folder_path):
        if any(file.endswith(ext) for ext in image_extensions):
            files.append(file)
    
    # Sort files for consistency
    files.sort()
    
    if files:
        photo_structure[folder] = files

# Print as JavaScript object
print("const photoStructure = {")
for category, files in sorted(photo_structure.items()):
    print(f"    '{category}': [")
    for file in files:
        print(f"        '{file}',")
    print("    ],")
print("};")

print(f"\n// Total photos found: {sum(len(files) for files in photo_structure.values())}")
print(f"// Categories: {', '.join(sorted(photo_structure.keys()))}")