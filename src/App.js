import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [latestBlocks, setLatestBlocks] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);

  const renderLatestBlocks = () => {
    return (
      <div>
        <div className="text-lg text-blue-900 mb-3 font-medium">
          Latest Blocks
        </div>
        <div className="rounded-md bg-blue-100 p-10 h-[70vh] overflow-scroll overflow-x-auto overflow-y-auto">
          <div className="space-y-2">
            {latestBlocks.map((block, i) => {
              return (
                <div className="flex space-x-3 items-center" key={i}>
                  <div
                    className="rounded-md py-2 px-3 bg-blue-200"
                    key={block.number}
                  >
                    <div className="text-blue-700 cursor-pointer hover:underline">
                      {block.number}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div>Fee Recipient:</div>
                    <div className="text-blue-700 cursor-pointer hover:underline">
                      {block.miner.substr(0, 10)}...
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderLatestTransactions = () => {
    return (
      <div>
        <div className="text-lg text-blue-900 mb-3 font-medium">
          Latest Transactions
        </div>
        <div className="rounded-md bg-blue-100 p-10 overflow-scroll h-[70vh] overflow-x-auto overflow-y-auto">
          <div className="space-y-2">
            {latestTransactions.map((tx, i) => {
              return (
                <div className="flex space-x-3 items-center" key={i}>
                  <div className="rounded-md py-2 px-3 bg-blue-200" key={i}>
                    <div className="text-blue-700 cursor-pointer hover:underline">
                      {tx.blockHash.substr(0, 10)}
                    </div>
                  </div>
                  <div>
                    <div className="flex space-x-2">
                      <div>From:</div>
                      <div className="text-blue-700 cursor-pointer hover:underline">
                        {tx.from.substr(0, 10)}...
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div>To:</div>
                      <div className="text-blue-700 cursor-pointer hover:underline">
                        {tx.to.substr(0, 10)}...
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    async function getLatestBlocks() {
      // Get the latest block number
      let blockNumber = await alchemy.core.getBlockNumber();
      console.log(blockNumber);

      let latestBlocks = [];

      let block;

      let num;

      let latestBlockWithTransactions = [];

      // Get only the latest 10 blocks
      for (let i = 0; i < 10; i++) {
        num = blockNumber - i;
        // Get the block with the number num and the information of its transactions
        block = await alchemy.core.getBlockWithTransactions(num);
        latestBlocks.push(block);
        console.log(block);
        // Get only the latest 10 transactions
        if (latestBlockWithTransactions.length < 10) {
          latestBlockWithTransactions.push(...block.transactions);
        }
      }
      setLatestBlocks(latestBlocks);
      latestBlockWithTransactions = latestBlockWithTransactions.slice(0, 10);
      console.log(latestBlockWithTransactions);
      setLatestTransactions(latestBlockWithTransactions);
    }

    getLatestBlocks();
  }, []);

  return (
    <div className="px-2">
      <div className="text-blue-900 text-2xl m-5 font-medium text-center">
        Ethereum Blockchain Explorer
      </div>
      <div className="flex justify-around gap-5 items-center my-10 flex-wrap">
        {renderLatestBlocks()}
        {renderLatestTransactions()}
      </div>
    </div>
  );
}

export default App;
