# 🟢 Moocho API

Moocho API is a Node.js/Express backend for managing user authentication via Google OAuth 2.0, movie tracking, and movie data retrieval. It uses Redis for session storage and caching.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)

---

## Features

- Google OAuth 2.0 authentication
- Redis-backed sessions
- User profile management
- Movie tracking (`watched`, `ratings`)
- Swagger UI documentation
- Responsive HTML root page with mascot
- Easily extendable routes for movies and users
- Data provided by TMDb API (https://www.themoviedb.org/)
---

## Technologies

- Node.js
- Express
- TypeScript
- Redis
- Passport.js
- Swagger (OpenAPI 3.1)
- Docker (optional)

---

## Installation

Clone the repository:

```bash
git clone https://github.com/andreoliveiraalves/moocho-api.git
cd moocho-api