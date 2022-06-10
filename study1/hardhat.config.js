require("@nomiclabs/hardhat-waffle");

// Go to https://infura.io/ and create a new project
// Replace this with your Infura project ID


// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts


module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/kseNYbAjtqeYBcTrJRG3GfVW0Zupqbex",
      accounts: ["507ab095cdb953f02466259128978a126cf9c728f02686ad0798f41798b5c92a"]
    }
  }
};
