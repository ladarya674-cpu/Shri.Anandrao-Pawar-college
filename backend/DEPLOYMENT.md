# Backend security configuration

Set these environment variables on the backend host before deployment:

```text
ADMIN_USERNAME=choose-a-private-admin-username
ADMIN_PASSWORD=use-a-long-unique-password
ADMIN_SESSION_SECRET=generate-a-long-random-secret
FRONTEND_ORIGIN=https://your-netlify-site.netlify.app
```

The admin password is no longer stored in the frontend. The backend issues an
8-hour signed session token after a successful login. The following routes
require that token:

- `GET /api/enquiries`
- `PATCH /api/enquiries/:id/read`
- `DELETE /api/enquiries/:id`
- `POST /api/notices`
- `DELETE /api/notices/:id`

Public visitors can still use `GET /api/notices` and `POST /api/enquiries`.

Never commit real environment values to the repository. On Netlify, the
frontend must proxy `/api` to the deployed backend, or the frontend API base
URL must be configured to point to that backend.