/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import {
  ChatSearchAI,
  ChatSearchAI_ChatCreated,
  ChatSearchAI_MessageAdded,
} from "generated";

ChatSearchAI.ChatCreated.handler(async ({ event, context }) => {
  const entity: ChatSearchAI_ChatCreated = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    owner: event.params.owner,
    chatId: event.params.chatId,
  };

  context.ChatSearchAI_ChatCreated.set(entity);
});


ChatSearchAI.MessageAdded.handler(async ({ event, context }) => {
  const entity: ChatSearchAI_MessageAdded = {
    id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
    chatId: event.params.chatId,
    role: event.params.role,
    content: event.params.content,
  };

  context.ChatSearchAI_MessageAdded.set(entity);
});

