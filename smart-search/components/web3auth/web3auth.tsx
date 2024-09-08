'use client'

import { useContext } from "react";
import { useWeb3Auth } from "./web3auth-context";
import RPC from "./ethersRPC";
import { GlobalContext } from "@/context/globalContext";
import { IS_ADMIN, MAX_REQUESTS_LOGGED, MAX_REQUESTS_NOT_LOGGED } from "@/config/constant";

export default function Web3AuthLogin() {
  const { provider, setProvider, web3auth, isLoggedIn, setIsLoggedIn } = useWeb3Auth();
  const { updateContext, numberRequests } = useContext(GlobalContext);
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

  const adminView = (
    <>
      <div>
          <div onClick={getUserInfo} className="card">
            Get User Info
          </div>
        </div>
        <div>
          <div onClick={getAccounts} className="card">
            Get Accounts
          </div>
        </div>
        <div>
          <div onClick={getBalance} className="card">
            Get Balance
          </div>
        </div>
        <div>
          <div onClick={signMessage} className="card">
            Sign Message
          </div>
        </div>
        <div>
          <div onClick={sendTransaction} className="card">
            Send Transaction
          </div>
        </div>
    </>
  );

  const loggedInView = (
    <div className="flex-container flex flex-row items-center justify-between">
      <div className="mr-4 text-sm text-gray-500">
        Number of requests: {numberRequests} / {MAX_REQUESTS_LOGGED}
      </div>
      <span onClick={logout} className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
        Log Out
      </span>
      {IS_ADMIN && adminView}
    </div>
  );

  const unloggedInView = (
    <div className="flex-container flex flex-row items-center justify-between">
      <div className="mr-4 text-sm text-gray-500">
        Number of requests: {numberRequests} / {MAX_REQUESTS_NOT_LOGGED}
      </div>
      <span onClick={login} className="cursor-pointer text-sm text-gray-500 underline hover:text-gray-700">
        Login for more free AI requests
      </span>
    </div>
  );

  return (
    <div className="grid">{isLoggedIn ? loggedInView : unloggedInView}</div>
  )
}