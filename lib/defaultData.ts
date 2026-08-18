import { PortfolioData } from "./types";

// Sample data — replace every field with your own details.
// This is exactly what a first-time visitor to the admin dashboard will see
// as a starting point, so it doubles as a template.
export const defaultData: PortfolioData = {
  profile: {
    name: "Alex Perera",
    role: "Software Engineer & Visual Creator",
    tagline: "I build software by day, and frame the world by aperture and layer by night.",
    bio: "I'm a software engineer who splits attention between shipping products and chasing light with a camera. This site is a contact sheet of both sides: the code I've written and the frames I've shot, developed side by side.",
    email: "hello@example.com",
    location: "Colombo, Sri Lanka",
    photoUrl: "",
    socials: {
      github: "https://github.com/yourusername",
      linkedin: "https://linkedin.com/in/yourusername",
      instagram: "https://instagram.com/yourusername",
      facebook: "https://facebook.com/yourusername",
    },
  },
  qualifications: [
    {
      id: "q1",
      type: "education",
      title: "BSc (Hons) in Software Engineering",
      organization: "Example University",
      location: "Colombo, Sri Lanka",
      startDate: "2021-01",
      endDate: "2025-06",
      description:
        "Focused on distributed systems and human-computer interaction. Final year project: a real-time computer-vision app for posture tracking.",
      order: 1,
    },
    {
      id: "q2",
      type: "experience",
      title: "Software Engineer",
      organization: "Example Tech Pvt Ltd",
      location: "Colombo, Sri Lanka",
      startDate: "2025-07",
      endDate: "",
      description:
        "Building and testing features for a logistics and order-management platform used by regional clients.",
      order: 2,
    },
    {
      id: "q3",
      type: "certification",
      title: "AWS Certified Cloud Practitioner",
      organization: "Amazon Web Services",
      location: "",
      startDate: "2024-03",
      endDate: "",
      description: "Foundational certification covering core AWS services and cloud architecture.",
      order: 3,
    },
  ],
  activities: [
    {
      id: "a1",
      category: "Photography",
      title: "Street & Documentary Photography",
      description:
        "Shooting street life and everyday moments around Colombo on a 35mm prime lens. Featured in a local group exhibition, 2024.",
      imageUrl: "",
      link: "https://instagram.com/yourusername",
      order: 1,
    },
    {
      id: "a2",
      category: "Graphic Design",
      title: "Brand & Poster Design",
      description:
        "Freelance poster and social-media brand kits for small businesses and university events.",
      imageUrl: "",
      link: "https://behance.net/yourusername",
      order: 2,
    },
    {
      id: "a3",
      category: "Volunteering",
      title: "Tech Mentor, Local Coding Club",
      description: "Weekend mentor teaching web fundamentals to first-year students.",
      imageUrl: "",
      link: "",
      order: 3,
    },
  ],
  projects: [
    {
      id: "p1",
      title: "PoseTrace",
      summary: "Real-time webcam pose detection app built with Next.js and MediaPipe.",
      description:
        "A browser-based tool that tracks body posture live from a webcam feed and gives real-time correction cues. Built to explore computer vision in the browser without a backend.",
      techStack: ["Next.js", "TypeScript", "MediaPipe", "Tailwind CSS"],
      githubUrl: "https://github.com/yourusername/posetrace",
      liveUrl: "",
      imageUrl: "",
      featured: true,
      order: 1,
    },
    {
      id: "p2",
      title: "Contact Sheet",
      summary: "This very portfolio site — a Next.js app with a custom admin dashboard.",
      description:
        "A personal portfolio with a built-in admin panel for managing qualifications, extracurricular work, and projects, plus resume upload and download.",
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel KV", "Vercel Blob"],
      githubUrl: "https://github.com/yourusername/portfolio",
      liveUrl: "",
      imageUrl: "",
      featured: true,
      order: 2,
    },
    {
      id: "p3",
      title: "Order Tracker Widget",
      summary: "A small embeddable widget for tracking order status across couriers.",
      description:
        "A lightweight embeddable widget that polls a courier API and renders order status with a simple timeline UI.",
      techStack: ["React", "Node.js"],
      githubUrl: "https://github.com/yourusername/order-tracker-widget",
      liveUrl: "",
      imageUrl: "",
      featured: false,
      order: 3,
    },
  ],
  resume: null,
};
