const fs = require('fs');
const path = require('path');

// Function to recursively find all .tsx and .jsx files
function findReactFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findReactFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to check if a file has React hook usage without proper imports
function checkReactImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if it's not a client component
    if (!content.includes("'use client'")) {
      return null;
    }
    
    // Extract import statements
    const importLines = content.split('\n').filter(line => 
      line.trim().startsWith('import') && line.includes('react')
    );
    
    // Check for React hooks usage
    const hooks = ['useState', 'useEffect', 'useCallback', 'useMemo', 'useRef', 'useContext'];
    const usedHooks = [];
    const importedHooks = [];
    
    // Find used hooks
    hooks.forEach(hook => {
      if (content.includes(hook + '(')) {
        usedHooks.push(hook);
      }
    });
    
    // Find imported hooks
    importLines.forEach(line => {
      hooks.forEach(hook => {
        if (line.includes(hook)) {
          importedHooks.push(hook);
        }
      });
    });
    
    // Find missing hooks
    const missingHooks = usedHooks.filter(hook => !importedHooks.includes(hook));
    
    if (missingHooks.length > 0) {
      return {
        file: filePath,
        usedHooks,
        importedHooks,
        missingHooks,
        importLines
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return null;
  }
}

// Main execution
console.log('🔍 Checking React imports in all component files...\n');

const reactFiles = findReactFiles('./nextjs-frontend/src');
const issues = [];

reactFiles.forEach(file => {
  const result = checkReactImports(file);
  if (result) {
    issues.push(result);
  }
});

if (issues.length === 0) {
  console.log('✅ All React components have proper imports!');
} else {
  console.log(`❌ Found ${issues.length} files with missing React hook imports:\n`);
  
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.file}`);
    console.log(`   Used hooks: ${issue.usedHooks.join(', ')}`);
    console.log(`   Imported hooks: ${issue.importedHooks.join(', ')}`);
    console.log(`   Missing hooks: ${issue.missingHooks.join(', ')}`);
    console.log(`   Current import: ${issue.importLines[0] || 'No React import found'}`);
    
    // Suggest fix
    const allNeededHooks = [...new Set([...issue.importedHooks, ...issue.missingHooks])];
    console.log(`   Suggested fix: import React, { ${allNeededHooks.join(', ')} } from 'react';`);
    console.log('');
  });
}

console.log('\n🔧 Summary:');
console.log(`   Total React files checked: ${reactFiles.length}`);
console.log(`   Files with issues: ${issues.length}`);
console.log(`   Files without issues: ${reactFiles.length - issues.length}`);
