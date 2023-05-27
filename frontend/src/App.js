import React, { useState, useEffect } from 'react';
import './App.css';
// import { ethers } from 'ethers';
import Web3 from 'web3';
import VotingSystemContract from './VotingSystem.json';
const ethers = require("ethers");
// const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
// const contractAddress = '0xD548914Ee53D07Ae78EcbF7A3713b6A46F582eaB';


const App = () => {
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [propsalRaisedByAddress, setpropsalRaisedByAddress] = useState('');
    const [ballotOfficialName, setBallotOfficialName] = useState('');
    const [proposal, setProposal] = useState('');
    const [voterAddress, setVoterAddress] = useState('');
    const [voterName, setVoterName] = useState('');
    const [voteChoice, setVoteChoice] = useState(0);
    const [votingStarted, setVotingStarted] = useState(false);
    const [votingEnded, setVotingEnded] = useState(false);
    const [voterRegistered, setVoterRegistered] = useState(false);
    const [totalVotes, setTotalVotes] = useState(0);
    const [yesVotes, setYesVotes] = useState(0);
    const [noVotes, setNoVotes] = useState(0);
    const [finalResult, setFinalResult] = useState('');

    useEffect(() => {
        // const initContract = async () => {
        //   const contract = new web3.eth.Contract(VotingSystemContract, contractAddress);
        //   setContract(contract);
        // };

        // initContract();
        initializeContract();
    }, []);

    // const initializeContract = async () => {
    //   try {
    //     if (window.ethereum) {
    //       await window.ethereum.enable();
    //       const provider = new ethers.providers.Web3Provider(window.ethereum);
    //       const signer = provider.getSigner();
    //       const contractAddress = '0xD548914Ee53D07Ae78EcbF7A3713b6A46F582eaB';
    //       const contract = new ethers.Contract(contractAddress, VotingSystemContract.abi, signer);

    //       setContract(contract);
    //       setProvider(provider);
    //     } else {
    //       console.log('Please install MetaMask to interact with this dApp.');
    //     }
    //   } catch (error) {
    //     console.log('Error initializing contract:', error);
    //   }
    // };
    const initializeContract = async () => {
        try {
            if (window.ethereum) {
                await window.ethereum.enable();
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                //! Replace contractAddress here
                const contractAddress = '0x35C6eA8c815599d864dc6e9AC08C76445fC846fD';
                const contract = new ethers.Contract(contractAddress, VotingSystemContract, signer);

                if (contract && contract.addProposal) {
                    setContract(contract);
                    setProvider(provider);
                    console.log('Contract initialized successfully!');
                } else {
                    console.log('Contract or function not found.');
                }
            } else {
                console.log('Please install MetaMask to interact with this dApp.');
            }
        } catch (error) {
            console.log('Error initializing contract:', error);
        }
    };


    const addProposal = async () => {
        try {
            await contract.addProposal(ballotOfficialName, proposal);
            console.log('Proposal added successfully!');
        } catch (error) {
            console.log('Error adding proposal:', error);
        }
    };

    //   const addVoter = async () => {
    //     try {
    //       await contract.addVoter(voterAddress, voterName);
    //       console.log('Voter added successfully!');
    //     } catch (error) {
    //       console.log('Error adding voter:', error);
    //     }
    //   };

    const startVote = async () => {
        try {
            await contract.startVote();
            console.log('Voting started!');
            setVotingStarted(true);
        } catch (error) {
            console.log('Error starting vote:', error);
        }
    };

    const doVote = async () => {
        try {
            await contract.doVote(voteChoice);
            console.log('Vote submitted!');
        } catch (error) {
            console.log('Error submitting vote:', error);
        }
    };

    const endVote = async () => {
        try {
            await contract.endVote();
            console.log('Voting ended!');
            setVotingEnded(true);
        } catch (error) {
            console.log('Error ending vote:', error);
        }
    };

    const fetchVoteResults = async () => {
        try {
            const totalVoter = await contract.totalVoter();
            const totalVote = await contract.totalVote();
            const yesResult = await contract.yesResult();
            const noResult = await contract.noResult();

            setTotalVotes(parseInt(totalVote));
            setYesVotes(parseInt(yesResult));
            setNoVotes(parseInt(noResult));
            const finalResult = yesVotes > noVotes ? "Accepted" : "Rejected";
            setFinalResult(finalResult);
        } catch (error) {
            console.log('Error fetching vote results:', error);
        }
    };

    return (
        <div className="container">
            <h2>Voting System</h2>

            <div className="top-half">
                <div className="section1">
                    <h3>Add Proposal</h3>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={ballotOfficialName}
                        onChange={(e) => setBallotOfficialName(e.target.value)}
                    />
                    <br />
                    <label>Proposal:</label>
                    <input
                        type="text"
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                    />
                    <br />
                    <button onClick={addProposal}>Add Proposal</button>
                </div>

                {/* <div className="section2">
          <h3>Add Voter</h3>
          <label>Voter Address:</label>
          <input
            type="text"
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value)}
          />
          <br />
          <label>Voter Name:</label>
          <input
            type="text"
            value={voterName}
            onChange={(e) => setVoterName(e.target.value)}
          />
          <br />
          <button onClick={addVoter}>Add Voter</button>
        </div> */}
            </div>

            <div className="bottom-half">
                <div className="section3">
                    <h3>Start Vote</h3>
                    <button onClick={startVote}>Start Vote</button>
                </div>

                {votingStarted && (
                    <div className="section5">
                        <h3>Cast Your Vote</h3>
                        <label>Vote Choice:</label>
                        <select
                            value={voteChoice}
                            onChange={(e) => setVoteChoice(parseInt(e.target.value))}
                        >
                            <option value={0}>Nay</option>
                            <option value={1}>Yay</option>
                        </select>
                        <br />
                        <button onClick={doVote}>Submit Vote</button>
                    </div>
                )}

                <div className="section4">
                    <h3>End Vote</h3>
                    <button onClick={endVote}>End Vote</button>
                </div>

                {votingEnded && (
                    <div className="section6">
                        <h3>Vote Results</h3>
                        <button onClick={fetchVoteResults}>Fetch Results</button>
                        <br />
                        <p>Total Votes: {totalVotes}</p>
                        <p>Yes Votes: {yesVotes}</p>
                        <p>No Votes: {noVotes}</p>
                        <p>Final Result: {finalResult}</p>
                    </div>
                )}
            </div>
        </div>
    );

};

export default App;