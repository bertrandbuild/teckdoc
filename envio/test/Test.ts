import assert from "assert";
import { 
  TestHelpers,
  Chatsearchai_ChatCreated
} from "generated";
const { MockDb, Chatsearchai } = TestHelpers;

describe("Chatsearchai contract ChatCreated event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Chatsearchai contract ChatCreated event
  const event = Chatsearchai.ChatCreated.createMockEvent({/* It mocks event fields with default values. You can overwrite them if you need */});

  it("Chatsearchai_ChatCreated is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Chatsearchai.ChatCreated.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualChatsearchaiChatCreated = mockDbUpdated.entities.Chatsearchai_ChatCreated.get(
      `${event.chainId}_${event.block.number}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedChatsearchaiChatCreated: Chatsearchai_ChatCreated = {
      id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
      owner: event.params.owner,
      chatId: event.params.chatId,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualChatsearchaiChatCreated, expectedChatsearchaiChatCreated, "Actual ChatsearchaiChatCreated should be the same as the expectedChatsearchaiChatCreated");
  });
});
