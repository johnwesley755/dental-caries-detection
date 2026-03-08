import os
import re

def replace_in_files(directory, replacements):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if not file.endswith(('.tsx', '.ts')):
                continue
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            new_content = content
            for old_pat, new_pat in replacements:
                new_content = re.sub(old_pat, new_pat, new_content)

            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {path}")

# Frontend replacements
frontend_rep = [
    (r'\b(bg|text|border|ring|from|to|via|shadow|fill|hover:bg|hover:text|focus:ring|hover:border|divide|border-[lrtb])-purple-(\d{2,3})\b', r'\1-yellow-\2'),
    (r'\b(bg|text|border|ring|from|to|via|shadow|fill|hover:bg|hover:text|focus:ring|hover:border|divide|border-[lrtb])-cyan-(\d{2,3})\b', r'\1-orange-\2')
]

# Patient-portal replacements
portal_rep = [
    (r'\b(bg|text|border|ring|from|to|via|shadow|fill|hover:bg|hover:text|focus:ring|hover:border|divide|border-[lrtb])-orange-(\d{2,3})\b', r'\1-teal-\2'),
    (r'\b(bg|text|border|ring|from|to|via|shadow|fill|hover:bg|hover:text|focus:ring|hover:border|divide|border-[lrtb])-yellow-(\d{2,3})\b', r'\1-emerald-\2'),
    (r'\b(bg|text|border|ring|from|to|via|shadow|fill|hover:bg|hover:text|focus:ring|hover:border|divide|border-[lrtb])-amber-(\d{2,3})\b', r'\1-teal-\2')
]

replace_in_files('/home/user/Documents/trust-hire/dental-caries/dental-caries-detection/frontend/src', frontend_rep)
replace_in_files('/home/user/Documents/trust-hire/dental-caries/dental-caries-detection/patient-portal/src', portal_rep)

print("Done comprehensive theming.")
