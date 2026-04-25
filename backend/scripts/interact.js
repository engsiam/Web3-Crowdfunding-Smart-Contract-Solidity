const {ethers} = require("hardhat");

async function main() {
    const contractAddress = await ethers.getContractAt('SimpleBank','0x9558E72E8Ba39Cb93fDD69e992aCCa0CCA93C9EA');
    const contract = await ethers.getContractAt("SimpleBank", contractAddress);
    const balanceWei = await contract.getContractBalance();
    const balance = ethers.formatEther(balanceWei);
    console.log("Contract balance:", balance,"ETH");
}

main().then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});