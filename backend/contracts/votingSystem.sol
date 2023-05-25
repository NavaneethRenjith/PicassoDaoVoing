// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

// 6 important points of any voting system
// ------------------------------
// 1. voting must be secret (use ether address)
// 2. one address = one vote
// 3. voters are eligable to vote. (person who deploys the contract dictates who gets to vote
// 4. transparency - rules must be transparent.
// 5. votes must be recorded and counted
// 6. reliable, no frauds.

contract VotingSystem {

    // VARIABLES
    struct vote {
        address voterAddress;
        // yay or nay
        uint choice;
    }

    struct voter {
        string voterName;
        // did the voter voted or not
        bool voted;
    }

    // count the votes
    uint public noResult = 0;
    uint public yesResult = 0;
    string public finalResult;
    uint public totalVoter = 0;
    uint public totalVote = 0;

    // address of ballot
    address public ballotOfficialAddress;
    string public ballotOfficialName;
    string public proposal;

    mapping(uint => vote) private votes;
    mapping(address => voter) public voterRegister;

    // states of ballot
    enum State {
        Created,
        Voting,
        Ended
    }

    State public state;

    // MODIFIERS
    modifier condition(bool _condition){
        require(_condition);
        _;
    }

    // modifier onlyOfficial(){
    //     require(msg.sender == ballotOfficialAddress);
    //     _;
    // }

    modifier inState(State _state){
        require(state == _state);
        _;
    }

    // EVENTS

    // FUNCTIONS
    function addProposal(string memory _ballotOfficialName, string memory _proposal) public{
      //  ballotOfficialAddress = msg.sender;
        ballotOfficialName = _ballotOfficialName;
        proposal = _proposal;

        state = State.Created;
    }

    // creator of ballot adds voter addresses one by one
    function addVoter(address _voterAddress, string memory _voterName) public inState(State.Created) {
        voter memory v;
        v.voterName = _voterName;
        v.voted = false;
        voterRegister[_voterAddress] = v;
        totalVoter++;
    }

    // creator starts the ballot
    function startVote() public inState(State.Created){
        state = State.Voting;
    }
    
    // voter chooses, true or false
    function doVote(uint _choice) public inState(State.Voting) returns(bool voted){
        // first check if the voter is in the voter registry && voter hasnt voted yet
        bool found = false;
        if(bytes(voterRegister[msg.sender].voterName).length != 0 && !voterRegister[msg.sender].voted){
            voterRegister[msg.sender].voted = true;
            vote memory v;
            v.voterAddress = msg.sender;
            v.choice = _choice;

            if(_choice==1){
                // we only count true values (yay)
                yesResult++;
            }
            else{
                noResult++;
            }
            votes[totalVote] = v;
            totalVote++;
            found = true;
        }
        return found;
    }

    function endVote() public inState(State.Voting){
        state = State.Ended;
        finalResult = yesResult>=noResult?"Accepted":"Rejected";
    }
    // function totalVotes() public returns(uint){
    //     return totalVoter;
    // }
    // function totalVote() public returns(uint){
    //     return totalVote;
    // }
    // function yesResult() public returns(uint){
    //     return yesResult;
    // }
    // function totalVotes() public returns(uint){
    //     return totalVoter;
    // }
    // function totalVotes() public returns(uint){
    //     return totalVoter;
    // }


}