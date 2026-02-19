#!/usr/bin/env node

/**
 * FinBox Training Documents Sync Script
 *
 * Uploads all PDFs from training-docs/core/ to AnythingLLM "Finbox-Core" workspace
 * Re-runnable: skips already uploaded documents, adds new ones
 *
 * Usage: npm run sync-training-docs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ANYTHINGLLM_URL = process.env.VITE_ANYTHINGLLM_URL || 'http://localhost:3001';
const ANYTHINGLLM_API_KEY = process.env.VITE_ANYTHINGLLM_API_KEY;
const TRAINING_FOLDER = process.env.VITE_TRAINING_FOLDER_PATH || './training-docs/core';
const CORE_WORKSPACE_SLUG = 'finbox-core';
const CORE_WORKSPACE_NAME = 'Finbox-Core';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) { log(`✓ ${message}`, colors.green); }
function logWarning(message) { log(`⚠ ${message}`, colors.yellow); }
function logError(message) { log(`✗ ${message}`, colors.red); }
function logInfo(message) { log(`ℹ ${message}`, colors.blue); }
function logHeader(message) { log(`\n${message}`, colors.cyan); }

/**
 * Check if AnythingLLM is running
 */
async function checkAnythingLLM() {
  try {
    const response = await fetch(`${ANYTHINGLLM_URL}/api/v1/auth`, {
      method: 'GET',
    });

    if (response.status === 200 || response.status === 401) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Get or create the Finbox-Core workspace
 */
async function getOrCreateWorkspace() {
  logHeader('📂 Checking Finbox-Core workspace...');

  try {
    // List all workspaces
    const listResponse = await fetch(`${ANYTHINGLLM_URL}/api/v1/workspaces`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!listResponse.ok) {
      throw new Error(`Failed to list workspaces: ${listResponse.statusText}`);
    }

    const workspaces = await listResponse.json();
    const existingWorkspace = workspaces.workspaces?.find(
      ws => ws.slug === CORE_WORKSPACE_SLUG
    );

    if (existingWorkspace) {
      logSuccess(`Found existing workspace: ${CORE_WORKSPACE_NAME}`);
      return existingWorkspace;
    }

    // Create new workspace
    logInfo(`Creating workspace: ${CORE_WORKSPACE_NAME}...`);
    const createResponse = await fetch(`${ANYTHINGLLM_URL}/api/v1/workspace/new`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: CORE_WORKSPACE_NAME,
        slug: CORE_WORKSPACE_SLUG,
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Failed to create workspace: ${error}`);
    }

    const newWorkspace = await createResponse.json();
    logSuccess(`Created workspace: ${CORE_WORKSPACE_NAME}`);
    return newWorkspace.workspace;

  } catch (error) {
    logError(`Workspace error: ${error.message}`);
    throw error;
  }
}

/**
 * Get list of documents in workspace
 */
async function getWorkspaceDocuments() {
  try {
    const response = await fetch(
      `${ANYTHINGLLM_URL}/api/v1/workspace/${CORE_WORKSPACE_SLUG}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.workspace?.documents || [];
  } catch (error) {
    logWarning(`Could not fetch workspace documents: ${error.message}`);
    return [];
  }
}

/**
 * Upload a PDF file to AnythingLLM
 */
async function uploadDocument(filePath, fileName) {
  try {
    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);
    const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });

    // Create FormData with the file
    const formData = new FormData();
    formData.append('file', fileBlob, fileName);

    logInfo(`Uploading: ${fileName}...`);

    const uploadResponse = await fetch(`${ANYTHINGLLM_URL}/api/v1/document/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      throw new Error(`Upload failed: ${error}`);
    }

    const uploadResult = await uploadResponse.json();

    if (!uploadResult.success) {
      throw new Error(uploadResult.error || 'Upload failed');
    }

    logSuccess(`Uploaded: ${fileName}`);

    // Now add it to the workspace
    logInfo(`Adding to workspace: ${fileName}...`);

    const addResponse = await fetch(
      `${ANYTHINGLLM_URL}/api/v1/workspace/${CORE_WORKSPACE_SLUG}/update-embeddings`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ANYTHINGLLM_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adds: [uploadResult.documents[0].location],
          deletes: [],
        }),
      }
    );

    if (!addResponse.ok) {
      const error = await addResponse.text();
      throw new Error(`Failed to add to workspace: ${error}`);
    }

    logSuccess(`Added to workspace: ${fileName}`);
    return true;

  } catch (error) {
    logError(`Failed to process ${fileName}: ${error.message}`);
    return false;
  }
}

/**
 * Get all PDF files from training docs folder
 */
function getPDFFiles() {
  const trainingPath = path.resolve(__dirname, '..', TRAINING_FOLDER);

  if (!fs.existsSync(trainingPath)) {
    logError(`Training folder not found: ${trainingPath}`);
    return [];
  }

  const files = fs.readdirSync(trainingPath);
  const pdfFiles = files.filter(file =>
    file.toLowerCase().endsWith('.pdf')
  );

  return pdfFiles.map(file => ({
    name: file,
    path: path.join(trainingPath, file),
  }));
}

/**
 * Main sync function
 */
async function syncTrainingDocs() {
  logHeader('═══════════════════════════════════════════════════════════');
  logHeader('   FinBox Training Documents Sync');
  logHeader('═══════════════════════════════════════════════════════════');

  // Pre-flight checks
  logHeader('🔍 Pre-flight checks...');

  if (!ANYTHINGLLM_API_KEY) {
    logError('VITE_ANYTHINGLLM_API_KEY not set in environment');
    logInfo('Set it in .env.local or export it before running this script');
    process.exit(1);
  }

  logInfo(`AnythingLLM URL: ${ANYTHINGLLM_URL}`);
  logInfo(`Training folder: ${TRAINING_FOLDER}`);

  // Check AnythingLLM is running
  const isRunning = await checkAnythingLLM();
  if (!isRunning) {
    logError(`AnythingLLM not responding at ${ANYTHINGLLM_URL}`);
    logInfo('Make sure AnythingLLM is running before syncing');
    process.exit(1);
  }
  logSuccess('AnythingLLM is running');

  // Get or create workspace
  await getOrCreateWorkspace();

  // Get existing documents
  logHeader('📋 Checking existing documents...');
  const existingDocs = await getWorkspaceDocuments();
  const existingNames = existingDocs.map(doc => {
    // Extract filename from document location
    const parts = doc.location.split('/');
    return parts[parts.length - 1];
  });

  if (existingNames.length > 0) {
    logInfo(`Found ${existingNames.length} existing documents in workspace`);
  } else {
    logInfo('No existing documents found');
  }

  // Get PDFs from training folder
  logHeader('📄 Scanning training docs folder...');
  const pdfFiles = getPDFFiles();

  if (pdfFiles.length === 0) {
    logWarning('No PDF files found in training folder');
    logInfo(`Add PDF files to: ${path.resolve(__dirname, '..', TRAINING_FOLDER)}`);
    process.exit(0);
  }

  logInfo(`Found ${pdfFiles.length} PDF file(s)`);

  // Upload new documents
  logHeader('📤 Uploading documents...');

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of pdfFiles) {
    // Check if already exists (simple name match)
    if (existingNames.some(name => name.includes(file.name))) {
      logWarning(`Skipped (already exists): ${file.name}`);
      skipped++;
      continue;
    }

    const success = await uploadDocument(file.path, file.name);
    if (success) {
      uploaded++;
    } else {
      failed++;
    }

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  logHeader('═══════════════════════════════════════════════════════════');
  logHeader('   Sync Complete');
  logHeader('═══════════════════════════════════════════════════════════');

  if (uploaded > 0) logSuccess(`${uploaded} document(s) uploaded`);
  if (skipped > 0) logInfo(`${skipped} document(s) skipped (already exist)`);
  if (failed > 0) logError(`${failed} document(s) failed`);

  logInfo('\nDocuments are now being indexed by AnythingLLM');
  logInfo('This may take a few minutes depending on document size');
  logInfo('Check AnythingLLM > Workspaces > Finbox-Core to see status');

  process.exit(failed > 0 ? 1 : 0);
}

// Run the sync
syncTrainingDocs().catch(error => {
  logError(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
