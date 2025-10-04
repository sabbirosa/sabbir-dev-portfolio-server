import { env } from "../config/environment";
import { BlogModel } from "../models/Blog";
import { ProjectModel } from "../models/Project";
import { UserModel } from "../models/User.mongoose";
import { logger } from "../utils/logger";

/**
 * Seed initial admin user
 */
export const seedAdminUser = async (): Promise<void> => {
  try {
    // Check if admin user already exists
    const existingAdmin = await UserModel.findOne({ email: env.ADMIN_EMAIL });

    if (existingAdmin) {
      logger.info("Admin user already exists", { email: env.ADMIN_EMAIL });
      return;
    }

    // Create admin user
    const adminUser = await UserModel.create({
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      role: "admin",
    });

    logger.info("Admin user created successfully", {
      id: adminUser._id,
      email: adminUser.email,
    });
  } catch (error: any) {
    logger.error("Error seeding admin user", { error: error.message });
    throw error;
  }
};

/**
 * Seed sample blogs
 */
export const seedBlogs = async (): Promise<void> => {
  try {
    const blogCount = await BlogModel.countDocuments();

    if (blogCount > 0) {
      logger.info(`${blogCount} blogs already exist, skipping seed`);
      return;
    }

    const sampleBlogs = [
      {
        title: "Building a Modern Portfolio with React and Tailwind CSS",
        description:
          "Learn how to create a stunning developer portfolio using React, Tailwind CSS, and modern web development practices. This comprehensive guide covers everything from setup to deployment.",
        content: `# Building a Modern Portfolio with React and Tailwind CSS

In today's competitive tech landscape, having a well-designed portfolio is essential for developers. This guide will walk you through creating a modern, responsive portfolio using React and Tailwind CSS.

## Why React and Tailwind CSS?

React provides a component-based architecture that makes it easy to build and maintain complex UIs. Tailwind CSS offers utility-first styling that speeds up development and ensures consistency across your design.

## Getting Started

First, set up your React project:

\`\`\`bash
npx create-react-app my-portfolio
cd my-portfolio
npm install tailwindcss
\`\`\`

## Key Features to Include

1. **Hero Section** - Make a strong first impression
2. **Projects Showcase** - Display your best work
3. **Skills Section** - Highlight your technical abilities
4. **Contact Form** - Make it easy for people to reach you

## Best Practices

- Keep it simple and focused
- Ensure mobile responsiveness
- Optimize images and assets
- Include clear call-to-actions

## Conclusion

A well-crafted portfolio can open doors to new opportunities. Take time to polish it and keep it updated with your latest projects.`,
        date: new Date("2024-01-15"),
        readTime: "8 min read",
        tags: ["React", "Tailwind CSS", "Portfolio", "Web Development"],
        published: true,
      },
      {
        title: "Mastering State Management in React Applications",
        description:
          "Explore different state management solutions in React, from useState and useContext to Redux and Zustand. Understand when and how to use each approach effectively.",
        content: `# Mastering State Management in React Applications

State management is one of the most crucial aspects of building React applications. Let's explore various approaches and when to use each one.

## Local State with useState

The simplest form of state management is using the \`useState\` hook:

\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

Use this for:
- Simple component-level state
- Form inputs
- Toggle states

## Context API

For sharing state across components without prop drilling:

\`\`\`jsx
const ThemeContext = createContext();
\`\`\`

## Redux

For complex, large-scale applications with predictable state updates.

## Zustand

A lightweight alternative to Redux with a simpler API.

## Choosing the Right Tool

- **Small projects**: useState + useContext
- **Medium projects**: Zustand or Redux Toolkit
- **Large projects**: Redux with middleware

## Conclusion

Understanding these tools will help you build more maintainable React applications.`,
        date: new Date("2024-01-10"),
        readTime: "12 min read",
        tags: ["React", "State Management", "Redux", "Context API"],
        published: true,
      },
      {
        title: "Optimizing Performance in Next.js Applications",
        description:
          "Discover advanced techniques for optimizing Next.js applications, including image optimization, code splitting, and server-side rendering strategies for better user experience.",
        content: `# Optimizing Performance in Next.js Applications

Next.js provides many built-in optimizations, but knowing how to leverage them effectively is key to building fast, scalable applications.

## Image Optimization

Use the Next.js Image component:

\`\`\`jsx
import Image from 'next/image';

<Image src="/photo.jpg" width={500} height={300} alt="Description" />
\`\`\`

Benefits:
- Automatic resizing
- Lazy loading
- Modern formats (WebP)

## Code Splitting

Next.js automatically code-splits by page. For component-level splitting:

\`\`\`jsx
const DynamicComponent = dynamic(() => import('./Component'));
\`\`\`

## Server-Side Rendering Strategies

### Static Site Generation (SSG)
Use \`getStaticProps\` for pages that can be pre-rendered.

### Incremental Static Regeneration (ISR)
Update static content without rebuilding the entire site.

### Server-Side Rendering (SSR)
Use \`getServerSideProps\` for dynamic, user-specific content.

## Caching Strategies

Implement proper caching headers and use CDN effectively.

## Monitoring

Use tools like:
- Lighthouse
- Web Vitals
- Next.js Analytics

## Conclusion

Optimization is an ongoing process. Regularly monitor and improve your application's performance.`,
        date: new Date("2024-01-05"),
        readTime: "10 min read",
        tags: ["Next.js", "Performance", "Optimization", "Web Development"],
        published: true,
      },
    ];

    await BlogModel.insertMany(sampleBlogs);
    logger.info(`Seeded ${sampleBlogs.length} sample blogs`);
  } catch (error: any) {
    logger.error("Error seeding blogs", { error: error.message });
    throw error;
  }
};

/**
 * Seed sample projects
 */
export const seedProjects = async (): Promise<void> => {
  try {
    const projectCount = await ProjectModel.countDocuments();

    if (projectCount > 0) {
      logger.info(`${projectCount} projects already exist, skipping seed`);
      return;
    }

    const sampleProjects = [
      {
        title: "BUCC Portal",
        description:
          "Full-stack portal for BRAC University Computer Club (1500+ members, 33+ admins). Streamlined recruitment & events, RFID attendance via student IDs, and role-based dashboards.",
        image: "/images/projects/bucc-portal.png",
        liveLink: "https://bracucc.org",
        codeLink: "https://github.com/sabbirosa/bucc",
        year: "2024",
        techStack: [
          "React",
          "Tailwind CSS",
          "Node.js",
          "Express",
          "MongoDB",
          "JWT",
        ],
        challenges: [
          "Designing scalable role-based access across admin/member views",
          "RFID attendance integration and syncing with user profiles",
        ],
        improvements: [
          "Add audit logs and granular activity metrics",
          "Introduce background jobs for heavy report generation",
        ],
        featured: true,
        order: 1,
      },
      {
        title: "Uddyog",
        description:
          "Platform for social development events. SPA with JWT auth + Firebase login, event creation/filtering, reviews & participation tracking, theme toggle, and newsletter support.",
        image: "/images/projects/uddyog.png",
        liveLink: "https://uddyog.netlify.app",
        codeLink: "https://github.com/sabbirosa/uddyog-client",
        year: "2025",
        techStack: ["React", "Tailwind CSS", "Firebase", "Express", "MongoDB"],
        challenges: [
          "Coordinating Firebase auth with custom JWT for server endpoints",
          "Designing event filters and pagination for large datasets",
        ],
        improvements: [
          "Add server-side search and facets",
          "Implement optimistic UI for participation actions",
        ],
        featured: true,
        order: 2,
      },
      {
        title: "Cohabit",
        description:
          "Roommate-matching SPA by location, budget, and lifestyle. Secure auth (email + Google OAuth), protected routes, theme toggle, Swiper gallery, and mobile-first UI.",
        image: "/images/projects/cohabit.png",
        liveLink: "https://cohabit-sabbirosa.netlify.app",
        codeLink: "https://github.com/sabbirosa/cohabit-client",
        year: "2025",
        techStack: [
          "React",
          "Tailwind CSS",
          "Express",
          "MongoDB",
          "JWT",
          "OAuth",
        ],
        challenges: [
          "Balancing data privacy with search/match precision",
          "Implementing mobile-first matched list with lazy loading",
        ],
        improvements: [
          "Refine recommendation scoring with embeddings",
          "Add chat and safety tips modules",
        ],
        featured: true,
        order: 3,
      },
      {
        title: "Project R",
        description:
          "Donation management system with MySQL-backed REST API. Role-based dashboards, authentication, donation tracking, reporting, and easy local/remote deployment.",
        image: "/images/projects/project-r.png",
        liveLink: "https://project-r-sabbirosa.netlify.app/",
        codeLink: "https://github.com/sabbirosa/project-r-client",
        year: "2025",
        techStack: [
          "React",
          "Tailwind CSS",
          "Node.js",
          "Express",
          "MySQL",
          "JWT",
        ],
        challenges: [
          "Designing normalized schemas and efficient reporting queries",
          "Implementing secure role-specific dashboards",
        ],
        improvements: [
          "Add exportable analytics and scheduled reports",
          "Introduce webhooks for donation events",
        ],
        featured: false,
        order: 4,
      },
      {
        title: "Civix UI",
        description:
          "Accessible component library for e-government platforms (thesis). Standardizes UX for citizens with limited digital literacy; supports clearer flows and form guidance.",
        image: "/images/projects/civix-ui.png",
        liveLink: "https://civix-ui.vercel.app",
        codeLink: null,
        year: "2025",
        techStack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
        challenges: [
          "Adapting components for low digital literacy and accessibility",
          "Balancing design consistency with flexibility",
        ],
        improvements: [
          "Publish as a versioned NPM package",
          "Add i18n-ready content and RTL support",
        ],
        featured: false,
        order: 5,
      },
    ];

    await ProjectModel.insertMany(sampleProjects);
    logger.info(`Seeded ${sampleProjects.length} sample projects`);
  } catch (error: any) {
    logger.error("Error seeding projects", { error: error.message });
    throw error;
  }
};

/**
 * Main seed function
 */
export const seedAll = async (): Promise<void> => {
  try {
    await seedAdminUser();
    await seedBlogs();
    await seedProjects();
    logger.info("Database seeding completed successfully");
  } catch (error: any) {
    logger.error("Database seeding failed", { error: error.message });
    throw error;
  }
};
