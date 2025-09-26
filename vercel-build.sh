#!/bin/bash

# Generate Prisma client
npx prisma generate

# Build the application
npm run build
