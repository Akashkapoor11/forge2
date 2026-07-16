# Backend scaffold (Laravel)

This folder is a **drop-in scaffold**, not a full Laravel install — migrations,
models, controllers, and routes are hand-written and ready to use, but the
Laravel framework skeleton itself (the `vendor/`, `bootstrap/`, `artisan`
core files, etc.) needs to come from a real `composer create-project`, since
this build environment's network can't reach packagist.org to install it.

## Set up in ~2 minutes

```bash
composer create-project laravel/laravel backend-fresh
```

Then copy these folders from this scaffold into `backend-fresh/`, overwriting
nothing that already exists there:

```
app/Models/          → backend-fresh/app/Models/
app/Http/Controllers/ → backend-fresh/app/Http/Controllers/
database/migrations/ → backend-fresh/database/migrations/
routes/api.php        → backend-fresh/routes/api.php
tests/Feature/        → backend-fresh/tests/Feature/
.env.example          → backend-fresh/.env.example (merge, don't overwrite)
```

Rename `backend-fresh` to `backend`, then:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# SQLite — zero setup
touch database/database.sqlite
# in .env: DB_CONNECTION=sqlite, comment out DB_HOST/DB_PORT/DB_DATABASE etc.

php artisan migrate
php artisan test
php artisan serve
```

The API will be live at `http://localhost:8000/api`. Point the frontend's
`VITE_API_BASE_URL` at that, then swap `frontend/src/data/api.js` over to the
commented-out `fetch()` calls (each function already has the exact route
shape it expects).

## Routes (see `routes/api.php`)

| Method | Route | Action |
|---|---|---|
| GET/POST | `/api/boards` | list / create boards |
| DELETE | `/api/boards/{board}` | delete a board |
| GET/POST | `/api/boards/{board}/lists` | list / create lists |
| PATCH/DELETE | `/api/lists/{list}` | rename / delete a list |
| GET/POST | `/api/boards/{board}/cards` | list / create cards |
| PATCH | `/api/cards/{card}` | update a card (title, description, tags, member, due date) |
| PATCH | `/api/cards/{card}/move` | move a card to another list/position |
| DELETE | `/api/cards/{card}` | delete a card |
| POST | `/api/cards/{card}/comments` | add a comment |
| GET/POST | `/api/members` | list / create members |
| GET/POST | `/api/tags` | list / create tags |
