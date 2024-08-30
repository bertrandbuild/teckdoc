// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "./interfaces/IOracle.sol";

// @title ChatSearch
// @notice This contract interacts with teeML oracle to handle multi-modal chat interactions using the OpenAI model.
contract ChatSearch {
  struct ChatRun {
    address owner;
    IOracle.Message[] messages;
    uint messagesCount;
  }

  // @notice Address of the contract owner
  address private owner;

  // @notice Address of the oracle contract
  address public oracleAddress;

  // @notice Event emitted when the oracle address is updated
  event OracleAddressUpdated(address indexed newOracleAddress);

  // @notice Event emitted when a new chat is created
  event ChatCreated(address indexed owner, uint indexed chatId);

  // @notice Configuration for the OpenAI request
  IOracle.OpenAiRequest private config;

  // @notice Mapping from chat ID to ChatRun
  mapping(uint => ChatRun) public chatRuns;
  uint private chatRunsCount;

  // @notice Initializes the contract with the initial oracle address and default configuration for OpenAI requests
  // @param initialOracleAddress The address of the oracle contract to be used initially
  constructor(address initialOracleAddress) {
    owner = msg.sender;
    oracleAddress = initialOracleAddress;
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
    require(msg.sender == oracleAddress, "Call is not oracle");
    _;
  }

  // @notice newOracleAddress The new oracle address to set
  function setOracleAddress(address newOracleAddress) public onlyOwner {
    oracleAddress = newOracleAddress;
    emit OracleAddressUpdated(newOracleAddress);
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

    IOracle(oracleAddress).createLlmCall(currentId);
    emit ChatCreated(msg.sender, currentId);

    return currentId;
  }

  // @notice Adds a new message to an existing chat run
  // @param message The new message to add
  // @param runId The ID of the chat run
  function addMessage(string memory message, uint runId) public {
    ChatRun storage run = chatRuns[runId];
    require(
      run.messagesCount > 0 &&
        keccak256(abi.encodePacked(run.messages[run.messagesCount - 1].role)) ==
        keccak256(abi.encodePacked("assistant")),
      "No response to previous message"
    );
    require(run.owner == msg.sender, "Only chat owner can add messages");

    IOracle.Message memory newMessage = createTextMessage("user", message);
    run.messages.push(newMessage);
    run.messagesCount++;
    IOracle(oracleAddress).createLlmCall(runId);
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

  // @notice Retrieves the text content of all messages in a specific chat
  // @param chatId The ID of the chat from which to retrieve the message contents
  // @return An array of strings, where each string is the content of a message in the chat
  function getMessageHistoryContents(
    uint chatId
  ) public view returns (string[] memory) {
    ChatRun storage run = chatRuns[chatId];
    string[] memory messages = new string[](run.messages.length);

    for (uint i = 0; i < run.messages.length; i++) {
      if (run.messages[i].content.length > 0) {
        messages[i] = run.messages[i].content[0].value;
      } else {
        messages[i] = "";
      }
    }
    return messages;
  }

  // @notice Retrieves the roles of all messages in a specific chat
  // @param chatId The ID of the chat from which to retrieve the message roles
  // @return An array of strings, where each string represents the role of the sender of a message in the chat
  function getMessageHistoryRoles(
    uint chatId
  ) public view returns (string[] memory) {
    ChatRun storage run = chatRuns[chatId];
    string[] memory roles = new string[](run.messages.length);

    for (uint i = 0; i < run.messages.length; i++) {
      roles[i] = run.messages[i].role;
    }
    return roles;
  }

  // @notice Handles the response from the oracle, adding it as a message in the chat run
  // @param runId The ID of the chat run that the oracle response belongs to
  // @param response The content of the response from the oracle
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
  }
}
