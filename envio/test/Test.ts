import assert from "assert";
import { 
  TestHelpers,
  Chatsearch_ChatCreated
} from "generated";
const { MockDb, Chatsearch } = TestHelpers;

describe("Chatsearch contract ChatCreated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Chatsearch contract ChatCreated event
  const event = Chatsearch.ChatCreated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("Chatsearch_ChatCreated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Chatsearch.ChatCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualChatsearchChatCreated = mockDbUpdated.entities.Chatsearch_ChatCreated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedChatsearchChatCreated: Chatsearch_ChatCreated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      owner: event.params.owner,
      chatId: event.params.chatId,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualChatsearchChatCreated, expectedChatsearchChatCreated, "Actual ChatsearchChatCreated should be the same as the expectedChatsearchChatCreated");
  });
});
