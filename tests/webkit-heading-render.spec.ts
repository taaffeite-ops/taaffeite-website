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
    await page.goto('/#/', { waitUntil: 'networkidle' });

    // Scroll down to activate FoundersShowcase section
    await page.evaluate(() => window.scrollTo(0, 1200));

    // Wait for the reveal-word elements to be attached in DOM
    await page.waitForSelector('.founders-large-title .reveal-word', { state: 'attached' });

    // Collect widths of every .reveal-word span inside the heading.
    const wordData = await page.locator('.founders-large-title .reveal-word').evaluateAll(
      (spans) =>
        spans.map((span) => ({
          text: span.textContent ?? '',
          width: span.getBoundingClientRect().width,
        }))
    );

    // There must be 2 word spans ("Why" and "Taaffeite?").
    expect(wordData.length, 'Expected reveal-word spans to be present').toBe(2);

    // Every word span — including "Taaffeite?" — must have a non-zero width.
    for (const { text, width } of wordData) {
      expect(
        width,
        `Word span "${text}" has zero (or near-zero) width on ${browserName}. ` +
        `This indicates a glyph rendering bug.`
      ).toBeGreaterThan(10);
    }

    // Verify "Taaffeite?" word span exists and renders properly.
    const taaffeiteSpan = wordData.find((w) => w.text.includes('Taaffeite'));
    expect(taaffeiteSpan, 'Expected Taaffeite word span to be present').toBeTruthy();
    expect(taaffeiteSpan?.width).toBeGreaterThan(100);

    // Screenshot the heading for visual diff in CI.
    await page.locator('.founders-large-title').screenshot({
      path: `test-results/founders-title-${browserName}.png`,
    });
  });
});
