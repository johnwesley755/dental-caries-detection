import os
import re

def replace_hex_colors(directory, replacements):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content
                for old_hex, new_hex in replacements:
                    # case insensitive replacement for hex codes
                    new_content = re.sub(old_hex, new_hex, new_content, flags=re.IGNORECASE)

                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {path}")

# Frontend replacements (orange/amber theme)
frontend_reps = [
    (r'#3b82f6', '#f97316'), # blue to orange-500
    (r'#2563eb', '#ea580c'), # blue to orange-600
    (r'#60a5fa', '#fb923c'), # blue to orange-400
    (r'#8b5cf6', '#f59e0b'), # purple to amber-500
    (r'#7c3aed', '#d97706'), # purple to amber-600
    (r'#a78bfa', '#fbbf24'), # purple to amber-400
    (r'#8884d8', '#f97316'), # default rechart purple to orange-500
    (r'#82ca9d', '#f59e0b'), # default rechart green to amber-500
]

# Patient portal replacements (teal/emerald theme)
portal_reps = [
    (r'#3b82f6', '#14b8a6'), # blue to teal-500
    (r'#2563eb', '#0d9488'), # blue to teal-600
    (r'#60a5fa', '#2dd4bf'), # blue to teal-400
    (r'#8b5cf6', '#10b981'), # purple to emerald-500
    (r'#7c3aed', '#059669'), # purple to emerald-600
    (r'#a78bfa', '#34d399'), # purple to emerald-400
    (r'#8884d8', '#14b8a6'), # default rechart purple to teal-500
    (r'#82ca9d', '#10b981'), # default rechart green to emerald-500
]

replace_hex_colors('frontend/src/components/charts', frontend_reps)
replace_hex_colors('patient-portal/src/components/charts', portal_reps)
print("Done with chart color updates.")
