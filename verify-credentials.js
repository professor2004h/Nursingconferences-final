/**
 * PayPal Credentials Verification
 * Analyzes the credentials character by character
 */

const PROVIDED_CLIENT_ID = 'Ac1OIovvmsWJmSXZCIjXobg377B8OHZDuD_N8qAo-HghVTheKXrwp_QqjAYab9f__a4c6FTCFkWLFaWD';
const PROVIDED_CLIENT_SECRET = 'ENmlGyS5xSk2x3ZeNTClpRP48JCJ1GuyduCk52IOsHPxgVElk4RfRrc5l2p8G_JyY08cj-whu247O5tn';

console.log('🔍 PayPal Credentials Analysis\n');

console.log('📋 Client ID Analysis:');
console.log('Length:', PROVIDED_CLIENT_ID.length);
console.log('Starts with:', PROVIDED_CLIENT_ID.substring(0, 10));
console.log('Ends with:', PROVIDED_CLIENT_ID.substring(-10));
console.log('Contains dashes:', PROVIDED_CLIENT_ID.includes('-'));
console.log('Contains underscores:', PROVIDED_CLIENT_ID.includes('_'));
console.log('Full Client ID:', PROVIDED_CLIENT_ID);

console.log('\n📋 Client Secret Analysis:');
console.log('Length:', PROVIDED_CLIENT_SECRET.length);
console.log('Starts with:', PROVIDED_CLIENT_SECRET.substring(0, 10));
console.log('Ends with:', PROVIDED_CLIENT_SECRET.substring(-10));
console.log('Contains dashes:', PROVIDED_CLIENT_SECRET.includes('-'));
console.log('Contains underscores:', PROVIDED_CLIENT_SECRET.includes('_'));
console.log('Full Client Secret:', PROVIDED_CLIENT_SECRET);

console.log('\n🔍 Character-by-Character Analysis:');
console.log('Client Secret characters:');
for (let i = 0; i < PROVIDED_CLIENT_SECRET.length; i++) {
  const char = PROVIDED_CLIENT_SECRET[i];
  const code = char.charCodeAt(0);
  console.log(`Position ${i + 1}: '${char}' (ASCII: ${code})`);
}

console.log('\n🧪 Base64 Encoding Test:');
const auth = Buffer.from(`${PROVIDED_CLIENT_ID}:${PROVIDED_CLIENT_SECRET}`).toString('base64');
console.log('Base64 Auth String Length:', auth.length);
console.log('Base64 Auth String:', auth);

console.log('\n📝 Recommendations:');
console.log('1. Verify these credentials in your PayPal Developer Dashboard');
console.log('2. Check if the PayPal app is active and not suspended');
console.log('3. Ensure the app has the correct permissions');
console.log('4. Try regenerating the client secret in PayPal dashboard');
console.log('5. Verify the app is in sandbox mode');

console.log('\n🔗 PayPal Developer Dashboard:');
console.log('https://developer.paypal.com/developer/applications/');
