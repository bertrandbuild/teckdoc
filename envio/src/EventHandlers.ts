/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  Chatsearchai,
  Chatsearchai_ChatCreated,
  Chatsearchai_MessageAdded,
} from "generated";

Chatsearchai.ChatCreated.handler(async ({ event, context }) => {
  const entity: Chatsearchai_ChatCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    chatId: event.params.chatId,
  };

  context.Chatsearchai_ChatCreated.set(entity);
});


Chatsearchai.MessageAdded.handler(async ({ event, context }) => {
  const entity: Chatsearchai_MessageAdded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    chatId: event.params.chatId,
    role: event.params.role,
    content: event.params.content,
  };

  context.Chatsearchai_MessageAdded.set(entity);
});

