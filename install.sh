#!/bin/bash

# ═══════════════════════════════════════════════════════
# Nexus Agent — Installation Script
# https://github.com/Botan-linux/nexus-agent
# ═══════════════════════════════════════════════════════

set -e

REPO="Botan-linux/nexus-agent"
BINARY_NAME="nexus"
INSTALL_DIR="${NEXUS_INSTALL_DIR:-/usr/local/bin}"
CONFIG_DIR="$HOME/.nexus-agent"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[OK]${NC} $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

banner() {
    echo ""
    echo -e "${CYAN}"
    echo "  ╔══════════════════════════════════════╗"
    echo "  ║       Nexus Agent Installer          ║"
    echo "  ║   Autonomous Multi-Agent System      ║"
    echo "  ╚══════════════════════════════════════╝"
    echo -e "${NC}"
}

check_deps() {
    info "Checking dependencies..."

    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        success "Node.js found: $NODE_VERSION"
    else
        error "Node.js is required. Install it from https://nodejs.org"
    fi

    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        success "npm found: $NPM_VERSION"
    else
        error "npm is required. Install it with Node.js"
    fi
}

detect_os() {
    OS="$(uname -s)"
    case "$OS" in
        Linux*)  ARCH=$(uname -m); MACHINE="linux-${ARCH}" ;;
        Darwin*) ARCH=$(uname -m); MACHINE="macos-${ARCH}" ;;
        *)       error "Unsupported OS: $OS" ;;
    esac
    success "Detected: $MACHINE"
}

install_npm() {
    info "Installing nexus-agent via npm..."

    if [ "$(id -u)" -eq 0 ]; then
        npm install -g nexus-agent 2>/dev/null || npm install -g "github:${REPO}" 2>/dev/null
    else
        warn "No root access. Installing to ~/.local/bin..."
        mkdir -p "$HOME/.local/bin"
        npm install -g nexus-agent --prefix "$HOME/.local" 2>/dev/null || \
        npm install -g "github:${REPO}" --prefix "$HOME/.local" 2>/dev/null
        INSTALL_DIR="$HOME/.local/bin"

        # Add to PATH if not already there
        if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
            echo ""
            warn "Add to your PATH:"
            echo -e "  ${CYAN}echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.bashrc${NC}"
            echo -e "  ${CYAN}source ~/.bashrc${NC}"
        fi
    fi

    success "nexus-agent installed!"
}

install_from_source() {
    info "Installing from source..."

    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"

    info "Cloning repository..."
    git clone "https://github.com/${REPO}.git" --depth 1 2>/dev/null || {
        error "Failed to clone repository. Check your internet connection."
    }

    cd nexus-agent

    info "Installing dependencies..."
    npm install --production 2>/dev/null

    info "Building CLI bundle..."
    npm run build:cli 2>/dev/null || {
        warn "Build script not found. Using tsx directly..."
        mkdir -p dist
        cp src/cli.ts dist/cli.js
    }

    # Install binary
    info "Installing to ${INSTALL_DIR}..."
    if [ "$(id -u)" -eq 0 ]; then
        mkdir -p "$INSTALL_DIR"
        cp dist/nexus-cli.mjs "$INSTALL_DIR/nexus" 2>/dev/null || cp dist/cli.js "$INSTALL_DIR/nexus"
        chmod +x "$INSTALL_DIR/nexus"
    else
        mkdir -p "$HOME/.local/bin"
        cp dist/nexus-cli.mjs "$HOME/.local/bin/nexus" 2>/dev/null || cp dist/cli.js "$HOME/.local/bin/nexus"
        chmod +x "$HOME/.local/bin/nexus"
        INSTALL_DIR="$HOME/.local/bin"
    fi

    # Cleanup
    cd /
    rm -rf "$TEMP_DIR"

    success "Installed from source!"
}

setup_config() {
    info "Setting up config directory..."
    mkdir -p "$CONFIG_DIR"

    if [ ! -f "$CONFIG_DIR/config.json" ]; then
        cat > "$CONFIG_DIR/config.json" << 'EOF'
{
  "provider": "zai",
  "model": null,
  "apiKey": null,
  "baseUrl": null,
  "ollamaUrl": "http://localhost:11434"
}
EOF
        success "Config created: $CONFIG_DIR/config.json"
    else
        success "Config exists: $CONFIG_DIR/config.json"
    fi
}

verify_install() {
    echo ""
    info "Verifying installation..."

    # Determine which nexus binary to check
    if [ "$(id -u)" -eq 0 ]; then
        NEXUS_BIN="$INSTALL_DIR/nexus"
    else
        NEXUS_BIN="$HOME/.local/bin/nexus"
    fi

    export PATH="$INSTALL_DIR:$PATH"

    if command -v nexus &> /dev/null || [ -f "$NEXUS_BIN" ]; then
        success "Nexus Agent is installed!"
        echo ""
        echo -e "  ${CYAN}Usage:${NC}"
        echo "    nexus chat          Start interactive chat"
        echo "    nexus serve         Start Web UI (http://localhost:3000)"
        echo "    nexus run <agent>   Run specific agent"
        echo "    nexus auto <task>   Auto-route task"
        echo "    nexus list          List agents"
        echo "    nexus config        Manage configuration"
        echo ""
        echo -e "  ${CYAN}Config:${NC} $CONFIG_DIR/config.json"
        echo ""
        echo -e "  ${CYAN}Quick Start:${NC}"
        echo "    nexus serve         → Open http://localhost:3000"
        echo "    nexus chat          → Terminal chat mode"
        echo ""
    else
        warn "Binary not found in PATH. You may need to restart your terminal."
        echo "  Manual: $NEXUS_BIN"
    fi
}

# ─── MAIN ──────────────────────────────────────────────
banner()

METHOD="${1:-npm}"

case "$METHOD" in
    npm)
        check_deps
        detect_os
        setup_config
        install_npm
        verify_install
        ;;
    source)
        check_deps
        detect_os
        setup_config
        install_from_source
        verify_install
        ;;
    *)
        echo ""
        echo "  Usage: install.sh [npm|source]"
        echo ""
        echo "  Methods:"
        echo "    npm     Install via npm (default, requires npm)"
        echo "    source  Install from GitHub source"
        echo ""
        echo "  Quick install:"
        echo -e "    ${CYAN}curl -fsSL https://raw.githubusercontent.com/Botan-linux/nexus-agent/main/install.sh | bash${NC}"
        echo ""
        exit 0
        ;;
esac
