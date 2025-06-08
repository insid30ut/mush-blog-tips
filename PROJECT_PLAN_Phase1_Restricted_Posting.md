# Project Plan: Phase 1 - Restricted Posting

**Goal:** Ensure only a designated admin account can create new blog posts. Update and delete operations will retain their current logic (only original author can modify/delete their own posts).

**Method:** Use an admin identifier (email or User ID) stored in the `server/.env` file.

---

## 1. Backend Changes

### 1.1. Add Admin Identifier to `.env`
*   **File:** `server/.env`
*   **Action:** Add one of the following lines, replacing the placeholder with your actual admin user's email or MongoDB User `_id`.
    ```dotenv
    ADMIN_USER_EMAIL=your.admin.email@example.com
    # --- OR ---
    # ADMIN_USER_ID=yourmongodbuseridforadmin
    ```
    *   *(Implementation Note: The chosen variable name (`ADMIN_USER_EMAIL` or `ADMIN_USER_ID`) must be used consistently in the controller logic.)*

### 1.2. Update Post Controller Authorization Logic
*   **File:** `server/controllers/postController.js`
*   **Target Function:** `createPost`
*   **Logic:** Before the line `const post = new Post({...});` (or similar, where the new post object is created), insert the following authorization check. This assumes `req.user` is populated by the `protect` middleware.

    ```javascript
    // Inside createPost function, after req.body destructuring
    // Ensure you use the correct environment variable name and comparison
    // (e.g., req.user.email or req.user._id.toString())

    if (process.env.ADMIN_USER_EMAIL && req.user.email !== process.env.ADMIN_USER_EMAIL) {
      res.status(403); // Forbidden
      throw new Error('User not authorized to create posts');
    } else if (process.env.ADMIN_USER_ID && req.user._id.toString() !== process.env.ADMIN_USER_ID) {
      res.status(403); // Forbidden
      throw new Error('User not authorized to create posts');
    }
    // If neither ADMIN_USER_EMAIL nor ADMIN_USER_ID is set, or if user matches, proceed.
    // Consider adding a fallback or error if neither .env variable is set but restriction is expected.
    ```
    *   *(Note: The `updatePost` and `deletePost` functions will retain their existing logic, which restricts actions to the original post author. The admin, if also the author, can perform these actions. If the admin needs to override other authors, this logic would need further changes.)*

---

## 2. Frontend Changes

### 2.1. Make Admin Status Available in Auth Context
*   **Assumption:** The backend login response (`/api/users/login`) will be modified to include an `isBlogAdmin: true/false` flag in the user object if the logged-in user matches the admin identifier from `.env`.
*   **File:** `client/src/contexts/AuthContext.jsx` (or equivalent auth state management)
*   **Action:**
    *   Ensure the user object stored in the context upon login includes the `isBlogAdmin` flag.
    *   Provide this flag through the context value.

    ```javascript
    // Example modification in AuthContext
    // Assuming login API returns: { ..., email: '...', name: '...', token: '...', isBlogAdmin: true }
    // setUser({ ..., email, name, token, isBlogAdmin });
    // ...
    // return (
    //   <AuthContext.Provider value={{ user, login, logout, /* other values */ }}>
    //     {children}
    //   </AuthContext.Provider>
    // );
    ```

### 2.2. Conditionally Render "Create Post" UI
*   **Files:** Any client components that contain links/buttons to create a new post (e.g., `Navbar.jsx`, `DashboardPage.jsx`).
*   **Action:** Use the `isBlogAdmin` flag from the `AuthContext` to conditionally render these UI elements.

    ```jsx
    // Example in a React component
    import React from 'react';
    // import { useAuth } from './contexts/AuthContext'; // Adjust path as needed
    // import { Link } from 'react-router-dom';

    function NavigationBar() {
      // const { user } = useAuth(); // Assuming user object has isBlogAdmin

      return (
        <nav>
          {/* Other nav items */}
          {/* {user && user.isBlogAdmin && ( */}
          {/*   <Link to="/create-post">Create New Post</Link> */}
          {/* )} */}
        </nav>
      );
    }
    export default NavigationBar;
    ```
    *(Implementation Note: The exact structure of `AuthContext` and how `user.isBlogAdmin` is accessed might vary based on your existing implementation.)*

---

## 3. Server-Side Modification for `isBlogAdmin` Flag (During Login)

*   **File:** `server/controllers/userController.js`
*   **Target Function:** `authUser` (or your login controller function)
*   **Logic:** After successfully authenticating the user and fetching their details, compare the user's email/ID with the `ADMIN_USER_EMAIL`/`ADMIN_USER_ID` from `.env`. Add an `isBlogAdmin` property to the user object that is sent back to the client.

    ```javascript
    // Inside authUser function, after finding the user and matching password

    if (user && (await user.matchPassword(password))) {
      let isBlogAdmin = false;
      if (process.env.ADMIN_USER_EMAIL && user.email === process.env.ADMIN_USER_EMAIL) {
        isBlogAdmin = true;
      } else if (process.env.ADMIN_USER_ID && user._id.toString() === process.env.ADMIN_USER_ID) {
        isBlogAdmin = true;
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        // isAdmin: user.isAdmin, // If you have a general admin role already
        isBlogAdmin: isBlogAdmin, // Add this new flag
        token: generateToken(user._id),
      });
    } else {
      // ... existing error handling ...
    }
    ```

---

This plan outlines the core steps. Implementation will require careful attention to detail in each specified file.