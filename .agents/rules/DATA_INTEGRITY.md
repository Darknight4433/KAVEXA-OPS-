# ==================================================
# REAL DATA FIRST — ZERO FAKE CONTENT POLICY
# ==================================================

KAVEXA OPS is a real operations management system. The application must NEVER populate production UI with AI-generated, fictional, assumed or random information.

## STRICT RULES:

1. **NEVER invent users.**
   Do not generate names, avatars, emails, roles, founders, team members or identities.
   User identity must come from Firebase Authentication and the Firestore user profile.
   - `displayName` → actual Firebase user name
   - `email` → actual authenticated email
   - `photoURL` → actual profile image
   - `role` → user-defined Firestore profile field
   If a value is missing, show: "Not configured" with an appropriate action to add or configure it.

2. **NEVER invent projects.**
   Do not automatically create example projects. Projects must only appear when created by a user or when explicitly provided as development seed data.
   If no projects exist: Show a real empty state ("No projects yet").

3. **NEVER invent tasks.**
   Do not display fake assignments, fake deadlines, fake work, fake priorities or fake project tasks. All tasks must come from Firestore.
   If no tasks exist: Show: "No tasks found" and provide: "+ Add Task".

4. **NEVER invent academic information.**
   Do not generate random courses, homework, exams, problem sets, labs or deadlines. Study data must only be created by the authenticated user. Study data is private.
   If no study items exist: Show a private study empty state ("No upcoming academic work").

5. **NEVER invent analytics.**
   Do not display percentages, productivity scores, completion rates, trends, workload charts or statistics unless they are calculated from real application data.
   If insufficient data exists: Show: "Not enough data yet" and explain what activity is required before analytics can be generated.

6. **NEVER invent activity.**
   The activity timeline must only show real application events (Task created, Task completed, Project created, File uploaded, Document updated, Resource added). Each activity event must contain: actual user, actual timestamp, actual action, actual entity.

7. **NEVER invent deadlines.**
   A deadline must only exist if the user explicitly sets one. Do not automatically assign: Tomorrow, In 3 days, Next week. If no deadline exists: Show: "No deadline".

8. **NEVER invent team members.**
   The Team section must only display users who actually exist in the KAVEXA OPS team database. If the team contains one member: Show one member. Do not generate a second fictional founder.

9. **EMPTY STATES ARE REQUIRED.**
   Every major module must support: Empty state, Loading state, Error state, Offline state, Real data state. Never replace missing data with fake examples.

10. **DEVELOPMENT DEMO DATA**
    Demo or seed data is allowed ONLY when explicitly enabled through `DEMO_MODE = true`. Demo mode must be visually identifiable. Production mode (`DEMO_MODE = false`) must contain zero fictional data.

## CORE PRINCIPLE: THE UI MUST REPRESENT REALITY.
If the database is empty, the interface must honestly show that it is empty. KAVEXA OPS must never pretend that work, projects, users, tasks or activity exists when it does not.
