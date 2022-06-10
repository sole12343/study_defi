// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

/*此处是第一个测试，测试代币部署的总量是否正确*/

// const { expect } = require("chai");

// describe("Token contract", function() {
//   it("Deployment should assign the total supply of tokens to the owner", async function() {


//     const [owner] = await ethers.getSigners();  
//     //Signer 代表以太坊账户对象； owner 是所连接节点中的帐户列表的第一个

//     const Token = await ethers.getContractFactory("Token");
//     //ethers.js中的ContractFactory是用于部署新智能合约的抽象，因此此处的Token是用来实例代币合约。

//     const hardhatToken = await Token.deploy();
//     //在ContractFactory上调用deploy()将启动部署，并返回解析为Contract的Promise。 
//     //该对象包含了智能合约所有函数的方法。
    
    
//     await hardhatToken.deployed();
//     //当你调用deploy()时，将发送交易，但是直到该交易打包出块后，合约才真正部署.
//     //调用deployed()将返回一个Promise，因此该代码将阻塞直到部署完成。

//     const ownerBalance = await hardhatToken.balanceOf(owner.getAddress());
//     //部署合约后，我们可以在hardhatToken 上调用合约方法，通过调用balanceOf()来获取所有者帐户的余额。
//     //部署合约的帐户获得了全部代币，在使用 hardhat-ethers 插件时，默认情况下， ContractFactory和Contract实例连接到第一个签名者。 
//     //这意味着owner变量中的帐户执行了部署，而balanceOf()应该返回全部发行量。


//     expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
//     // totalSupply()返回代币的发行量，我们检查它是否等于ownerBalance。
//   });
// });



// We import Chai to use its asserting functions here.
const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. 四个阶段   These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    //ethers.js中的ContractFactory是用于部署新智能合约的抽象，因此此处的Token是用来实例代币合约。
    Token = await ethers.getContractFactory("Token");
    //Signer 代表以太坊账户对象； owner 是所连接节点中的帐户列表的第一个，addr1, addr2, ...addrs是之后的账户
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatToken = await Token.deploy();
    await hardhatToken.deployed();

    // We can interact with the contract by calling `hardhatToken.method()`
    await hardhatToken.deployed();
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.定义测试名。

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an assertion objet. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      //希望let 定义的owner地址就是合约里面的owner地址
      expect(await hardhatToken.owner()).to.equal(await owner.getAddress());
    });

    //希望 totalSupply()返回代币的发行量 等于 ownerBalance。
    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.getAddress());
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    /*一共三次测试：
    第一次测试：从owner-->addr1(50) 检查地址1是否是50
               从addr1-->addr2(50) 检查地址2是否是50
               
    第二次测试：从addr1-->owner(1) 检查是否失败，检查owner代币是否没变化
    
    第三次测试：从owner-->addr1(100) 检查地址1是否是100
               从owner-->addr2(50) 检查地址2是否是50 
               检查owner是否是减少150
    分别用三个it async实现
    */
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      //测试 是否成功从owner转账到addr1 50token
      await hardhatToken.transfer(await addr1.getAddress(), 50);
      const addr1Balance = await hardhatToken.balanceOf(
        await addr1.getAddress()
      );
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      //测试 是否成功从addr1转账到addr2 50token
      //转账此处有所不同，采用connect（addr1）
      await hardhatToken.connect(addr1).transfer(await addr2.getAddress(), 50);
      const addr2Balance = await hardhatToken.balanceOf(
        await addr2.getAddress()
      );
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
        await owner.getAddress()
      );

      // Try to send 1 token from addr1 (0 tokens) to owner (1000 tokens).
      // `require` will evaluate false and revert the transaction.会直接报错
      await expect(
        hardhatToken.connect(addr1).transfer(await owner.getAddress(), 1)
      ).to.be.revertedWith("Not enough tokens");

      // Owner balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(await owner.getAddress())).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await hardhatToken.balanceOf(
        await owner.getAddress()
      );

      // Transfer 100 tokens from owner to addr1.
      await hardhatToken.transfer(await addr1.getAddress(), 100);

      // Transfer another 50 tokens from owner to addr2.
      await hardhatToken.transfer(await addr2.getAddress(), 50);

      // Check balances.
      const finalOwnerBalance = await hardhatToken.balanceOf(
        await owner.getAddress()
      );
      expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

      const addr1Balance = await hardhatToken.balanceOf(
        await addr1.getAddress()
      );
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hardhatToken.balanceOf(
        await addr2.getAddress()
      );
      expect(addr2Balance).to.equal(50);
    });
  });
});
