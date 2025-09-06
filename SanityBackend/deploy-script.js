const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Create Sanity client with editing token first to check project details
const editingClient = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  token: 'skJo4iwMzLtavnRYqibHHTzDqOJc5UJTQE9JCv066MM6vWDFE6XEZBnV2XZTzbxE8BKTawmfQhPE2ZPwrLNP7CokAwUlJN5VeQWLuUiLFeZQfyiXeDdkAShynpyk1v4jWmcNAZDvph2QCuCFcJko5q0XAf123nDHp9VF4oRr7NnJh1NkEa6V',
  useCdn: false,
  apiVersion: '2023-05-03'
});

// Create Sanity client with deployment token
const deployClient = createClient({
  projectId: 'zt8218vh',
  dataset: 'production',
  token: 'skJo4iwMzLtavnRYqibHHTzDqOJc5UJTQE9JCv066MM6vWDFE6XEZBnV2XZTzbxE8BKTawmfQhPE2ZPwrLNP7CokAwUlJN5VeQWLuUiLFeZQfyiXeDdkAShynpyk1v4jWmcNAZDvph2QCuCFcJko5q0XAf123nDHp9VF4oRr7NnJh1NkEa6V',
  useCdn: false,
  apiVersion: '2023-05-03'
});

console.log('Testing Sanity connection with deployment token...');

async function testConnection() {
  console.log('Testing editing token...');
  try {
    // Test the editing connection first
    const editingProjects = await editingClient.projects.list();
    console.log('✅ Editing token works! Available projects:', editingProjects.map(p => `${p.displayName} (${p.id})`));

    const project = editingProjects.find(p => p.id === 'zt8218vh');
    if (project) {
      console.log('✅ Found target project:', project.displayName);
    }
  } catch (error) {
    console.error('❌ Editing token failed:', error.message);
  }

  console.log('\nTesting deployment token...');
  try {
    // Test the deployment connection
    const deployProjects = await deployClient.projects.list();
    console.log('✅ Deployment token works! Available projects:', deployProjects.map(p => `${p.displayName} (${p.id})`));

    const project = deployProjects.find(p => p.id === 'zt8218vh');
    if (project) {
      console.log('✅ Found target project with deployment token:', project.displayName);
      console.log('✅ Deployment token is working correctly!');
      console.log('');
      console.log('🚀 Your Sanity studio should be accessible at:');
      console.log('   https://intelliglobalconferences.sanity.studio/');
      console.log('');
      console.log('📝 Note: The studio deployment is managed by Sanity Cloud.');
      console.log('   Your schema changes and content are automatically synced.');
    } else {
      console.log('❌ Could not find project zt8218vh with deployment token');
    }

  } catch (error) {
    console.error('❌ Deployment token failed:', error.message);
    console.log('');
    console.log('This might be because:');
    console.log('1. The deployment token might be for a different project');
    console.log('2. The deployment token might not have the right permissions');
    console.log('3. The project ID might be incorrect');
    console.log('4. Network connectivity issues');
    console.log('');
    console.log('💡 Suggestion: The studio at https://intelliglobalconferences.sanity.studio/');
    console.log('   might already be deployed and working. Try accessing it directly.');
  }
}

testConnection();
