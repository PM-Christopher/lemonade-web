import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import EventPromotionDetailsClient from "./EventPromotionDetailsClient";

const complete = vi.fn();
const detail = vi.fn();

vi.mock("next/dynamic", () => ({
  default: () => () => <p>Schedule modal</p>,
}));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: (select: (state: unknown) => unknown) => select({ auth: { isLoggedIn: true } }),
}));
vi.mock("@/features/events/queries", () => ({
  useEventPromotionQuery: () => ({ data: detail() }),
}));
vi.mock("@/features/events/mutations", () => ({
  useCompleteEventPromotionMutation: () => ({ mutate: complete, isPending: false }),
}));

const promotion = (status: string, promotionDate: string | null = null) => ({
  event_summary: {
    id: "p1",
    unique_id: "PR-1",
    event_name: "Unlocking business potentials",
    event_image: null,
    owner: "Adebayo Akintoye",
    promotion_name: "Instagram Feed Post",
    promotion_price: "30000.00",
    date_paid: "2024-04-23T21:45:00Z",
    promotion_date: promotionDate,
    status,
  },
  event: {
    id: "e1",
    image: null,
    name: "Unlocking business potentials",
    event_date: "Mon, 23 Mar - Mon, 23 Mar",
    event_time: "04:00PM - 11:00PM",
    location: "Lekki phase 1",
    description: "About this event",
    promotions: [],
  },
});

describe("EventPromotionDetailsClient", () => {
  beforeEach(() => complete.mockReset());

  it("shows the real promotion and event details", () => {
    detail.mockReturnValue(promotion("pending"));
    render(<EventPromotionDetailsClient id="p1" />);

    expect(screen.getByText("Adebayo Akintoye")).toBeInTheDocument();
    expect(screen.getByText("Instagram Feed Post")).toBeInTheDocument();
    expect(screen.getByText("₦30,000")).toBeInTheDocument();
    expect(screen.getByText("Lekki phase 1")).toBeInTheDocument();
  });

  it("marks a promotion completed", () => {
    detail.mockReturnValue(promotion("scheduled", "2030-05-25"));
    render(<EventPromotionDetailsClient id="p1" />);

    fireEvent.click(screen.getByRole("button", { name: "Mark as completed" }));

    expect(complete).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Reschedule" })).toBeInTheDocument();
  });

  it("offers no actions once completed", () => {
    detail.mockReturnValue(promotion("completed", "2030-05-25"));
    render(<EventPromotionDetailsClient id="p1" />);

    expect(screen.queryByRole("button", { name: "Mark as completed" })).not.toBeInTheDocument();
  });
});
