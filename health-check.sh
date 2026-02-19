#!/bin/bash

###############################################################################
# FinBox Health Check Utility
#
# This script diagnoses common issues with Mac mini deployments.
# Run this when FinBox is not working properly.
#
# Usage: ./health-check.sh
###############################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
ANYTHINGLLM_URL="http://localhost:3001"
OLLAMA_URL="http://localhost:11434"
FINBOX_PORT=5173

###############################################################################
# Helper Functions
###############################################################################

print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}   FinBox Health Check - Diagnostic Tool${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${CYAN}▶ $1${NC}"
    echo -e "${CYAN}───────────────────────────────────────────────────────────${NC}"
}

print_check() {
    echo -e "  ${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "  ${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "  ${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "  ${RED}✗${NC} $1"
}

print_info() {
    echo -e "  ${CYAN}ℹ${NC} $1"
}

###############################################################################
# Health Checks
###############################################################################

check_system_info() {
    print_section "System Information"

    print_check "Operating System"
    print_info "$(sw_vers -productName) $(sw_vers -productVersion) (Build $(sw_vers -buildVersion))"

    print_check "Hardware"
    print_info "$(sysctl -n hw.model)"

    print_check "Memory"
    local mem_gb=$(( $(sysctl -n hw.memsize) / 1024 / 1024 / 1024 ))
    print_info "${mem_gb} GB RAM"

    print_check "Disk Space"
    local disk_info=$(df -h / | tail -1 | awk '{print "Used: " $3 " / " $2 " (" $5 " full)"}')
    print_info "$disk_info"
}

check_node_environment() {
    print_section "Node.js Environment"

    print_check "Node.js Version"
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        print_success "$node_version installed"

        # Check if version is >= 18
        local major_version=$(echo $node_version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$major_version" -lt 18 ]; then
            print_warning "Node.js 18+ recommended (you have v$major_version)"
            print_info "Upgrade with: brew upgrade node"
        fi
    else
        print_error "Node.js not found"
        print_info "Install with: brew install node"
        return 1
    fi

    print_check "npm Version"
    if command -v npm &> /dev/null; then
        local npm_version=$(npm --version)
        print_success "npm v$npm_version installed"
    else
        print_error "npm not found"
        return 1
    fi

    print_check "FinBox Dependencies"
    if [ -d "node_modules" ]; then
        local pkg_count=$(find node_modules -maxdepth 1 -type d | wc -l | xargs)
        print_success "$pkg_count packages installed"
    else
        print_error "node_modules not found"
        print_info "Run: npm install"
        return 1
    fi
}

check_anythingllm() {
    print_section "AnythingLLM Service"

    print_check "Connection to $ANYTHINGLLM_URL"
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "${ANYTHINGLLM_URL}/api/v1/auth" 2>/dev/null)

    if [[ "$http_code" =~ ^(200|401|403)$ ]]; then
        print_success "AnythingLLM is running (HTTP $http_code)"

        # Try to get system info
        print_check "AnythingLLM Version"
        local version_info=$(curl -s "${ANYTHINGLLM_URL}/api/system" 2>/dev/null | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
        if [ -n "$version_info" ]; then
            print_info "Version: $version_info"
        fi

    else
        print_error "AnythingLLM not responding (HTTP $http_code)"
        print_info "Start AnythingLLM application"
        print_info "Ensure it's configured to run on port 3001"
        return 1
    fi

    print_check "AnythingLLM Process"
    if pgrep -f "AnythingLLM" > /dev/null; then
        print_success "AnythingLLM process is running"
        local pid=$(pgrep -f "AnythingLLM" | head -1)
        print_info "PID: $pid"
    else
        print_warning "No AnythingLLM process detected"
    fi
}

check_ollama() {
    print_section "Ollama Service"

    print_check "Connection to $OLLAMA_URL"
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "${OLLAMA_URL}" 2>/dev/null)

    if [[ "$http_code" =~ ^(200|404)$ ]]; then
        print_success "Ollama is running (HTTP $http_code)"
    else
        print_warning "Ollama not responding (HTTP $http_code)"
        print_info "Start Ollama with: ollama serve"
        print_info "Or install with: brew install ollama"
    fi

    print_check "Ollama CLI"
    if command -v ollama &> /dev/null; then
        print_success "Ollama CLI installed"

        print_check "Available Models"
        if ollama list 2>/dev/null | grep -q "llama"; then
            local models=$(ollama list 2>/dev/null | grep "llama" | awk '{print $1}')
            while IFS= read -r model; do
                print_success "Model: $model"
            done <<< "$models"

            # Check specifically for llama3.1:8b
            if ollama list 2>/dev/null | grep -q "llama3.1:8b"; then
                print_success "Recommended model llama3.1:8b found"
            else
                print_warning "llama3.1:8b not found"
                print_info "Install with: ollama pull llama3.1:8b"
            fi
        else
            print_warning "No Llama models found"
            print_info "Install with: ollama pull llama3.1:8b"
        fi
    else
        print_error "Ollama CLI not found"
        print_info "Install with: brew install ollama"
    fi
}

check_environment_config() {
    print_section "Environment Configuration"

    print_check ".env.local File"
    if [ -f ".env.local" ]; then
        print_success ".env.local exists"

        # Check API key
        if grep -q "VITE_ANYTHINGLLM_API_KEY=.\+" .env.local && ! grep -q 'VITE_ANYTHINGLLM_API_KEY=""' .env.local && ! grep -q 'VITE_ANYTHINGLLM_API_KEY=$' .env.local; then
            print_success "AnythingLLM API key is configured"
        else
            print_error "AnythingLLM API key not set"
            print_info "Add your API key to .env.local"
            print_info "Get API key from AnythingLLM > Settings > API Keys"
        fi

        # Check URL
        if grep -q "VITE_ANYTHINGLLM_URL=.\+" .env.local; then
            local url=$(grep "VITE_ANYTHINGLLM_URL=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
            print_info "AnythingLLM URL: $url"
        fi

        # Check workspace
        if grep -q "VITE_ANYTHINGLLM_WORKSPACE=.\+" .env.local; then
            local workspace=$(grep "VITE_ANYTHINGLLM_WORKSPACE=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
            print_info "Workspace: $workspace"
        fi

    else
        print_error ".env.local not found"
        if [ -f ".env.example" ]; then
            print_info "Create from template: cp .env.example .env.local"
        else
            print_error ".env.example not found either"
        fi
        return 1
    fi

    print_check ".env.example Template"
    if [ -f ".env.example" ]; then
        print_success ".env.example exists"
    else
        print_warning ".env.example not found"
    fi
}

check_network_ports() {
    print_section "Network Ports"

    print_check "Port 3001 (AnythingLLM)"
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        local pid=$(lsof -ti:3001 | head -1)
        local process=$(ps -p $pid -o comm= 2>/dev/null)
        print_success "Port 3001 in use by PID $pid ($process)"
    else
        print_warning "Port 3001 not in use"
        print_info "AnythingLLM should be listening on this port"
    fi

    print_check "Port 11434 (Ollama)"
    if lsof -Pi :11434 -sTCP:LISTEN -t >/dev/null 2>&1; then
        local pid=$(lsof -ti:11434 | head -1)
        local process=$(ps -p $pid -o comm= 2>/dev/null)
        print_success "Port 11434 in use by PID $pid ($process)"
    else
        print_warning "Port 11434 not in use"
        print_info "Ollama should be listening on this port"
    fi

    print_check "Port 5173 (FinBox/Vite)"
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
        local pid=$(lsof -ti:5173 | head -1)
        local process=$(ps -p $pid -o comm= 2>/dev/null)
        print_success "Port 5173 in use by PID $pid ($process)"
        print_warning "Another instance of FinBox may be running"
        print_info "Stop with: kill $pid"
    else
        print_success "Port 5173 available"
    fi
}

check_finbox_files() {
    print_section "FinBox Application Files"

    print_check "package.json"
    if [ -f "package.json" ]; then
        print_success "package.json exists"
        local name=$(grep '"name"' package.json | cut -d'"' -f4)
        local version=$(grep '"version"' package.json | cut -d'"' -f4)
        print_info "Project: $name v$version"
    else
        print_error "package.json not found - are you in the FinBox directory?"
        return 1
    fi

    print_check "Critical Application Files"
    local critical_files=(
        "src/main.tsx"
        "src/App.tsx"
        "src/lib/ai-client.ts"
        "src/lib/config.ts"
        "index.html"
        "vite.config.ts"
    )

    local missing_count=0
    for file in "${critical_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "$file"
        else
            print_error "$file not found"
            missing_count=$((missing_count + 1))
        fi
    done

    if [ $missing_count -gt 0 ]; then
        print_error "$missing_count critical files missing"
        return 1
    fi
}

check_startup_script() {
    print_section "Startup Script"

    print_check "start-finbox.sh"
    if [ -f "start-finbox.sh" ]; then
        print_success "start-finbox.sh exists"

        if [ -x "start-finbox.sh" ]; then
            print_success "Script is executable"
        else
            print_warning "Script is not executable"
            print_info "Make executable with: chmod +x start-finbox.sh"
        fi
    else
        print_error "start-finbox.sh not found"
    fi
}

###############################################################################
# Recommendations
###############################################################################

print_recommendations() {
    print_section "Recommendations"

    echo ""
    echo -e "${YELLOW}Common Issues and Solutions:${NC}"
    echo ""
    echo -e "  ${CYAN}1. AnythingLLM Not Responding:${NC}"
    echo "     • Open the AnythingLLM application"
    echo "     • Check it's running on port 3001"
    echo "     • Generate an API key in Settings > API Keys"
    echo ""
    echo -e "  ${CYAN}2. Missing API Key:${NC}"
    echo "     • Open AnythingLLM > Settings > API Keys"
    echo "     • Generate new API key"
    echo "     • Add to .env.local: VITE_ANYTHINGLLM_API_KEY=your-key-here"
    echo ""
    echo -e "  ${CYAN}3. Ollama Not Working:${NC}"
    echo "     • Install: brew install ollama"
    echo "     • Start service: ollama serve (runs in background)"
    echo "     • Pull model: ollama pull llama3.1:8b"
    echo ""
    echo -e "  ${CYAN}4. FinBox Won't Start:${NC}"
    echo "     • Ensure AnythingLLM is running first"
    echo "     • Check .env.local has API key configured"
    echo "     • Run: ./start-finbox.sh"
    echo ""
    echo -e "  ${CYAN}5. Port Conflicts:${NC}"
    echo "     • Check what's using port: lsof -i :5173"
    echo "     • Kill process: lsof -ti:5173 | xargs kill"
    echo ""
}

###############################################################################
# Main Execution
###############################################################################

main() {
    print_header

    # Navigate to script directory
    cd "$(dirname "$0")"
    print_info "Working directory: $(pwd)"

    # Run all health checks
    local checks_passed=0
    local checks_failed=0

    check_system_info

    if check_node_environment; then
        checks_passed=$((checks_passed + 1))
    else
        checks_failed=$((checks_failed + 1))
    fi

    if check_anythingllm; then
        checks_passed=$((checks_passed + 1))
    else
        checks_failed=$((checks_failed + 1))
    fi

    check_ollama  # Non-critical, don't count

    if check_environment_config; then
        checks_passed=$((checks_passed + 1))
    else
        checks_failed=$((checks_failed + 1))
    fi

    check_network_ports  # Informational only

    if check_finbox_files; then
        checks_passed=$((checks_passed + 1))
    else
        checks_failed=$((checks_failed + 1))
    fi

    check_startup_script  # Informational only

    print_recommendations

    # Summary
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    if [ $checks_failed -eq 0 ]; then
        echo -e "${GREEN}✓ All critical checks passed! FinBox should be ready to run.${NC}"
        echo -e "  Run: ${CYAN}./start-finbox.sh${NC}"
    else
        echo -e "${RED}✗ $checks_failed critical check(s) failed.${NC}"
        echo -e "  Review the errors above and follow the recommendations."
    fi
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Run main function
main
