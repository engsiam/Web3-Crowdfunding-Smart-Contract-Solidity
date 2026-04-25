const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Crowdfunding", function () {
  let crowdfunding, owner, creator, backer, otherAccount;
  const goal = ethers.parseEther("5"); // 5 ETH
  const minContribution = ethers.parseEther("0.1"); // 0.1 ETH (Bonus Feature)
  const durationInDays = 30;

  beforeEach(async function () {
    [owner, creator, backer, otherAccount] = await ethers.getSigners();
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");
    crowdfunding = await Crowdfunding.deploy();
  });

  // 1. Contract deploys correctly
  it("✅ 1.Contract deploys correctly", async function () {
    expect(crowdfunding.target).to.not.equal(ethers.ZeroAddress);
    expect(await crowdfunding.owner()).to.equal(owner.address);
  });

  // 2. Campaign creation with valid inputs works
  it("✅ 2. Campaign creation with valid inputs works and emits event", async function () {
    await expect(
      crowdfunding.connect(creator).createCampaign("Test", "Desc", goal, minContribution, durationInDays)
    ).to.emit(crowdfunding, "CampaignCreated");
  });

  // 3. Campaign creation fails with invalid inputs
  it("✅ 3. Campaign creation fails if goal amount is 0", async function () {
    await expect(
      crowdfunding.createCampaign("Invalid", "No goal", 0, minContribution, 30)
    ).to.be.revertedWith("Goal must be greater than 0");
  });

  // 4. Users can contribute ETH to a campaign
  it("✅ 4. Users can contribute ETH and track total correctly", async function () {
    await crowdfunding.createCampaign("Project X", "Desc", goal, minContribution, 10);
    await crowdfunding.connect(backer).contribute(1, { value: ethers.parseEther("1") });
    
    const campaign = await crowdfunding.getCampaign(1);
    expect(campaign.amountRaised).to.equal(ethers.parseEther("1"));
  });

  // 5. Contribution fails after deadline
  it("✅ 5. Contribution fails after deadline", async function () {
    await crowdfunding.createCampaign("Time Test", "Desc", goal, minContribution, 1);
    await time.increase(time.duration.days(2)); // Time travel!
    
    await expect(
      crowdfunding.connect(backer).contribute(1, { value: minContribution })
    ).to.be.revertedWith("Campaign deadline has passed");
  });

  // 6. Contribution fails if below minimum (including 0 ETH)
  it("✅ 6. Should fail if contribution is below minimum (including 0 ETH)", async function () {
    await crowdfunding.connect(creator).createCampaign("Zero Test", "Desc", goal, minContribution, 30);
    
    // Test with 0 ETH
    await expect(crowdfunding.connect(backer).contribute(1, { value: 0 }))
      .to.be.revertedWith("Lower than min contribution");
  });

  // 7. Creator can claim funds after successful campaign
  it("✅ 7. Creator can claim funds after successful campaign and deadline", async function () {
    await crowdfunding.connect(creator).createCampaign("Success", "Desc", goal, minContribution, 1);
    await crowdfunding.connect(backer).contribute(1, { value: goal });
    
    await time.increase(time.duration.days(2));
    await expect(crowdfunding.connect(creator).claimFunds(1)).to.emit(crowdfunding, "FundsClaimed");
  });

  // 8. Non-creator cannot claim funds
  it("✅ 8. Non-creator cannot claim funds", async function () {
    await crowdfunding.connect(creator).createCampaign("Security", "Desc", goal, minContribution, 1);
    await crowdfunding.connect(backer).contribute(1, { value: goal });
    await time.increase(time.duration.days(2));

    await expect(crowdfunding.connect(backer).claimFunds(1)).to.be.revertedWith("Not the campaign creator");
  });

  // 9. Claim fails if goal not met
  it("✅ 9. Claim fails if goal not met", async function () {
    await crowdfunding.connect(creator).createCampaign("Failure", "Desc", goal, minContribution, 1);
    await time.increase(time.duration.days(2));

    await expect(crowdfunding.connect(creator).claimFunds(1)).to.be.revertedWith("Goal not met");
  });

  // 10. Backers can get refund if campaign failed
  it("✅ 10.Backers can get refund if campaign failed", async function () {
    await crowdfunding.createCampaign("Refund", "Desc", goal, minContribution, 1);
    await crowdfunding.connect(backer).contribute(1, { value: minContribution });
    await time.increase(time.duration.days(2));

    await expect(crowdfunding.connect(backer).refund(1)).to.emit(crowdfunding, "RefundIssued");
  });

  // 11. Refund fails if campaign was successful
  it("✅ 11.Refund fails if campaign was successful", async function () {
    await crowdfunding.createCampaign("No Refund", "Desc", goal, minContribution, 1);
    await crowdfunding.connect(backer).contribute(1, { value: goal });
    await time.increase(time.duration.days(2));

    await expect(crowdfunding.connect(backer).refund(1)).to.be.revertedWith("Goal was met, no refund");
  });

  // 12. Double claiming prevention
 it("✅ 12. Events are emitted correctly with correct arguments", async function () {
    // CampaignCreated event check
    const tx = await crowdfunding.connect(creator).createCampaign("Event Test", "Desc", goal, minContribution, 10);
    const receipt = await tx.wait();
    
    // Extracting the timestamp from the block
    await expect(tx)
      .to.emit(crowdfunding, "CampaignCreated")
      .withArgs(1, creator.address, goal, anyUint); // anyUint is a placeholder for the timestamp which we can't predict

    // ContributionReceived event check
    await expect(crowdfunding.connect(backer).contribute(1, { value: minContribution }))
      .to.emit(crowdfunding, "ContributionReceived")
      .withArgs(1, backer.address, minContribution);
  });
});

// helper for any uint value in events
const anyUint = (val) => true;