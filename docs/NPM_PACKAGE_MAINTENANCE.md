# NPM Package Maintenance Guide
## @bitravage/timeline

This document provides step-by-step instructions for maintaining and updating the `@bitravage/timeline` NPM package.

---

## 📦 **Package Overview**

- **Package Name**: `@bitravage/timeline`
- **Current Version**: `1.0.0`
- **NPM URL**: https://www.npmjs.com/package/@bitravage/timeline
- **Repository**: https://github.com/AmirZhou/timeline
- **Branch**: `npm-package-timeline`

---

## 🔧 **Development Setup**

### **Prerequisites**
```bash
# Required tools
Node.js 16+
NPM account with 'bitravage' username
Git access to the repository
```

### **Environment Setup**
```bash
# Clone and setup
git checkout npm-package-timeline
npm install

# Environment variables needed
VITE_CONVEX_URL=https://courteous-tortoise-261.convex.cloud
NOTION_API_KEY=your_notion_api_key_here

# Convex deployment environment variables
NOTION_DATABASE_ID=your_notion_database_id_here
```

---

## 🚀 **Publishing Updates**

### **1. Version Bump**
Choose the appropriate version bump based on changes:

```bash
# Patch version (bug fixes): 1.0.0 → 1.0.1
npm version patch

# Minor version (new features): 1.0.0 → 1.1.0
npm version minor

# Major version (breaking changes): 1.0.0 → 2.0.0
npm version major
```

### **2. Build the Package**
```bash
# Build library for distribution
npm run build:lib

# Verify build output
ls -la dist/
# Should contain: index.es.js, index.umd.js
```

### **3. Test the Package**
```bash
# Run development server to test
npm run dev

# Test both themes in browser at http://localhost:5174/
# - Dark theme (default)
# - Light theme
# - Notion data sync functionality
```

### **4. Publish to NPM**
```bash
# Login to NPM (if not already logged in)
npm login
# Username: bitravage
# Email: yue.zhou@edu.sait.ca

# Publish package (must use --access public for scoped packages)
npm publish --access public
```

**Important Notes:**
- Always use `--access public` flag for scoped packages (`@bitravage/`)
- Without this flag, NPM tries to publish as private (requires paid subscription)
- If 2FA is enabled, provide OTP: `npm publish --access public --otp=123456`

---

## 🛠️ **Development Workflow**

### **Making Changes**

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Update source code in `src/`
   - Main component: `src/Timeline.tsx`
   - Theme system: `src/components/providers/ThemeProvider.tsx`

3. **Test Changes**
   ```bash
   npm run dev
   # Test in browser, verify both themes work
   ```

4. **Build and Test Package**
   ```bash
   npm run build:lib
   # Verify no build errors
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "your commit message"
   ```

### **Merging to Main Package Branch**
```bash
git checkout npm-package-timeline
git merge feature/your-feature-name
git push origin npm-package-timeline
```

---

## 📋 **Build Configuration**

### **Package.json Key Fields**
```json
{
  "name": "@bitravage/timeline",
  "main": "dist/index.umd.js",       // UMD format for CommonJS
  "module": "dist/index.es.js",      // ES modules for bundlers
  "files": ["dist"],                 // Only dist folder is published
  "scripts": {
    "build:lib": "vite build --mode lib",
    "prepublishOnly": "npm run build:lib"
  }
}
```

### **Vite Configuration**
- **Library mode**: `vite.config.ts` has special `lib` mode
- **External dependencies**: React and React-DOM are external (not bundled)
- **Output formats**: ES modules and UMD for maximum compatibility

---

## 🎨 **Theme System**

### **Adding New Themes**
1. **Update ThemeProvider.tsx**:
   ```typescript
   const newTheme: ThemeColors = {
     background: '#your-bg-color',
     text: '#your-text-color',
     // ... other colors
     glass: {
       background: 'rgba(...)',
       border: 'rgba(...)'
     }
   };
   ```

2. **Update Theme Type**:
   ```typescript
   export type ThemeMode = 'dark' | 'light' | 'new-theme';
   ```

3. **Test thoroughly** with `npm run dev`

---

## 🔍 **Troubleshooting**

### **Common Issues**

**1. "process is not defined" Error**
- Fixed in current version with browser-compatible env detection
- Uses `import.meta.env` for Vite, safe `process.env` checks for others

**2. "Payment Required" Error**
- Use `--access public` flag when publishing
- Scoped packages (`@bitravage/`) default to private

**3. Build Errors**
```bash
# Clear cache and rebuild
rm -rf dist/ node_modules/.vite
npm run build:lib
```

**4. Environment Variables**
- Frontend: Uses `VITE_CONVEX_URL` from `.env.local`
- Backend: Needs `NOTION_API_KEY` and `NOTION_DATABASE_ID` in Convex deployment

---

## 📊 **Package Stats**

Current package size:
- **Compressed**: 51.8 kB
- **Unpacked**: 188.0 kB
- **Files**: 4 (2 JS bundles + package.json + README)

Target to keep package under 60 kB compressed for optimal download speed.

---

## 🔄 **Dependency Updates**

### **Updating Dependencies**
```bash
# Check outdated packages
npm outdated

# Update specific package
npm install package-name@latest

# Update all dependencies (careful with breaking changes)
npm update
```

### **Testing After Updates**
1. `npm run build:lib` (verify builds successfully)
2. `npm run dev` (test in browser)
3. Test both dark and light themes
4. Verify Notion sync functionality

---

## 📝 **Documentation Updates**

When making significant changes:

1. **Update this file** if process changes
2. **Update README-package.md** for user-facing changes  
3. **Update CLAUDE.md** if architecture changes
4. **Update component JSDoc comments** for API changes

---

## ✅ **Pre-Publish Checklist**

Before every NPM publish:

- [ ] Code changes tested in development
- [ ] `npm run build:lib` succeeds without errors
- [ ] Both themes work correctly
- [ ] Notion sync functionality works
- [ ] Version bumped appropriately (`npm version patch/minor/major`)
- [ ] Changes committed to git
- [ ] Branch pushed to origin
- [ ] Ready to publish with `npm publish --access public`

---

**Last Updated**: August 25, 2025  
**Package Version**: 1.0.0  
**Maintainer**: bitravage