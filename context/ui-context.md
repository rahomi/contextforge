# ContextForge - UI Context

## Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;

  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;

  /* Success Colors */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;

  /* Warning Colors */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;

  /* Error Colors */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;

  /* Dark Mode */
  --dark-bg: #0f172a;
  --dark-surface: #1e293b;
  --dark-border: #334155;
}
```

### Typography
```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### Spacing Scale
```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
}
```

## Component Patterns

### Buttons
```jsx
// Primary Button
<Button variant="primary" size="md">
  Button Text
</Button>

// Variants: primary, secondary, outline, ghost, danger
// Sizes: sm, md, lg
```

### Cards
```jsx
// Standard Card
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Body>
    Content here
  </Card.Body>
  <Card.Footer>
    Actions
  </Card.Footer>
</Card>
```

### Forms
```jsx
// Form Group
<FormGroup>
  <FormLabel>Label</FormLabel>
  <FormInput type="text" placeholder="Placeholder" />
  <FormError message="Error message" />
</FormGroup>
```

### Tables
```jsx
// Data Table
<Table>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Column 1</Table.HeaderCell>
      <Table.HeaderCell>Column 2</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Data 1</Table.Cell>
      <Table.Cell>Data 2</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Modals
```jsx
// Modal Dialog
<Modal isOpen={isOpen} onClose={handleClose}>
  <Modal.Header>
    <Modal.Title>Modal Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Modal content
  </Modal.Body>
  <Modal.Footer>
    <Button onClick={handleClose}>Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Modal.Footer>
</Modal>
```

## Layout Rules

### Page Layout
```
┌─────────────────────────────────────────────────────────┐
│                      Header/Nav                         │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│   Side   │                 Main Content                 │
│   bar    │                                              │
│          │  ┌────────────────────────────────────────┐  │
│          │  │           Page Header                   │  │
│          │  ├────────────────────────────────────────┤  │
│          │  │                                        │  │
│          │  │           Page Content                 │  │
│          │  │                                        │  │
│          │  └────────────────────────────────────────┘  │
│          │                                              │
├──────────┴──────────────────────────────────────────────┤
│                      Footer (optional)                  │
└─────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints
```css
/* Mobile First Approach */
/* Small devices (phones, 640px and below) */
@media (max-width: 640px) { }

/* Medium devices (tablets, 768px and below) */
@media (max-width: 768px) { }

/* Large devices (desktops, 1024px and below) */
@media (max-width: 1024px) { }

/* Extra large devices (large desktops, 1280px and below) */
@media (max-width: 1280px) { }
```

### Grid System
```css
/* 12-column grid system */
.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }

@media (max-width: 768px) {
  .grid-cols-2, .grid-cols-3, .grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
```

## Accessibility Rules

### WCAG 2.1 Compliance
- **Level AA** compliance minimum
- Target **Level AAA** where feasible

### Color Contrast
- Normal text: minimum 4.5:1 contrast ratio
- Large text: minimum 3:1 contrast ratio
- UI components: minimum 3:1 contrast ratio

### Keyboard Navigation
- All interactive elements must be focusable
- Focus order must be logical
- Focus indicators must be visible
- Support Escape key to close modals/dropdowns

### ARIA Attributes
```jsx
// Use appropriate ARIA roles
<button aria-label="Close dialog">×</button>
<nav aria-label="Main navigation">...</nav>
<dialog aria-labelledby="dialog-title">...</dialog>

// Announce dynamic content changes
<div aria-live="polite" aria-atomic="true">
  {notificationMessage}
</div>

// Form field associations
<label htmlFor="email">Email</label>
<input id="email" aria-describedby="email-error" aria-invalid={hasError} />
```

### Screen Reader Considerations
- Provide text alternatives for images
- Use semantic HTML elements
- Structure headings hierarchically
- Provide skip navigation links
- Test with screen readers (NVDA, VoiceOver)

## Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Collapsible sidebar (hamburger menu)
- Stack navigation items vertically
- Full-width buttons and inputs
- Touch-friendly tap targets (minimum 44px)

### Tablet (768px - 1024px)
- Two column layout where appropriate
- Collapsible sidebar
- Responsive tables (horizontal scroll)
- Adaptive navigation

### Desktop (> 1024px)
- Full sidebar navigation
- Multi-column layouts
- Hover states for interactive elements
- More information density

## Dark Mode

### Implementation
```css
/* Use CSS custom properties */
.dark {
  --bg-primary: var(--dark-bg);
  --bg-surface: var(--dark-surface);
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --border-color: var(--dark-border);
}

/* Media query for system preference */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    /* Dark mode styles */
  }
}
```

### User Preference
- Store user preference in localStorage
- Sync preference across devices (future)
- Default to system preference
- Allow manual override

## Loading States

### Skeleton Loading
```jsx
<Skeleton>
  <Skeleton.Header />
  <Skeleton.Text lines={3} />
  <Skeleton.Image />
</Skeleton>
```

### Spinners
```jsx
<Spinner size="sm" />   /* 16px */
<Spinner size="md" />   /* 24px */
<Spinner size="lg" />   /* 32px */
```

### Progress Indicators
```jsx
<ProgressBar value={75} max={100} />
<ProgressRing value={75} />
```

## Animation Guidelines

### Transitions
```css
/* Standard transition */
.transition {
  transition-property: color, background-color, border-color, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Slow transition */
.transition-slow {
  transition-duration: 300ms;
}
```

### Motion Principles
- **Purposeful:** Animations should serve a purpose
- **Quick:** Keep animations under 300ms
- **Subtle:** Avoid distracting animations
- **Respect reduced motion:** Support `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
</contents>