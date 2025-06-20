# recruitment-platform-backend
Backend service for the Recruitment Platform built with Node.js, Express, TypeORM, and PostgreSQL.

## Getting Started

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/yourusername/recruitment-platform-backend.git
cd recruitment-platform-backend
npm install
````

### 2. Setup Database and Environment Variables

* Copy the example environment file:

```bash
cp .env.example .env
```

* Edit the `.env` file to set your database connection details:

```
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_DATABASE=recruitment
DB_PORT=5432

JWT_SECRET = my-super-secret
```

Make sure these values match your local database setup.

* Run the database migrations:

```bash
npm run migration:run
```

### 3. Start the server

```bash
npm run start-server
```

---

## Notes

* The `.env` file is **not** included in the repository for security reasons.
* Use the `.env.example` file as a template to create your own `.env`.
