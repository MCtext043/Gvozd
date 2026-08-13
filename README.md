# Frontend — СЦ «Гвоздь»

Next.js App Router (TypeScript) + Tailwind CSS.

## Быстрый старт

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

API по умолчанию: `http://localhost:8000/api/v1` (`NEXT_PUBLIC_API_URL`).

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер |
| `npm run build` | Production build (standalone) |
| `npm start` | Запуск production |
| `npm test` | Vitest |
| `npm run test:e2e` | Playwright smoke |
| `npm run lint` | ESLint |

## Docker

```bash
docker build -t gvozd-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://host.docker.internal:8000/api/v1 gvozd-frontend
```

Образ использует `output: "standalone"`.
