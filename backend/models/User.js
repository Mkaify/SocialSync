// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SocialAccountSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['facebook', 'twitter', 'instagram', 'linkedin'],
    required: true
  },
  platformUserId: String,
  username: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiry: Date,
  isActive: { type: Boolean, default: true },
  connectedAt: { type: Date, default: Date.now },
  lastUsed: Date
});

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  socialAccounts: [SocialAccountSchema],
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add social account method
UserSchema.methods.addSocialAccount = function(accountData) {
  // Remove existing account for the same platform
  this.socialAccounts = this.socialAccounts.filter(
    account => account.platform !== accountData.platform
  );
  
  // Add new account
  this.socialAccounts.push({
    ...accountData,
    connectedAt: new Date(),
    isActive: true
  });
};

// Get active social account
UserSchema.methods.getSocialAccount = function(platform) {
  return this.socialAccounts.find(
    account => account.platform === platform && account.isActive
  );
};

module.exports = mongoose.model('User', UserSchema);