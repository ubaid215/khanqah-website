my-lms-platform/
├── src/
│   ├── app/
│   │   ├── (main)/                          # Main website (public)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                     # Homepage
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx                 # Articles list
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx             # Single article
│   │   │   ├── books/
│   │   │   │   ├── page.tsx                 # Books library
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx             # Book details
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx                 # Courses catalog
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx             # Course details & enrollment
│   │   │   ├── qa/
│   │   │   │   ├── page.tsx                 # Q&A list
│   │   │   │   ├── ask/
│   │   │   │   │   └── page.tsx             # Ask question form
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx             # Question & answers
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   │
│   │   ├── dashboard/                       # User Dashboard (protected)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                     # Dashboard overview
│   │   │   ├── my-courses/
│   │   │   │   ├── page.tsx                 # Enrolled courses
│   │   │   │   └── [courseId]/
│   │   │   │       ├── page.tsx             # Course content & video player
│   │   │   │       └── lesson/
│   │   │   │           └── [lessonId]/
│   │   │   │               └── page.tsx     # Individual lesson viewer
│   │   │   ├── certificates/
│   │   │   │   └── page.tsx
│   │   │   ├── bookmarks/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/                           # Admin Dashboard (protected)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                     # Admin overview & stats
│   │   │   ├── courses/
│   │   │   │   ├── page.tsx                 # Manage courses
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx             # Edit course
│   │   │   │       └── lessons/
│   │   │   │           ├── page.tsx         # Manage lessons
│   │   │   │           └── [lessonId]/
│   │   │   │               └── page.tsx     # Edit lesson
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx                 # Manage articles
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx             # Edit article
│   │   │   ├── books/
│   │   │   │   ├── page.tsx                 # Manage books
│   │   │   │   ├── create/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx             # Edit book
│   │   │   ├── qa/
│   │   │   │   └── page.tsx                 # Moderate Q&A
│   │   │   └── users/
│   │   │       ├── page.tsx                 # Manage users
│   │   │       └── [id]/
│   │   │           └── page.tsx             # User details
│   │   │
│   │   ├── auth/                            # Authentication routes
│   │   │   ├── signin/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/                             # API routes
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts             # NextAuth configuration
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   └── signout/
│   │   │   │       └── route.ts
│   │   │   ├── courses/
│   │   │   │   ├── route.ts                 # GET all, POST create
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts             # GET, PUT, DELETE
│   │   │   │   └── [id]/enroll/
│   │   │   │       └── route.ts             # POST enrollment
│   │   │   ├── lessons/
│   │   │   │   ├── route.ts
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── [id]/complete/
│   │   │   │       └── route.ts             # POST mark as completed
│   │   │   ├── articles/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── books/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── qa/
│   │   │   │   ├── questions/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   └── answers/
│   │   │   │       ├── route.ts
│   │   │   │       └── [id]/
│   │   │   │           └── route.ts
│   │   │   ├── progress/
│   │   │   │   └── route.ts                 # Track video progress
│   │   │   └── upload/
│   │   │       └── route.ts                 # File upload handler
│   │   │
│   │   ├── layout.tsx                       # Root layout
│   │   ├── globals.css                      # Global styles + Tailwind
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── avatar.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── header.tsx                   # Main site header
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx                  # Dashboard sidebar
│   │   │   └── admin-sidebar.tsx            # Admin sidebar
│   │   │
│   │   ├── course/
│   │   │   ├── course-card.tsx
│   │   │   ├── course-grid.tsx
│   │   │   ├── lesson-list.tsx
│   │   │   ├── video-player.tsx
│   │   │   └── progress-tracker.tsx
│   │   │
│   │   ├── article/
│   │   │   ├── article-card.tsx
│   │   │   └── article-list.tsx
│   │   │
│   │   ├── book/
│   │   │   ├── book-card.tsx
│   │   │   └── book-list.tsx
│   │   │
│   │   ├── qa/
│   │   │   ├── question-card.tsx
│   │   │   └── answer-form.tsx
│   │   │
│   │   └── forms/
│   │       ├── course-form.tsx
│   │       ├── lesson-form.tsx
│   │       ├── article-form.tsx
│   │       └── book-form.tsx
│   │
│   ├── lib/
│   │   ├── db.ts                            # PostgreSQL connection (Prisma client)
│   │   ├── auth.ts                          # Auth utilities & NextAuth config
│   │   ├── utils.ts                         # Helper functions
│   │   └── validations.ts                   # Zod schemas for validation
│   │
│   ├── types/
│   │   ├── index.ts                         # Shared types
│   │   ├── course.ts
│   │   ├── user.ts
│   │   ├── article.ts
│   │   ├── book.ts
│   │   └── qa.ts
│   │
│   ├── hooks/
│   │   ├── use-user.ts                      # Current user hook
│   │   ├── use-course-progress.ts           # Track course progress
│   │   └── use-toast.ts                     # Toast notifications
│   │
│   └── middleware.ts                        # Auth & route protection
│
├── prisma/
│   ├── schema.prisma                        # Database schema
│   ├── migrations/                          # Migration files
│   └── seed.ts                              # Database seeding
│
├── public/
│   ├── images/
│   ├── videos/                              # Placeholder (use cloud storage)
│   └── uploads/
│
├── .env                                     # Environment variables
├── .env.example
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md