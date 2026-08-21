export interface Qualification {
  id: string;
  type: "education" | "experience" | "certification";
  title: string;       // e.g. "BSc (Hons) Software Engineering"
  organization: string; // e.g. "University of Colombo School of Computing"
  location?: string;
  startDate: string;    // "2021-01"
  endDate?: string;     // "2025-06" or empty for "Present"
  description?: string;
  order: number;
}

export interface Activity {
  id: string;
  category: string;     // e.g. "Photography", "Graphic Design", "Volunteering"
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description?: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
  impact?: string[];        // e.g. ["Reduced load time by 40%", "Handled 500+ concurrent test cases"]
  architectureImage?: string; // URL to a diagram image
  challenges?: string; 
}

export interface ResumeMeta {
  fileName: string;
  url: string;
  uploadedAt: string;
  size: number;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  email: string;
  location: string;
  photoUrl?: string;
  socials: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface PortfolioData {
  profile: Profile;
  qualifications: Qualification[];
  activities: Activity[];
  projects: Project[];
  resume: ResumeMeta | null;
  skills: Skill[];    
}

export interface Skill {
  id: string;
  category: string; // e.g. "Languages", "Frameworks", "Databases", "Tools", "Testing"
  items: string[];  // e.g. ["JavaScript", "TypeScript", "PHP"]
  order: number;
}
