# LINKNEST — MASTER DESIGN & BUILD PROMPT

## Premium Visual URL Library / Editorial Bookmark Archive

You are an elite Principal Product Designer, Creative Director, Senior UX Engineer, Motion Designer, Frontend Architect, and Design Systems Engineer.

Your task is to design and build **LinkNest**, a premium personal URL library and visual bookmark archive.

The application must feel like a sophisticated digital directory / creative archive rather than a normal bookmark manager.

The design direction should combine:

- Editorial web directories
- Premium creative portfolios
- Awwwards-style visual composition
- Modern minimalism
- Glassmorphism
- Subtle 3D depth
- High-quality typography
- Refined micro-interactions
- Smooth scrolling
- Intentional motion
- Strong visual hierarchy
- Premium card composition

The final product must look **HUMAN-DESIGNED**.

It must NOT look like an AI-generated SaaS template.

---

# 01 — PRODUCT OBJECTIVE

Build a small but highly polished URL management application.

The core product is simple:

1. Add a URL
2. Automatically extract useful information
3. Save the URL
4. Organize URLs
5. Search URLs
6. Filter URLs
7. Open URLs
8. Delete URLs
9. View URLs through a premium visual card system

The application should make browsing saved links feel enjoyable and visual.

Prioritize:

**CONTENT > VISUAL HIERARCHY > MOTION > DECORATION**

Do not add unnecessary enterprise features.

---

# 02 — IMPORTANT: REMOVE AUTHENTICATION

**REMOVE LOGIN AND SIGN-UP COMPLETELY.**

There must be:

- No Login page
- No Sign Up page
- No Authentication UI
- No Forgot Password
- No Auth modal
- No User authentication flow
- No account creation
- No profile menu
- No auth middleware
- No protected routes

Do not create authentication just because Supabase supports it.

This project is intentionally a simple URL library.

If a user identity is required internally for future extensibility, architect the data layer so it can be introduced later, but **DO NOT expose authentication in the current product**.

The current experience should open directly into the URL library.

---

# 03 — CORE EXPERIENCE

The primary experience should be:

```text
OPEN WEBSITE
      ↓
VISUAL URL LIBRARY
      ↓
SEARCH / FILTER
      ↓
BROWSE VISUAL CARDS
      ↓
ADD URL
      ↓
URL PREVIEW CARD
      ↓
SAVE
      ↓
CARD ENTERS LIBRARY
```

The homepage is the actual application.

Do not create a marketing landing page unless it materially improves the product.

---

# 04 — DESIGN REFERENCE

Use the supplied visual reference image as a **DESIGN DIRECTION** reference.

Reference characteristics to extract:

- Editorial directory layout
- Large visual cards
- Three-column desktop composition
- Compact top navigation
- Horizontal filter controls
- Minimal metadata
- Strong thumbnail/image area
- Small creator/domain information
- Clean light background
- Controlled card radius
- Tight card spacing
- Dense but breathable composition
- Visual-first browsing
- Professional typography
- Minimal interface chrome

**DO NOT CLONE THE SOURCE WEBSITE.**

Extract its design principles and reinterpret them specifically for LinkNest.

Do not copy:

- Branding
- Logos
- Text
- Exact content
- Exact layout measurements
- Proprietary UI elements

The result should feel inspired by premium creative directories, not like a copy.

---

# 05 — DESIGN PHILOSOPHY

The visual language should be:

- EDITORIAL
- PREMIUM
- MINIMAL
- TACTILE
- ARCHITECTURAL
- CALM
- VISUAL
- MODERN
- SOPHISTICATED

Avoid:

- Generic SaaS dashboards
- Generic Tailwind templates
- Excessive rounded cards
- Purple AI gradients
- Neon gradients everywhere
- Huge unnecessary typography
- Excessive glassmorphism
- Random 3D objects
- Excessive shadows
- Excessive animations
- Floating UI everywhere
- Dashboard-style KPI cards
- Generic component-library appearance

Every visual effect must have a purpose.

---

# 06 — TYPOGRAPHY

USE **CHILLAX** THROUGHOUT THE ENTIRE PROJECT.

Font source:

https://www.fontshare.com/fonts/chillax

Chillax is the primary and dominant typeface.

Use Chillax for:

- Navigation
- Headings
- Body text
- Card titles
- Metadata
- Buttons
- Filters
- Inputs
- Empty states
- Modal content
- Toasts
- Tooltips
- Labels

Do not mix random fonts into the interface.

Create a structured Chillax type scale.

Suggested hierarchy:

### Display
Chillax Semibold

### Hero
Chillax Medium / Semibold

### Section Heading
Chillax Medium

### Card Title
Chillax Medium

### Body
Chillax Regular

### Metadata
Chillax Regular

### Micro Labels
Chillax Medium

Use letter spacing carefully.

Do not over-tighten Chillax.

The typography should feel elegant and slightly editorial.

Prefer self-hosting the production font assets where licensing/package distribution allows rather than depending on a runtime third-party font request.

---

# 07 — COLOR SYSTEM

Use the supplied warm monochromatic palette as the core visual system.

Palette:

| Token | Name | Hex | Primary Use |
|---|---|---|---|
| Cloud | Cloud | `#F2EFEC` | Background / Canvas |
| Fog | Fog | `#CCCAC6` | Borders / Dividers |
| Stone | Stone | `#ADA89F` | Secondary text |
| Slate | Slate | `#3C3936` | UI elements / Navigation |
| Ink | Ink | `#1A1816` | Primary text / Icons |

The supplied palette defines:

- Cloud → Background / Canvas
- Fog → Borders / Dividers
- Stone → Secondary text
- Slate → UI elements / Navigation
- Ink → Primary text / Icons

Do not introduce arbitrary colors.

Accent colors may only appear when they come from URL thumbnails, website previews, or content imagery.

The application shell itself should remain warm monochromatic.

---

# 08 — COLOR TOKENS

Create centralized design tokens.

```css
--color-cloud: #F2EFEC;
--color-fog: #CCCAC6;
--color-stone: #ADA89F;
--color-slate: #3C3936;
--color-ink: #1A1816;

--background: #F2EFEC;

--surface: rgba(255,255,255,0.45);
--surface-strong: rgba(255,255,255,0.70);

--text-primary: #1A1816;
--text-secondary: #3C3936;
--text-muted: #ADA89F;

--border: rgba(60,57,54,0.14);
--border-strong: rgba(60,57,54,0.22);
```

Keep all major color decisions centralized.

---

# 09 — GLASSMORPHISM

Use glassmorphism as a **SECONDARY visual language**.

Do not turn the entire application into glass.

Glass should primarily appear in:

- Navigation
- Search controls
- Filter controls
- Add URL panel
- Floating actions
- Modal/dialog
- Selected filter states
- Utility controls

Example:

```css
background: rgba(242,239,236,0.62);
backdrop-filter: blur(18px) saturate(110%);
border: 1px solid rgba(255,255,255,0.45);
box-shadow: 0 12px 40px rgba(26,24,22,0.06);
```

Glass must remain subtle.

It should feel like premium physical material, not "frosted glass everywhere."

---

# 10 — APPLICATION STRUCTURE

Use **Next.js App Router**.

Suggested structure:

```text
app/
├── layout.tsx
├── page.tsx
├── globals.css
│
├── library/
│   └── page.tsx
│
└── api/
    └── ...

components/
├── navigation/
│   ├── Navbar.tsx
│   └── MobileNav.tsx
│
├── library/
│   ├── URLGrid.tsx
│   ├── URLCard.tsx
│   ├── URLCardMedia.tsx
│   ├── URLCardMeta.tsx
│   ├── URLSearch.tsx
│   ├── URLFilters.tsx
│   ├── AddURL.tsx
│   ├── EmptyLibrary.tsx
│   └── LoadingGrid.tsx
│
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── GlassPanel.tsx
│   ├── Tooltip.tsx
│   └── Modal.tsx
│
└── motion/
    ├── Reveal.tsx
    ├── Magnetic.tsx
    └── Parallax.tsx

lib/
├── supabase/
│   ├── client.ts
│   └── server.ts
│
├── url/
│   ├── normalize.ts
│   ├── metadata.ts
│   └── validation.ts
│
└── utils.ts

hooks/
├── useUrls.ts
├── useAddUrl.ts
└── useUrlFilters.ts

types/
└── url.ts

public/
├── fonts/
└── ...
```

Keep architecture clean.

Do not create unnecessary abstractions.

---

# 11 — TECH STACK

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Design Intelligence

- UI UX Pro Max
- Taste Skill v2
- Impeccable

## Animation

- Motion

## Icons

- Lucide React

## Forms

- React Hook Form

## Validation

- Zod

## Notifications

- Sonner

## Data

- TanStack Query

## Backend

- Supabase

## Database

- PostgreSQL

Do NOT add:

- Express
- Django
- Firebase
- Redux
- GraphQL
- Prisma
- Separate Node backend

unless a genuine requirement appears.

Keep the project small.

---

# 12 — DATABASE

Use a simple URL table.

```text
urls

id
url
normalized_url
title
description
domain
favicon_url
preview_image
created_at
updated_at
```

Optional future-ready fields:

```text
category
tags
```

For the first version, avoid unnecessary complexity.

Use a database-level uniqueness rule:

```sql
UNIQUE(normalized_url)
```

This prevents duplicate URLs.

If multi-user support is introduced later, the constraint can become:

```sql
UNIQUE(user_id, normalized_url)
```

But do NOT introduce authentication now.

---

# 13 — HOMEPAGE EXPERIENCE

The homepage should immediately feel like a premium visual archive.

Structure:

```text
NAVIGATION
      ↓
EDITORIAL INTRO / LIBRARY HEADER
      ↓
SEARCH
      ↓
FILTERS
      ↓
URL GRID
      ↓
FLOATING ADD URL ACTION
```

---

# 14 — NAVIGATION

Create a minimal premium navigation.

Desktop:

```text
LEFT:
LinkNest wordmark

CENTER:
Library
Collections
Recent

RIGHT:
Search
Add URL
```

Do not overcrowd navigation.

Use a floating glass navigation container where appropriate.

Navbar behavior:

### Initial
Transparent / integrated with page

### After scrolling
Slightly elevated glass surface

Use:

- backdrop blur
- subtle border
- subtle shadow
- smooth transition

Avoid sticky navigation that visually dominates the page.

---

# 15 — HERO / LIBRARY INTRO

Do not make a generic SaaS hero.

Instead create an editorial library introduction.

Example:

> YOUR DIGITAL ARCHIVE

> A carefully collected library of things worth coming back to.

Then display subtle metadata such as:

```text
124 LINKS
18 DOMAINS
LAST UPDATED TODAY
```

Keep statistics subtle.

The content should feel like a creative archive rather than analytics.

---

# 16 — SEARCH

Search should be visually prominent but minimal.

Search by:

- URL
- title
- domain
- description
- tags

Search interaction:

### Default
Subtle glass input

### Hover
Slightly stronger border

### Focus
Elevated glass surface

### Typing
Results update smoothly

### Empty search
Beautiful empty state

Do not use aggressive animations.

---

# 17 — FILTER SYSTEM

Create compact editorial filter controls.

Examples:

```text
All
Recent
Design
Development
Inspiration
Tools
Articles
Resources
```

Use pill-like controls, but avoid excessive pill UI.

Selected state:

```text
dark Ink surface
light text
```

Unselected:

```text
transparent / Cloud
Fog border
```

Hover:

- small vertical movement
- subtle shadow
- background transition

---

# 18 — URL CARD — PRIMARY DESIGN

**THIS IS THE MOST IMPORTANT COMPONENT.**

The URL card should be inspired by the supplied visual reference.

Do NOT create ordinary SaaS cards.

Each card should feel like a miniature editorial website preview.

Structure:

```text
┌───────────────────────────────┐
│                               │
│       WEBSITE PREVIEW         │
│                               │
│                               │
│                               │
│                               │
├───────────────────────────────┤
│ DOMAIN                        │
│ Website title                 │
│ Short description             │
│                               │
│ ↗ Open                        │
└───────────────────────────────┘
```

The image/preview area should dominate the card.

Ratio:

Approximately 4:3 or 16:10 depending on content.

Use real website preview imagery where available.

If preview image is unavailable, create a sophisticated fallback composition using:

- favicon
- domain
- title
- subtle gradient derived from neutral palette
- abstract geometric structure

Never show broken image icons.

---

# 19 — CARD VISUAL TREATMENT

Cards should have:

- Soft radius
- Minimal border
- Deep but subtle shadow
- Image clipping
- Slight internal depth
- Editorial metadata
- Strong title typography

Suggested radius:

```text
14–18px
```

Do not use extreme 30–40px rounded cards.

---

# 20 — CARD HOVER

Hover should feel tactile.

On hover:

### Image
Scale `1.025–1.04`

### Card
Translate Y `-4px`

### Shadow
Increase slightly

### Border
Become slightly more visible

### Content
Small opacity/position transition

Optional:

Image receives subtle perspective distortion.

Duration:

`400–700ms`

Use a refined premium easing curve.

Avoid springy UI-library behavior.

---

# 21 — 3D CARD INTERACTION

Implement subtle pointer-based 3D tilt.

Maximum rotation:

```text
X: ±3 degrees
Y: ±3 degrees
```

Perspective:

```text
1000–1400px
```

Never make cards rotate dramatically.

The goal is:

**TACTILE DEPTH**

not:

**3D GIMMICK**

Add a subtle highlight following pointer position.

Interaction:

```text
Pointer moves
      ↓
Soft radial highlight follows
      ↓
Card slightly rotates
      ↓
Image depth increases
```

Disable this interaction on touch devices.

---

# 22 — CARD IMAGE DEPTH

Create layered depth:

```text
Layer 1:
background

Layer 2:
website preview

Layer 3:
gradient overlay

Layer 4:
metadata / interaction

Layer 5:
hover highlight
```

This creates a premium editorial object.

---

# 23 — GRID

Desktop:

```text
3 columns
```

Large screen:

```text
3 columns with generous horizontal gutters
```

Tablet:

```text
2 columns
```

Mobile:

```text
1 column
```

Do NOT simply shrink the desktop grid.

Mobile must be intentionally composed.

Desktop example:

```css
grid-template-columns: repeat(3, minmax(0, 1fr));
```

Gap:

```text
16–24px
```

depending on viewport.

---

# 24 — MASONRY FEEL

The visual rhythm should have a slight editorial / masonry feeling.

However:

Do NOT introduce complicated masonry dependencies unless necessary.

Prefer:

**CSS Grid**

with controlled image aspect ratios.

Variation can come from:

- image crop
- card media ratio
- content density
- featured cards

rather than a heavy masonry library.

---

# 25 — FEATURED CARD

Allow occasional featured cards.

A featured URL can span:

```text
2 columns
```

or use a larger editorial composition where practical.

Use this sparingly.

Example:

```text
Normal:
3 cards

Featured:
large editorial card
+
two smaller cards
```

This creates visual rhythm.

Do not make every card special.

---

# 26 — ADD URL EXPERIENCE

The Add URL interaction should feel premium.

Do NOT navigate to a boring form page.

Use a glass modal / floating panel.

Opening animation:

```text
small scale
opacity 0
blur
```

Then:

```text
scale 1
opacity 1
blur decreases
```

Panel:

Glass surface

Fields:

- URL
- Title
- Description
- Category
- Tags

The URL field should be the primary focus.

Example:

```text
ADD TO LIBRARY

Paste a URL worth remembering.

[ https:// ]

[Preview]

[Save to Library]
```

---

# 27 — SMART URL FLOW

When user pastes a URL:

```text
1. Validate URL
2. Normalize URL
3. Detect duplicate
4. Fetch metadata where supported
5. Extract:
   - title
   - domain
   - favicon
   - preview image
   - description
6. Show preview
7. User confirms
8. Save
```

The interface should communicate progress:

```text
PASTING URL
      ↓
ANALYZING
      ↓
PREVIEW READY
      ↓
SAVE
```

Use subtle motion between states.

---

# 28 — DUPLICATE EXPERIENCE

If URL already exists:

Do NOT show a generic red error.

Instead:

> This link is already in your library.

Then show the existing card.

Actions:

- View existing
- Cancel

This should feel calm and polished.

---

# 29 — MICRO INTERACTIONS

Implement meaningful micro-interactions.

Examples:

### Button hover
Small translateY

### Button press
Scale `0.97`

### Icon hover
Subtle rotation/translation

### Copy
Checkmark morph

### Delete
Fade + shrink

### Save
Small confirmation animation

### Filter
Smooth selection transition

### Search
Result movement

### Card
Depth response

### Toast
Slide + blur

All interactions should share one motion language.

---

# 30 — STORYTELLING

The application should tell a subtle story.

Opening:

> This is your collection.

Browsing:

> Things worth keeping.

Adding:

> Save something worth returning to.

Empty:

> Your archive is waiting.

This storytelling should remain subtle.

Do not turn the app into a marketing website.

---

# 31 — SCROLL EXPERIENCE

The scroll experience should feel premium.

Use:

- Smooth reveal
- Progressive opacity
- Small vertical movement
- Staggered cards
- Subtle parallax
- Section transitions

Avoid:

- Excessive scroll hijacking
- Aggressive horizontal scrolling
- Huge parallax
- Scroll animations on every element

Native scrolling must remain usable.

---

# 32 — ENTRANCE ANIMATION

On initial page load:

1. Navigation appears
2. Library title reveals
3. Search appears
4. Filters appear
5. Cards stagger into view

Suggested timing:

```text
Navigation: 400ms
Heading: 600ms
Search: 500ms
Filters: 450ms
Cards: 600–900ms staggered
```

Do not make users wait for the UI.

---

# 33 — SCROLL REVEALS

Cards should reveal as they enter the viewport.

Animation:

```text
opacity: 0 → 1
translateY: 20px → 0
scale: 0.985 → 1
```

Use viewport-based triggering.

Animate once.

Avoid repeated animation every time the card enters/exits unless intentional.

---

# 34 — PARALLAX

Use parallax selectively.

Potential usage:

- Hero background
- Featured card image
- Large editorial card

Movement should be subtle.

Maximum:

```text
8–20px
```

The user should feel depth without consciously noticing the effect.

---

# 35 — 3D MOTION

Use 3D primarily for:

- Card hover
- Featured card
- Background depth
- Add URL panel
- Small decorative geometry

Preferred implementation:

**CSS 3D transforms**

Use perspective.

Do not introduce heavy WebGL for basic interactions.

If React Three Fiber is introduced, use it only for a highly intentional hero/ambient scene and ensure it remains optional and performant.

---

# 36 — PAGE TRANSITIONS

If multiple pages are created:

Use subtle page transitions.

Exit:

```text
opacity
0.98 → 0
```

Enter:

```text
opacity
0 → 1
```

with small vertical movement.

No dramatic page wipes.

The transition should feel editorial and expensive.

---

# 37 — LOADING

Never show a blank page.

Create a sophisticated loading skeleton.

Skeleton:

Cloud / Fog tones

Cards should have:

- image skeleton
- title skeleton
- metadata skeleton

Use soft shimmer.

Do not use bright animated skeletons.

---

# 38 — EMPTY STATE

If no URLs exist:

Create a beautiful editorial empty state.

Example:

> YOUR ARCHIVE IS EMPTY.

> The internet is full of things worth keeping.

CTA:

```text
Add your first link
```

Include a subtle abstract 3D object or layered card composition.

Do not use generic illustrations.

---

# 39 — ERROR STATES

Handle:

- Invalid URL
- Duplicate URL
- Metadata unavailable
- Image unavailable
- Network failure
- Database failure
- Delete failure

Errors should be understandable.

Avoid technical error messages.

---

# 40 — RESPONSIVE DESIGN

Desktop:

```text
3-column editorial grid
```

Tablet:

```text
2-column grid
```

Mobile:

```text
1-column grid
```

Mobile navigation:

Compact glass header

Mobile card:

Full width

Mobile interactions:

**NO hover-dependent functionality.**

3D tilt disabled.

Use tap states instead.

Touch targets:

Minimum approximately `44px`.

Typography should scale intentionally.

---

# 41 — MOBILE MOTION

Mobile should not simply receive desktop animations.

Disable:

- Cursor-following effects
- 3D tilt
- Magnetic buttons
- Heavy parallax

Keep:

- Entrance reveals
- Tap feedback
- Filter transitions
- Modal transitions
- Image scale

Prioritize battery and performance.

---

# 42 — ACCESSIBILITY

Follow WCAG principles.

Requirements:

- Semantic HTML
- Keyboard navigation
- Visible focus
- Accessible labels
- ARIA only when required
- Proper heading hierarchy
- Reduced motion support
- Readable contrast
- 44px touch targets
- Keyboard-accessible dialogs
- Escape-to-close modal
- Focus trap for modal

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled, remove:

- Parallax
- Card tilt
- Magnetic movement
- Large transforms
- Complex entrance animations

Keep simple opacity transitions where appropriate.

---

# 43 — PERFORMANCE

Performance is critical.

Optimize:

- Images
- Fonts
- Animations
- JavaScript
- DOM
- Network requests

Use:

- `next/image`
- Lazy loading
- Responsive image sizes
- CSS transforms
- Opacity animations
- IntersectionObserver / Motion viewport triggers

Avoid layout-triggering animation.

Do not animate:

- width
- height
- top
- left

when transform can be used.

Prefer:

- transform
- opacity

---

# 44 — IMAGE HANDLING

URL preview images may be external.

Always provide:

- loading state
- fallback
- error state
- aspect ratio
- object-fit

Prevent layout shift.

Use:

```css
aspect-ratio
```

and responsive images.

---

# 45 — DESIGN SYSTEM

Create reusable tokens for:

- Colors
- Typography
- Spacing
- Radius
- Shadows
- Glass
- Motion
- Breakpoints
- Z-index
- Container widths

Suggested spacing scale:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Do not invent random spacing values everywhere.

---

# 46 — SHADOW SYSTEM

Use soft shadows.

Small:

```css
0 4px 16px rgba(26,24,22,0.04)
```

Medium:

```css
0 12px 32px rgba(26,24,22,0.07)
```

Large:

```css
0 24px 70px rgba(26,24,22,0.10)
```

Avoid dark black shadows.

---

# 47 — BORDER SYSTEM

Borders should be subtle.

Primary:

```css
rgba(60,57,54,0.12)
```

Hover:

```css
rgba(60,57,54,0.20)
```

Glass:

```css
rgba(255,255,255,0.45)
```

Do not outline everything heavily.

---

# 48 — CONTENT DENSITY

The visual reference demonstrates an important principle:

Many meaningful pieces of content can coexist without making the interface feel cluttered.

Use:

```text
large preview
+
small metadata
+
domain
+
title
+
optional description
+
small interaction
```

Do not create large empty cards with almost no information.

---

# 49 — URL CARD CONTENT

Recommended:

```text
[preview]

DOMAIN
example.com

Website title

Short description if available

Category
Tag

                         ↗
```

On hover:

```text
Open
Copy
More
```

Keep secondary actions hidden until interaction.

---

# 50 — CARD CONTEXT MENU

Three-dot action can expose:

- Open link
- Copy URL
- Edit
- Move category
- Delete

Do not clutter every card with visible action buttons.

---

# 51 — DELETE INTERACTION

Deletion should require confirmation.

Use a small glass confirmation dialog.

Message:

> Remove this link from your archive?

Actions:

```text
Cancel
Remove
```

After deletion:

- Card shrinks slightly
- Opacity decreases
- Grid closes the gap smoothly

---

# 52 — VISUAL DEPTH

Use multiple depth layers:

```text
Background
↓
Ambient gradient/noise
↓
Navigation
↓
Content
↓
Cards
↓
Image
↓
Metadata
↓
Interaction layer
```

Depth must support hierarchy.

Do not add decorative 3D objects simply because 3D was requested.

---

# 53 — BACKGROUND

Primary background:

```text
#F2EFEC
```

Create subtle visual depth with:

- Very soft radial gradients
- Extremely low-opacity noise
- Subtle light variation

Do not use colorful gradient backgrounds.

The warm monochrome palette must remain dominant.

---

# 54 — VISUAL TEXTURE

A subtle grain/noise texture may be used.

Opacity:

Very low.

It should barely be visible.

Purpose:

Reduce digital flatness.

Do not create obvious film grain.

---

# 55 — CURSOR / POINTER

Desktop may include a subtle custom cursor enhancement.

Possible behavior:

```text
Normal cursor
      ↓
Interactive element
      ↓
Small visual expansion
```

Do not replace the native cursor completely unless there is a compelling UX reason.

Accessibility must remain intact.

---

# 56 — MAGNETIC INTERACTIONS

Use magnetic behavior only for:

- Primary Add URL button
- Major CTA

Movement:

Very subtle

Maximum:

`4–8px`

Do not make every button magnetic.

---

# 57 — UI UX PRO MAX

Use UI UX Pro Max as a design intelligence layer.

Before implementation, determine:

Product category:

**Personal productivity / visual bookmark library / creative archive**

UX pattern:

**Visual directory / editorial grid / searchable archive**

UI style:

**Premium editorial minimalism + restrained glassmorphism**

Color:

**Warm monochromatic neutral system**

Typography:

**Chillax**

Component style:

**Soft radius + thin borders + subtle depth**

Avoid generic SaaS patterns.

---

# 58 — TASTE SKILL V2

Apply Taste Skill v2 to prevent generic AI-generated design.

Before producing each major section ask:

- Does this feel intentionally art-directed?
- Does this hierarchy feel human?
- Would this still look good without the animation?
- Is this visual decision necessary?
- Does the composition have rhythm?
- Are the cards too repetitive?
- Does the interface resemble a template?

If yes:

**REDESIGN.**

---

# 59 — IMPECCABLE QUALITY LAYER

Apply Impeccable principles.

Audit:

- Typography
- Hierarchy
- Spacing
- Alignment
- Contrast
- Density
- Interaction
- Responsiveness
- Consistency
- Accessibility
- Motion

Fix:

- weak spacing
- inconsistent radius
- excessive shadows
- poor text hierarchy
- unnecessary components
- visual noise
- awkward mobile layouts

---

# 60 — MOTION DESIGN SYSTEM

Create a unified motion system.

Fast:

`150–220ms`

Normal:

`300–450ms`

Premium:

`500–800ms`

Use custom easing.

Avoid default generic bounce animations.

Motion hierarchy:

```text
Micro:
150–250ms

Component:
300–500ms

Section:
500–800ms

Page:
600–1000ms
```

Never make interactions feel slow.

---

# 61 — MOTION PRINCIPLES

Motion should communicate:

- Hierarchy
- Cause and effect
- Continuity
- Feedback
- Depth

Every animation must answer:

> WHY IS THIS MOVING?

If there is no useful answer:

**REMOVE IT.**

---

# 62 — VISUAL QA

Before declaring the project complete, inspect the actual UI.

Check:

```text
Desktop 1440px
Desktop 1920px
Tablet 1024px
Mobile 768px
Mobile 390px
Small mobile 360px
```

Verify:

- Typography
- Grid
- Card proportions
- Navigation
- Search
- Filters
- Modal
- Loading
- Empty state
- Error state
- Hover
- Focus
- Touch
- Reduced motion

---

# 63 — QUALITY BAR

The final result should feel like:

> **A premium creative archive.**

NOT:

> **A bookmark CRUD application.**

The emotional qualities should be:

- Calm
- Curated
- Tactile
- Precise
- Premium
- Editorial
- Modern

---

# 64 — IMPLEMENTATION ORDER

Follow this exact workflow.

## PHASE 1 — RESEARCH

Study:

- Supplied reference image
- Supplied color palette
- Chillax typography
- Editorial directory patterns
- Modern glassmorphism patterns
- Premium card interactions

## PHASE 2 — DECONSTRUCT

Define:

- Information architecture
- Content hierarchy
- Card system
- Navigation
- Search
- Filters
- Add URL flow

## PHASE 3 — DEFINE STORY

Determine:

- What the user sees first
- What they understand first
- What action they take
- How they browse
- How they save
- How they return

## PHASE 4 — DESIGN SYSTEM

Create:

- Color tokens
- Typography tokens
- Spacing
- Radius
- Shadows
- Glass tokens
- Motion tokens
- Breakpoints

## PHASE 5 — COMPOSE

Build:

- Navbar
- Library intro
- Search
- Filters
- Grid
- URL card
- Add URL panel
- Empty state
- Loading state

## PHASE 6 — IMPLEMENT

Use:

- Next.js
- React
- TypeScript
- Tailwind
- Supabase

## PHASE 7 — ANIMATE

Add:

- Entrance
- Reveal
- Hover
- Micro interaction
- Parallax
- Subtle 3D
- Page transitions
- Loading

## PHASE 8 — ADD DEPTH

Add:

- Card perspective
- Pointer highlight
- Glass depth
- Image depth
- Subtle ambient background

## PHASE 9 — RESPONSIVE

Explicitly redesign:

- Tablet
- Mobile
- Small mobile

Do not simply scale desktop.

## PHASE 10 — ACCESSIBILITY

Verify:

- Keyboard
- Focus
- Reduced motion
- Contrast
- Touch targets

## PHASE 11 — PERFORMANCE

Optimize:

- Images
- Fonts
- Motion
- Queries
- Rendering
- Bundle

## PHASE 12 — VISUAL QA

Actually inspect the rendered interface.

Fix anything that looks:

- Generic
- AI-generated
- Unbalanced
- Over-animated
- Too empty
- Too crowded
- Inconsistent

---

# 65 — DO NOT DO

DO NOT:

- Create Login
- Create Signup
- Create authentication UI
- Create a generic SaaS dashboard
- Use purple gradients
- Use excessive glassmorphism
- Use excessive rounded containers
- Use excessive 3D
- Use random 3D illustrations
- Use huge unnecessary hero sections
- Use excessive shadows
- Use excessive animation
- Use dozens of UI components
- Add unnecessary dependencies
- Add unnecessary backend architecture
- Add Redux
- Add Express
- Add Django
- Add unnecessary APIs
- Copy the reference website
- Make every card identical
- Make the design look AI-generated

---

# 66 — FINAL DESIGN TARGET

Imagine:

A sophisticated digital archive.

A designer opens LinkNest.

They immediately see:

A refined warm canvas

+

A compact editorial navigation

+

A beautiful library introduction

+

A clean search system

+

A row of elegant filters

+

A dense three-column visual archive

+

Each URL represented as a beautiful mini website card.

Hovering over a card creates:

- subtle depth
- image movement
- soft perspective
- micro highlight

The interface responds without becoming distracting.

Opening Add URL creates:

A floating glass panel

with a beautiful URL preview.

Everything feels:

- intentional
- quiet
- premium
- fast
- tactile
- human

---

# 67 — FINAL ACCEPTANCE CRITERIA

The project is complete only when:

## Product

- [ ] Login removed
- [ ] Signup removed
- [ ] Auth UI removed
- [ ] Homepage opens directly into library
- [ ] URL CRUD works
- [ ] Duplicate prevention works
- [ ] URL normalization works
- [ ] Search works
- [ ] Filters work
- [ ] URL previews work
- [ ] Delete flow works

## Technology

- [ ] Next.js App Router implemented
- [ ] React + TypeScript implemented
- [ ] Tailwind implemented
- [ ] Supabase integrated
- [ ] TanStack Query used appropriately
- [ ] React Hook Form used appropriately
- [ ] Zod validation implemented
- [ ] Sonner notifications implemented
- [ ] Motion implemented
- [ ] Lucide icons used

## Design

- [ ] Chillax used consistently
- [ ] Warm monochrome palette implemented
- [ ] Glassmorphism implemented selectively
- [ ] Editorial card system implemented
- [ ] 3-column desktop grid
- [ ] 2-column tablet grid
- [ ] 1-column mobile grid
- [ ] Premium visual hierarchy
- [ ] No generic AI-template appearance

## Motion

- [ ] Card hover depth implemented
- [ ] Subtle 3D implemented
- [ ] Micro interactions implemented
- [ ] Entrance animations implemented
- [ ] Scroll reveals implemented
- [ ] Subtle parallax implemented
- [ ] Page transitions implemented where needed
- [ ] Smooth loading implemented
- [ ] Reduced motion supported

## Accessibility

- [ ] Keyboard navigation works
- [ ] Focus states work
- [ ] Accessible labels exist
- [ ] Modal focus trap works
- [ ] Escape closes dialogs
- [ ] Touch targets are accessible
- [ ] Contrast is acceptable
- [ ] Reduced motion works

## Performance

- [ ] Images are optimized
- [ ] Fonts are optimized
- [ ] Layout shift minimized
- [ ] Animations use performant properties
- [ ] Network requests are minimized
- [ ] Mobile performance checked
- [ ] No unnecessary dependencies
- [ ] No unnecessary architecture

## Responsive

- [ ] Desktop 1440px checked
- [ ] Desktop 1920px checked
- [ ] Tablet 1024px checked
- [ ] Tablet 768px checked
- [ ] Mobile 390px checked
- [ ] Small mobile 360px checked
- [ ] Mobile interactions intentionally designed

## Visual QA

- [ ] Typography inspected
- [ ] Grid inspected
- [ ] Card proportions inspected
- [ ] Navigation inspected
- [ ] Search inspected
- [ ] Filters inspected
- [ ] Modal inspected
- [ ] Loading state inspected
- [ ] Empty state inspected
- [ ] Error state inspected
- [ ] Hover state inspected
- [ ] Focus state inspected
- [ ] Touch state inspected
- [ ] Reduced-motion state inspected

---

# FINAL INSTRUCTION

Do not rush into coding.

First understand the product.

Then deconstruct the reference.

Then establish the visual system.

Then compose the experience.

Then implement.

Then animate.

Then add depth and 3D.

Then optimize responsive behavior.

Then perform accessibility and performance QA.

Finally inspect the actual rendered UI and refine it.

The goal is not to build the most features.

The goal is to build the **smallest possible URL library that feels exceptionally designed.**

Build for:

**STORY**
+
**COMPOSITION**
+
**TYPOGRAPHY**
+
**DEPTH**
+
**MOTION**
+
**USABILITY**
+
**PERFORMANCE**

The final result must feel like a product designed by a strong human creative team — not generated from a template.

---

## DESIGN REFERENCE SUMMARY

### Typography

**Chillax**

https://www.fontshare.com/fonts/chillax

### Color Palette

```text
Cloud  #F2EFEC
Fog    #CCCAC6
Stone  #ADA89F
Slate  #3C3936
Ink    #1A1816
```

### Core Visual Direction

```text
Premium
Editorial
Minimal
Warm
Tactile
Glass
Visual
Human-designed
```

### Experience Stack

```text
Storytelling
+
Visual Design
+
Scroll Experience
+
Hover Interaction
+
Micro Interaction
+
Parallax
+
3D Motion
+
Entrance / Reveals
+
Page Transitions
+
Smooth Loading
+
Responsive Motion
```

### Design Workflow

```text
Research
    ↓
Deconstruct
    ↓
Define Story
    ↓
Design System
    ↓
Compose
    ↓
Implement
    ↓
Animate
    ↓
Add Depth / 3D
    ↓
Responsive
    ↓
Accessibility
    ↓
Performance
    ↓
Visual QA
```

### Final Product Positioning

**LinkNest is a premium visual URL archive — not a generic bookmark manager.**
