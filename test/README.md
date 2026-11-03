# Agent registration checks

Run the permission and registration tests from the backend directory:

    node test/agents-registration.test.cjs

Run the live API checks from the project root after Docker services are ready:

    docker compose exec -T backend node test/agents-registration.e2e.cjs

The live checks create temporary users, sessions, LGAs and wards in the configured database, then remove those exact fixtures in a finally block. They verify supervisor login, registration in the assigned LGA, rejection of other roles/LGAs/wards and existing emails, login by the new field agent, and the supervisor agent list.

# Member registration with images

Member registration upload checks, with the local PostgreSQL container running, from the backend directory:

    node test/supporter-registration.e2e.cjs

This starts an isolated Nest test server using the real multipart interceptor, DTO validation, role guard, services and PostgreSQL transactions. Only token verification and external Cloudinary calls are substituted; no images are sent to Cloudinary. It checks both oversized files, the exact 5 MB boundary, missing/empty/unsupported images, invalid form data, authentication/roles, inactive agents, first/second upload failures, database failure, cleanup, successful retry and duplicate protection. Temporary accounts and member records are deleted afterward. `TEST_DATABASE_*` variables override local database defaults; schema synchronization is disabled.

# Field-agent dashboard checks

From the backend directory:

    node test/field-agent-dashboard.test.cjs

Against the running Docker backend, from the project root:

    docker compose exec -T backend node test/field-agent-dashboard.e2e.cjs

The live checks create temporary field-agent accounts and member records, verify separate totals for agents in the same LGA, empty totals, ownership protection, and verification/rejection updates, then delete those fixtures and their sessions.

# Supervisor dashboard checks

From the backend directory:

    node test/supervisor-dashboard.test.cjs

Against Docker from the project root:

    docker compose exec -T backend node test/supervisor-dashboard.e2e.cjs

The live checks use temporary users, profiles and member records. They verify LGA boundaries, exclusion of supervisor/admin registrations, missing assignments, empty teams, status updates, agent reassignment, and personal field-agent counts. All test fixtures and sessions are removed afterward.

# Personal password-change checks

From the backend directory:

    node test/change-password.test.cjs

Against Docker from the project root:

    docker compose exec -T backend node test/change-password.e2e.cjs

The live checks create a temporary admin, have that admin create a supervisor, and have the supervisor create a field agent. They verify personal password changes for both roles, rejection of invalid passwords and other-account targets, old/new sign-ins and password hashing. Fixtures and sessions are removed afterward.
