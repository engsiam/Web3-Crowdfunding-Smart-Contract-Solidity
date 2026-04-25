// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

/**
 * @title Crowdfunding Smart Contract
 * @dev assignment Crowdfunding
 * @author Md.Shohrab Hossain
 */
contract Crowdfunding {
    address public owner;
    uint public campaignCount;

    struct Campaign {
        address creator;
        string title;
        string description;
        uint goalAmount;
        uint minContribution;
        uint deadline;
        uint amountRaised;
        bool claimed;
    }
    mapping(uint => Campaign) public campaigns;
    mapping(uint => mapping(address => uint)) public contributions;

    //Events
    event CampaignCreated(
        uint campaignId,
        address creator,
        uint goal,
        uint deadline
    );
    event ContributionReceived(uint campingId, address backer, uint amount);
    event FundsClaimed(uint campaignId, address creator, uint amount);
    event RefundIssued(uint Campaignid, address backer, uint amount);

    // Modifiers
    modifier onlyCreator(uint _campaignId) {
        require(
            msg.sender == campaigns[_campaignId].creator,
            "Not the campaign creator"
        );
        _;
    }

    //constructor
    constructor() {
        owner = msg.sender;
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint _goalAmount,
        uint _minContribution,
        uint _durationInDays
    ) external {
        require(_goalAmount > 0, "Goal must be greater than 0");
        require(_minContribution > 0, "Minimum contribution must be > 0");
        require(
            _durationInDays >= 1 && _durationInDays <= 60,
            "Duration must be 1-60 days"
        );

        uint deadline = block.timestamp + (_durationInDays * 1 days);

        campaignCount++;
        campaigns[campaignCount] = Campaign({
            creator: msg.sender,
            title: _title,
            description: _description,
            goalAmount: _goalAmount,
            minContribution: _minContribution,
            deadline: deadline,
            amountRaised: 0,
            claimed: false
        });

        emit CampaignCreated(campaignCount, msg.sender, _goalAmount, deadline);
    }

    function contribute(uint _campaignId) external payable {
        Campaign storage campaign = campaigns[_campaignId];

        require(
            block.timestamp < campaign.deadline,
            "Campaign deadline has passed"
        );
        require(msg.value >= campaign.minContribution, "Lower than min contribution");

        campaign.amountRaised += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;

        emit ContributionReceived(_campaignId, msg.sender, msg.value);
    }

    function claimFunds(uint _campaignId) external onlyCreator(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];

        require(
            block.timestamp >= campaign.deadline,
            "Deadline not reached yet"
        );
        require(campaign.amountRaised >= campaign.goalAmount, "Goal not met");
        require(!campaign.claimed, "Funds already claimed");

        uint amountToClaim = campaign.amountRaised;

        campaign.claimed = true;

        // Interaction:
        (bool success, ) = payable(msg.sender).call{value: amountToClaim}("");
        require(success, "Transfer failed");

        emit FundsClaimed(_campaignId, msg.sender, amountToClaim);
    }

    function refund(uint _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];

        require(
            block.timestamp >= campaign.deadline,
            "Deadline not reached yet"
        );
        require(
            campaign.amountRaised < campaign.goalAmount,
            "Goal was met, no refund"
        );

        uint contributedAmount = contributions[_campaignId][msg.sender];
        require(contributedAmount > 0, "No contribution found to refund");

        // Effect
        contributions[_campaignId][msg.sender] = 0;

        // Interaction
        (bool success, ) = payable(msg.sender).call{value: contributedAmount}(
            ""
        );
        require(success, "Refund failed");

        emit RefundIssued(_campaignId, msg.sender, contributedAmount);
    }

    function getCampaign(
        uint _campaignId
    )
        external
        view
        returns (
            address creator,
            string memory title,
            string memory description,
            uint goalAmount,
            uint deadline,
            uint amountRaised,
            bool claimed
        )
    {
        Campaign storage c = campaigns[_campaignId];
        return (
            c.creator,
            c.title,
            c.description,
            c.goalAmount,
            c.deadline,
            c.amountRaised,
            c.claimed
        );
    }
}
