# POSApp

React Native point of sale application.

## Setup

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.example .env
```

`API_URL` is used by the main API axios client, and `API_URL_TENANT` is used by the tenant URL axios client.

## Run

Start Metro:

```bash
npm start
```

Run Android:

```bash
npm run android
```

Run iOS:

```bash
npm run ios
```

After changing `.env`, restart Metro so the new values are bundled.
