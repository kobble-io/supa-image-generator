![Supabase image generator with Kobble](https://firebasestorage.googleapis.com/v0/b/kobble-prod.appspot.com/o/docs%2Fbanners%2Fsupa-image-generator.png?alt=media&token=dbf49f02-2cda-4b4f-98ca-71aadfa52922)

[![License](https://img.shields.io/:license-mit-blue.svg?style=flat)](https://opensource.org/licenses/MIT)
![Status](https://img.shields.io/:status-stable-green.svg?style=flat)

This example SaaS project demonstrates how to build a simple SaaS with Kobble and Supabase.

- **Supabase** is used for the database and server side code execution (using edge functions).
- **Kobble** is used for authentication and monetization.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fkobble-io%2Fsupa-image-generator&env=VITE_KOBBLE_DOMAIN,VITE_KOBBLE_CLIENT_ID,VITE_KOBBLE_REDIRECT_URI,VITE_SUPABASE_URL,VITE_SUPABASE_API_KEY&envDescription=Add%20your%20Supabase%20and%20Kobble%20environment%20variables.&envLink=https%3A%2F%2Fdocs.kobble.io%2Flearning%2Fquickstart%2Fsupabase&project-name=my-supa-image-generator&repository-name=my-supa-image-generator&demo-title=Supa%20Image%20Generator&demo-description=AI%20Image%20Generator%20built%20with%20Supabase%20and%20Kobble.io&demo-url=https%3A%2F%2Fsupa-image-generator.vercel.app&demo-image=https%3A%2F%2Ffirebasestorage.googleapis.com%2Fv0%2Fb%2Fkobble-prod.appspot.com%2Fo%2Fdocs%252Fbanners%252Fsupa-image-generator-thumbnail.png%3Falt%3Dmedia%26token%3D1fd59bf7-68e7-4900-8652-a45ffc8207af)
_[![Preview](https://github.com/kobble-io/supa-image-generator/blob/main/.readme/preview-btn.svg?raw=true)](https://supa-image-generator.vercel.app)_


## Getting Started

Using [npm](https://npmjs.org) in your project directory run the following command:

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
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
```dotenv
VITE_KOBBLE_DOMAIN=**********
VITE_KOBBLE_CLIENT_ID=**********
VITE_KOBBLE_REDIRECT_URI=http://localhost:5173/callback
VITE_SUPABASE_URL=**********
VITE_SUPABASE_API_KEY=**********
```

## Configure Supabase

Create a new project on [Supabase](https://app.supabase.io/).

Add the correct RLS policies to the tables and storage (docs coming soon).

Asks us for more details if you need help.

**Allow user's images read access**

```sql
create policy "read user images" on "public"."Images" as permissive for select to authenticated using ((request_user_id() = user_id));
```

**Allow service_role (edge function) to persist images**

```sql
create policy "insert images from service_role" on "public"."Images" as permissive for insert to service_role with check (true);
```

### Update Supabase environment

Supabase functions are located in the same repo.

Copy the `supabase/functions/.env.example` file to `supabase/functions/.env` and update the values with your details.

```dotenv
DEZGO_API_KEY=GENERATE_FROM_YOUR_DEZGO_DASHBOARD
KOBBLE_SECRET_KEY=GENERATE_FROM_YOUR_KOBBLE_DASHBOARD
```

Note: the Dezgo API Key can be generated on the [Dezgo Dashboard](https://dezgo.com/) and is used to generate images from the Edge Function Backend.

### Deploy Supabase Edge Functions

Deploy the Supabase functions to your Supabase project.

```sh
cd supabase/functions

npm run supabase:deploy # will deploy environment and functions
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

