import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

describe("Card", () => {
  it("renders every section and keeps a caller's className", () => {
    render(
      <Card data-testid="card" className="custom">
        <CardHeader>
          <CardTitle>Wallet</CardTitle>
          <CardDescription>Your balance</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByTestId("card")).toHaveClass("custom");
    for (const text of ["Wallet", "Your balance", "Body", "Footer"]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });
});
