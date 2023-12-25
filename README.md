This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


NOTE:
// cross - env allow us to use same env file for next and dotenv

// not loading payloadcms delete the .next file. then run yarn dev. or change to 127.0.0.1

// your monogodb url should include the db at the end
mongodb+srv://username:password@cluster/dbname?retryWrites=true&w=majority

// (auth) the folder will be ignored from next js routing and we can put folders/files relating to it
// [trpc] dynamic route -> gives access to whatever comes after

// trpc->allowsmainatinace of type saftey through frontend backend.. change data on the backend -> it might break the frontend.. vice versa

// in trpc folder we create the router
// we call what we define in our trpc/index router
// then we can use it in our page.tsx e'g auth-router -> sign-up page.tsx
