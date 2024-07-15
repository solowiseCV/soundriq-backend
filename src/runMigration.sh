cd ..
npx prisma migrate dev --name add_user_table
npx prisma generate
cd src
npm run dev

