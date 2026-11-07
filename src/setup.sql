-- ========================================
-- Setup Database Schema & Sample Data
-- CSE 340 - Web Services
-- ========================================

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS organization CASCADE;

-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Project Table (Team Activity)
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization (organization_id) ON DELETE CASCADE
);

-- ========================================
-- Category Table (Assignment: Database Retrieval)
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ========================================
-- Junction Table: Project Categories (N:M)
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES project (project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category (category_id) ON DELETE CASCADE
);

-- ========================================
-- Insert Sample Data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename) VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Insert Sample Data: Projects (5 per Organization)
-- ========================================
-- BrightFuture Builders (org_id: 1)
INSERT INTO project (organization_id, title, description, location, date) VALUES
(1, 'Community Playground Renovation', 'Refurbishing playground equipment and installing new safety ground cover.', 'Lincoln Community Park', '2026-11-15'),
(1, 'Wheelchair Ramp Construction', 'Building accessibility ramps for senior and mobility-impaired residents.', 'Oak Street Senior Center', '2026-11-22'),
(1, 'Habitat Family Home Restoration', 'Repairing insulation, roofing, and weatherization for low-income housing.', '142 Elm Street, Riverdale', '2026-12-05'),
(1, 'Youth Center Library Shelving', 'Constructing custom wooden bookshelves and study desks for children.', 'Downtown Youth Center', '2026-12-18'),
(1, 'Community Center Hall Painting', 'Interior and exterior painting, patching drywall, and freshening community space.', 'Eastside Civic Center', '2027-01-10');

-- GreenHarvest Growers (org_id: 2)
INSERT INTO project (organization_id, title, description, location, date) VALUES
(2, 'Urban Greenhouse Planting', 'Planting seasonal winter vegetables and herbs in community hydroponic beds.', 'Sunnyhills Rooftop Garden', '2026-11-12'),
(2, 'Community Garden Soil Preparation', 'Tilling soil, laying down organic compost, and weeding garden beds.', 'Highland Community Garden', '2026-11-20'),
(2, 'Fruit Orchard Tree Planting', 'Planting 50 native fruit trees to expand neighborhood food harvesting.', 'Pine Valley Nature Reserve', '2026-12-02'),
(2, 'Rainwater Harvesting Workshop & Setup', 'Installing rain collection barrels and gravity-fed drip irrigation lines.', 'Metro Urban Farm Hub', '2026-12-14'),
(2, 'Community Compost Bins Assembly', 'Constructing multi-tier wooden compost bins for neighborhood food waste.', 'Northside Urban Farm', '2027-01-15');

-- UnityServe Volunteers (org_id: 3)
INSERT INTO project (organization_id, title, description, location, date) VALUES
(3, 'Holiday Food Basket Assembly', 'Sorting and packing non-perishable nutritious food baskets for 200 families.', 'St. Jude Food Pantry', '2026-11-18'),
(3, 'Senior Companionship & Meal Delivery', 'Delivering warm meals and spending quality social time with elderly residents.', 'Maplewood Retirement Home', '2026-11-29'),
(3, 'Winter Blanket & Coat Drive', 'Collecting, sorting, and distributing winter warmth bundles to shelter guests.', 'City Hope Mission', '2026-12-08'),
(3, 'After-School STEM Mentoring', 'Tutoring middle school students in science experiments and mathematics.', 'Franklin Middle School Library', '2026-12-20'),
(3, 'Hygiene Care Kits Packing', 'Assembling essential personal care kits with toiletries for unhoused neighbors.', 'Central Community Hall', '2027-01-08');

-- ========================================
-- Insert Sample Data: Categories
-- ========================================
INSERT INTO category (name) VALUES
('Environmental & Sustainability'),
('Community Support & Food'),
('Education & Youth'),
('Construction & Housing'),
('Health & Senior Care');

-- ========================================
-- Insert Sample Data: Project Categories (N:M Relationships)
-- Every project belongs to at least one category
-- ========================================
INSERT INTO project_category (project_id, category_id) VALUES
-- BrightFuture Builders Projects
(1, 4), -- Community Playground Renovation -> Construction & Housing
(1, 3), -- Community Playground Renovation -> Education & Youth
(2, 4), -- Wheelchair Ramp Construction -> Construction & Housing
(2, 5), -- Wheelchair Ramp Construction -> Health & Senior Care
(3, 4), -- Habitat Family Home Restoration -> Construction & Housing
(4, 4), -- Youth Center Library Shelving -> Construction & Housing
(4, 3), -- Youth Center Library Shelving -> Education & Youth
(5, 4), -- Community Center Hall Painting -> Construction & Housing

-- GreenHarvest Growers Projects
(6, 1), -- Urban Greenhouse Planting -> Environmental & Sustainability
(6, 2), -- Urban Greenhouse Planting -> Community Support & Food
(7, 1), -- Community Garden Soil Preparation -> Environmental & Sustainability
(8, 1), -- Fruit Orchard Tree Planting -> Environmental & Sustainability
(8, 2), -- Fruit Orchard Tree Planting -> Community Support & Food
(9, 1), -- Rainwater Harvesting Workshop & Setup -> Environmental & Sustainability
(10, 1), -- Community Compost Bins Assembly -> Environmental & Sustainability

-- UnityServe Volunteers Projects
(11, 2), -- Holiday Food Basket Assembly -> Community Support & Food
(12, 2), -- Senior Companionship & Meal Delivery -> Community Support & Food
(12, 5), -- Senior Companionship & Meal Delivery -> Health & Senior Care
(13, 2), -- Winter Blanket & Coat Drive -> Community Support & Food
(14, 3), -- After-School STEM Mentoring -> Education & Youth
(15, 2), -- Hygiene Care Kits Packing -> Community Support & Food
(15, 5); -- Hygiene Care Kits Packing -> Health & Senior Care
