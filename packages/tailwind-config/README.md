# @ohmmade/tailwind-config

Shared Tailwind CSS configuration for all packages in the OhmMade monorepo.

## Usage

### For Apps (Next.js, etc.)

In your app's `globals.css` or main CSS file:

```css
@import 'tailwindcss';
@import '@ohmmade/tailwind-config/styles.css';
```

### For New Shared Packages

When creating a new shared package, you don't need to create individual `styles.css` files. The shared config automatically scans all packages in the `packages/` directory.

#### Package Structure

```
packages/
  ├── tailwind-config/     # This package (handles all Tailwind scanning)
  ├── providers/           # Your package
  ├── ui/                  # Future UI package
  ├── components/          # Future components package
  └── utils/               # Future utils package
```

#### Adding New Package Types

If you add a new package type, update `packages/tailwind-config/styles.css`:

```css
@source "../providers/**/*.{js,jsx,ts,tsx}";
@source "../ui/**/*.{js,jsx,ts,tsx}";
@source "../components/**/*.{js,jsx,ts,tsx}";
@source "../utils/**/*.{js,jsx,ts,tsx}";
@source "../your-new-package/**/*.{js,jsx,ts,tsx}";  // Add this line
```

## Benefits

- ✅ **Single source of truth** for Tailwind configuration
- ✅ **Automatic scanning** of all shared packages
- ✅ **Easy to maintain** - no need to create individual styles.css files
- ✅ **Consistent styling** across all packages
- ✅ **Better performance** - centralized scanning instead of multiple imports

## Troubleshooting

If Tailwind classes aren't working in a shared package:

1. Make sure the package is included in `packages/tailwind-config/styles.css`
2. Restart the dev server after adding new packages
3. Clear the `.next` cache if needed: `rm -rf .next`
