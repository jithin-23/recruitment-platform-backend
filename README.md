# recruitment-platform-backend

Backend service for the Recruitment Platform built with Node.js, Express, TypeORM, and PostgreSQL.

## Related Repositories

- **Frontend**: [KV_PROJECT_FE](https://github.com/KiranBabu007/KV_PROJECT_FE) – Web interface for the recruitment platform.
- **AI Service**: [Resume Screening Service](https://github.com/CheerfulPianissimo/resume-screening-service) – Intelligent resume screening using AI.

---

## Getting Started

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/yourusername/recruitment-platform-backend.git
cd recruitment-platform-backend
npm install
````

### 2. Set up the Database and Environment Variables

* Create a new PostgreSQL database.
  The name of the database should match the value you set in the `.env` file under `DB_DATABASE`.

* Copy the example environment file:

```bash
cp .env.example .env
```

* Edit the `.env` file to configure your database connection:

```
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_DATABASE=recruitment
DB_PORT=5432

JWT_SECRET=my-super-secret
```

> Ensure these values match your local database setup.

* Run database migrations:

```bash
npm run migration:run
```

### 3. Start the Server

```bash
npm run start-server
```

---

## Notes

* The `.env` file is **not** included in the repository for security reasons.
* Use the `.env.example` file as a template to create your own `.env`.
