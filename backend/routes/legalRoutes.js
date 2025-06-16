// routes/legalRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

// Privacy Policy route
router.get('/privacy', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Privacy Policy - SocialSync</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
            h1 { color: #333; border-bottom: 2px solid #007cba; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 30px; }
            p { margin-bottom: 15px; }
            .contact { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 30px; }
        </style>
    </head>
    <body>
        <h1>Privacy Policy for SocialSync</h1>
        <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h2>1. Introduction</h2>
        <p>SocialSync ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our social media management application.</p>
        
        <h2>2. Information We Collect</h2>
        <h3>2.1 Account Information</h3>
        <p>When you register for SocialSync, we collect:</p>
        <ul>
            <li>Your name and email address</li>
            <li>Password (stored encrypted)</li>
            <li>Account creation date and login history</li>
        </ul>
        
        <h3>2.2 Social Media Account Information</h3>
        <p>When you connect social media accounts, we collect:</p>
        <ul>
            <li>OAuth access tokens (stored encrypted)</li>
            <li>Basic profile information (username, platform user ID)</li>
            <li>Connection timestamps and usage data</li>
        </ul>
        
        <h3>2.3 Content Data</h3>
        <p>We temporarily process:</p>
        <ul>
            <li>Post content you create through our platform</li>
            <li>Images and media URLs you provide</li>
            <li>Publishing history and status</li>
        </ul>
        
        <h2>3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
            <li>Provide social media posting services</li>
            <li>Authenticate your identity and social media accounts</li>
            <li>Manage your account and preferences</li>
            <li>Improve our services and user experience</li>
            <li>Communicate with you about your account</li>
        </ul>
        
        <h2>4. Information Sharing</h2>
        <p>We do not sell, trade, or share your personal information with third parties except:</p>
        <ul>
            <li>With social media platforms when you authorize posting</li>
            <li>When required by law or legal process</li>
            <li>To protect our rights or safety</li>
        </ul>
        
        <h2>5. Data Security</h2>
        <p>We implement appropriate security measures including:</p>
        <ul>
            <li>Encryption of sensitive data at rest and in transit</li>
            <li>Secure authentication using JWT tokens</li>
            <li>Regular security updates and monitoring</li>
            <li>Limited access to personal data</li>
        </ul>
        
        <h2>6. Data Retention</h2>
        <p>We retain your information:</p>
        <ul>
            <li>Account data: Until you delete your account</li>
            <li>Social media tokens: Until you disconnect accounts</li>
            <li>Post content: Not permanently stored (only processed for publishing)</li>
        </ul>
        
        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Delete your account and associated data</li>
            <li>Disconnect social media accounts at any time</li>
            <li>Export your data (upon request)</li>
        </ul>
        
        <h2>8. Third-Party Services</h2>
        <p>Our service integrates with social media platforms. Each platform has its own privacy policy:</p>
        <ul>
            <li>Facebook: https://www.facebook.com/privacy/policy/</li>
            <li>Twitter: https://twitter.com/privacy</li>
            <li>LinkedIn: https://www.linkedin.com/legal/privacy-policy</li>
            <li>Instagram: https://help.instagram.com/519522125107875</li>
        </ul>
        
        <h2>9. Children's Privacy</h2>
        <p>SocialSync is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
        
        <h2>10. Changes to This Policy</h2>
        <p>We may update this Privacy Policy occasionally. We will notify users of significant changes via email or through our service.</p>
        
        <div class="contact">
            <h2>11. Contact Information</h2>
            <p>For questions about this Privacy Policy, contact us at:</p>
            <p><strong>Email:</strong> privacy@socialsync.app<br>
            <strong>Address:</strong> [Your Business Address]<br>
            <strong>Website:</strong> http://localhost:3000</p>
        </div>
    </body>
    </html>
  `);
});

// Terms of Service route
router.get('/terms', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Terms of Service - SocialSync</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
            h1 { color: #333; border-bottom: 2px solid #007cba; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 30px; }
            p { margin-bottom: 15px; }
            .contact { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 30px; }
        </style>
    </head>
    <body>
        <h1>Terms of Service for SocialSync</h1>
        <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using SocialSync, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2>2. Description of Service</h2>
        <p>SocialSync is a social media management platform that allows users to:</p>
        <ul>
            <li>Connect multiple social media accounts</li>
            <li>Create and publish content across platforms</li>
            <li>Manage social media presence from a unified interface</li>
        </ul>
        
        <h2>3. User Accounts</h2>
        <h3>3.1 Account Creation</h3>
        <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
        
        <h3>3.2 Account Responsibilities</h3>
        <p>You are responsible for:</p>
        <ul>
            <li>All activities that occur under your account</li>
            <li>Maintaining the security of your login credentials</li>
            <li>Notifying us immediately of any unauthorized use</li>
        </ul>
        
        <h2>4. Social Media Integration</h2>
        <p>When connecting social media accounts:</p>
        <ul>
            <li>You grant SocialSync permission to post on your behalf</li>
            <li>You remain responsible for all content posted through our service</li>
            <li>You must comply with each platform's terms of service</li>
            <li>You can revoke access at any time through our platform</li>
        </ul>
        
        <h2>5. Content Policy</h2>
        <h3>5.1 User Content</h3>
        <p>You retain ownership of content you create. By using our service, you grant us a license to process and transmit your content to connected social media platforms.</p>
        
        <h3>5.2 Prohibited Content</h3>
        <p>You may not post content that:</p>
        <ul>
            <li>Violates any laws or regulations</li>
            <li>Infringes on intellectual property rights</li>
            <li>Contains hate speech, harassment, or threats</li>
            <li>Includes spam or misleading information</li>
            <li>Violates social media platform policies</li>
        </ul>
        
        <h2>6. Service Availability</h2>
        <p>We strive to maintain service availability but cannot guarantee:</p>
        <ul>
            <li>100% uptime or uninterrupted service</li>
            <li>Compatibility with all social media platform changes</li>
            <li>Successful posting due to platform limitations</li>
        </ul>
        
        <h2>7. Limitation of Liability</h2>
        <p>SocialSync shall not be liable for:</p>
        <ul>
            <li>Failed posts due to social media platform issues</li>
            <li>Content that violates platform policies</li>
            <li>Account suspensions on third-party platforms</li>
            <li>Data loss or service interruptions</li>
        </ul>
        
        <h2>8. User Responsibilities</h2>
        <p>Users agree to:</p>
        <ul>
            <li>Use the service in compliance with all applicable laws</li>
            <li>Respect intellectual property rights</li>
            <li>Not attempt to hack, reverse engineer, or disrupt the service</li>
            <li>Not create multiple accounts to circumvent limitations</li>
        </ul>
        
        <h2>9. Privacy</h2>
        <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
        
        <h2>10. Termination</h2>
        <p>We may terminate or suspend your account if you:</p>
        <ul>
            <li>Violate these Terms of Service</li>
            <li>Use the service for illegal activities</li>
            <li>Fail to pay applicable fees (if any)</li>
        </ul>
        
        <h2>11. Modifications</h2>
        <p>We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or through the service.</p>
        
        <h2>12. Governing Law</h2>
        <p>These terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction].</p>
        
        <h2>13. Third-Party Platforms</h2>
        <p>Our service integrates with third-party social media platforms. You must also comply with their terms of service:</p>
        <ul>
            <li>Facebook Terms: https://www.facebook.com/terms.php</li>
            <li>Twitter Terms: https://twitter.com/tos</li>
            <li>LinkedIn Terms: https://www.linkedin.com/legal/user-agreement</li>
            <li>Instagram Terms: https://help.instagram.com/581066165581870</li>
        </ul>
        
        <div class="contact">
            <h2>14. Contact Information</h2>
            <p>For questions about these Terms of Service, contact us at:</p>
            <p><strong>Email:</strong> legal@socialsync.app<br>
            <strong>Address:</strong> [Your Business Address]<br>
            <strong>Website:</strong> http://localhost:3000</p>
        </div>
    </body>
    </html>
  `);
});

// Data Deletion Callback - Required for Facebook/Instagram OAuth compliance
router.post('/data-deletion', async (req, res) => {
  try {
    const { signed_request } = req.body;
    
    if (!signed_request) {
      return res.status(400).json({
        error: 'Missing signed_request parameter'
      });
    }

    // Parse Facebook signed request
    const [encodedSig, payload] = signed_request.split('.');
    
    // Decode the payload
    const decodedPayload = JSON.parse(
      Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
    );
    
    const userId = decodedPayload.user_id;
    const algorithm = decodedPayload.algorithm || 'HMAC-SHA256';
    
    // Verify signature (in production, use your actual app secret)
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    if (appSecret && algorithm === 'HMAC-SHA256') {
      const expectedSig = crypto
        .createHmac('sha256', appSecret)
        .update(payload)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
      
      const providedSig = encodedSig.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
      
      if (expectedSig !== providedSig) {
        console.warn('Invalid signature for data deletion request');
        return res.status(400).json({
          error: 'Invalid signature'
        });
      }
    }

    // Find user by Facebook user ID and delete their data
    let deletedUser = null;
    if (userId) {
      deletedUser = await User.findOneAndDelete({
        'socialAccounts.platformUserId': userId,
        'socialAccounts.platform': 'facebook'
      });
      
      // Also check Instagram accounts (same Facebook user ID)
      if (!deletedUser) {
        deletedUser = await User.findOneAndDelete({
          'socialAccounts.platformUserId': userId,
          'socialAccounts.platform': 'instagram'
        });
      }
    }

    // Generate confirmation code for the deletion
    const confirmationCode = crypto.randomBytes(16).toString('hex');
    
    // Log the deletion request
    console.log(`Data deletion request processed for user ID: ${userId}`, {
      timestamp: new Date().toISOString(),
      userFound: !!deletedUser,
      confirmationCode
    });

    // Respond with confirmation URL as required by Facebook
    res.json({
      url: `http://localhost:5000/legal/data-deletion-status?id=${confirmationCode}`,
      confirmation_code: confirmationCode
    });

  } catch (error) {
    console.error('Data deletion callback error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// Data Deletion Status Page - Shows deletion confirmation
router.get('/data-deletion-status', (req, res) => {
  const confirmationId = req.query.id;
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Data Deletion Status - SocialSync</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; }
            .status-card { background-color: #e8f5e8; border: 1px solid #4caf50; border-radius: 5px; padding: 20px; text-align: center; }
            .confirmation-id { background-color: #f5f5f5; padding: 10px; border-radius: 3px; font-family: monospace; margin: 15px 0; }
            h1 { color: #333; }
        </style>
    </head>
    <body>
        <div class="status-card">
            <h1>✅ Data Deletion Completed</h1>
            <p>Your data deletion request has been processed successfully.</p>
            
            <div class="confirmation-id">
                <strong>Confirmation ID:</strong> ${confirmationId || 'Unknown'}
            </div>
            
            <p>All personal data associated with your social media account has been permanently removed from SocialSync's servers.</p>
            
            <h3>What was deleted:</h3>
            <ul style="text-align: left;">
                <li>Your SocialSync account and profile information</li>
                <li>Connected social media account tokens</li>
                <li>Any stored preferences or settings</li>
                <li>Account activity logs</li>
            </ul>
            
            <p><small>Deletion completed on: ${new Date().toLocaleString()}</small></p>
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
            <p>If you have questions about this deletion, please contact us at:</p>
            <p><strong>Email:</strong> privacy@socialsync.app</p>
        </div>
    </body>
    </html>
  `);
});

// Generic data deletion request page (for other platforms)
router.get('/data-deletion', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Data Deletion Request - SocialSync</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; }
            .form-card { background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px; padding: 20px; }
            .button { background-color: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer; }
            .button:hover { background-color: #c82333; }
            h1 { color: #333; }
        </style>
    </head>
    <body>
        <div class="form-card">
            <h1>🗑️ Data Deletion Request</h1>
            <p>To request deletion of your data from SocialSync, please contact us directly.</p>
            
            <h3>What will be deleted:</h3>
            <ul>
                <li>Your SocialSync account and profile</li>
                <li>All connected social media account access tokens</li>
                <li>Account preferences and settings</li>
                <li>Activity logs and usage data</li>
            </ul>
            
            <h3>How to request deletion:</h3>
            <ol>
                <li>Send an email to <strong>privacy@socialsync.app</strong></li>
                <li>Include your registered email address</li>
                <li>Specify "Data Deletion Request" in the subject line</li>
                <li>We will process your request within 30 days</li>
            </ol>
            
            <p><strong>Note:</strong> This action is irreversible. All your data will be permanently deleted.</p>
            
            <div style="text-align: center; margin-top: 20px;">
                <a href="mailto:privacy@socialsync.app?subject=Data%20Deletion%20Request" class="button">
                    Send Deletion Request Email
                </a>
            </div>
        </div>
    </body>
    </html>
  `);
});

module.exports = router; 