# @ohmmade/ui

A shared UI component library for the OhmMade monorepo.

## Components

### LayoutContainer

A responsive container component that provides consistent max-width and padding across the application.

**Usage:**

```jsx
import LayoutContainer from '@ohmmade/ui/layout-container';

export default function MyPage() {
	return (
		<LayoutContainer className="py-8">
			<h1>My Content</h1>
		</LayoutContainer>
	);
}
```

**Props:**

- `children`: React nodes to render inside the container
- `className`: Additional CSS classes to apply (optional)

**Default Styles:**

- `w-full`: Full width
- `max-w-7xl`: Maximum width of 80rem (1280px)
- `mx-auto`: Center horizontally
- `px-4 sm:px-6 lg:px-8 xl:px-0`: Responsive horizontal padding

## Adding New Components

1. Create your component in the `src/` directory
2. Export it from the `package.json` exports field
3. Update this README with usage documentation
4. Import the component in your app using the package path

## Styling

This package uses Tailwind CSS v4. The styles are imported from `@ohmmade/tailwind-config` to ensure consistency across all packages.

To use this package in an app:

1. Add `@ohmmade/ui` as a workspace dependency
2. Import the styles: `@import '@ohmmade/ui/styles.css';`
3. Import components using the package path
