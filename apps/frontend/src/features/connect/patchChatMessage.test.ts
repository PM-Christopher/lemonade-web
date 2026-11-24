import { describe, expect, it } from "vitest";
import { QueryClient } from "@tanstack/react-query";
import { appendIncomingChatMessage, connectKeys, patchChatMessage } from "./queries";
import type { ChatDetailResponse } from "./api";

const seed = (queryClient: QueryClient) =>
  queryClient.setQueryData(connectKeys.chat("them"), {
    chat: null,
    messages: [
      {
        id: "m1",
        message: "See you at 5",
        sender: true,
        receiver: false,
        media: null,
        created_at: "t1",
      },
      { id: "m2", message: "Ok", sender: false, receiver: true, media: null, created_at: "t2" },
    ],
  } as unknown as ChatDetailResponse);

describe("patchChatMessage", () => {
  it("changes the text and edited time of one message only", () => {
    const queryClient = new QueryClient();
    seed(queryClient);

    patchChatMessage(queryClient, "them", "m1", { message: "See you at 6", edited_at: "t3" });

    const messages = queryClient.getQueryData<ChatDetailResponse>(
      connectKeys.chat("them"),
    )!.messages;
    expect(messages[0]).toMatchObject({ id: "m1", message: "See you at 6", edited_at: "t3" });
    expect(messages[1]).toMatchObject({ id: "m2", message: "Ok" });
    expect(messages[1].edited_at).toBeUndefined();
  });

  it("leaves a chat that is not loaded alone", () => {
    const queryClient = new QueryClient();

    patchChatMessage(queryClient, "them", "m1", { message: "x", edited_at: "t3" });

    expect(queryClient.getQueryData(connectKeys.chat("them"))).toBeUndefined();
  });

  it("keeps the edited time on a message that arrives already edited", () => {
    const queryClient = new QueryClient();
    seed(queryClient);

    appendIncomingChatMessage(queryClient, "me", {
      id: "m3",
      message: "Hi",
      sender: "them",
      receiver: "me",
      media: null,
      created_at: "t4",
      edited_at: "t5",
    });

    const messages = queryClient.getQueryData<ChatDetailResponse>(
      connectKeys.chat("them"),
    )!.messages;
    expect(messages.at(-1)).toMatchObject({ id: "m3", edited_at: "t5" });
  });
});
