import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const authStateFile = join(__dirname, 'auth_state.json');

async function setup() {
    console.log('🔍 Checking if auth_state.json exists...');
    
    if (!existsSync(authStateFile)) {
        console.log('❌ auth_state.json not found. Running authentication...');
        try {
            execSync('npx playwright test tests/auth.spec.ts --project=chromium', { stdio: 'inherit' });
            console.log('✅ Authentication completed.');
        } catch (error) {
            console.error('❌ Authentication failed:', error);
            process.exit(1);
        }
    } else {
        console.log('✅ auth_state.json already exists.');
    }
    
    console.log('\n🔍 Verifying auth_state.json exists...');
    if (existsSync(authStateFile)) {
        console.log('✅ auth_state.json verified. Running automation...');
        try {
            execSync('npx playwright test tests/automation.spec.ts --project=chromium', { stdio: 'inherit' });
            console.log('✅ Automation completed successfully.');
        } catch (error) {
            console.error('❌ Automation failed:', error);
            process.exit(1);
        }
    } else {
        console.log('❌ auth_state.json still not found. Setup failed.');
        process.exit(1);
    }
}

setup();
