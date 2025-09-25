#!/bin/bash

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Build the application
npm run build
