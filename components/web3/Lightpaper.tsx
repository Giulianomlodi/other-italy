import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AnimatedPatternBackground from '@/components/layout/AnimatedPatternBackground';
import Image from 'next/image';
import {
    CircleDollarSign,
    Paintbrush,
    Users,
    ScrollText,
    BarChart3,
    Layers,
    Shield,
    Scroll,
    Banana,
    Rocket,
    Target,
    Clock
} from 'lucide-react';

const LitepaperPage = () => {
    const mainSections = [

        {
            title: "Introduction",
            content: `Banana" project is a collection consisting of 3000 unique NFTs, created by a talented artist, each representing a different version of Banana.“ApeChain is the fruit of the monkeys, and the fruit of the monkeys is the banana.” This has been the mantra that we from the Banana team have repeated to ourselves every day since we decided to do something for ApeChain and for the club.

Our main goal is to make Banana something that is extremely inseparable from the monkeys but also useful for everyone else. Banana is not just a symbol; it's a message, a goal, a status. We are working on Banana not only as an idea but also as a tool, and you will definitely be able to have your Banana even in Otherside.

We want to demonstrate that Web3 is united, that Web3 knows how to come together, that Web3 is made of people and dreamers but also of unstoppable builders. Many things can be written with a pen, others can be told with the voice, but think of Banana as the tool to prove your stance. We are Apes and we primarily address the Apes, but the truth is, if you are someone so forward-thinking to be in this space, we want you on our side! Culture can never be set aside; culture is priceless and cannot be bought, not even for all the money in the world.`,
            icon: ScrollText
        },
        {
            title: "Mission",
            content: `Our mission is twofold: to establish Banana as a symbol of identity and distinction in the ApeChain world to make it a tool and status in Web3, and become one of the Iconic artistic collections of the Web 3 ecosystem. The collection aims to become an emblem of ApeChain culture, a symbol for those who embrace innovation, culture, art, and the Web3 community.`,
            icon: Target
        },
        {
            title: "First Step: Artistic Challenge",
            content: `Banana’s first challenge is a head-to-head with artist Maurizio Cattelan, known for his provocative artwork featuring a banana. Our ambitious goal is to surpass the final auction value of Cattelan’s artwork with the market cap of the Banana 404 token. This challenge is an opportunity to demonstrate the strength and unity of the Web3 community and the potential of digital culture. This action aims to bring maximum attention to the WEB 3 world and specifically to the NFT collections involved. With this first challenge, we seek to attract not only the entire Web 3 community to participate in this challenge on ApeChain, but we also aim to attract and onboard an external user base by increasing the chances of making the ApeChain network better known and used.`,
            icon: Paintbrush
        }
    ];

    const preSalePhases = [
        {
            title: "Phase 1: Private Pre-sale",
            content: [
                "Reserved for BANANA, BAYC, MAYC, BAKC, Gs on Ape, Monkees, Bowlers, Humanoids NFT holders.",
                "Token Price: whitelisted users will receive +20% boost of Bananoshi compared to Phase 2."
            ],
            icon: Users
        },
        {
            title: "Phase 2: Public Pre-sale",
            content: [
                "After Phase 1, the sale opens to the general public.",
                "Ensures broader distribution and community growth."
            ],
            icon: Rocket
        }
    ];

    const preSaleBenefits = [
        {
            title: "Benefits of the Two-Phase Structure",
            content: [
                "NFT Holder Incentives: Reward for community support.",
                "Public Access: Ensures broader distribution and community growth."
            ],
            icon: Target
        }
    ];

    const stakingOptions = [
        {
            title: "NFT Banana + BN Bananoshi Full Stakers",
            benefits: [
                "Rewards: Receive 2x the staking rewards.",
                "Eligibility: Full stake requires holding both Banana NFTs and BN Bananoshi.",
                "Minimum Stake Requirement: The minimum staking amount corresponds to the quantity of Banana Bananoshi airdropped to Legendary Banana holders who were eligible for the double snapshot (x2) during the airdrop."
            ],
            icon: Layers
        },
        {
            title: "NFT + BN Bananoshi Stakers",
            benefits: [
                "Rewards: Receive a bonus on their staking rewards.",
                "Minimum Stake Requirement: Stakers must hold both a Banana NFT and BN Bananoshi.",
                "Eligibility: Minimum staking amount is based on the quantity of Banana Bananoshi airdropped to Uncommon Banana holders who were eligible for the double snapshot (x2) in the airdrop."
            ],
            icon: BarChart3
        },
        {
            title: "BN Bananoshi Stakers",
            benefits: [
                "Rewards: Earn basic staking rewards.",
                "Eligibility: Staking is limited to BN Bananoshi only, providing an entry-level reward structure."
            ],
            icon: Shield
        }
    ];

    const tokenDistribution = [
        { label: "Presale", value: "45%", color: "bg-blue-500", amount: "450,000,000 Bananoshi" },
        { label: "Staking Rewards", value: "25%", color: "bg-purple-500", amount: "250,000,000 Bananoshi" },
        { label: "NFT Holders", value: "20%", color: "bg-green-500", amount: "200,000,000 Bananoshi" },
        { label: "Team", value: "10%", color: "bg-yellow-500", amount: "100,000,000 Bananoshi" }
    ];

    const airdropDetails = [
        {
            title: "Airdrop to BANANA NFT Holders",
            content: [
                "Total Allocation: 20% (200,000,000 Bananoshi).",
                "Distribution Method: Point-based system based on number and rarity of Banana NFTs.",
                "Tiers: Uncommon, Rare, Epic, Legendary.",
                "Verification: Daily snapshots for 10 days, twice a day.",
                "Final Allocation: Points determine the token allocation each holder receives.",
                "Wallet Frozen Allocation: 15% of the airdrop (30,000,000 Bananoshi) will be sent to Yuga’s wallet (Yuga is not involved in the operation), the purpose is to 'locked reserve' to promote stability and token deflation."
            ],
            icon: Scroll
        },
        {
            title: "Team Allocation",
            content: [
                "Total Allocation: 10% (100,000,000 Bananoshi).",
                "Purpose: To support project development and management.",
                "Vesting: Lock-up period to prevent immediate Bananoshi sales."
            ],
            icon: Shield
        }
    ];

    return (
        <section className="min-h-screen w-full overflow-hidden flex flex-col items-center py-[150px] px-4 relative">
            <div className="max-w-7xl w-full space-y-8 relative z-10">
                {/* Header Section */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white">BN404 Lite Paper 1.0</h1>
                </div>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Hero Card */}


                    {/* Main Sections */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {mainSections.map((section, index) => (
                            <Card key={index} className={`bg-white/20 backdrop-blur-sm border-white/30 ${index === 0 ? 'lg:col-span-2' : ''}`}>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500 rounded-lg">
                                            <section.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <CardTitle className="text-white">{section.title}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-white/80 whitespace-pre-line">{section.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                <div className="relative aspect-square w-full max-w-md mx-auto">
                                    <Image
                                        src="/images/Banana21.png"
                                        alt="Banana NFT"
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-bold text-white">Banana NFT #21 = BN404 Token</h2>
                                    <div className="space-y-2 text-white/80">
                                        <p>1 NFT = 1,000,000,000 Bananoshi</p>
                                        <p>Our BN404:</p>
                                        <p>1 NFT corresponds to 1 billion Bananoshi.</p>
                                        <p>1 Bananoshi corresponds to 0.000000001 of the whole BN404</p>
                                        <p>Token Holding: When the distribution of Bananoshi starts, the NFT disappears and the fraction of Bananoshi will be tradable on Camelot (you will be able to trade the fraction of BN404).</p>
                                        <p>To amplify our message, we will destroy one of the most iconic NFTs in the collection, Banana #21, transforming it into a unique token called “BN404”, inspired by the classic "DN404." This gesture represents an artistic act where the artwork dissolves and splits into small parts, allowing the community to become part of an ambitious and innovative project, and part of the Artwork itself. With a unique supply of "1” NFT, the Banana #21 NFT will be "burned" and divided into tokens to achieve the Cattelan mission.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Tokenomics Section */}
                    <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <CircleDollarSign className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-white">Tokenomics</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
                                    <div className="space-y-4 text-white/80">
                                        <p>Total Supply: 1 token = 1,000,000,000 Bananoshi</p>
                                        <p>Token Distribution:</p>
                                        <ul className="list-disc pl-6">
                                            <li>45% Presale: 450,000,000 Bananoshi</li>
                                            <li>25% Locked Pool Reward for Stakers: 250,000,000 Bananoshi</li>
                                            <li>20% Airdrop for NFT Banana Holders: 200,000,000 Bananoshi</li>
                                            <li>10% Team: 100,000,000 Bananoshi</li>
                                        </ul>
                                        <p>Funds Distribution from Presale:</p>
                                        <ul className="list-disc pl-6">
                                            <li>10% to the Team</li>
                                            <li>90% to the Liquidity Pool</li>
                                        </ul>

                                    </div>
                                    <div className="relative h-[350px] w-full md:mt-[-20px] mb-10">
                                        <Image
                                            src="/images/Tokenomics.png"
                                            alt="Tokenomics Distribution"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {tokenDistribution.map((item, index) => (
                                        <div key={index} className="p-4 rounded-lg bg-black/20">
                                            <div className={`w-12 h-1 ${item.color} mb-2 rounded-full`} />
                                            <p className="text-white font-bold text-2xl">{item.value}</p>
                                            <p className="text-white/60 text-sm">{item.label}</p>
                                            <p className="text-white/80 text-xs mt-1">{item.amount}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Pre-sale Phases */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {preSalePhases.map((phase, index) => (
                                        <div key={index} className="p-4 rounded-lg bg-black/20">
                                            <div className="flex items-center gap-2 mb-4">
                                                <phase.icon className="w-5 h-5 text-blue-400" />
                                                <h3 className="text-white font-semibold">{phase.title}</h3>
                                            </div>
                                            <ul className="space-y-2">
                                                {phase.content.map((item, idx) => (
                                                    <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                                                        <span className="text-blue-400">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                {/* Benefits of Two-Phase Structure */}
                                <div className="p-4 rounded-lg bg-black/20">
                                    <div className="flex items-center gap-2 mb-4">
                                        {React.createElement(preSaleBenefits[0].icon, { className: "w-5 h-5 text-blue-400" })}
                                        <h3 className="text-white font-semibold">{preSaleBenefits[0].title}</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {preSaleBenefits[0].content.map((item, idx) => (
                                            <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                                                <span className="text-blue-400">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Airdrop Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {airdropDetails.map((detail, index) => (
                                        <div key={index} className="p-4 rounded-lg bg-black/20">
                                            <div className="flex items-center gap-2 mb-4">
                                                <detail.icon className="w-5 h-5 text-blue-400" />
                                                <h3 className="text-white font-semibold">{detail.title}</h3>
                                            </div>
                                            <ul className="space-y-2">
                                                {detail.content.map((item, idx) => (
                                                    <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                                                        <span className="text-blue-400">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Staking Mechanism */}
                    <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <Layers className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-white">Phase 2: Staking Mechanism</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/80 mb-6">
                                Following the pre-sale, Phase 2 introduces a staking mechanism that provides multiple staking options, rewarding different levels of engagement within the Banana ecosystem. Here’s how the staking system will work:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {stakingOptions.map((option, index) => (
                                    <div key={index} className="p-4 rounded-lg bg-black/20">
                                        <div className="flex items-center gap-2 mb-4">
                                            <option.icon className="w-5 h-5 text-blue-400" />
                                            <h3 className="text-white font-semibold">{option.title}</h3>
                                        </div>
                                        <ul className="space-y-2">
                                            {option.benefits.map((benefit, idx) => (
                                                <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                                                    <span className="text-blue-400">•</span>
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Phase 3 & Conclusion */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500 rounded-lg">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-white">Phase 3: Litepaper 2.0</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white/80">Work in progress…</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500 rounded-lg">
                                        <Target className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-white">Conclusion</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white/80">
                                    Banana is more than just an NFT: it’s a message, a goal, a status. Banana is the proof that the Web3 community is united, inclusive, and innovative. With the Banana project, we aim to engage not only ApeChain enthusiasts but anyone who believes in the culture and values of Web3.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Legal Disclaimer */}
                    <Card className="bg-white/20 backdrop-blur-sm border-white/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg">
                                    <Scroll className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-white">Legal Disclaimer for the "Banana" Project</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 text-white/80">
                                {/* Introduction */}
                                <div>
                                    <p>Please read this disclaimer carefully before participating in any activities related to the "Banana" project.</p>
                                    <p className="italic mt-2">No Investment Advice: The information provided in the "Banana" project litepaper, on the website, or through any other channels does not constitute investment advice, financial advice, trading advice, or any recommendation to buy, sell, or hold any cryptocurrency, token, or NFT. You should perform your own due diligence and consult with a financial advisor or legal counsel before making any investment decisions.</p>
                                </div>

                                {/* Nature of Tokens */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Nature of Tokens</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="font-medium text-white">Utility Tokens</p>
                                            <p>The BN404 token is intended to function as utility token within the "Banana" ecosystem. They do not represent or confer any ownership right, equity, or similar interest in the project, its team, or any associated company.</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Non-Security Status</p>
                                            <p>The tokens are not intended to be securities under any jurisdiction. However, interpretations can vary, and we cannot guarantee that regulatory authorities will not classify them as such in the future.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Risks Involved */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Risks Involved</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="font-medium text-white">Volatility</p>
                                            <p>Cryptocurrency and token markets are highly volatile. The value of BN404 tokens can fluctuate dramatically, potentially leading to significant or total loss of your investment.</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Market and Liquidity</p>
                                            <p>There is no assurance of an active or liquid market for BN404 tokens. Liquidity might be limited, affecting your ability to sell or trade your tokens at desired prices.</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Technology Risks</p>
                                            <p>The technology behind blockchain, smart contracts, and NFTs, including the ApeChain network, could have unforeseen bugs or vulnerabilities. This includes, but is not limited to, smart contract failures, hacking, and loss of digital assets due to technical failures.</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Regulatory Risks</p>
                                            <p>Regulatory changes or actions by governmental or regulatory bodies could adversely affect the project, the tokens, or your rights to use them.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Viability */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Project Viability</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="font-medium text-white">No Guarantees</p>
                                            <p>There is no guarantee that the "Banana" project, its goals, or its tokenomics structure will succeed as planned. The project's success depends on various factors outside our control.</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Artistic Value</p>
                                            <p>The value of the NFTs and the symbolic challenge against Maurizio Cattelan's artwork is subjective. There's no assurance that these assets will achieve or maintain any specific market value.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Token Distribution and Use */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Token Distribution and Use</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="font-medium text-white">Token Allocation</p>
                                            <p>The distribution of tokens as outlined (Pre-sale, Staking Rewards, Airdrops, Team Allocation) is subject to change based on project needs or unforeseen circumstances.</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Staking</p>
                                            <p>Rewards from staking are subject to the availability of tokens in the reward pool, which might vary over time. Staking involves locking up your tokens, which could restrict your liquidity.</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">No Refunds</p>
                                            <p>Once tokens are purchased or acquired through any method (pre-sale, airdrop, staking, etc.), there is no right to a refund or exchange.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Legal Jurisdiction */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Legal Jurisdiction</h3>
                                    <p>This disclaimer shall be governed by and construed in accordance with the laws of the United Arab Emirates, and you agree to submit to the exclusive jurisdiction of the courts located in Dubai, UAE.</p>
                                </div>

                                {/* Changes to Disclaimer */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Changes to Disclaimer</h3>
                                    <p>The project reserves the right to update or modify this disclaimer at any time. Participants are encouraged to review this disclaimer periodically.</p>
                                </div>

                                {/* Participation Agreement */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">By participating in the "Banana" project or acquiring any tokens:</h3>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>You acknowledge that you have read, understood, and agreed to be bound by this disclaimer.</li>
                                        <li>You are aware of the risks involved and are financially capable of bearing the risk of loss of your entire investment.</li>
                                        <li>You are not relying on any promises or representations other than those explicitly provided in the project's official documentation.</li>
                                    </ul>
                                </div>

                                {/* Contact Information */}
                                <div className="border-t border-white/20 pt-4">
                                    <p>For further inquiries or concerns, please contact the project team directly at @bananaonape. Remember, always seek independent legal and financial advice before engaging with cryptocurrencies or related projects.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
            <AnimatedPatternBackground />
        </section>
    );
};

export default LitepaperPage;
