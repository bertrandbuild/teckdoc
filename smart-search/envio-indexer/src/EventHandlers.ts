/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  ChatSearchIA,
  ChatSearchIA_ChatCreated,
  ChatSearchIA_MessageAdded,
} from "generated";

ChatSearchIA.ChatCreated.handler(async ({ event, context }) => {
  const entity: ChatSearchIA_ChatCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    chatId: event.params.chatId,
  };

  context.ChatSearchIA_ChatCreated.set(entity);
});


ChatSearchIA.MessageAdded.handler(async ({ event, context }) => {
  const entity: ChatSearchIA_MessageAdded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    chatId: event.params.chatId,
    role: event.params.role,
    content: event.params.content,
  };

  context.ChatSearchIA_MessageAdded.set(entity);
});

