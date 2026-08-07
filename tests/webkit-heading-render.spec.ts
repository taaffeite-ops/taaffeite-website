import { test, expect } from '@playwright/test';

/**
 * Regression test: "Why Taaffeite?" heading glyph rendering on WebKit.
 *
 * WHAT THIS TESTS:
 * Safari's CoreText engine can collapse 'ff' glyphs to zero-width when they span
 * separate <span> elements and ligature substitution is attempted across a DOM
 * boundary. This test verifies that every character unit in the heading renders
 * with a non-zero bounding-box width in WebKit, catching any future regression.
 *
 * HOW TO RUN:
 *   npx playwright test tests/webkit-heading-render.spec.ts --project=webkit
 *
 * PREREQUISITES:
 *   npx playwright install webkit
 */
test.describe('Why Taaffeite? heading — WebKit glyph rendering', () => {
  // Run this suite in WebKit only for the glyph-collapse check.
  // The Chromium variant below is a sanity-check baseline.
  test('all character spans have non-zero width in WebKit', async ({ page, browserName }) => {
    // Intercept and block heavy media assets to keep headless WebKit lightweight
    await page.route('**/*.{webp,png,jpg,jpeg}', (route) => route.abort());

    await page.goto('/#/');

    // The heading is inside FoundersShowcase which sits below the hero.
    // Scroll until the sticky section is visible and the IntersectionObserver fires.
    const foundersSection = page.locator('#founders-showcase');
    await foundersSection.scrollIntoViewIfNeeded();

    // Give the IntersectionObserver + CSS transition time to run.
    // The slide entry transition is 2s; we wait 500 ms — enough for the chars to
    // start rendering (they're present in the DOM immediately, just opacity:0).
    await page.waitForTimeout(500);

    // Collect widths of every .reveal-char span inside the heading.
    const charData = await page.locator('.founders-large-title .reveal-char').evaluateAll(
      (spans) =>
        spans.map((span) => ({
          text: span.textContent ?? '',
          width: span.getBoundingClientRect().width,
        }))
    );

    // There must be at least some spans (sanity check markup exists).
    expect(charData.length, 'Expected reveal-char spans to be present').toBeGreaterThan(0);

    // Every span — including the 'ff' ligature unit — must have a non-zero width.
    for (const { text, width } of charData) {
      expect(
        width,
        `Character unit "${text}" has zero (or near-zero) width on ${browserName}. ` +
        `This indicates a CoreText ligature-collapse bug or a missing glyph.`
      ).toBeGreaterThan(1);
    }

    // Verify the 'ff' unit is present as a single grouped span (our structural fix).
    const ffSpans = charData.filter((c) => c.text === 'ff');
    expect(
      ffSpans.length,
      `Expected the 'ff' ligature pair to be in exactly one grouped span, ` +
      `got ${ffSpans.length}. Check groupLigaturePairs() in FoundersShowcase.tsx.`
    ).toBe(1);

    // Screenshot the heading for visual diff in CI.
    await page.locator('.founders-large-title').screenshot({
      path: `test-results/founders-title-${browserName}.png`,
    });
  });
});
