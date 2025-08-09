// scripts/check-env.ts
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// Check if running in Vercel
const isVercel = process.env.VERCEL === '1';

// List of required environment variables
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

// Check each required variable
let allVarsPresent = true;
const missingVars: string[] = [];

console.log('\n🔍 Checking environment variables...\n');

for (const varName of requiredVars) {
  const value = process.env[varName];
  const isPresent = value && value.trim() !== '';
  
  console.log(
    `${isPresent ? '✅' : '❌'} ${varName}:`,
    isPresent ? 'Set' : 'Missing',
    !isPresent && isVercel ? '(Check Vercel Environment Variables)' : ''
  );
  
  if (!isPresent) {
    missingVars.push(varName);
    allVarsPresent = false;
  }
}

// Show results
console.log('\n---\n');

if (allVarsPresent) {
  console.log('🎉 All required environment variables are set!');
} else {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`  - ${varName}`));
  
  console.log('\n💡 Please add the missing variables to your .env file:');
  console.log('   Create a .env file in the project root and add:');
  missingVars.forEach(varName => console.log(`   ${varName}=your_value_here`));
  
  if (isVercel) {
    console.log('\n🌐 For Vercel deployment, set these as environment variables in your Vercel project settings.');
  }
  
  process.exit(1);
}
