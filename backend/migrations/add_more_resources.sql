-- Add more educational resources with verified working links
INSERT INTO resources (title, description, content, category, resource_type, url, author, source, tags, is_featured) VALUES

-- Education Category
('Tooth Decay (Cavities)', 'Comprehensive guide on dental caries from Mayo Clinic', 
 'Cavities are permanently damaged areas in the hard surface of your teeth that develop into tiny openings or holes. Cavities, also called tooth decay or caries, are caused by a combination of factors, including bacteria in your mouth, frequent snacking, sipping sugary drinks and not cleaning your teeth well.', 
 'Education', 'article', 'https://www.mayoclinic.org/diseases-conditions/cavities/symptoms-causes/syc-20352892', 'Mayo Clinic', 'Mayo Clinic', 
 ARRAY['cavities', 'tooth decay', 'prevention'], TRUE),

('Dental Plaque: What It Is and How to Remove It', 'Understanding and managing dental plaque', 
 'Plaque is a sticky film of bacteria that constantly forms on teeth. Bacteria in plaque produce acids after you eat or drink. These acids can destroy tooth enamel and cause cavities and gingivitis.', 
 'Education', 'article', 'https://www.colgate.com/en-us/oral-health/plaque-and-tartar/what-is-plaque', 'Colgate', 'Colgate Oral Care', 
 ARRAY['plaque', 'bacteria', 'oral hygiene'], FALSE),

('Gum Disease (Periodontal Disease)', 'Complete guide to gum disease prevention and treatment', 
 'Gum disease is an infection of the tissues that hold your teeth in place. It is typically caused by poor brushing and flossing habits that allow plaque to build up on the teeth and harden.', 
 'Education', 'article', 'https://www.nidcr.nih.gov/health-info/gum-disease', 'NIDCR', 'National Institute of Dental Research', 
 ARRAY['gum disease', 'periodontal', 'prevention'], TRUE),

('Tooth Enamel Erosion', 'How to protect your tooth enamel', 
 'Tooth enamel is the hard, outer surface layer of your teeth that serves to protect against tooth decay. Learn about causes of enamel erosion and how to prevent it.', 
 'Education', 'article', 'https://www.webmd.com/oral-health/guide/tooth-enamel-erosion-restoration', 'WebMD', 'WebMD', 
 ARRAY['enamel', 'erosion', 'protection'], FALSE),

-- Hygiene Category
('The Right Way to Brush Your Teeth', 'ADA approved brushing technique', 
 'Brush your teeth twice a day with a soft-bristled brush. The size and shape of your brush should fit your mouth allowing you to reach all areas easily. Replace your toothbrush every three to four months.', 
 'Hygiene', 'guide', 'https://www.mouthhealthy.org/en/az-topics/b/brushing-your-teeth', 'ADA', 'American Dental Association', 
 ARRAY['brushing', 'technique', 'daily care'], TRUE),

('Flossing: How to Floss Your Teeth', 'Step-by-step flossing guide', 
 'Use about 18 inches of floss wound around one of your middle fingers, with the rest wound around the opposite middle finger. Hold the floss tightly between your thumbs and forefingers and gently insert it between your teeth.', 
 'Hygiene', 'guide', 'https://www.mouthhealthy.org/en/az-topics/f/flossing', 'ADA', 'American Dental Association', 
 ARRAY['flossing', 'interdental', 'cleaning'], TRUE),

('Choosing the Right Toothpaste', 'Guide to selecting effective toothpaste', 
 'Look for toothpaste with the ADA Seal of Acceptance. Fluoride toothpaste helps prevent tooth decay. Consider your specific needs like sensitivity, whitening, or tartar control.', 
 'Hygiene', 'guide', 'https://www.ada.org/resources/research/science-and-research-institute/oral-health-topics/toothpastes', 'ADA', 'American Dental Association', 
 ARRAY['toothpaste', 'fluoride', 'products'], FALSE),

('Mouthwash: Benefits and How to Use', 'Understanding therapeutic mouthwashes', 
 'Mouthwash can help prevent or control tooth decay, reduce plaque, prevent or reduce gingivitis, reduce the speed that tartar develops, or produce a combination of these effects.', 
 'Hygiene', 'article', 'https://www.ada.org/resources/research/science-and-research-institute/oral-health-topics/mouthrinse', 'ADA', 'American Dental Association', 
 ARRAY['mouthwash', 'rinse', 'antimicrobial'], FALSE),

-- Nutrition Category
('Foods That Fight Cavities', 'Cavity-fighting foods for better oral health', 
 'Certain foods can help protect tooth enamel and fight plaque. Cheese, yogurt, leafy greens, apples, carrots, celery, and almonds are all great choices for oral health.', 
 'Nutrition', 'article', 'https://www.mouthhealthy.org/en/nutrition/food-tips', 'MouthHealthy', 'American Dental Association', 
 ARRAY['nutrition', 'cavity prevention', 'healthy foods'], TRUE),

('Sugar and Your Teeth', 'How sugar affects oral health', 
 'When you eat sugary foods or sip sugary drinks for long periods of time, plaque bacteria use that sugar to produce acids that attack your enamel. Learn how to minimize damage.', 
 'Nutrition', 'article', 'https://www.mouthhealthy.org/en/nutrition/sugar', 'MouthHealthy', 'American Dental Association', 
 ARRAY['sugar', 'diet', 'prevention'], FALSE),

('Calcium and Vitamin D for Strong Teeth', 'Essential nutrients for dental health', 
 'Calcium and vitamin D are essential for maintaining strong teeth and bones. Learn about the best food sources and recommended daily intake.', 
 'Nutrition', 'guide', 'https://www.healthline.com/health/dental-and-oral-health/calcium-and-teeth', 'Healthline', 'Healthline', 
 ARRAY['calcium', 'vitamin d', 'nutrients'], FALSE),

-- Pediatric Category
('Baby Teeth: When They Come In and Fall Out', 'Complete guide to baby teeth development', 
 'Baby teeth typically begin to appear when a baby is between 6 and 12 months old. Learn about the timeline, care tips, and what to expect.', 
 'Pediatric', 'guide', 'https://www.healthychildren.org/English/ages-stages/baby/teething-tooth-care/Pages/default.aspx', 'AAP', 'American Academy of Pediatrics', 
 ARRAY['baby teeth', 'children', 'development'], TRUE),

('Preventing Tooth Decay in Children', 'CDC guidelines for children''s oral health', 
 'Tooth decay is one of the most common chronic diseases of childhood. Learn how to prevent it with proper oral hygiene, fluoride, and regular dental visits.', 
 'Pediatric', 'article', 'https://www.cdc.gov/oralhealth/basics/childrens-oral-health/index.html', 'CDC', 'Centers for Disease Control', 
 ARRAY['children', 'prevention', 'decay'], TRUE),

('Thumb Sucking and Pacifier Use', 'Managing oral habits in children', 
 'Most children stop thumb sucking on their own between ages 2 and 4. Learn when intervention may be needed and how to help your child stop.', 
 'Pediatric', 'guide', 'https://www.mouthhealthy.org/en/babies-and-kids/thumb-sucking', 'MouthHealthy', 'American Dental Association', 
 ARRAY['thumb sucking', 'habits', 'children'], FALSE),

-- Treatment Category
('What to Expect During a Dental Filling', 'Understanding the filling procedure', 
 'A dental filling is used to treat a small hole, or cavity, in a tooth. Learn about the procedure, types of fillings, and aftercare.', 
 'Treatment', 'guide', 'https://www.mouthhealthy.org/en/az-topics/f/fillings', 'MouthHealthy', 'American Dental Association', 
 ARRAY['fillings', 'treatment', 'procedure'], FALSE),

('Root Canal Treatment Explained', 'What you need to know about root canals', 
 'A root canal is a treatment used to repair and save a tooth that is badly decayed or infected. Learn about the procedure and recovery.', 
 'Treatment', 'article', 'https://www.mouthhealthy.org/en/az-topics/r/root-canals', 'MouthHealthy', 'American Dental Association', 
 ARRAY['root canal', 'endodontic', 'treatment'], FALSE),

('Dental Crowns: Types and Procedure', 'Complete guide to dental crowns', 
 'A dental crown is a tooth-shaped cap that is placed over a tooth to restore its shape, size, strength, and appearance. Learn about different types and when they are needed.', 
 'Treatment', 'guide', 'https://www.mouthhealthy.org/en/az-topics/c/crowns', 'MouthHealthy', 'American Dental Association', 
 ARRAY['crowns', 'restoration', 'treatment'], FALSE),

-- General Oral Health
('How Often Should You Visit the Dentist?', 'Dental checkup frequency guidelines', 
 'Most people should visit the dentist at least twice a year for routine checkups and cleanings. Some people may need more frequent visits based on their oral health.', 
 'Education', 'article', 'https://www.mouthhealthy.org/en/dental-care-concerns/questions-about-going-to-the-dentist', 'MouthHealthy', 'American Dental Association', 
 ARRAY['checkups', 'prevention', 'dental visits'], TRUE),

('Teeth Whitening: What You Need to Know', 'Safe teeth whitening options', 
 'Learn about professional and at-home teeth whitening options, their effectiveness, and potential side effects.', 
 'Treatment', 'article', 'https://www.mouthhealthy.org/en/az-topics/w/whitening', 'MouthHealthy', 'American Dental Association', 
 ARRAY['whitening', 'cosmetic', 'treatment'], FALSE),

('Dry Mouth: Causes and Treatment', 'Managing xerostomia (dry mouth)', 
 'Dry mouth occurs when the salivary glands do not make enough saliva. Learn about causes, complications, and treatment options.', 
 'Education', 'article', 'https://www.nidcr.nih.gov/health-info/dry-mouth', 'NIDCR', 'National Institute of Dental Research', 
 ARRAY['dry mouth', 'saliva', 'treatment'], FALSE);
