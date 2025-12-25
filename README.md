# Simpli - Insurance Landing Page

This is a Next.js project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Features

- **Mobile First:** Optimized for mobile devices.
- **Fast Loading:** Static generation and optimized assets.
- **Internationalization (i18n):** Supports German (de), English (en), French (fr), and Italian (it).
- **Azure Table Storage:** Leads are saved to Azure Table Storage.
- **Tailwind CSS:** Styled with Tailwind CSS.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

### Azure Table Storage

Create a `.env.local` file in the root directory and add your Azure Storage connection string:

```env
AZURE_STORAGE_CONNECTION_STRING="your_connection_string"
AZURE_TABLE_NAME="SimpliLeads"
```

For local development, you can use the Azure Storage Emulator (Azurite) with the connection string `UseDevelopmentStorage=true`.

### Internationalization

Translations are stored in the `messages` directory.
- `de.json` (German - Default)
- `en.json` (English)
- `fr.json` (French)
- `it.json` (Italian)

## Project Structure

- `src/app/[locale]`: Localized pages.
- `src/components`: React components (e.g., `MultiStepForm`).
- `src/lib`: Utility functions (e.g., Azure Table client).
- `src/i18n`: Internationalization configuration.
- `messages`: Translation files.
