import assert from "assert";
import { 
  TestHelpers,
  ChatSearchIA_ChatCreated
} from "generated";
const { MockDb, ChatSearchIA } = TestHelpers;

describe("ChatSearchIA contract ChatCreated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for ChatSearchIA contract ChatCreated event
  const event = ChatSearchIA.ChatCreated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("ChatSearchIA_ChatCreated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await ChatSearchIA.ChatCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualChatSearchIAChatCreated = mockDbUpdated.entities.ChatSearchIA_ChatCreated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedChatSearchIAChatCreated: ChatSearchIA_ChatCreated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      owner: event.params.owner,
      chatId: event.params.chatId,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualChatSearchIAChatCreated, expectedChatSearchIAChatCreated, "Actual ChatSearchIAChatCreated should be the same as the expectedChatSearchIAChatCreated");
  });
});
