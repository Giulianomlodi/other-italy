// useWhitelistStatus.ts
import { useState, useEffect, useMemo } from "react";
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
): WhitelistStatus => {
  // Create Merkle trees once and memoize them
  const { memberTree, topMemberTree } = useMemo(() => {
    const createMerkleTree = (addresses: `0x${string}`[]) => {
      // Debug: Log addresses being processed
      console.log("Processing addresses for Merkle tree:", addresses);

      // Ensure addresses are lowercase
      const normalizedAddresses = addresses.map((addr) => addr.toLowerCase());
      console.log("Normalized addresses:", normalizedAddresses);

      const leafNodes = normalizedAddresses.map((addr) => {
        // Create leaf node exactly as the contract does
        const leaf = keccak256(
          encodePacked(["address"] as const, [addr as `0x${string}`])
        );
        console.log(`Leaf node for ${addr}:`, leaf);
        return leaf;
      });

      const tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
      console.log("Merkle Root:", tree.getHexRoot());

      // Debug: Print the entire tree structure
      console.log("Tree Layers:", tree.getLayers());

      return tree;
    };

    return {
      memberTree: createMerkleTree(whitelistConfig.members),
      topMemberTree: createMerkleTree(whitelistConfig.topMembers),
    };
  }, [whitelistConfig.members, whitelistConfig.topMembers]);

  const [status, setStatus] = useState<WhitelistStatus>({
    isMemberWhitelisted: false,
    isTopMemberWhitelisted: false,
    memberMerkleProof: [],
    topMemberMerkleProof: [],
    memberMerkleRoot: memberTree.getHexRoot(),
    topMemberMerkleRoot: topMemberTree.getHexRoot(),
  });

  useEffect(() => {
    if (!address) {
      return;
    }

    const verifyAddress = (tree: MerkleTree) => {
      // Debug: Log the verification process
      console.log("Verifying address:", address.toLowerCase());

      const claimingAddress = keccak256(
        encodePacked(["address"] as const, [
          address.toLowerCase() as `0x${string}`,
        ])
      );
      console.log("Generated leaf for verification:", claimingAddress);

      const hexProof = tree.getHexProof(claimingAddress);
      console.log("Generated Merkle proof:", hexProof);

      const rootHash = tree.getHexRoot();
      console.log("Tree root hash:", rootHash);

      const verified = tree.verify(hexProof, claimingAddress, rootHash);
      console.log("Verification result:", verified);

      return { verified, proof: hexProof as `0x${string}`[] };
    };

    const memberVerification = verifyAddress(memberTree);
    const topMemberVerification = verifyAddress(topMemberTree);

    // Additional debug info
    console.log("Final verification results:", {
      memberVerification,
      topMemberVerification,
      address,
      memberRoot: memberTree.getHexRoot(),
      topMemberRoot: topMemberTree.getHexRoot(),
    });

    setStatus({
      isMemberWhitelisted: memberVerification.verified,
      isTopMemberWhitelisted: topMemberVerification.verified,
      memberMerkleProof: memberVerification.proof,
      topMemberMerkleProof: topMemberVerification.proof,
      memberMerkleRoot: memberTree.getHexRoot(),
      topMemberMerkleRoot: topMemberTree.getHexRoot(),
    });
  }, [address, memberTree, topMemberTree]);

  return status;
};
