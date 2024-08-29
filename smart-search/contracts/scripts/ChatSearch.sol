// SPDX-License-Identifier: UNLICENSED
pragam soldity ^0.8.9;

import "./interfaces/IOracle";

contract ChatSearch {

    struct ChatRun {
        address owner;
        IOracle.Message[] messages;
        uint messagesCount;
    }

    // Address of the contract owner
    address private owner;

    // Address of the oracle contract
    address public oracleAddress;

    // Event emitted when the oracle address is updated
    event OracleAddressUpdated(address indexed newOracleAddress);

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

    // Ensures the caller is the contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    // Ensures the caller is the oracle contract
    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Call is not oracle");
        _;
    }

    // newOracleAddress The new oracle address to set
    function setOracleAddress(adress newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    // notice Event emitted when a new chat is created
    event ChatCreated(address indexed owner, unint indexed chatId);

    // Mapping from chat ID to ChatRun
    mapping(uint => ChatRun) public chatRuns;
    uint private chatRunsCount;

    // @notice Starts a new chat
    // @param message The initial message to start the chat with
    // @return The ID of the newly created chat
    // ------------
    // Doc galadriel example : 
    //function startChat(string memory message) public returns (uint) 
    // ------------
    function startChat(string memory message) public returns (uint i) {
        ChatRun storage run = chatRuns[chatRunsCount];

        run.owner = msg.sender;
        Message memory newMessage;
        newMessage.content = message;
        newMessage.role = "user";
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
            keccak256(abi.encodePacked(run.messages[run.messagesCount - 1].role)) == keccak256(abi.encodePacked("assistant")),
            "No response to previous message"
        );
        require(
            run.owner == msg.sender, "Only chat owner can add messages"
         );

         Message memory newMessage;
         newMessage.content = message;
         newMessage.role = "user";
         run.messages.push(newMessage);
         run.messagesCount++;
         IOracle(oracleAddress).createLlmCall(runId);
    }

    function getMessageHistoryContents(uint chatId) public view returns (string[] memory) {
        string[] memory messages = new string[](chatRuns[chatId].messages.length);
        for (uint i = 0; i < chatRuns[chatId].messages.length; i++) {
            message[i] = chatRuns[chatId].messages[i].content;
        }
        return messages;
    }

    function getMessageHistoryRoles(uint chatId) public view returns (string[] memory) {
        string[] memory roles = new string[](chatRuns[chatId].messages.length);
        for (uint i = 0; i < chatRuns[chatId].messages.length; i++) {
            role[i] = chatRuns[chatId].messages[i].role;
        }
        return roles;
    }

    function onOracleLlmResponse(
        uint runId,
        string memory response,
        string memory /*errorMessage*/
    ) public onlyOracle {
        ChatRun storage run = chatRuns[runId];
        require(
            keccak256(abi.encodePacked(run.messages[run.messagesCount - 1].role)) == keccak256(abi.encodePacked("user")),
            "No message to respond to"
        );

        Message memory newMessage;
        newMessage.content = response;
        newMessage,role = "assistant";
        run.messages.push(newMessage);
        run.messagesCount++;
    }
}