#!/bin/bash

# =============================================================================
# NURSING CONFERENCES - DEVELOPMENT SERVER STARTUP SCRIPT (UNIX/LINUX/MACOS)
# =============================================================================
# This script starts both frontend and backend servers with environment variables
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to load environment variables from .env file
load_env_file() {
    local env_file="$1"
    
    if [[ -f "$env_file" ]]; then
        print_color $CYAN "Loading environment variables from .env file..."
        
        # Load environment variables, ignoring comments and empty lines
        set -a  # Automatically export all variables
        source <(grep -v '^#' "$env_file" | grep -v '^$' | sed 's/^/export /')
        set +a  # Stop automatically exporting
        
        local var_count=$(grep -v '^#' "$env_file" | grep -v '^$' | wc -l)
        print_color $GREEN "✅ Loaded $var_count environment variables"
        return 0
    else
        print_color $YELLOW "⚠️  No .env file found at: $env_file"
        print_color $YELLOW "   Copy .env.example to .env and configure your values"
        return 1
    fi
}

# Function to validate critical environment variables
validate_env_vars() {
    print_color $CYAN "Validating environment variables..."
    
    local critical_vars=(
        "NEXT_PUBLIC_SANITY_PROJECT_ID"
        "NEXT_PUBLIC_SANITY_DATASET"
        "SANITY_API_TOKEN"
    )
    
    local missing=()
    local configured=()
    
    for var in "${critical_vars[@]}"; do
        local value="${!var}"
        if [[ -z "$value" ]] || [[ "$value" == *"your_"*"_here"* ]]; then
            missing+=("$var")
        else
            configured+=("$var")
        fi
    done
    
    if [[ ${#configured[@]} -gt 0 ]]; then
        print_color $GREEN "✅ Configured variables:"
        for var in "${configured[@]}"; do
            print_color $GREEN "   - $var"
        done
    fi
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        print_color $YELLOW "⚠️  Missing or unconfigured variables:"
        for var in "${missing[@]}"; do
            print_color $YELLOW "   - $var"
        done
        echo ""
        print_color $YELLOW "Note: Some features may not work without proper configuration"
    fi
    
    return 0
}

# Parse command line arguments
PRODUCTION=false
SKIP_ENV_CHECK=false
HELP=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --production|-p)
            PRODUCTION=true
            shift
            ;;
        --skip-env-check|-s)
            SKIP_ENV_CHECK=true
            shift
            ;;
        --help|-h)
            HELP=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [[ "$HELP" == true ]]; then
    print_color $CYAN "=============================================================================="
    print_color $CYAN "NURSING CONFERENCES - SERVER STARTUP SCRIPT"
    print_color $CYAN "=============================================================================="
    echo ""
    print_color $YELLOW "Usage:"
    echo "  ./start-dev.sh                    # Start development servers"
    echo "  ./start-dev.sh --production       # Start production servers"
    echo "  ./start-dev.sh --skip-env-check   # Skip environment variable validation"
    echo "  ./start-dev.sh --help             # Show this help"
    echo ""
    print_color $YELLOW "Environment Variables:"
    echo "  The script will load environment variables from .env file"
    echo "  Copy .env.example to .env and configure your values"
    echo ""
    exit 0
fi

print_color $GREEN "=============================================================================="
print_color $GREEN "NURSING CONFERENCES - STARTING DEVELOPMENT ENVIRONMENT"
print_color $GREEN "=============================================================================="
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

# Check if Node.js is installed
print_color $CYAN "Checking system requirements..."
if ! command -v node &> /dev/null; then
    print_color $RED "❌ ERROR: Node.js is not installed!"
    print_color $YELLOW "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
print_color $GREEN "✅ Node.js version: $NODE_VERSION"

# Load environment variables
load_env_file "$ENV_FILE"
ENV_LOADED=$?

# Validate environment variables (unless skipped)
if [[ "$SKIP_ENV_CHECK" != true ]]; then
    validate_env_vars
fi

echo ""
print_color $GREEN "Starting servers..."
echo ""

# Determine which npm script to use
if [[ "$PRODUCTION" == true ]]; then
    FRONTEND_SCRIPT="start"
    BACKEND_SCRIPT="start"
else
    FRONTEND_SCRIPT="dev"
    BACKEND_SCRIPT="dev"
fi

# Start Frontend Server (Port 3000)
print_color $CYAN "🚀 Starting Frontend Server on port 3000..."
cd "$SCRIPT_DIR/nextjs-frontend"
npm install
npm run "$FRONTEND_SCRIPT" &
FRONTEND_PID=$!

# Wait a moment
sleep 3

# Start Backend Server (Port 3333)
print_color $CYAN "🚀 Starting Sanity Backend on port 3333..."
cd "$SCRIPT_DIR/SanityBackend"
npm install
npm run "$BACKEND_SCRIPT" &
BACKEND_PID=$!

echo ""
print_color $GREEN "=============================================================================="
print_color $GREEN "🎉 SERVERS STARTED SUCCESSFULLY!"
print_color $GREEN "=============================================================================="
print_color $YELLOW "📱 Frontend (Next.js):     http://localhost:3000"
print_color $YELLOW "🔧 Backend (Sanity CMS):   http://localhost:3333"
print_color $YELLOW "📊 Data Population:        http://localhost:3000/populate-sanity-backend"
echo ""
print_color $CYAN "Environment:"
if [[ "$PRODUCTION" == true ]]; then
    print_color $WHITE "  Mode: Production"
else
    print_color $WHITE "  Mode: Development"
fi

if [[ $ENV_LOADED -eq 0 ]]; then
    print_color $WHITE "  Env File: ✅ Loaded"
else
    print_color $WHITE "  Env File: ❌ Not Found"
fi

echo ""
print_color $CYAN "💡 Tips:"
print_color $WHITE "  - Both servers are running in the background"
print_color $WHITE "  - Press Ctrl+C to stop both servers gracefully"
print_color $WHITE "  - Check terminal output for detailed logs"
print_color $WHITE "  - Use 'ps aux | grep node' to see running processes"
echo ""
print_color $WHITE "Press Ctrl+C to stop both servers..."

# Function to cleanup on exit
cleanup() {
    echo ""
    print_color $CYAN "Stopping servers..."
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID 2>/dev/null
        print_color $GREEN "✅ Frontend server stopped"
    fi
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID 2>/dev/null
        print_color $GREEN "✅ Backend server stopped"
    fi
    print_color $GREEN "All servers stopped successfully."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Wait for background processes
wait
