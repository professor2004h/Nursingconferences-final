# Deployment Guide

This guide covers deploying the Conference Registration Package to various hosting platforms.

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Completed environment configuration
- [ ] Tested PayPal integration in sandbox
- [ ] Set up database and tested connection
- [ ] Configured email service
- [ ] Generated secure JWT and session secrets
- [ ] Obtained SSL certificate for your domain
- [ ] Set up PayPal webhooks with production URL

## Platform-Specific Deployment

### Vercel (Recommended)

Vercel provides excellent Next.js support with automatic deployments.

#### 1. Install Vercel CLI

```bash
npm i -g vercel
```

#### 2. Deploy

```bash
# From your project directory
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set up project settings
```

#### 3. Configure Environment Variables

In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add all variables from your `.env.local`

```
NEXT_PUBLIC_APP_NAME=Your Conference Name
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id
PAYPAL_CLIENT_SECRET=your_client_secret
DATABASE_URL=your_database_url
# ... add all other variables
```

#### 4. Custom Domain

1. In Vercel Dashboard, go to "Domains"
2. Add your custom domain
3. Configure DNS records as instructed
4. Update PayPal webhook URL to use custom domain

### Netlify

#### 1. Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

#### 2. Deploy

```bash
# Build the project
npm run build

# Deploy to Netlify (drag and drop or CLI)
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

#### 3. Environment Variables

In Netlify Dashboard:
1. Go to Site Settings > Environment Variables
2. Add all environment variables
3. Redeploy the site

### Railway

#### 1. Connect Repository

1. Go to [Railway](https://railway.app)
2. Create new project from GitHub repository
3. Railway will auto-detect Next.js

#### 2. Configure Environment

In Railway Dashboard:
1. Go to Variables tab
2. Add all environment variables
3. Railway will automatically redeploy

#### 3. Custom Domain

1. In Railway Dashboard, go to Settings
2. Add custom domain
3. Configure DNS records

### DigitalOcean App Platform

#### 1. Create App

1. Go to DigitalOcean App Platform
2. Create app from GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`

#### 2. Environment Variables

In App Platform:
1. Go to Settings > App-Level Environment Variables
2. Add all environment variables
3. Redeploy app

### AWS Amplify

#### 1. Connect Repository

1. Go to AWS Amplify Console
2. Connect GitHub repository
3. Configure build settings

#### 2. Build Configuration

Create `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### 3. Environment Variables

In Amplify Console:
1. Go to App Settings > Environment Variables
2. Add all environment variables

### Self-Hosted (VPS/Dedicated Server)

#### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx
```

#### 2. Deploy Application

```bash
# Clone repository
git clone your-repository-url
cd conference-registration-package

# Install dependencies
npm install

# Build application
npm run build

# Create environment file
cp .env.example .env.local
# Edit .env.local with production values
```

#### 3. Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'conference-registration',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/your/app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

Start with PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 4. Configure Nginx

Create `/etc/nginx/sites-available/conference-registration`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/conference-registration /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Database Deployment

### PostgreSQL on Cloud

**AWS RDS:**
1. Create RDS PostgreSQL instance
2. Configure security groups
3. Update DATABASE_URL in environment

**Google Cloud SQL:**
1. Create Cloud SQL PostgreSQL instance
2. Configure authorized networks
3. Update connection string

**DigitalOcean Managed Database:**
1. Create managed PostgreSQL cluster
2. Configure firewall rules
3. Use provided connection string

### MongoDB Atlas

1. Create MongoDB Atlas cluster
2. Configure network access
3. Create database user
4. Update DATABASE_URL

## Email Service Deployment

### SendGrid

1. Create SendGrid account
2. Verify sender domain
3. Generate API key
4. Update SMTP configuration

### Mailgun

1. Create Mailgun account
2. Add and verify domain
3. Get SMTP credentials
4. Update environment variables

## PayPal Production Setup

### 1. Switch to Live Environment

```env
NEXT_PUBLIC_PAYPAL_ENVIRONMENT="live"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="live_client_id"
PAYPAL_CLIENT_SECRET="live_client_secret"
```

### 2. Update Webhook URL

1. Go to PayPal Developer Dashboard
2. Update webhook URL to production domain
3. Update PAYPAL_WEBHOOK_ID

### 3. Test Production PayPal

1. Make small test transaction
2. Verify webhook delivery
3. Check payment capture

## Post-Deployment Tasks

### 1. Health Check

```bash
curl https://your-domain.com/api/health
```

Verify all services are connected.

### 2. Test Registration Flow

1. Complete full registration
2. Test payment processing
3. Verify email delivery
4. Check database records

### 3. Monitor Logs

Set up log monitoring:
- Application logs
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring

### 4. Backup Strategy

Set up automated backups:
- Database backups
- Application code backups
- Environment configuration backups

## Security Considerations

### 1. Environment Variables

- Never commit secrets to version control
- Use platform-specific secret management
- Rotate secrets regularly

### 2. HTTPS

- Always use HTTPS in production
- Configure HSTS headers
- Use secure cookies

### 3. Database Security

- Use strong passwords
- Enable SSL connections
- Restrict network access
- Regular security updates

### 4. PayPal Security

- Verify webhook signatures
- Use production credentials only in production
- Monitor for suspicious transactions

## Monitoring and Maintenance

### 1. Application Monitoring

Set up monitoring for:
- Application uptime
- Response times
- Error rates
- Database performance

### 2. Log Management

Configure centralized logging:
- Application logs
- Access logs
- Error logs
- PayPal webhook logs

### 3. Backup and Recovery

Implement backup strategy:
- Daily database backups
- Application state backups
- Disaster recovery plan

### 4. Updates and Maintenance

Regular maintenance tasks:
- Security updates
- Dependency updates
- Performance optimization
- Feature updates

## Troubleshooting Deployment

### Common Issues

1. **Build Failures**
   - Check Node.js version
   - Verify dependencies
   - Check build logs

2. **Environment Variables**
   - Verify all required variables are set
   - Check variable names and values
   - Test with health endpoint

3. **Database Connection**
   - Verify connection string
   - Check network access
   - Test database connectivity

4. **PayPal Issues**
   - Verify client credentials
   - Check environment setting
   - Test webhook connectivity

### Getting Help

1. Check deployment platform documentation
2. Review application logs
3. Test individual components
4. Contact platform support if needed

---

**Your conference registration system is now live!** 🚀
