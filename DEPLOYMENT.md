# Deployment Instructions for InfinityFree

## Frontend Deployment

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to root directory:**
   - Upload all files from `frontend/dist/` to root directory (`htdocs/`)
   - Upload `.htaccess` file to root directory
   - Structure should be:
     ```
     htdocs/
     ├── .htaccess          (for React Router)
     ├── index.html
     ├── assets/
     └── backend/           (backend folder)
     ```

## Backend Deployment

1. **Upload backend files:**
   - Upload entire `backend/` folder to `htdocs/backend/`
   - Structure should be:
     ```
     htdocs/backend/
     ├── public/
     │   └── index.php
     ├── controllers/
     ├── vendor/
     └── logs/            (will be created automatically)
     ```

2. **Database credentials are hardcoded in `Database.php`:**
   ```php
   'sql100.infinityfree.com'
   'if0_40454816_react_ecommerce'
   'if0_40454816'
   'jZIUca1TPR6obVr'
   ```

3. **Run database migration:**
   - Upload `backend/database/ecommerce.sql` via phpMyAdmin
   - Or run `backend/database/migration.php` once

## Logs

Logs are created in:
- `backend/logs/graphql.log` - GraphQL requests/responses
- `backend/logs/database.log` - Database connection attempts

View logs:
```bash
tail -f backend/logs/graphql.log
tail -f backend/logs/database.log
```

## URLs

- Frontend: `https://tesk-task.xo.je/`
- GraphQL API: `https://tesk-task.xo.je/backend/public/index.php`
- Category pages: `https://tesk-task.xo.je/all`, `/clothes`, `/tech`
- Product pages: `https://tesk-task.xo.je/tech/apple-airtag`

## Troubleshooting

### 500 Internal Server Error on product pages
- Make sure `.htaccess` is in root directory
- Check that `mod_rewrite` is enabled

### Database connection errors
- Check logs in `backend/logs/database.log`
- Verify credentials in `Database.php`

### CORS errors
- Check `backend/public/index.php` has correct allowed origins
- Check logs in `backend/logs/graphql.log`
