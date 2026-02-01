Role: Act as a Senior Fullstack Web Developer specialized in Progressive Web Apps (PWA).

Project Context: Build a PWA named "Sistem Informasi Pendataan SDM GMIT Emaus Liliba". This system collects professional data from church congregation members to create a "Human Resource Bank" for church service optimization and economic empowerment.

Tech Stack Requirements:

Frontend: React.js / Vue.js (choose best for PWA), Tailwind CSS (for minimalist/fun UI), Leaflet.js (OpenStreetMaps).

Backend: Node.js / Firebase / Supabase (choose best for scalability).

Charts: Chart.js or Recharts.

Detailed Feature Requirements:

1. Public Landing Page & Form (PWA):

Design: Minimalist, user-friendly, clean typography.

Sections: Hero (Info about Church), About Program (Purpose/Goals), Contact Us.

Action: A prominent "Isi Data Jemaat" button linking to the form.

Form Logic (The Form must be broken into 4 logical sections/steps):

Identitas: Name, Gender, DOB (Auto-calculate Age), Phone (Validation: starts with '08', max 13 digits, numeric only), Address (Long text + OpenStreetMap Pin Point picker default view: Kupang City), Sector (Dropdown), Lingkungan (1-7), Rayon (1-20).

Profil Profesional: Education (Dropdown SD-S3), Major, Job Category (KBJI Standard), Specific Job Title, Company/Instance, Years of Experience, Technical Skills (Textarea with placeholder examples).

Komitmen: Willingness to serve (Radio: Active/On-demand), Interest Areas (Checkbox: Health, Education, Social, etc.), Contribution Type (Checkbox: Consult, Mentor, Tech Support, etc.).

Persetujuan: Privacy disclaimer text and a "Validate Data" checkbox.

2. Admin Dashboard (Protected Route):

Dashboard Widgets:

Total Data Count.

Pie Charts: Gender, Age Group, Sector, Willingness to Serve, Interest Areas.

Histogram: Education Level, Years of Experience, Lingkungan/Rayon Stats.

Map: Leaflet Map showing distribution points of members.

Top 3 Job Categories card.

Data Management:

Table with Search, Sort, and Filter per column.

Export Data button (CSV/Excel).

Actions: View Detail, Delete (with confirmation modal).

Settings/CMS:

Edit Landing Page text content.

Add/Remove Form Fields capability.

Admin User Management (CRUD).