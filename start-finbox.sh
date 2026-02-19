#!/bin/bash

###############################################################################
# FinBox Startup Script for Mac mini Deployment
#
# This script:
# 1. Checks AnythingLLM is running at localhost:3001
# 2. Checks Ollama is running at localhost:11434
# 3. Validates environment configuration
# 4. Launches Vite dev server
#
# Usage: ./start-finbox.sh
# Or set as Login Item in System Preferences for auto-start
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ANYTHINGLLM_URL="http://localhost:3001"
OLLAMA_URL="http://localhost:11434"
FINBOX_PORT=5173
MAX_RETRIES=30
RETRY_DELAY=2

###############################################################################
# Helper Functions
###############################################################################

print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}   FinBox - Canadian IFA Advisory Tool${NC}"
    echo -e "${BLUE}   Mac mini Deployment Startup${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

###############################################################################
# Pre-flight Checks
###############################################################################

check_anythingllm() {
    print_step "Checking AnythingLLM at ${ANYTHINGLLM_URL}..."

    local retries=0
    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -s -o /dev/null -w "%{http_code}" "${ANYTHINGLLM_URL}/api/v1/auth" | grep -q "200\|401\|403"; then
            print_success "AnythingLLM is running"
            return 0
        fi

        retries=$((retries + 1))
        if [ $retries -lt $MAX_RETRIES ]; then
            print_warning "AnythingLLM not ready yet (attempt $retries/$MAX_RETRIES). Waiting ${RETRY_DELAY}s..."
            sleep $RETRY_DELAY
        fi
    done

    print_error "AnythingLLM is not responding after $MAX_RETRIES attempts"
    print_error "Please start AnythingLLM first:"
    print_error "  1. Open AnythingLLM application"
    print_error "  2. Ensure it's running on port 3001"
    print_error "  3. Try this script again"
    return 1
}

check_ollama() {
    print_step "Checking Ollama at ${OLLAMA_URL}..."

    if curl -s -o /dev/null -w "%{http_code}" "${OLLAMA_URL}" | grep -q "200\|404"; then
        print_success "Ollama is running"

        # Check if llama model is available
        if ollama list 2>/dev/null | grep -q "llama"; then
            print_success "Llama model detected"
        else
            print_warning "No Llama model found. AnythingLLM may not work properly."
            print_warning "Install with: ollama pull llama3.1:8b"
        fi
        return 0
    fi

    print_warning "Ollama not detected (optional but recommended)"
    print_warning "AnythingLLM may use a different LLM provider"
    return 0
}

check_env_file() {
    print_step "Checking environment configuration..."

    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found"
        print_warning "Creating from .env.example..."

        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_warning "Please edit .env.local and add your AnythingLLM API key"
            print_warning "Then restart this script"
            return 1
        else
            print_error ".env.example not found. Cannot create .env.local"
            return 1
        fi
    fi

    # Check if API key is set
    if grep -q "VITE_ANYTHINGLLM_API_KEY=$" .env.local || grep -q "VITE_ANYTHINGLLM_API_KEY=\"\"" .env.local; then
        print_error "AnythingLLM API key not configured in .env.local"
        print_error "Please add your API key and restart"
        return 1
    fi

    print_success "Environment configuration found"
    return 0
}

check_node_modules() {
    print_step "Checking dependencies..."

    if [ ! -d "node_modules" ]; then
        print_warning "Node modules not installed"
        print_step "Running npm install..."
        npm install
        print_success "Dependencies installed"
    else
        print_success "Dependencies already installed"
    fi

    return 0
}

check_port_available() {
    print_step "Checking if port ${FINBOX_PORT} is available..."

    if lsof -Pi :${FINBOX_PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_error "Port ${FINBOX_PORT} is already in use"
        print_error "Another instance of FinBox may be running"
        print_error "Stop it with: lsof -ti:${FINBOX_PORT} | xargs kill"
        return 1
    fi

    print_success "Port ${FINBOX_PORT} is available"
    return 0
}

###############################################################################
# Main Execution
###############################################################################

main() {
    print_header

    # Navigate to script directory
    cd "$(dirname "$0")"
    print_success "Working directory: $(pwd)"
    echo ""

    # Run all pre-flight checks
    check_anythingllm || exit 1
    check_ollama || true  # Non-fatal
    check_env_file || exit 1
    check_node_modules || exit 1
    check_port_available || exit 1

    echo ""
    print_success "All pre-flight checks passed!"
    echo ""

    # Start FinBox
    print_step "Starting FinBox on http://localhost:${FINBOX_PORT}"
    print_step "Press Ctrl+C to stop"
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    # Launch Vite dev server
    npm run dev
}

# Trap Ctrl+C for clean exit
trap 'echo ""; print_warning "Shutting down FinBox..."; exit 0' INT

# Run main function
main
