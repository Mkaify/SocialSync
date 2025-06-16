#!/usr/bin/env node

/**
 * Security Check Script for SocialSync
 * 
 * This script validates that all required environment variables are properly configured
 * before starting the application. It helps prevent accidental deployment with missing
 * or weak security configurations.
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkEnvironmentFile() {
  const envPath = path.join(__dirname, 'backend', '.env');
  
  if (!fs.existsSync(envPath)) {
    log(colors.red, '❌ ERROR: backend/.env file not found!');
    log(colors.yellow, '💡 SOLUTION: Copy .env.example to backend/.env and fill in your values');
    return false;
  }
  
  log(colors.green, '✅ Environment file found');
  return true;
}

function validateEnvironmentVariables() {
  // Load environment variables
  try {
    require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });
  } catch (error) {
    // If dotenv is not available globally, try to load it from backend
    try {
      const dotenv = require('./backend/node_modules/dotenv');
      dotenv.config({ path: path.join(__dirname, 'backend', '.env') });
    } catch (err) {
      log(colors.yellow, '⚠️  dotenv module not found, reading .env file manually');
      // Manually read .env file
      const envFile = path.join(__dirname, 'backend', '.env');
      if (fs.existsSync(envFile)) {
        const envContent = fs.readFileSync(envFile, 'utf8');
        const envVars = envContent.split('\n').filter(line => line.includes('='));
        envVars.forEach(line => {
          const [key, value] = line.split('=');
          if (key && value) {
            process.env[key.trim()] = value.trim();
          }
        });
      }
    }
  }
  
  const requiredVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'PORT'
  ];
  
  let hasErrors = false;
  let hasWarnings = false;
  
  log(colors.blue, '\n🔍 Checking required environment variables...');
  
  // Check required variables
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      log(colors.red, `❌ MISSING: ${varName}`);
      hasErrors = true;
    } else {
      log(colors.green, `✅ ${varName}`);
    }
  }
  
  // Check JWT secret strength
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      log(colors.yellow, '⚠️  WARNING: JWT_SECRET should be at least 32 characters long');
      hasWarnings = true;
    }
    if (process.env.JWT_SECRET.includes('your-super-secret') || process.env.JWT_SECRET.includes('change-this')) {
      log(colors.red, '❌ ERROR: JWT_SECRET is still using a placeholder value!');
      hasErrors = true;
    }
  }
  
  // Check MongoDB URI
  if (process.env.MONGO_URI && process.env.MONGO_URI === 'mongodb://localhost:27017/socialsync') {
    log(colors.yellow, '⚠️  INFO: Using local MongoDB (fine for development)');
  }
  
  // Check OAuth variables
  log(colors.blue, '\n🔍 Checking OAuth credentials...');
  let connectedPlatforms = 0;
  
  const platforms = [
    { name: 'FACEBOOK', idVar: 'FACEBOOK_APP_ID', secretVar: 'FACEBOOK_APP_SECRET' },
    { name: 'TWITTER', idVar: 'TWITTER_CLIENT_ID', secretVar: 'TWITTER_CLIENT_SECRET' },
    { name: 'LINKEDIN', idVar: 'LINKEDIN_CLIENT_ID', secretVar: 'LINKEDIN_CLIENT_SECRET' },
    { name: 'INSTAGRAM', idVar: 'INSTAGRAM_CLIENT_ID', secretVar: 'INSTAGRAM_CLIENT_SECRET' }
  ];
  
  for (const platform of platforms) {
    const hasId = process.env[platform.idVar] && 
                  !process.env[platform.idVar].includes('your_') && 
                  !process.env[platform.idVar].includes('_here');
    const hasSecret = process.env[platform.secretVar] && 
                      !process.env[platform.secretVar].includes('your_') && 
                      !process.env[platform.secretVar].includes('_here');
    
    if (hasId && hasSecret) {
      log(colors.green, `✅ ${platform.name} OAuth configured`);
      connectedPlatforms++;
    } else {
      log(colors.yellow, `⚠️  ${platform.name} OAuth not configured (optional)`);
    }
  }
  
  if (connectedPlatforms === 0) {
    log(colors.yellow, '\n⚠️  WARNING: No OAuth platforms configured. Users won\'t be able to connect social media accounts.');
    log(colors.yellow, '💡 See OAUTH_SETUP.md for setup instructions');
    hasWarnings = true;
  } else {
    log(colors.green, `\n✅ ${connectedPlatforms} OAuth platform(s) configured`);
  }
  
  // Final summary
  log(colors.blue, '\n📋 Security Check Summary:');
  
  if (hasErrors) {
    log(colors.red, '❌ ERRORS FOUND: Please fix the above issues before deploying');
    return false;
  } else if (hasWarnings) {
    log(colors.yellow, '⚠️  WARNINGS FOUND: Review the above recommendations');
    log(colors.green, '✅ No critical security issues detected');
    return true;
  } else {
    log(colors.green, '✅ All security checks passed!');
    return true;
  }
}

function checkGitignore() {
  const gitignorePath = path.join(__dirname, '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    log(colors.red, '❌ ERROR: .gitignore file not found!');
    return false;
  }
  
  const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  
  if (!gitignoreContent.includes('.env')) {
    log(colors.red, '❌ ERROR: .gitignore does not include .env files!');
    return false;
  }
  
  log(colors.green, '✅ .gitignore properly configured');
  return true;
}

function main() {
  log(colors.bold + colors.blue, '🔒 SocialSync Security Check');
  log(colors.blue, '='.repeat(50));
  
  const checks = [
    checkEnvironmentFile(),
    checkGitignore(),
    validateEnvironmentVariables()
  ];
  
  const allPassed = checks.every(check => check);
  
  log(colors.blue, '\n' + '='.repeat(50));
  
  if (allPassed) {
    log(colors.green, '🎉 Security check completed successfully!');
    log(colors.green, '✅ Your project is ready for deployment');
    process.exit(0);
  } else {
    log(colors.red, '❌ Security check failed!');
    log(colors.red, '🚫 Please fix the above issues before deploying');
    process.exit(1);
  }
}

// Run the security check
main();
