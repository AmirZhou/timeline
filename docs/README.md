# Timeline Project Documentation

This folder contains comprehensive documentation for the timeline project and its NPM package `@bitravage/timeline`.

## 📚 **Documentation Index**

### **For Maintainers**
- **[NPM Package Maintenance](./NPM_PACKAGE_MAINTENANCE.md)** - Step-by-step guide for updating and publishing the NPM package
- **[Development Workflow](./DEVELOPMENT_WORKFLOW.md)** - Development processes, branch management, and contribution guidelines

### **For Users**
- **[Package README](../README-package.md)** - User-facing documentation for the NPM package
- **[Project Overview](../CLAUDE.md)** - Comprehensive technical overview of the entire codebase

---

## 🎯 **Quick Reference**

### **Publishing Updates**
```bash
# 1. Version bump
npm version patch|minor|major

# 2. Build package  
npm run build:lib

# 3. Publish to NPM
npm publish --access public
```

### **Development Setup**
```bash
git checkout npm-package-timeline
npm install
npm run dev
```

### **Package Information**
- **Name**: `@bitravage/timeline`
- **Version**: `1.0.0`
- **NPM URL**: https://www.npmjs.com/package/@bitravage/timeline
- **Size**: 51.8 kB compressed

---

## 🏗️ **Project Structure**

This project serves dual purposes:
1. **Original Timeline App**: Full-screen timeline application
2. **NPM Package**: Reusable React component (`@bitravage/timeline`)

Both are maintained in the same repository with different build targets and branches.

---

## 📞 **Support**

For questions or issues:
- Check the troubleshooting sections in the workflow guides
- Review the comprehensive technical overview in `CLAUDE.md`
- Examine component source code with JSDoc comments

---

**Last Updated**: August 25, 2025  
**Maintainer**: bitravage