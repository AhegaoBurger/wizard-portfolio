# Dynamic Rendering System - Project Context

## What This Document Is

This is context for understanding and discussing the architecture of a **JSON-driven dynamic rendering system** - a system that renders UI from declarative JSON definitions instead of hardcoded React components. The concepts here are informed by two real projects (ClaimLink and a personal portfolio) but the goal is to deeply understand the **general pattern** and build one correctly.

---

## The Core Problem

Traditional React apps have a 1:1 mapping: each page/view is a handwritten JSX component. To change what's displayed, you change code.

A dynamic rendering system inverts this: **a JSON definition describes what to render**, and a generic renderer walks that definition and produces React components. Changes to content, layout, and even interactive behavior happen by editing JSON, not code.

This is the same pattern used by:
- **CMS systems** (WordPress Gutenberg, Drupal's render arrays)
- **Form builders** (JSON Forms, React JSON Schema Form)
- **Page builders** (Puck, Craft.js, GrapesJS)
- **Low-code platforms** (Retool, Appsmith)

---

## The 3-Layer Architecture

The most flexible approach separates concerns into three layers within a single page definition:

### Schema Layer - "What data exists"
```json
{
  "profile": {
    "type": "object",
    "fields": {
      "name": { "type": "string" },
      "title": { "type": "string" },
      "avatar": { "type": "image" }
    }
  },
  "skills": {
    "type": "array",
    "items": {
      "type": "object",
      "fields": {
        "name": { "type": "string" },
        "level": { "type": "number" }
      }
    }
  }
}
```

**Purpose**: Defines field names, types, validation rules. Used for editor auto-complete, form generation, and Zod validation. The schema is the **contract** between data and layout.

### Layout Layer - "How to arrange it"
```json
{
  "type": "page",
  "responsive": { "desktop": "grid-2col", "mobile": "stack" },
  "children": [
    {
      "type": "window",
      "props": { "title": "Wizard_Profile" },
      "bind": "profile",
      "behaviors": [{ "preset": "fadeIn" }],
      "children": [
        { "type": "text", "field": "profile.name", "props": { "variant": "heading" } },
        { "type": "text", "field": "profile.title" }
      ]
    },
    {
      "type": "window",
      "props": { "title": "Skills" },
      "children": [
        {
          "type": "list",
          "bind": "skills",
          "itemLayout": {
            "type": "flex",
            "props": { "direction": "row" },
            "children": [
              { "type": "text", "field": "name" },
              { "type": "progress-bar", "field": "level", "props": { "max": 5 } }
            ]
          }
        }
      ]
    }
  ]
}
```

**Purpose**: A tree of component nodes. Each node has a `type` (resolved from a registry), optional `props`, optional `field`/`bind` for data binding, optional `behaviors` for interactivity, and optional `children`. The layout **never contains actual data values** - it only references them.

### Data Layer - "The actual values"
```json
{
  "profile": {
    "name": "Wizard",
    "title": "Archmage of Code",
    "avatar": "/images/wizard.png"
  },
  "skills": [
    { "name": "TypeScript", "level": 5 },
    { "name": "React", "level": 4 }
  ]
}
```

**Purpose**: The actual content. Flat key-value structure that the layout references via dot-path bindings.

### Why Separate Them?

Each layer changes independently:
- **Redesign the page?** Change Layout only. Schema and Data untouched.
- **Add a new field?** Add to Schema and Data. Layout stays the same until you're ready to display it.
- **Update content?** Change Data only. Layout and Schema untouched.
- **Build an editor?** Schema drives form generation automatically.

---

## The Rendering Pipeline

```
JSON PageDefinition
        │
        ▼
┌─────────────────┐
│  Zod Validation  │  ← Runtime type checking at load time
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PageRenderer    │  ← Top-level: provides DataContext, starts tree walk
│                  │
│  ┌─────────────┐ │
│  │ DataContext  │ │  ← React context holding data layer + dot-path resolver
│  └─────────────┘ │
└────────┬────────┘
         │
         ▼ (for each node in layout tree)
┌─────────────────┐
│  NodeRenderer    │  ← Recursive: resolves node.type from registry
│                  │
│  1. Look up component type in registry
│  2. Resolve data bindings (field → value)
│  3. Apply responsive hints
│  4. Wrap with BehaviorWrapper if behaviors exist
│  5. Render component with resolved props
│  6. Recursively render children
└─────────────────┘
```

### Data Binding Resolution

Simple dot-path lookup. No expressions, no computed values.

```typescript
function resolveField(data: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((obj, key) => obj?.[key], data);
}

// "profile.name" → data.profile.name → "Wizard"
// "skills[0].name" → data.skills[0].name → "TypeScript"
```

When a node has `bind: "skills"`, a scoped DataContext is created for its children. Inside that scope, `field: "name"` resolves relative to the current item, not the root data.

### List/Repeater Pattern

When the renderer encounters a `list` node with `bind` pointing to an array:

```json
{
  "type": "list",
  "bind": "skills",
  "itemLayout": {
    "type": "flex",
    "children": [
      { "type": "text", "field": "name" },
      { "type": "progress-bar", "field": "level" }
    ]
  }
}
```

The renderer:
1. Resolves `data.skills` → gets the array
2. Maps over each item
3. For each item, creates a scoped DataContext where `field: "name"` resolves to `item.name`
4. Renders `itemLayout` within that scope

This means `field` paths inside a list are **relative to the current item**, not the root data.

---

## Component Registry

A static `Map<string, React.ComponentType>` that maps type strings to React components.

```typescript
const registry = new Map<string, React.ComponentType<RendererComponentProps>>();

// Layout components
registry.set('page', PageContainer);
registry.set('box', Box);
registry.set('grid', Grid);
registry.set('flex', Flex);
registry.set('section', Section);
registry.set('columns', Columns);
registry.set('window', Window);

// Content components
registry.set('text', Text);
registry.set('image', ImageComponent);
registry.set('link', LinkComponent);
registry.set('list', ListRepeater);
registry.set('progress-bar', ProgressBar);

// Interactive components
registry.set('particle-effect', ParticleEffect);
registry.set('draggable-item', DraggableItem);
```

**All registered at build time.** Type-safe. Feature folders can contribute their own components (e.g., `features/grimoire/` registers `project-card`). The registry is the single source of truth for what can be rendered.

**What a registered component receives:**

```typescript
interface RendererComponentProps {
  node: LayoutNode;           // The raw node definition
  resolvedData?: unknown;     // The data resolved from field/bind paths
  children?: React.ReactNode; // Rendered children (from recursive NodeRenderer)
}
```

---

## Behavior Presets

Interactive behaviors (animations, particle effects, drag-and-drop) are configured in JSON via named presets:

```json
{ "behaviors": [{ "preset": "fadeIn" }, { "preset": "hover-sparkles" }] }
```

Presets are defined in code:

```typescript
const behaviorPresets = {
  'fadeIn': { animation: 'fadeIn', duration: 0.3 },
  'slideUp': { animation: 'slideUp', duration: 0.4, delay: 0.1 },
  'hover-sparkles': { trigger: 'hover', effect: 'particles', count: 15, color: 'white' },
  'explode-on-drop': { trigger: 'dragEnd', effect: 'explosion', particles: 12 },
  'pulse': { animation: 'pulse', duration: 1, repeat: Infinity },
};
```

The `BehaviorWrapper` component wraps any node that has behaviors, applying Framer Motion animations and event handlers based on the preset config. JSON says **what** behavior to use, code says **how** it works.

---

## Responsive Rendering

Single layout definition with responsive hints:

```json
{
  "type": "page",
  "responsive": { "desktop": "grid-2col", "mobile": "stack" }
}
```

The renderer checks the viewport (via `useMobile()` or equivalent) and applies the matching layout strategy:
- `grid-2col` → CSS grid with 2 columns
- `stack` → flex column (items stacked vertically)
- `grid-3col`, `flex-row`, `tabs`, `accordion` etc.

Same children, different arrangement. No separate layout definitions for desktop/mobile.

---

## Lessons from ClaimLink's Current System

### What Works Well

1. **Context-based data access**: `useTemplateContext()` provides `getFieldValue()`, `resolveAssetUrl()` etc. Components never fetch their own data - they receive it through context. Clean dependency inversion.

2. **Type-safe node system**: 18 node types with TypeScript discriminated unions and type guards. Runtime safety through explicit type checking.

3. **Variant-aware rendering**: Same component renders differently based on context (certificate view vs information view vs user view). Styling changes, not structure.

4. **Immutable tree operations**: `template-tree-utils.ts` provides `addNode`, `removeNode`, `updateNode`, `moveNode` - all return new arrays. Safe for editor undo/redo.

### What Causes Pain

1. **Redundancy**: Every token stores 4 copies of the template (template, certificateTemplate, userViewTemplate, formTemplate). ~1000 lines of conversion code exists just to transform between these.

2. **Mixed concerns**: The template node tree mixes layout (how things are arranged) with data references (what fields exist) with actual content. No clean separation.

3. **Conversion complexity**: `template-converter.ts` (~400 lines) and `view-generator.ts` (~593 lines) exist solely to convert between the form definition format and the render format. With Schema + Layout + Data separation, this code wouldn't need to exist.

4. **No visual editing**: Templates are defined in code. The Puck-based visual editor is planned but not yet built.

### The Evolution Path

```
v1.0 (Current): TemplateStructure + TemplateNode[] (dual format with conversion)
     │
     │  Problems: redundancy, conversion code, mixed concerns
     │
v2.0 (Planned): Puck-based single JSON format + visual editor
     │
     │  Solves: visual editing, removes conversion code
     │  Still has: mixed layout + data in single tree
     │
v3.0 (Vision): Schema + Layout + Data separation
     │
     │  Solves: all remaining concerns
     │  Enables: independent layer changes, auto-form generation,
     │           stylesheet-only redesigns
```

### Versioning Strategy

Old tokens minted with v1 format must always render correctly. Solution: **renderer registry**.

```typescript
const rendererRegistry = {
  "1.0.0": { Renderer: LegacyTemplateRenderer },
  "2.0.0": { Renderer: PuckCertificateRenderer },
  "3.0.0": { Renderer: SchemaLayoutDataRenderer },
};

// Token metadata includes version → dispatch to correct renderer
```

Frozen renderers for old versions. New features only added to latest version.

---

## Storage Architecture

### For a Personal Portfolio (SQLite)

```
content/*.json  →  Seed data (initial state, version-controlled)
                     │
                     ▼  (first server start)
              ┌──────────────┐
              │  SQLite DB    │  ← Primary storage after seeding
              │  pages table  │
              │  (id, route,  │
              │   definition, │  ← Full PageDefinition JSON blob
              │   version)    │
              └──────┬───────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   GET /api/pages   Editor       Seed check
   (read)           (write)      (skip if exists)
```

### For ClaimLink (On-Chain)

```
Collection metadata  →  Template schema + layout
Token metadata       →  Template version + field values + (optionally) layout copy

Rendering:
  1. Load token metadata
  2. Check claimlink.template_version
  3. Dispatch to versioned renderer
  4. Renderer loads layout from token (or falls back to collection)
  5. Resolves field values from token metadata
  6. Renders component tree
```

---

## The Editor System

Split-pane: code editor (left) + live preview (right).

```
┌─────────────────────────────────────────┐
│  Code Editor (Monaco)  │  Live Preview   │
│                        │                 │
│  {                     │  ┌───────────┐  │
│    "schema": {...},    │  │ Window    │  │
│    "layout": {...},    │  │ ┌───────┐ │  │
│    "data": {...}       │  │ │ Name  │ │  │
│  }                     │  │ │ Title │ │  │
│                        │  │ └───────┘ │  │
│                        │  └───────────┘  │
└─────────────────────────────────────────┘
```

**Flow**:
1. Editor's `onChange` updates local React state with the new JSON
2. State is passed directly to `<PageRenderer>` in the preview pane
3. Zod validates on each change for inline error display
4. No server round-trip until the user clicks Save
5. Save sends validated JSON to API → writes to SQLite

The preview reuses the **exact same renderer** used in production. What you see in the editor is what you get on the live site.

---

## Key Design Decisions & Rationale

| Decision | Choice | Why |
|----------|--------|-----|
| Layer architecture | Schema + Layout + Data (3-layer) | Independent changes per layer, auto-form generation, separation of concerns |
| Page definition | Unified file (3 layers inside one JSON) | One file per page, simple to manage, easy to version |
| Component registry | Static Map, build-time | Type-safe, no runtime surprises, explicit control |
| Data binding | Simple dot-path lookup | Easy to implement, debug, validate. No parser complexity |
| Behaviors | Named presets | Simple JSON, full control in code. New presets = new code, not new JSON syntax |
| Responsive | Single layout with hints | Less JSON duplication, same children different arrangement |
| Validation | Zod schemas | Runtime type safety, good error messages, works on both client and server |
| Storage | SQLite (JSON as seed) | Fast reads, editable via API, seed from version-controlled files |
| Editor | Code editor + live preview | Developer-friendly, maximum control, reuses production renderer |

---

## Open Questions for Discussion

These are areas where the mental model could be deepened:

1. **Schema ↔ Layout coupling**: If the schema says a field is type `image`, should the renderer auto-select the `image` component, or must the layout explicitly use `{ type: "image", field: "..." }`? (Current answer: layout is explicit, but schema could provide hints for editor auto-complete.)

2. **Nested data binding**: When a list item has nested objects (e.g., `skills[].metadata.category`), how deep should the scoped context go? Does `bind` only work one level, or does it nest?

3. **Cross-page data**: Can one page reference data from another? (e.g., home page showing latest 3 projects from grimoire's data). Or does each page own its data completely?

4. **Dynamic component loading**: The registry is static, but what if a page definition references a component type that doesn't exist? Fallback component? Error boundary? Skip?

5. **Behavior composition**: Can a node have multiple behaviors? Do they compose (fadeIn + hover-sparkles)? What about conflicts (two behaviors both triggering on hover)?

6. **Editor ergonomics**: Raw JSON editing is powerful but verbose. Should there be schema-driven auto-complete? Snippet templates? Drag-and-drop for layout rearrangement?

7. **Migration path**: How to incrementally adopt the renderer? Can some pages use the renderer while others remain hardcoded during transition?

8. **Performance**: Deep layout trees with many nodes - should the renderer memoize resolved data? Virtualize long lists? Lazy-load heavy interactive components?

---

## Key Terminology

| Term | Meaning |
|------|---------|
| **PageDefinition** | Complete JSON describing a page: meta + schema + layout + data |
| **LayoutNode** | A single node in the layout tree: type, props, field, children |
| **Schema** | Field definitions layer: types, labels, validation |
| **Registry** | Static map of type strings → React components |
| **Behavior preset** | Named animation/interaction config (e.g., "fadeIn", "hover-sparkles") |
| **DataContext** | React context providing data + dot-path resolver to all descendants |
| **Bind** | Connects a container node to a data path (scopes its children's field resolution) |
| **Field** | Connects a leaf node to a specific data value via dot-path |
| **NodeRenderer** | Recursive component that resolves and renders a single LayoutNode |
| **BehaviorWrapper** | HOC that applies preset animations/interactions to a node |
| **Responsive hints** | Layout strategy per breakpoint (e.g., desktop: grid-2col, mobile: stack) |
| **Seed** | Initial import of JSON files into SQLite on first server start |
