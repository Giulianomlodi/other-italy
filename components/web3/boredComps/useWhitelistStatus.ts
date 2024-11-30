import { useState, useEffect } from "react";
import { MerkleTree } from "merkletreejs";
import { keccak256, encodePacked } from "viem";

interface WhitelistConfig {
  members: `0x${string}`[];
  topMembers: `0x${string}`[];
}

export interface WhitelistStatus {
  isMemberWhitelisted: boolean;
  isTopMemberWhitelisted: boolean;
  memberMerkleProof: `0x${string}`[];
  topMemberMerkleProof: `0x${string}`[];
  memberMerkleRoot: string;
  topMemberMerkleRoot: string;
}

export const useWhitelistStatus = (
  address: string | undefined,
  whitelistConfig: WhitelistConfig
) => {
  const [status, setStatus] = useState<WhitelistStatus>({
    isMemberWhitelisted: false,
    isTopMemberWhitelisted: false,
    memberMerkleProof: [],
    topMemberMerkleProof: [],
    memberMerkleRoot: "",
    topMemberMerkleRoot: "",
  });

  useEffect(() => {
    const generateMerkleData = (
      addresses: `0x${string}`[],
      type: "member" | "topMember"
    ) => {
      const leafNodes = addresses.map((addr) =>
        keccak256(
          encodePacked(["address"], [addr.toLowerCase() as `0x${string}`])
        )
      );
      const merkleTree = new MerkleTree(leafNodes, keccak256, {
        sortPairs: true,
      });
      const rootHash = merkleTree.getHexRoot();

      // Console logs for debugging
      console.log(
        `${type === "member" ? "Members" : "Top Members"} Merkle Root:`,
        rootHash
      );

      if (!address) return { verified: false, proof: [], root: rootHash };

      const claimingAddress = keccak256(
        encodePacked(["address"], [address.toLowerCase() as `0x${string}`])
      );
      const hexProof = merkleTree.getHexProof(claimingAddress);
      const verified = merkleTree.verify(hexProof, claimingAddress, rootHash);

      // Console logs for debugging
      console.log(`Address:`, address);
      console.log(
        `Is ${type === "member" ? "Member" : "Top Member"} Whitelisted:`,
        verified
      );
      console.log(
        `${type === "member" ? "Member" : "Top Member"} Merkle Proof:`,
        hexProof
      );

      return { verified, proof: hexProof as `0x${string}`[], root: rootHash };
    };

    console.log("------------------------------------------------");
    console.log("Generating Merkle Proofs for address:", address);
    console.log("------------------------------------------------");

    const memberData = generateMerkleData(whitelistConfig.members, "member");
    const topMemberData = generateMerkleData(
      whitelistConfig.topMembers,
      "topMember"
    );

    setStatus({
      isMemberWhitelisted: memberData.verified,
      isTopMemberWhitelisted: topMemberData.verified,
      memberMerkleProof: memberData.proof,
      topMemberMerkleProof: topMemberData.proof,
      memberMerkleRoot: memberData.root,
      topMemberMerkleRoot: topMemberData.root,
    });
  }, [address, whitelistConfig]);

  return status;
};

export default useWhitelistStatus;
