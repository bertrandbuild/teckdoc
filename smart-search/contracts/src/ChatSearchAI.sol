// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./interfaces/IOracle.sol";

// @title ChatSearchAI
// @notice This contract handles chat interactions and integrates with teeML oracle for LLM and knowledge base queries.
contract ChatSearchAI {
  struct ChatRun {
    address owner;
    IOracle.Message[] messages;
    uint messagesCount;
  }

  // @notice Address of the contract owner
  address private owner;

  // @notice Address of the oracle contract
  address public oracleAddress;

  // @notice CID of the knowledge base
  string public knowledgeBase;

  // @notice Event emitted when the oracle address is updated
  event OracleAddressUpdated(address indexed newOracleAddress);

  // @notice Event emitted when the knowledge base is updated
  event KnowledgeBaseUpdated(string indexed newKnowledgeBase);

  // @notice Event emitted when a new chat is created
  event ChatCreated(address indexed owner, uint indexed chatId);

  // @notice Event emitted when a new message is added
  event MessageAdded(uint indexed chatId, string role, string content);

  // @notice Configuration for the OpenAI request
  IOracle.OpenAiRequest private config;

  // @notice Mapping from chat ID to ChatRun
  mapping(uint => ChatRun) public chatRuns;
  uint private chatRunsCount;

  // @notice Initializes the contract with the initial oracle address, default configuration and knowledge base
  // @param initialOracleAddress The address of the oracle contract to be used initially
  // @param knowledgeBaseCID CID of the initial knowledge base
  constructor(address initialOracleAddress, string memory knowledgeBaseCID) {
    owner = msg.sender;
    oracleAddress = initialOracleAddress;
    knowledgeBase = knowledgeBaseCID;
    chatRunsCount = 0;

    config = IOracle.OpenAiRequest({
      model: "gpt-4-turbo",
      frequencyPenalty: 21, // > 20 for null
      logitBias: "", // empty str for null
      maxTokens: 1000, // 0 for null
      presencePenalty: 21, // > 20 for null
      responseFormat: '{"type":"text"}',
      seed: 0, // null
      stop: "", // null
      temperature: 2, // Example temperature (scaled up, 10 means 1.0), > 20 means null
      topP: 101, // Percentage 0-100, > 100 means null
      tools: "",
      toolChoice: "", // "none" or "auto"
      user: "" // null
    });
  }

  // @notice Ensures the caller is the contract owner
  modifier onlyOwner() {
    require(msg.sender == owner, "Caller is not owner");
    _;
  }

  // @notice Ensures the caller is the oracle contract
  modifier onlyOracle() {
    require(msg.sender == oracleAddress, "Caller is not the oracle");
    _;
  }

  // @notice Sets a new oracle address
  // @param newOracleAddress The new oracle address
  function setOracleAddress(address newOracleAddress) public onlyOwner {
    oracleAddress = newOracleAddress;
    emit OracleAddressUpdated(newOracleAddress);
  }

  // @notice Sets a new knowledge base
  // @param newKnowledgeBase The new knowledge base
  function setKnowledgeBase(string memory newKnowledgeBase) public onlyOwner {
    knowledgeBase = newKnowledgeBase;
    emit KnowledgeBaseUpdated(newKnowledgeBase);
  }

  // @notice Starts a new chat
  // @param message The initial message to start the chat with
  // @return The ID of the newly created chat
  function startChat(string memory message) public returns (uint) {
    ChatRun storage run = chatRuns[chatRunsCount];

    run.owner = msg.sender;
    IOracle.Message memory newMessage = createTextMessage("user", message);
    run.messages.push(newMessage);
    run.messagesCount = 1;

    uint currentId = chatRunsCount;
    chatRunsCount = chatRunsCount + 1;

    // If there is a knowledge base, create a knowledge base query
    if (bytes(knowledgeBase).length > 0) {
      IOracle(oracleAddress).createKnowledgeBaseQuery(
        currentId,
        knowledgeBase,
        message,
        3
      );
    } else {
      // Otherwise, create an LLM call
      IOracle(oracleAddress).createLlmCall(currentId);
    }
    emit ChatCreated(msg.sender, currentId);
    emit MessageAdded(currentId, "user", message);

    return currentId;
  }

  // @notice Adds a new message to an existing chat run
  // @param message The new message to add
  // @param runId The ID of the chat run
  function addMessage(string memory message, uint runId) public {
    ChatRun storage run = chatRuns[runId];
    require(
      keccak256(abi.encodePacked(run.messages[run.messagesCount - 1].role)) ==
        keccak256(abi.encodePacked("assistant")),
      "No response to previous message"
    );
    require(run.owner == msg.sender, "Only chat owner can add messages");

    IOracle.Message memory newMessage = createTextMessage("user", message);
    run.messages.push(newMessage);
    run.messagesCount++;
    // If there is a knowledge base, create a knowledge base query
    if (bytes(knowledgeBase).length > 0) {
      IOracle(oracleAddress).createKnowledgeBaseQuery(
        runId,
        knowledgeBase,
        message,
        3
      );
      emit MessageAdded(runId, "user", message);
    } else {
      // Otherwise, create an LLM call
      IOracle(oracleAddress).createLlmCall(runId);
      emit MessageAdded(runId, "user", message);
    }
  }

  // @notice Creates a new message structure with the specified role and content
  // @param role The role of the message sender, e.g., "user" or "assistant"
  // @param content The content of the message to be sent
  // @return A new IOracle.Message struct containing the role and content
  function createTextMessage(
    string memory role,
    string memory content
  ) private pure returns (IOracle.Message memory) {
    IOracle.Message memory newMessage = IOracle.Message({
      role: role,
      content: new IOracle.Content[](1)
    });
    newMessage.content[0].contentType = "text";
    newMessage.content[0].value = content;
    return newMessage;
  }

  // @notice Retrieves the message history of a chat run
  // @param chatId The ID of the chat run
  // @return An array of messages
  // @dev Called by teeML oracle
  function getMessageHistory(
    uint chatId
  ) public view returns (IOracle.Message[] memory) {
    return chatRuns[chatId].messages;
  }

  // @notice Handles the response from the oracle for an LLM call
  // @param runId The ID of the chat run
  // @param response The response from the oracle
  // @dev Called by teeML oracle
  function onOracleLlmResponse(
    uint runId,
    string memory response,
    string memory /*errorMessage*/
  ) public onlyOracle {
    ChatRun storage run = chatRuns[runId];
    require(
      keccak256(abi.encodePacked(run.messages[run.messagesCount - 1].role)) ==
        keccak256(abi.encodePacked("user")),
      "No message to respond to"
    );

    IOracle.Message memory newMessage = createTextMessage(
      "assistant",
      response
    );
    run.messages.push(newMessage);
    run.messagesCount++;

    emit MessageAdded(runId, "assistant", response);
  }

  // @notice Handles the response from the oracle for a knowledge base query
  // @param runId The ID of the chat run
  // @param documents The array of retrieved documents
  // @dev Called by teeML oracle
  function onOracleKnowledgeBaseQueryResponse(
    uint runId,
    string[] memory documents,
    string memory /*errorMessage*/
  ) public onlyOracle {
    ChatRun storage run = chatRuns[runId];
    require(
      keccak256(abi.encodePacked(run.messages[run.messagesCount - 1].role)) ==
        keccak256(abi.encodePacked("user")),
      "No message to add context to"
    );
    // Retrieve the last user message
    IOracle.Message storage lastMessage = run.messages[run.messagesCount - 1];

    // Start with the original message content
    string memory newContent = lastMessage.content[0].value;

    // Append "Relevant context:\n" only if there are documents
    if (documents.length > 0) {
      newContent = string(
        abi.encodePacked(newContent, "\n\nRelevant context:\n")
      );
    }

    // Iterate through the documents and append each to the newContent
    for (uint i = 0; i < documents.length; i++) {
      newContent = string(abi.encodePacked(newContent, documents[i], "\n"));
    }

    // Finally, set the lastMessage content to the newly constructed string
    lastMessage.content[0].value = newContent;

    // Call LLM
    IOracle(oracleAddress).createLlmCall(runId);
  }

}
