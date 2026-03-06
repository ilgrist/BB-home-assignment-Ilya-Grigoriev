# Bug Reporter - Take-Home Assignment

## Quick Start

```bash
# Install dependencies
npm install

# Run both client and server
npm run dev
```

- **Client:** http://localhost:5173
- **Server:** http://localhost:4000

## Project Structure

```
bug-reporter-starter/
├── client/          # React + TypeScript (Vite)
│   └── src/
│       ├── api/     # API client
│       ├── pages/   # Page components
│       └── types/   # TypeScript types
└── server/          # Express + TypeScript
    ├── src/         # Server code
    └── uploads/     # Static uploads folder
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | Get all reports |
| POST | `/api/reports` | Create a new report |
| GET | `/api/health` | Health check |

## Data Model

```typescript
interface Report {
  id: string;
  issueType: string;
  description: string;
  contactName: string;
  contactEmail: string;
  status: 'NEW' | 'APPROVED' | 'RESOLVED';
  createdAt: number;
  approvedAt?: number;
  attachmentUrl: string;
}
```

## Environment Variables

Client `.env` (already configured):
```
VITE_API_BASE_URL=http://localhost:4000
```

## Performace issue (fixed)
### The issue: 
A deliberate, unnessesarily heavy calculation in the form validation method.

```
function validateField(value: string): string[] {
  ...

  const largeArray = Array.from({ length: 10000 }, (_, i) => `item-${i}-${value}`);

  for (let i = 0; i < 100; i++) {
    largeArray.sort(() => Math.random() - 0.5);
    largeArray.filter(item => item.includes(value.slice(0, 3)));
    largeArray.map(item => item.toUpperCase().toLowerCase());
  }

  ...
}
```
### Detection
I noticed it while refactoring the validation methods. It had no bearing on the code apart from making each form keystroke extremely resource heavy.

### Fix
I removed the unnessesary loop in order to reduce validation costs. I also added a debounce to the form fields in order to decrease validation frequency.

### Impact
Previously, the form lagged significantly.
It is now responsive.