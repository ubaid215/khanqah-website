// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create Super Admin
  const superAdminPassword = await hash("SuperAdmin@123", 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@lms.com" },
    update: {},
    create: {
      email: "superadmin@lms.com",
      username: "superadmin",
      password: superAdminPassword,
      name: "Super Administrator",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Super Admin created:", superAdmin.email);

  // Create Regular Admin
  const adminPassword = await hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@lms.com" },
    update: {},
    create: {
      email: "admin@lms.com",
      username: "admin",
      password: adminPassword,
      name: "Administrator",
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create Demo User
  const userPassword = await hash("User@123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@lms.com" },
    update: {},
    create: {
      email: "user@lms.com",
      username: "demouser",
      password: userPassword,
      name: "Demo User",
      role: "USER",
      status: "ACTIVE",
      emailVerified: new Date(),
    },
  });
  console.log("✅ Demo User created:", user.email);

  // Create Sample Categories
  const categories = [
    { name: "Web Development", slug: "web-development", icon: "💻" },
    { name: "Mobile Development", slug: "mobile-development", icon: "📱" },
    { name: "Data Science", slug: "data-science", icon: "📊" },
    { name: "Design", slug: "design", icon: "🎨" },
    { name: "Business", slug: "business", icon: "💼" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log("✅ Categories created");

  // Create Sample Course
  const webDevCategory = await prisma.category.findUnique({
    where: { slug: "web-development" },
  });

  if (webDevCategory) {
    const course = await prisma.course.upsert({
      where: { slug: "nextjs-fundamentals" },
      update: {},
      create: {
        title: "Next.js Fundamentals",
        slug: "nextjs-fundamentals",
        description: "Learn Next.js from scratch and build modern web applications.",
        shortDesc: "Master Next.js framework",
        level: "BEGINNER",
        status: "PUBLISHED",
        isPublished: true,
        isFree: true,
        duration: 180,
        publishedAt: new Date(),
        categories: {
          create: {
            categoryId: webDevCategory.id,
          },
        },
      },
    });
    console.log("✅ Sample Course created:", course.title);

    // Create Module for the course
    const module = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "Introduction to Next.js",
        description: "Get started with Next.js basics",
        order: 1,
      },
    });
    console.log("✅ Sample Module created:", module.title);

    // Create Lessons
    await prisma.lesson.createMany({
      data: [
        {
          moduleId: module.id,
          title: "What is Next.js?",
          description: "Introduction to Next.js framework",
          type: "VIDEO",
          duration: 600,
          order: 1,
          isFree: true,
        },
        {
          moduleId: module.id,
          title: "Setting up your environment",
          description: "Install Node.js and create your first Next.js app",
          type: "VIDEO",
          duration: 900,
          order: 2,
          isFree: true,
        },
        {
          moduleId: module.id,
          title: "Understanding File-based Routing",
          description: "Learn how routing works in Next.js",
          type: "VIDEO",
          duration: 1200,
          order: 3,
          isFree: false,
        },
      ],
    });
    console.log("✅ Sample Lessons created");
  }

  // Create Sample Article
  await prisma.article.upsert({
    where: { slug: "introduction-to-lms" },
    update: {},
    create: {
      title: "Introduction to Learning Management Systems",
      slug: "introduction-to-lms",
      excerpt: "Discover the power of modern LMS platforms",
      content: `
        <h2>What is an LMS?</h2>
        <p>A Learning Management System (LMS) is a software application for the administration, documentation, tracking, reporting, automation, and delivery of educational courses, training programs, or learning and development programs.</p>
        
        <h2>Key Features</h2>
        <ul>
          <li>Course Management</li>
          <li>Progress Tracking</li>
          <li>User Management</li>
          <li>Certification</li>
        </ul>
      `,
      status: "PUBLISHED",
      readTime: 5,
      publishedAt: new Date(),
    },
  });
  console.log("✅ Sample Article created");

  // Create Sample Book
  await prisma.book.upsert({
    where: { slug: "complete-web-development-guide" },
    update: {},
    create: {
      title: "Complete Web Development Guide",
      slug: "complete-web-development-guide",
      description: "A comprehensive guide to modern web development",
      author: "Institute Team",
      status: "PUBLISHED",
      pages: 350,
      publishedAt: new Date(),
    },
  });
  console.log("✅ Sample Book created");

  // Create Tags
  const tags = [
    { name: "JavaScript", slug: "javascript" },
    { name: "TypeScript", slug: "typescript" },
    { name: "React", slug: "react" },
    { name: "Next.js", slug: "nextjs" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log("✅ Tags created");

  console.log("\n🎉 Database seeding completed!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📧 Login Credentials:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Super Admin:");
  console.log("  Email: superadmin@lms.com");
  console.log("  Password: SuperAdmin@123");
  console.log("\nAdmin:");
  console.log("  Email: admin@lms.com");
  console.log("  Password: Admin@123");
  console.log("\nDemo User:");
  console.log("  Email: user@lms.com");
  console.log("  Password: User@123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
