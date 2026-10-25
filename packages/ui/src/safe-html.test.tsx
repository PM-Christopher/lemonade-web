import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { cleanHtml, SafeHtml } from "./safe-html";

describe("cleanHtml", () => {
  it("keeps basic formatting", () => {
    expect(cleanHtml("<h2>Title</h2><p>Hi <strong>there</strong></p><ul><li>One</li></ul>")).toBe(
      "<h2>Title</h2><p>Hi <strong>there</strong></p><ul><li>One</li></ul>",
    );
  });

  it("removes scripts, handlers, images, iframes and styles", () => {
    const clean = cleanHtml(
      '<p onclick="x()">Hi</p><script>alert(1)</script><img src=x onerror=alert(1)><iframe src="https://evil.test"></iframe><style>p{display:none}</style>',
    );

    expect(clean).toBe("<p>Hi</p>");
  });

  it("drops links that are not http, https, mailto or tel", () => {
    expect(cleanHtml('<a href="javascript:alert(1)">bad</a>')).not.toContain("javascript");
    expect(cleanHtml('<a href="data:text/html;base64,AAAA">bad</a>')).not.toContain("data:");
    expect(cleanHtml('<a href="mailto:help@lemonade.africa">mail</a>')).toContain("mailto:");
  });

  it("opens links safely in a new tab", () => {
    const clean = cleanHtml('<a href="https://example.com" target="_self" rel="opener">x</a>');

    expect(clean).toContain('target="_blank"');
    expect(clean).toContain('rel="noopener noreferrer nofollow"');
  });
});

describe("SafeHtml", () => {
  it("renders the cleaned markup", () => {
    const { container } = render(<SafeHtml html={"<p>Hello</p><script>alert(1)</script>"} />);

    expect(container.querySelector("p")?.textContent).toBe("Hello");
    expect(container.querySelector("script")).toBeNull();
  });
});
