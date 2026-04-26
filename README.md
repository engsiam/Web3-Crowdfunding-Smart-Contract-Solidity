# 🚀 Crowdfunding Platform

A decentralized crowdfunding platform built with **Solidity**, **Hardhat**, **Next.js**, **React**, and **Ethers.js**, deployed on the **Sepolia Ethereum Testnet**.

This project was developed as part of the **NonAcademy Blockchain Development Course (Batch 4)**.

---

## 🎯 Project Overview

A fully functional decentralized crowdfunding platform where:
- Project creators can launch campaigns with funding goals and deadlines
- Backers can contribute ETH to support campaigns
- Funds are released only if the funding goal is met
- If the goal is not met, contributors can claim a full refund

---

## ✨ Features

### Smart Contract
- **Dynamic Campaign Creation** - Create campaigns with title, description, funding goal, min contribution, and duration (1-60 days)
- **Secure Contributions** - Enforces minimum contribution and deadline validation
- **Fund Management** - `claimFunds()` for successful campaigns, `refund()` for failed campaigns
- **Reentrancy Protection** - Implements Checks-Effects-Interactions (CEI) pattern
- **Event Logging** - Emits events for campaign creation, contributions, fund claims, and refunds

### Frontend dApp
- **MetaMask Integration** - Secure wallet connection
- **Real-time Analytics** - Track funding trends with charts
- **Funding Activity** - View all campaign transactions on Etherscan
- **Fast UI** - Next.js with Turbopack for lightning performance
- **Dark Theme** - Modern amber/orange color scheme
- **Responsive Design** - Works on desktop and mobile

---

## 🛠 Tech Stack

### Backend (Smart Contract)
| Technology | Purpose |
|------------|---------|
| Solidity ^0.8.20 | Smart contract language |
| Hardhat | Development environment |
| Ethers.js v6 | Blockchain interaction |
| Mocha + Chai | Testing framework |
| Sepolia Testnet | Deployment network |

### Frontend (dApp)
| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| React 19 | UI library |
| TypeScript | Type-safe development |
| Tailwind CSS v4 | Utility-first styling |
| Zustand | Lightweight state management |
| Ethers.js v6 | Ethereum blockchain interaction |
| Recharts | Analytics charts |
| react-hot-toast | Transaction notifications |

---

## 📂 Project Structure

```
crowdfunding/
├── backend/                    # Smart contract (Hardhat)
│   ├── contracts/              # Crowdfunding.sol
│   ├── scripts/               # Deployment scripts
│   ├── test/                  # Test cases
│   └── hardhat.config.js       # Network configuration
│
├── frontend/                  # Next.js dApp
│   ├── src/
│   │   ├── app/               # App router pages
│   │   ├── components/        # UI components
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilities
│   │   ├── store/             # Zustand stores
│   │   └── types/             # Type definitions
│   └── package.json
│
└── README.md                   # This file
```

---

## 🔗 Smart Contract

**Contract Address:** `0xDFC67a4976C3719CD2F6531808F40953406f8205`

**Etherscan:** https://sepolia.etherscan.io/address/0xDFC67a4976C3719CD2F6531808F40953406f8205

### Contract Functions

| Function | Description |
|----------|-------------|
| `createCampaign()` | Create a new campaign |
| `contribute()` | Contribute ETH to a campaign |
| `claimFunds()` | Creator claims funds when goal met |
| `refund()` | Contributors request refund |
| `getCampaign()` | Get campaign details |
| `campaignCount()` | Get total campaign count |

### Contract Events

| Event | Description |
|-------|-------------|
| `CampaignCreated` | New campaign created |
| `ContributionReceived` | ETH contributed |
| `FundsClaimed` | Creator claimed funds |
| `RefundIssued` | Refund processed |

---

## 🌐 Network Configuration

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Sepolia Testnet | `0xaa36a7` | `https://rpc.sepolia.org` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Sepolia ETH (for testing)

### Backend Setup

```bash
cd backend
npm install
npx hardhat compile
npx hardhat test
```

#### Environment Variables

Create `.env` in backend directory:

```env
SEPOLIA_RPC_URL=your_alchemy_or_infura_url
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
```

#### Deployment

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

#### Environment Variables

Create `.env.local` in frontend directory:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xDFC67a4976C3719CD2F6531808F40953406f8205
NEXT_PUBLIC_CHAIN_ID=0xaa36a7
```

---

## 📄 Pages Overview

### Dashboard (`/`)
- Project overview stats (Total Raised, Active Campaigns)
- Campaign grid with progress bars
- Launch Campaign modal
- Connect wallet functionality

### Analytics (`/analytics`)
- Funding statistics cards
- Contributions over time chart
- Global funding trends

### Funding Activity (`/transactions`)
- Transaction history table
- Filter by type
- Etherscan links

---

## 📸 Project Preview

![Dashboard Preview](https://i.ibb.co.com/k207H0Vw/crowdfunding.png)
![Frontend Preview](https://i.ibb.co.com/xVzdbDq/Screenshot-6.png)

---

## ✅ Tests

All **12+ smart contract test cases** passed including:
- Deadline validation
- Goal logic
- Refund conditions
- Reentrancy protection

---

## 🔒 Security Notes

- All transactions require MetaMask connection
- Contract verified on Sepolia testnet
- Never share private keys
- Use testnet for development only

---

## 👨‍💻 Developed By

**Md. Shohrab Hossain**
Software Engineer & Full Stack Developer

- GitHub: https://github.com/engsiam/Web3-Crowdfunding-Smart-Contract-Solidity
- LinkedIn: https://www.linkedin.com/in/md-shohrab-hossain-14745133

---

## 📜 License

MIT License - Built for educational purposes on Ethereum Sepolia testnet.

---

**Built with ❤️ using Solidity, Hardhat, Next.js, and Ethers.js**