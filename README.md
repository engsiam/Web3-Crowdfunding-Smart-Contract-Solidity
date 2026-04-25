# 🚀 Crowdfunding Smart Contract - Hardhat Assignment

A robust, secure, and fully functional crowdfunding smart contract built with **Solidity**, **Hardhat**, and deployed on the **Sepolia Testnet**.

This project was developed as part of the **NonAcademy Blockchain Development Course (Batch 4)**.

---

## 🎯 Project Objective

The objective of this project is to design a decentralized crowdfunding platform where:

* Project creators can launch campaigns with a funding goal and deadline
* Backers can contribute ETH to support campaigns
* Funds are released only if the funding goal is met
* If the goal is not met, contributors can claim a full refund

---

## ✨ Features

* ✅ **Dynamic Campaign Creation**
  Create campaigns with title, description, funding goal, and duration (1–60 days)

* ✅ **Secure Contributions**
  Enforces minimum contribution and deadline validation

* ✅ **Fund Management System**

  * `claimFunds()` for successful campaigns
  * `refund()` for failed campaigns

* ✅ **Reentrancy Protection**
  Implements **Checks-Effects-Interactions (CEI)** pattern

* ✅ **Event Logging**
  Emits events for:

  * Campaign creation
  * Contributions
  * Fund claims
  * Refunds

* 🎖️ **Bonus Feature**
  Minimum contribution requirement per campaign

---

## 🛠️ Tech Stack

* **Smart Contract:** Solidity `^0.8.20`
* **Development Environment:** Hardhat
* **Testing:** Ethers.js + Mocha + Chai
* **Network:** Sepolia Testnet

---

## 📂 Project Structure

```bash
crowdfunding-assignment/
├── contracts/          # Crowdfunding.sol (Core logic)
├── scripts/            # deploy.js (Deployment script)
├── test/               # Crowdfunding.test.js (12+ test cases)
├── hardhat.config.js   # Network & Etherscan config
├── .env                # Environment variables (hidden)
├── .gitignore          # Ignored files
└── README.md           # Documentation
```

---

## 🚀 Getting Started

### 1. Installation

```bash
git clone <your-repo-url>
cd crowdfunding-assignment
npm install
```

---

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
SEPOLIA_RPC_URL=your_alchemy_or_infura_url
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

---

### 3. Compile & Test

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test
```

---

### 4. Deployment

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

### 5. Contract Verification

```bash
npx hardhat verify --network sepolia 0xDFC67a4976C3719CD2F6531808F40953406f8205
```

---

## 🔗 Live Deployment

* **Contract Address:**
  `0xDFC67a4976C3719CD2F6531808F40953406f8205`

* **Etherscan:**
  https://sepolia.etherscan.io/address/0xDFC67a4976C3719CD2F6531808F40953406f8205

---

## 📸 Proof of Work

### ✅ Automated Tests

* All **12+ test cases passed successfully**
* Includes edge cases:

  * Deadline validation
  * Goal logic
  * Refund conditions

---

### 🔍 Live Interaction

* Tested campaign creation and contributions on Sepolia
* Transactions verified via Etherscan
* Smart contract fully verified and public

---

## 👨‍💻 Developed By

**Md. Shohrab Hossain**
Software Engineer & Full Stack Developer

* 🔗 GitHub: https://github.com/engsiam/Web3-Crowdfunding-Smart-Contract-Solidity
* 🔗 LinkedIn: https://www.linkedin.com/in/md-shohrab-hossain-14745133

---

## ⭐ Final Notes

This project demonstrates:

* Smart contract design & security principles
* Real-world crowdfunding logic
* Testing, deployment, and verification workflow

---
## 📸 Transaction Screenshots

![Campaign Creation](https://i.ibb.co.com/k207H0Vw/crowdfunding.png)


