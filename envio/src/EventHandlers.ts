/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Chatsearch,
  Chatsearch_ChatCreated,
  Chatsearch_MessageAdded,
} from "generated";

Chatsearch.ChatCreated.handler(async ({ event, context }) => {
  const entity: Chatsearch_ChatCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    chatId: event.params.chatId,
  };

  context.Chatsearch_ChatCreated.set(entity);
});


Chatsearch.MessageAdded.handler(async ({ event, context }) => {
  const entity: Chatsearch_MessageAdded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    chatId: event.params.chatId,
    role: event.params.role,
    content: event.params.content,
  };

  context.Chatsearch_MessageAdded.set(entity);
});

