import os
import re

def migrate_theme(directory):
    # Advanced mapping for Clinical Blue migration
    patterns = [
        # Teal to Blue/Primary
        (r'teal-50\b', 'blue-50/50'),
        (r'teal-100\b', 'blue-100'),
        (r'teal-200\b', 'blue-200'),
        (r'teal-300\b', 'blue-300'),
        (r'teal-400\b', 'blue-400'),
        (r'teal-500\b', 'primary'),
        (r'teal-600\b', 'blue-900'),
        (r'teal-700\b', 'blue-950'),
        (r'teal-800\b', 'slate-900'),
        
        # Cyan/Sky to Blue
        (r'cyan-([0-9]{2,3})', r'blue-\1'),
        (r'sky-([0-9]{2,3})', r'blue-\1'),
        
        # Emerald standardization (Clinical Green)
        (r'emerald-500\b', 'emerald-600'),
        (r'emerald-400\b', 'emerald-500'),
        
        # Gradients
        (r'from-teal-x to-emerald-y', 'from-primary to-blue-800'),
        (r'from-teal-400 to-emerald-600', 'from-primary to-blue-900'),
        (r'bg-gradient-to-br from-teal-950/90 via-emerald-950/80 to-slate-950/90', 'bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-slate-950/90'),
        
        # Specific Brand text
        (r'text-teal-500', 'text-primary'),
        (r'text-teal-600', 'text-blue-900'),
        (r'bg-teal-500', 'bg-primary'),
        (r'bg-teal-600', 'bg-blue-900'),
        (r'shadow-teal-500/20', 'shadow-primary/20'),
        
        # Legacy Branding names
        (r'DentAI Diagnostics', 'DENTALAI Intelligence'),
        (r'DentAI', 'DENTALAI'),
    ]

    print(f"Starting migration in: {directory}")
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css')):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content
                for pattern, replacement in patterns:
                    new_content = re.sub(pattern, replacement, new_content)

                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Migrated: {file_path}")

if __name__ == "__main__":
    target_dir = os.path.join(os.getcwd(), 'patient-portal', 'src')
    migrate_theme(target_dir)
