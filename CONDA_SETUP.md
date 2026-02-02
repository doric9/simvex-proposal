# 🐍 Conda Environment Setup Guide

You requested to set up the Conda environment and install packages yourself. Here are the steps to get started:

## 1. Create Conda Environment

Open your terminal (Anaconda Prompt or PowerShell with Conda) and run:

```bash
# Create a new environment named 'simvex'
conda create -n simvex -y

# Activate the environment
conda activate simvex
```

## 2. Install Node.js via Conda

Since this is a React/Vite project, you need Node.js. You can install it using Conda:

```bash
# Install Node.js (Version 18 or later is recommended)
conda install -c conda-forge nodejs=20 -y
```

## 3. Install Project Dependencies

Navigate to the project directory and install the required packages:

```bash
cd c:\2026\simvex_3Dviewer\simvex-hook-refactor

# Install dependencies from package.json
npm install
```

## 4. Run the Development Server

Start the local development server:

```bash
npm run dev
```

## 5. Build for Production

To verify the build:

```bash
npm run build
```

---

## 📝 Note on Refactoring

The following changes were made to the original code to ensure stability and type safety:
- **Converted Hooks to TypeScript**: All files in `src/hooks/*.js` have been converted to `src/hooks/*.ts` to resolve build errors and provide better type checking.
- **Fixed `tsconfig.json` Issues**: The project was configured for TypeScript but contained JavaScript hooks, which caused build failures. The conversion resolves this.
