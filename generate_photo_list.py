import os
import json

# Path to your wales_photos folder
base_path = '/Users/dominiquedang/Documents/GitHub/dom-dang.github.io/wales_photos'

photo_structure = {}

# Image extensions to look for
image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.JPG', '.JPEG', '.PNG'}

# Scan each subfolder
for folder in os.listdir(base_path):
    folder_path = os.path.join(base_path, folder)
    
    # Skip if not a directory
    if not os.path.isdir(folder_path):
        continue
    
    # Special handling for 'nature' folder - check for subfolders
    if folder == 'nature':
        nature_structure = {}
        
        # Check all items in the nature folder
        for item in os.listdir(folder_path):
            item_path = os.path.join(folder_path, item)
            
            # If it's a subfolder (like bath, castles, etc.)
            if os.path.isdir(item_path):
                files = []
                for file in os.listdir(item_path):
                    if any(file.endswith(ext) for ext in image_extensions):
                        files.append(file)
                files.sort()
                if files:
                    nature_structure[item] = files
            
            # If it's a direct image file in nature folder
            elif any(item.endswith(ext) for ext in image_extensions):
                if 'other' not in nature_structure:
                    nature_structure['other'] = []
                nature_structure['other'].append(item)
        
        if nature_structure:
            # Sort the 'other' category if it exists
            if 'other' in nature_structure:
                nature_structure['other'].sort()
            photo_structure[folder] = nature_structure
    
    else:
        # Regular folders (teaching, mit, etc.) - just get files directly
        files = []
        for file in os.listdir(folder_path):
            if any(file.endswith(ext) for ext in image_extensions):
                files.append(file)
        files.sort()
        if files:
            photo_structure[folder] = files

# Print as JavaScript object
print("const photoStructure = {")
for category in sorted(photo_structure.keys()):
    content = photo_structure[category]
    
    # If it's nature (nested structure)
    if isinstance(content, dict):
        print(f"    {category}: {{")
        for subcategory, files in sorted(content.items()):
            print(f"        {subcategory}: [")
            for file in files:
                print(f"            '{file}',")
            print("        ],")
        print("    },")
    
    # If it's a regular category (flat list)
    else:
        print(f"    {category}: [")
        for file in content:
            print(f"        '{file}',")
        print("    ],")

print("};")

# Print summary
print("\n// Summary:")
total_photos = 0
for category, content in photo_structure.items():
    if isinstance(content, dict):
        for subcategory, files in content.items():
            count = len(files)
            total_photos += count
            print(f"// {category}/{subcategory}: {count} photos")
    else:
        count = len(content)
        total_photos += count
        print(f"// {category}: {count} photos")

print(f"// Total photos: {total_photos}")
print(f"// Main categories: {', '.join(sorted(photo_structure.keys()))}")