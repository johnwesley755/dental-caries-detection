-- Drop existing resources table if it exists and recreate with correct schema
DROP TABLE IF EXISTS resources CASCADE;

-- Create resources table for educational content
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    category VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- 'article', 'video', 'guide'
    url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    author VARCHAR(100),
    source VARCHAR(100),
    tags TEXT[], -- Array of tags
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON resources(is_featured);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);

-- Insert some initial dental health resources
INSERT INTO resources (title, description, content, category, resource_type, url, author, source, tags, is_featured) VALUES
('Understanding Dental Caries', 'Learn about the causes, prevention, and treatment of tooth decay', 
 'Dental caries, commonly known as tooth decay or cavities, is one of the most prevalent chronic diseases worldwide. It occurs when bacteria in your mouth produce acids that attack tooth enamel...', 
 'Education', 'article', 'https://www.nidcr.nih.gov/health-info/tooth-decay', 'NIDCR', 'National Institute of Dental Research', 
 ARRAY['caries', 'prevention', 'treatment'], TRUE),

('Proper Brushing Techniques', 'Step-by-step guide to effective tooth brushing', 
 'Brushing your teeth properly is essential for maintaining good oral health. Use a soft-bristled toothbrush and fluoride toothpaste. Hold the brush at a 45-degree angle to your gums...', 
 'Hygiene', 'guide', 'https://www.ada.org/en/member-center/oral-health-topics/toothbrushes', 'ADA', 'American Dental Association', 
 ARRAY['brushing', 'hygiene', 'prevention'], TRUE),

('How to Floss Correctly', 'Video tutorial on proper flossing technique', 
 'Flossing removes plaque and food particles from between teeth and under the gumline where a toothbrush cannot reach...', 
 'Hygiene', 'video', 'https://www.youtube.com/watch?v=example', 'Dental Care Experts', 'YouTube', 
 ARRAY['flossing', 'hygiene'], FALSE),

('Nutrition for Healthy Teeth', 'Foods that promote strong teeth and gums', 
 'Your diet plays a crucial role in oral health. Calcium-rich foods like milk, cheese, and yogurt strengthen tooth enamel. Crunchy fruits and vegetables stimulate saliva production...', 
 'Nutrition', 'article', 'https://www.mouthhealthy.org/en/nutrition', 'MouthHealthy', 'American Dental Association', 
 ARRAY['nutrition', 'diet', 'prevention'], FALSE),

('Dental Care for Children', 'Tips for maintaining your child''s oral health', 
 'Start dental care early. Clean your baby''s gums with a soft cloth after feeding. Begin brushing as soon as the first tooth appears...', 
 'Pediatric', 'guide', 'https://www.cdc.gov/oralhealth/basics/childrens-oral-health/index.html', 'CDC', 'Centers for Disease Control', 
 ARRAY['children', 'pediatric', 'prevention'], TRUE),

('Post-Treatment Care', 'What to do after dental procedures', 
 'After dental treatment, follow your dentist''s instructions carefully. Avoid eating or drinking for the recommended time. Take prescribed medications as directed...', 
 'Treatment', 'guide', NULL, 'Dental Professionals', 'Internal', 
 ARRAY['treatment', 'recovery', 'care'], FALSE);
