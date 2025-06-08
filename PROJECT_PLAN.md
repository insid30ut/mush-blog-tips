# Project Plan: MycoHub (Evolving Mycology Blog & Shop)

## Phase 1: Foundational Blog (MVP - Minimum Viable Product)

*   **Goal:** Establish a functional blog with user accounts and rich text editing capabilities.
*   **Technology Stack:**
    *   **Frontend:** React (using Vite for a fast development environment), Tailwind CSS for styling.
    *   **Backend:** Node.js with Express.js (for creating RESTful APIs).
    *   **Database:** MongoDB.
    *   **Authentication:** JWT (JSON Web Tokens) for secure user sessions.
    *   **Rich Text Editor:** A library like `React-Quill` or `Slate.js`.
*   **Core Features:**
    1.  **User Management:**
        *   User registration (e.g., username, email, password)
        *   User login/logout
        *   Password hashing for security
    2.  **Blog Post Management (CRUD):**
        *   Create new blog posts (title, content from rich text editor, author linked to user)
        *   Read blog posts (list view and single post view)
        *   Update existing blog posts (only by the author or an admin)
        *   Delete blog posts (only by the author or an admin)
    3.  **Frontend:**
        *   Homepage displaying a list of recent blog posts.
        *   Individual page for each blog post.
        *   Login and registration pages.
        *   A dashboard or dedicated page for logged-in users to create/manage their posts.
*   **Proposed Directory Structure:**
    ```
    mush-blog-tips/
    ├── client/              # React Frontend (Vite + Tailwind CSS)
    │   ├── public/
    │   └── src/
    │       ├── assets/
    │       ├── components/      # Reusable UI components
    │       │   ├── auth/        # Login, Register forms
    │       │   ├── layout/      # Navbar, Footer
    │       │   └── posts/       # PostItem, PostForm, RichTextEditorWrapper
    │       ├── contexts/        # React Context for global state (e.g., AuthContext)
    │       ├── hooks/           # Custom React hooks
    │       ├── pages/           # Top-level page components (Home, PostDetail, Login, Register, Dashboard)
    │       ├── services/        # API call functions (e.g., authService.js, postService.js)
    │       ├── App.jsx
    │       ├── main.jsx
    │       └── index.css      # Main CSS, Tailwind directives here
    │   ├── tailwind.config.js # Tailwind configuration
    │   └── postcss.config.js  # PostCSS configuration (for Tailwind)
    ├── server/              # Node.js Backend
    │   ├── config/          # Database connection, environment variables
    │   ├── controllers/     # Request handling logic (authController.js, postController.js)
    │   ├── middleware/      # Custom middleware (e.g., authMiddleware.js for protecting routes)
    │   ├── models/          # Mongoose schemas (User.js, Post.js)
    │   ├── routes/          # API routes (authRoutes.js, postRoutes.js)
    │   └── server.js        # Main server entry point
    ├── .gitignore
    ├── package.json         # For managing both client and server scripts (e.g., using concurrently)
    └── README.md
    ```
*   **Deployment (Initial Thoughts):** Frontend on Vercel, Backend on Render.

## Phase 2: Evolving into an Information Hub

*   **Goal:** Expand beyond a simple blog to become a comprehensive mycology information resource.
*   **Potential Features:**
    *   Content Organization: Categories, tags.
    *   Mycology Database (species, search, filter).
    *   User Contributions (sightings, photos, moderation).
    *   Advanced Search.
    *   Enhanced User Profiles.

## Phase 3: Adding an Online Shop

*   **Goal:** Integrate e-commerce functionality.
*   **Potential Features:**
    *   Product Management (CRUD).
    *   Shopping Cart.
    *   Secure Checkout (Stripe/PayPal).
    *   Order Management.
    *   Inventory Tracking.

## High-Level Architecture Diagram (Phase 1)

```mermaid
graph TD
    A[User Browser] -- HTTP/S --> B{React Frontend (Vite + Tailwind CSS)};
    B -- API Calls --> C{Node.js/Express.js Backend};
    C -- CRUD Operations --> D[MongoDB Database];
    C -- Authentication --> D;

    subgraph Frontend (client/)
        B;
        E[Pages: Home, Post, Login, Dashboard];
        F[Components: Navbar, PostItem, RichTextEditor];
        G[Services: api.js];
        B --> E;
        E --> F;
        E --> G;
    end

    subgraph Backend (server/)
        C;
        H[Controllers: auth, posts];
        I[Models: User, Post];
        J[Routes: /api/auth, /api/posts];
        K[Middleware: authJWT];
        C --> H;
        H --> I;
        C --> J;
        J --> K;
        K --> H;
    end

    subgraph Database
        D;
    end