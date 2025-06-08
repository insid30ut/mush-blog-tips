# Project File Cleanup and Vercel Deployment Preparation Plan

This document outlines the plan to remove unnecessary files, review configurations, and prepare the project for Vercel deployment.

## Phase 1: Initial File Cleanup (Completed)

*   **Action**: User manually removed `server/package-lock.json`.
*   **Status**: Completed.

## Phase 2: Configuration Review (Partially Completed)

*   **`client/eslint.config.js`**: Reviewed. Deemed essential and well-configured. No changes planned.
*   **`client/postcss.config.cjs`**: Reviewed. Deemed essential and correctly set up for Tailwind CSS. No changes planned.
*   **Status**: Paused to focus on overall Vercel deployment structure. Remaining client config files (`tailwind.config.js`, `vite.config.js`) can be reviewed later if needed, but current focus is on deployment structure.

## Phase 3: Vercel Deployment Preparation - Actions

This phase details the specific file creations, modifications, and deletions required to make the project Vercel-ready.

1.  **Create Root `.gitignore` File**:
    *   **Goal**: Ensure sensitive files and unnecessary build artifacts/dependencies are not committed to Git.
    *   **Action**: Create a `.gitignore` file in the project root.
    *   **Proposed Content**:
        ```gitignore
        # Dependencies
        /node_modules
        /client/node_modules
        /server/node_modules

        # Environment variables
        .env
        *.env
        .env.*
        !.env.example
        !.env.template

        # Build output
        /dist
        # client/dist is handled by client/.gitignore, but this is a good general rule
        # /server/dist (if server ever has a build step)

        # Logs
        logs
        *.log
        npm-debug.log*
        yarn-debug.log*
        yarn-error.log*
        pnpm-debug.log*
        lerna-debug.log*

        # OS generated files
        .DS_Store
        .DS_Store?
        ._*
        .Spotlight-V100
        .Trashes
        ehthumbs.db
        Thumbs.db

        # Editor directories and files
        .vscode/*
        !.vscode/extensions.json
        !.vscode/settings.json
        .idea
        *.suo
        *.ntvs*
        *.njsproj
        *.sln
        *.sw?

        # Optional: Vercel build output directory
        .vercel

        # Optional: Coverage directory
        coverage
        ```

2.  **Create `vercel.json` Configuration File**:
    *   **Goal**: Provide explicit deployment instructions to Vercel for builds and routing.
    *   **Action**: Create a `vercel.json` file in the project root.
    *   **Proposed Content**:
        ```json
        {
          "version": 2,
          "builds": [
            {
              "src": "server/server.js",
              "use": "@vercel/node"
            },
            {
              "src": "client/package.json",
              "use": "@vercel/static-build",
              "config": {
                "outputDirectory": "dist",
                "buildCommand": "yarn build",
                "rootDirectory": "client"
              }
            }
          ],
          "rewrites": [
            {
              "source": "/api/(.*)",
              "destination": "/server/server.js"
            },
            {
              "source": "/((?!api/).*)",
              "destination": "/client/index.html"
            }
          ]
        }
        ```

3.  **Create `server/.env.example` File**:
    *   **Goal**: Document required environment variables for the server and facilitate setup.
    *   **Action**: Create a `server/.env.example` file in the `server/` directory.
    *   **Proposed Content**:
        ```
        NODE_ENV=development
        PORT=5000
        MONGO_URI="your_mongodb_connection_string_here"
        JWT_SECRET="your_super_secret_jwt_token_key_here_at_least_32_characters"
        ADMIN_USER_EMAIL="admin_user_email@example.com"
        ```

4.  **Modify `server/server.js` for Vercel**:
    *   **Goal**: Adapt the Express server for Vercel's serverless environment.
    *   **Action**:
        *   Comment out or remove the `app.listen(...)` block.
        *   Add `module.exports = app;` at the end of the file.

5.  **Modify Root `package.json`**:
    *   **Goal**: Remove potentially unnecessary local Vercel CLI dependency.
    *   **Action**: Remove the `"vercel": "^42.3.0"` line from the `dependencies` section.

6.  **Delete `Procfile`**:
    *   **Goal**: Remove file not used by Vercel.
    *   **Action**: Delete the `Procfile` from the project root.

7.  **Environment Variables on Vercel (Reminder)**:
    *   **Note**: Actual secret values from `server/.env` (e.g., `MONGO_URI`, `JWT_SECRET`) must be manually configured in the Vercel project dashboard under "Environment Variables." They should not be committed to Git.

## Implementation Next Steps

*   Confirm this updated plan.
*   Request a switch to "Code" mode to implement all actions listed in Phase 3.

## Process Flow Diagram (Simplified for Vercel Prep)

```mermaid
graph TD
    A[Start Vercel Prep] --> B(Create root .gitignore);
    B --> C(Create vercel.json);
    C --> D(Create server/.env.example);
    D --> E(Modify server/server.js);
    E --> F(Modify root package.json);
    F --> G(Delete Procfile);
    G --> H{All File Changes Planned};
    H -- Yes --> I(Switch to Code Mode for Implementation);
    I --> J[Implement Changes];
    J --> K[Test Deployment on Vercel];
    K --> L[End];