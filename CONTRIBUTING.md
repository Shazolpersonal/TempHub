# Contributing to TempHub

Thank you for your interest in contributing to TempHub! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of experience level, background, or identity.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Provide constructive feedback
- Focus on what's best for the project
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Trolling or insulting comments
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Development environment set up:**
   - Follow [PROJECT_SETUP.md](./PROJECT_SETUP.md) for detailed instructions
   - Node.js 18+, npm, and Git installed
   - Gemini API key configured

2. **Familiarity with the tech stack:**
   - Next.js 14 (App Router)
   - React and TypeScript
   - Tailwind CSS
   - Vitest for testing

3. **Read the documentation:**
   - [README.md](./README.md) - Project overview
   - [API_ENDPOINTS.md](./API_ENDPOINTS.md) - API documentation
   - Design and requirements in `.kiro/specs/`

### Fork and Clone

1. **Fork the repository:**
   - Click "Fork" button on GitHub
   - This creates a copy in your account

2. **Clone your fork:**
   ```bash
   git clone https://github.com/your-username/temphub.git
   cd temphub
   ```

3. **Add upstream remote:**
   ```bash
   git remote add upstream https://github.com/original-owner/temphub.git
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Set up environment:**
   ```bash
   cp .env.example .env.local
   # Add your GEMINI_API_KEY to .env.local
   ```

---

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates
- `chore/` - Maintenance tasks

### 2. Make Your Changes

1. **Write code:**
   - Follow the [coding standards](#coding-standards)
   - Keep changes focused and atomic
   - Write clear, self-documenting code

2. **Test your changes:**
   ```bash
   npm run lint        # Check code quality
   npm test            # Run unit tests
   npm run build       # Verify build succeeds
   npm run dev         # Test locally
   ```

3. **Write tests:**
   - Add unit tests for new functions
   - Add integration tests for API changes
   - Ensure all tests pass

### 3. Commit Your Changes

Follow the [commit guidelines](#commit-guidelines):

```bash
git add .
git commit -m "feat: add new template category filter"
```

### 4. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create pull request on GitHub
# Fill out the PR template
```

---

## Coding Standards

### TypeScript

- **Use TypeScript for all new files**
- **Enable strict mode** - Already configured in `tsconfig.json`
- **Define proper types** - Avoid `any` when possible
- **Use interfaces for objects:**
  ```typescript
  // ✅ Good
  interface Template {
    id: string;
    name: string;
    category: string;
  }
  
  // ❌ Avoid
  const template: any = { ... };
  ```

### React Components

- **Use functional components with hooks**
- **Keep components small and focused**
- **Use proper prop types:**
  ```typescript
  interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
  }
  
  export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
    // Component implementation
  }
  ```

### File Organization

- **Components:** `components/feature-name.tsx`
- **Utilities:** `lib/feature-name.ts`
- **Types:** `types/index.ts`
- **Tests:** `__tests__/feature-name.test.ts`

### Naming Conventions

- **Files:** kebab-case (`template-card.tsx`)
- **Components:** PascalCase (`TemplateCard`)
- **Functions:** camelCase (`getTemplateById`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces:** PascalCase (`Template`, `GenerationRequest`)

### Code Style

- **Use Prettier for formatting** - Configured in `.prettierrc`
- **Use ESLint rules** - Configured in `.eslintrc.json`
- **Format on save** - Recommended in VS Code
- **Run before committing:**
  ```bash
  npm run lint
  npm run format
  ```

### Tailwind CSS

- **Use Tailwind utility classes** - Avoid custom CSS when possible
- **Use consistent spacing** - Follow Tailwind's spacing scale
- **Responsive design:**
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {/* Content */}
  </div>
  ```

### Comments and Documentation

- **Write self-documenting code** - Clear variable and function names
- **Add JSDoc for complex functions:**
  ```typescript
  /**
   * Generates an AI image using the Gemini API
   * @param prompt - The generation prompt
   * @param imageData - Base64 encoded image data
   * @returns Generated image data and metadata
   */
  export async function generateImage(
    prompt: string,
    imageData: string
  ): Promise<GenerationResponse> {
    // Implementation
  }
  ```
- **Explain "why" not "what"** - Code shows what, comments explain why
- **Update documentation** - Keep README and docs in sync with code

---

## Testing Guidelines

### Unit Tests

Write unit tests for:
- Utility functions
- Data transformations
- Validation logic
- Error handling

**Example:**
```typescript
// lib/__tests__/validation.test.ts
import { describe, it, expect } from 'vitest';
import { validateFileSize } from '../validation';

describe('validateFileSize', () => {
  it('should accept files under 5MB', () => {
    const result = validateFileSize(4 * 1024 * 1024); // 4MB
    expect(result.valid).toBe(true);
  });

  it('should reject files over 5MB', () => {
    const result = validateFileSize(6 * 1024 * 1024); // 6MB
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });
});
```

### Integration Tests

Write integration tests for:
- API endpoints
- User flows
- Component interactions

**Example:**
```javascript
// test-api.mjs
const response = await fetch('http://localhost:3000/api/templates');
const data = await response.json();
assert(data.success === true, 'API should return success');
```

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run integration tests (requires dev server)
npm run dev  # In one terminal
node test-api.mjs  # In another terminal
```

### Test Coverage

- Aim for 80%+ coverage on critical paths
- All new features should include tests
- Bug fixes should include regression tests

---

## Commit Guidelines

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat: add category filter to template gallery"

# Bug fix
git commit -m "fix: resolve image upload validation error"

# Documentation
git commit -m "docs: update API endpoint documentation"

# With scope
git commit -m "feat(admin): add template deletion confirmation dialog"

# With body
git commit -m "fix: handle network errors in image generation

- Add retry logic for transient errors
- Display user-friendly error messages
- Log errors for debugging"
```

### Commit Best Practices

- **Keep commits atomic** - One logical change per commit
- **Write clear messages** - Describe what and why, not how
- **Use present tense** - "add feature" not "added feature"
- **Reference issues** - Include issue numbers when applicable
- **Commit often** - Small, frequent commits are better than large ones

---

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass:**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

2. **Update documentation:**
   - Update README if adding features
   - Update API docs if changing endpoints
   - Add comments for complex code

3. **Rebase on latest main:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

4. **Squash commits if needed:**
   - Combine related commits
   - Keep history clean and meaningful

### Creating the Pull Request

1. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open pull request on GitHub:**
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template

3. **PR Title:**
   - Follow commit message format
   - Example: `feat: add template search functionality`

4. **PR Description:**
   - Describe what changes were made
   - Explain why the changes are needed
   - List any breaking changes
   - Include screenshots for UI changes
   - Reference related issues

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks:**
   - CI/CD pipeline runs tests
   - Linting and type checking
   - Build verification

2. **Code review:**
   - Maintainers review your code
   - May request changes
   - Discussion and feedback

3. **Address feedback:**
   - Make requested changes
   - Push updates to same branch
   - Respond to comments

4. **Approval and merge:**
   - Once approved, PR will be merged
   - Your contribution is now part of the project!

---

## Reporting Issues

### Before Creating an Issue

1. **Search existing issues:**
   - Check if issue already exists
   - Add to existing discussion if relevant

2. **Verify the issue:**
   - Reproduce the problem
   - Test on latest version
   - Check if it's a configuration issue

### Creating an Issue

Use the appropriate template:

**Bug Report:**
```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10]
- Node version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]

## Screenshots
Add screenshots if applicable

## Additional Context
Any other relevant information
```

**Feature Request:**
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Any other relevant information
```

---

## Development Tips

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Open Vitest UI
node test-api.mjs        # Run API integration tests

# Git
git status               # Check status
git log --oneline        # View commit history
git diff                 # View changes
```

### Debugging

1. **Browser DevTools:**
   - Press F12 to open
   - Use Console for logs
   - Use Network tab for API calls
   - Use React DevTools for component inspection

2. **VS Code Debugging:**
   - Set breakpoints in code
   - Use Debug panel (Ctrl+Shift+D)
   - Inspect variables and call stack

3. **Server Logs:**
   - Check terminal where `npm run dev` is running
   - Look for error messages and stack traces

### Getting Help

- **Documentation:** Check README and other docs
- **Issues:** Search existing issues on GitHub
- **Discussions:** Use GitHub Discussions for questions
- **Code Review:** Ask for feedback in your PR

---

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes (for significant contributions)
- Project documentation (for major features)

Thank you for contributing to TempHub! 🎉

---

## Questions?

If you have questions about contributing:
- Open a GitHub Discussion
- Comment on a relevant issue
- Reach out to maintainers

We're here to help and appreciate your contributions!

---

**Last Updated:** October 2025
