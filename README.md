![Supabase image generator with Kobble](https://firebasestorage.googleapis.com/v0/b/kobble-prod.appspot.com/o/docs%2Fbanners%2Fsupa-image-generator.png?alt=media&token=dbf49f02-2cda-4b4f-98ca-71aadfa52922)

[![License](https://img.shields.io/:license-mit-blue.svg?style=flat)](https://opensource.org/licenses/MIT)
![Status](https://img.shields.io/:status-stable-green.svg?style=flat)

This example SaaS project demonstrates how to build a simple SaaS with Kobble and Supabase.

- **Supabase** is used for the database and server side code execution (using edge functions).
- **Kobble** is used for authentication and monetization.


## Getting Started

### Installation

Using [npm](https://npmjs.org) in your project directory run the following command:

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Configure Kobble

Create an **Application** in your [Kobble Dashboard](https://app.kobble.io/p/applications).

Make sure your application can handle your localhost callback URL (see section below).

Note the **Client ID** and your **Portal Domain** values.

### Update environment

Copy the `.env.example` file to `.env` and update the values with your Kobble Application details.

```bash
cp .env.example > .env
```

Example:
```
VITE_KOBBLE_DOMAIN=https://your-project.portal.kobble.io
VITE_KOBBLE_CLIENT_ID=cluipasqr0000k8bzevczqy23
VITE_KOBBLE_REDIRECT_URI=https://your-app-url/callback
```

### Raise an issue

To provide feedback or report a bug, please [raise an issue on our issue tracker](https://github.com/kobble-io/supa-image-generator/issues).

## What is Kobble?

<p align="center">
  <picture>
    <img alt="Kobble Logo" src="https://firebasestorage.googleapis.com/v0/b/kobble-prod.appspot.com/o/docs%2Fbanners%2Flogo.png?alt=media&token=35c9e52e-6a90-4192-aa98-fe99c76be15a" width="150">
  </picture>
</p>
<p align="center">
 Kobble is the one-stop solution for monetizing modern SaaS and APIs. It allows to add authentication, analytics and payment to any app in under 10 minutes.
</p>
