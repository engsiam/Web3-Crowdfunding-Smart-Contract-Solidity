const hre = require("hardhat");

async function main() {
  console.log("Deploying Crowdfunding contract...");
  // 1. Get the contract factory
  const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
  //2. deploy the contract
  const crowdfunding = await Crowdfunding.deploy();
  // 3. Wait for the deployment to be mined
  await crowdfunding.waitForDeployment();

  //4. Get the deployed contract address
  const contractAddress = await crowdfunding.getAddress();

  console.log("------------------------------------------");
  console.log(`Crowdfunding deployed to: ${contractAddress}`);
  console.log("------------------------------------------");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
