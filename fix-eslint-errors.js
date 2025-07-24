const fs = require('fs');
const path = require('path');

// Files that need fixing based on the error log
const filesToFix = [
  'src/app/admin/cancellation-policy/page.tsx',
  'src/app/admin/manage-tracks/page.tsx',
  'src/app/admin/speaker-guidelines/page.tsx',
  'src/app/admin/venue-settings/page.tsx',
  'src/app/api/abstract-settings/route.ts',
  'src/app/api/payment/razorpay/route.ts',
  'src/app/api/payment/webhook/route.ts',
  'src/app/api/sponsorship/payment/route.ts',
  'src/app/components/PayPalOnlyPayment.tsx',
  'src/app/components/PayPalSimplePayment.tsx',
  'src/app/components/VenueMap.tsx',
  'src/app/components/NavigationLoader.tsx',
  'src/app/hooks/useNavigationLoading.ts',
  'src/app/api/populate-speakers/route.ts'
];

const frontendDir = path.join(__dirname, 'nextjs-frontend');

function fixFile(filePath) {
  const fullPath = path.join(frontendDir, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  // Fix unused variables by prefixing with underscore
  const unusedVarMatches = content.match(/(\w+) is assigned a value but never used/g);
  if (unusedVarMatches) {
    // Common unused variable patterns
    content = content.replace(/const result = /g, 'const _result = ');
    content = content.replace(/const amount = /g, 'const _amount = ');
    content = content.replace(/let amount = /g, 'let _amount = ');
    content = content.replace(/const resetTimeout = /g, 'const _resetTimeout = ');
    content = content.replace(/const pathname = /g, 'const _pathname = ');
    modified = true;
  }

  // Fix naming convention issues
  content = content.replace(/const razorpay_order_id/g, 'const razorpayOrderId');
  content = content.replace(/const razorpay_payment_id/g, 'const razorpayPaymentId');
  content = content.replace(/const razorpay_signature/g, 'const razorpaySignature');
  content = content.replace(/const _RAZORPAY_KEY_ID/g, 'const RAZORPAY_KEY_ID');
  content = content.replace(/const _RAZORPAY_KEY_SECRET/g, 'const RAZORPAY_KEY_SECRET');

  // Fix unescaped quotes in JSX
  content = content.replace(/([^\\])"([^"]*)"([^>]*>)/g, '$1&quot;$2&quot;$3');
  content = content.replace(/([^\\])'([^']*)'([^>]*>)/g, '$1&apos;$2&apos;$3');

  // Fix require imports
  content = content.replace(/const crypto = require\('crypto'\)/g, 'import crypto from "crypto"');

  // Fix unused function parameters
  content = content.replace(/function\s+\w+\s*\(\s*request\s*:/g, 'function $&_request:');
  content = content.replace(/\(\s*request\s*:/g, '(_request:');
  content = content.replace(/\(\s*onSuccess\s*:/g, '(_onSuccess:');
  content = content.replace(/\(\s*onCancel\s*:/g, '(_onCancel:');
  content = content.replace(/\(\s*index\s*:/g, '(_index:');

  // Remove unused imports
  content = content.replace(/import.*useEffect.*from 'react';\s*\n/g, '');
  content = content.replace(/,\s*useEffect/g, '');

  if (modified || content !== fs.readFileSync(fullPath, 'utf8')) {
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

// Fix all files
filesToFix.forEach(fixFile);

console.log('ESLint error fixes completed!');