import assert from "assert";
import { 
  TestHelpers,
  ChatSearchAI_ChatCreated
} from "generated";
const { MockDb, ChatSearchAI } = TestHelpers;

describe("ChatSearchAI contract ChatCreated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for ChatSearchAI contract ChatCreated event
  const event = ChatSearchAI.ChatCreated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("ChatSearchAI_ChatCreated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await ChatSearchAI.ChatCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualChatSearchAIChatCreated = mockDbUpdated.entities.ChatSearchAI_ChatCreated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedChatSearchAIChatCreated: ChatSearchAI_ChatCreated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      owner: event.params.owner,
      chatId: event.params.chatId,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualChatSearchAIChatCreated, expectedChatSearchAIChatCreated, "Actual ChatSearchAIChatCreated should be the same as the expectedChatSearchAIChatCreated");
  });
});
