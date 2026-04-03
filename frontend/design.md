# DentAI Diagnostics — Stitch Design Prompts

A curated set of Stitch prompts for designing the **DentAI Diagnostics** landing page — a final year undergraduate research project that presents an AI-powered dental caries detection system built specifically for dentists and dental clinics.

> ⚠️ **Scope: Desktop View Only.** All prompts in this file are designed exclusively for desktop screen widths (1440px). Do not apply any responsive, mobile, or tablet breakpoints. Every layout should remain in its full desktop grid arrangement at all times.

> 🎓 **Context: Final Year Project.** This is not a commercial product. The landing page should communicate research value, technical credibility, and clinical usefulness to dentists — not business pitch or marketing language. Tone should be academic, professional, and purpose-driven.

---

## 0. Desktop-Only Constraint (Apply First)

> **Prompt:**
> "Design this entire landing page for desktop view only, with a fixed layout optimized for 1440px wide screens. Do not add any responsive breakpoints, mobile navigation, hamburger menus, or stacked/collapsed mobile layouts. All grid sections must remain in their full desktop arrangement at all times. Ignore mobile-first defaults."

---

## 1. High-Level Concept

> **Prompt:**
> "A final year university research project landing page for a web-based AI system that detects dental caries from X-ray images uploaded by dentists. The target audience is dentists and dental professionals who will use this tool in a clinical setting. The page should feel academically credible, technically serious, and professionally presented — not a startup pitch. The overall tone should be similar to a polished research poster or a professional clinical tool showcase. Desktop view only at 1440px."

---

## 2. Visual Vibe

> **Prompt:**
> "Apply a calm, professional, and clinically trustworthy visual theme across the entire landing page. Use deep clinical blue (`#003d9b`) as the primary color with white and light gray (`#f8fafc`) backgrounds. Typography should use a clean modern sans-serif font like Inter or DM Sans. The design should feel clean, precise, and structured — like a professional medical software interface or a well-designed academic thesis poster. Avoid flashy gradients, neon colors, or startup-style bold marketing aesthetics. Desktop view only at 1440px. No mobile styles."

---

## 3. Navigation Bar

> **Prompt:**
> "Design a clean, minimal desktop navigation bar at 1440px width. On the left side, show the project logo: a small tooth icon next to the text 'DentAI Diagnostics' in bold dark blue. In the center, show navigation links: 'About', 'Features', 'How It Works', 'Results', 'Team'. On the right, add two buttons: a ghost/outline button labeled 'Sign In' and a solid deep blue button labeled 'Get Started'. The navbar background should be white with a very subtle bottom shadow. Desktop-only horizontal layout — no hamburger menu."

---

## 4. Hero Section

> **Prompt:**
> "Design the hero section of the landing page for desktop at 1440px. Use a two-column layout: the left column (55% width) contains a small academic badge at the top reading 'Final Year Project — Computer Science', then the main headline 'AI-Powered Dental Caries Detection for Clinical Dentists' in bold dark blue text, a 2-line description: 'A deep learning-based web application that assists dentists in identifying dental caries from dental X-ray images with high accuracy and speed.' Below that, one primary CTA button labeled 'Explore the System' in solid deep blue. The right column (45% width) shows a clean UI screenshot or mockup of the detection dashboard — a dark-themed panel with an X-ray image and AI-drawn bounding boxes highlighting detected caries regions. The hero background should be off-white with a very soft blue radial glow. Desktop-only, two columns must not collapse."

---

## 5. Problem Statement Section

> **Prompt:**
> "Add a section titled 'The Problem We Are Solving' with a centered heading in dark blue. Below it, display three cards in a horizontal row at desktop width. Card 1: 'Manual Detection Is Slow' — icon of a magnifying glass — description: 'Traditional caries detection depends on human visual inspection, which is time-consuming and prone to error.' Card 2: 'Early Caries Are Often Missed' — icon of a tooth with a warning sign — description: 'Early-stage caries are difficult to detect from X-rays without trained specialist support.' Card 3: 'Limited Diagnostic Tools' — icon of a laptop — description: 'Many dental clinics lack AI-assisted tools to support accurate and efficient diagnosis.' Cards should have white backgrounds, a light blue top accent border, and subtle shadows. Desktop-only 3-column layout."

---

## 6. System Features Section

> **Prompt:**
> "Create a features section titled 'What the System Does' on a light gray background. Show four feature cards in a 2x2 grid layout for desktop at 1440px. Feature 1: 'Automated Caries Detection' — icon: brain with scan lines — 'Deep learning model detects carious lesions in uploaded dental X-ray images.' Feature 2: 'Severity Classification' — icon: bar chart — 'Each finding is classified as Mild, Moderate, or Severe based on model confidence.' Feature 3: 'Patient Record Management' — icon: folder with user — 'Dentists can register patients, link scans, and track diagnosis history.' Feature 4: 'PDF Report Export' — icon: download document — 'Generate and download a detailed clinical PDF report for each detection session.' Cards should be white with a thin blue left-side accent border and a rounded icon in a light blue circle. Desktop-only 2x2 grid — do not stack all cards in one column."

---

## 7. How It Works Section

> **Prompt:**
> "Design a 'How It Works' section on a deep navy background for desktop at 1440px, showing a 4-step horizontal flow. Step 1 title: 'Register Patient' — description: 'Dentist adds a patient to the system with their clinical profile.' Step 2 title: 'Upload X-Ray' — description: 'Upload a dental X-ray image (JPEG/PNG) directly from the browser.' Step 3 title: 'AI Analysis' — description: 'The system processes the image through a trained deep learning model in under 3 seconds.' Step 4 title: 'View & Export Results' — description: 'Detection results with bounding boxes and severity grades are displayed. PDF report can be downloaded.' Each step has a numbered dark blue circle, bold white title, and light gray description. Steps are connected by a horizontal dashed line. Desktop horizontal layout — all 4 steps in one row, do not stack."

---

## 8. Research Results / Accuracy Section

> **Prompt:**
> "Add a research results section titled 'Model Performance' on a white background, centered for desktop at 1440px. Show four metrics in a horizontal row: '97.4% Detection Accuracy', '92.1% Precision', '94.8% Recall', '2.6s Avg Processing Time'. Each metric card has the large bold number in deep blue, a small label below it in slate gray, and a thin bottom line chart icon suggesting the trend. Below the metrics, add a single sentence in italic gray: 'Results validated against the UFBA-UESC Dental Image Dataset.' Keep all four metrics in one row — desktop only, do not stack."

---

## 9. Tech Stack Section

> **Prompt:**
> "Add a compact section titled 'Built With' showing the technology stack used in the project. Display logos or text pills in a single horizontal row at desktop width on a very light gray background: 'Python', 'FastAPI', 'YOLOv8', 'React', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'. Each tech should appear as a small rounded pill badge with a white background, a thin border, and the technology name in dark gray text. Arrange all pills in one row, centered, desktop-only."

---

## 10. Team / About Section

> **Prompt:**
> "Design an 'About the Project' section with a 2-column desktop layout at 1440px. Left column: a short paragraph: 'This project was developed as part of the final year dissertation for the Bachelor of Computer Science program. It applies convolutional neural networks and object detection techniques to assist dental professionals in clinical caries diagnosis.' Right column: a simple profile card showing the student developer — a circular avatar, name in bold dark text, role 'Student Developer, Final Year Project', and University name below. Add a second smaller card for the project supervisor: circular avatar, name, title 'Project Supervisor', and department. Keep the two-column layout — do not stack on desktop."

---

## 11. CTA / Closing Section

> **Prompt:**
> "Design a closing CTA section at the bottom of the page on a deep navy blue background for desktop at 1440px. Center-aligned. Heading: 'Try the Detection System' in bold white. Subtext beneath it: 'Academic demonstration available. Sign in to upload a dental X-ray and see AI detection in action.' One solid white button labeled 'Launch Demo' with dark blue text, and one ghost white-outline button labeled 'View Source Code'. Desktop-only full-width horizontal layout."

---

## 12. Footer

> **Prompt:**
> "Design a minimal academic footer on a near-black background for desktop at 1440px in a single horizontal row. Left side: 'DentAI Diagnostics' in white bold text and below it 'Final Year Project — Computer Science 2025' in small muted gray text. Center: two columns of links — 'System': Detection, Patients, History, Reports; 'Project': About, Methodology, Results, GitHub. Right side: a small GitHub icon and a link reading 'View on GitHub' in light blue. Very bottom: thin divider line then '© 2025 John Wesley. Academic Project. Not for commercial use.' in muted gray italic text. Desktop-only horizontal layout — do not collapse to vertical stacks."

---

## 13. Global Theme Controls

> **Prompt:**
> "Set the global theme for the entire landing page for desktop view only at 1440px. Primary color: `#003d9b` (deep clinical blue). Background: `#f8fafc` (off-white). Text: `#0f172a` (near-black). Accent: `#3b82f6` (interactive blue). Font: Inter or DM Sans, all body text at 16px. Headings: `font-weight: 900`, dark blue. All buttons: rounded corners (`border-radius: 12px`), no uppercase text — use natural sentence case throughout. Cards: white background, `border-radius: 16px`, `box-shadow: 0 2px 12px rgba(0,0,0,0.06)`. No flashy animations — only subtle fade-in on scroll. No mobile media queries."

---

## Pro Tips Applied

| Principle | Applied |
|---|---|
| **Academic Tone** | No startup/marketing language; uses "research", "dissertation", "validated" |
| **Dentist-Oriented** | All feature descriptions focus on how the system helps dentists clinically |
| **Final Year Project Context** | Problem, Solution, Results, Tech Stack, Team — like a research poster |
| **Specific Colors** | Exact hex values (`#003d9b`, `#3b82f6`, `#f8fafc`) |
| **One Screen at a Time** | Each section has its own focused and self-contained prompt |
| **Desktop-Only Explicit Lock** | Every prompt ends with a desktop-only constraint at 1440px |
| **Real Research Numbers** | Accuracy, Precision, Recall and dataset name mentioned |
