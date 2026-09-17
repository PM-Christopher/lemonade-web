import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Textarea } from "./textarea";

expect.extend(toHaveNoViolations);

// Every page in both apps composes forms and cards out of these primitives —
// catching a violation here catches it everywhere it's used, before a
// consumer ever renders it. See docs/ARCHITECTURE.md Phase 7.
describe("@lemonade/ui accessibility", () => {
  it("a labeled form built from Label, Input and Textarea has no axe violations", async () => {
    const { container } = render(
      <form>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" />
      </form>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("a Card with a heading and buttons has no axe violations", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Save</Button>
          <Button variant="destructive">Delete</Button>
          <Button disabled>Loading</Button>
        </CardContent>
      </Card>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("a labeled Select trigger has no axe violations", async () => {
    // SelectTrigger renders a <button role="combobox">, not a native form
    // control — a plain Label htmlFor/id pair doesn't auto-associate with
    // it the way it would with an <input>, so the trigger needs its own
    // aria-labelledby pointing at the label. See docs/ARCHITECTURE.md §7.
    const { container } = render(
      <div>
        <Label id="status-label" htmlFor="status">
          Status
        </Label>
        <Select>
          <SelectTrigger id="status" aria-labelledby="status-label">
            <SelectValue placeholder="Choose a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
