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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

For the leaderboard and the authentification to work you need to create a file ./qcmi3il/quizz/.env.local and
copy this inside : 
TURSO_DATABASE_URL=libsql://quizz-3il-db-kovaaksenjoyer.aws-eu-west-1.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTEzODAxNTAsImlkIjoiMDFhMTE2OTMtMzgwMS03MTg3LTg5MzItYmMxNGQxYzk3YzA1Iiwia2lkIjoic0pQaVdnMzdvYWpHcEF5dUdRa2hWR1RCb2UzbndLc0RQSUFsekQ4cXh5OCIsInJpZCI6IjFhZWYwOGEzLWRkZjktNDVhNS1iYWRjLTJlMTQyMzYzNTQ1MSJ9.-9Xqde2cOA9_kErdUXjIRbo2w4z4RC1TJe-CwtESnPt_LjN6g0DzCL5sxr-J6_NSPETyToXiq399BX3d70xOAg


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

