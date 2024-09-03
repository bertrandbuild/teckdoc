'use client'

import { useContext } from "react";
import { useWeb3Auth } from "./web3auth-context";
import RPC from "./ethersRPC";
import { GlobalContext } from "@/context/globalContext";

export default function Web3AuthLogin() {
  const { provider, setProvider, web3auth, isLoggedIn, setIsLoggedIn } = useWeb3Auth();
  const { updateContext } = useContext(GlobalContext);
  if (!web3auth) {
    return null;
  }

  const login = async () => {
    updateContext("isSearchOpen", false);
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    setIsLoggedIn(true);
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    console.log(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setIsLoggedIn(false);
    console.log("logged out");
  };

  // Check the RPC file for the implementation
  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    console.log(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    console.log(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    console.log(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    console.log("Sending Transaction...");
    const transactionReceipt = await RPC.sendTransaction(provider);
    console.log(transactionReceipt);
  };

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
    <div className="grid">{isLoggedIn ? loggedInView : unloggedInView}</div>
  )
}