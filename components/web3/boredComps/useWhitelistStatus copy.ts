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
) => {
  // Create Merkle trees once and memoize them
  const { memberTree, topMemberTree } = useMemo(() => {
    const createMerkleTree = (addresses: `0x${string}`[]) => {
      const leafNodes = addresses.map((addr) =>
        keccak256(
          encodePacked(["address"], [addr.toLowerCase() as `0x${string}`])
        )
      );
      return new MerkleTree(leafNodes, keccak256, { sortPairs: true });
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
      setStatus((prev) => ({
        ...prev,
        isMemberWhitelisted: false,
        isTopMemberWhitelisted: false,
        memberMerkleProof: [],
        topMemberMerkleProof: [],
      }));
      return;
    }

    const verifyAddress = (tree: MerkleTree) => {
      const claimingAddress = keccak256(
        encodePacked(["address"], [address.toLowerCase() as `0x${string}`])
      );
      const hexProof = tree.getHexProof(claimingAddress);
      const rootHash = tree.getHexRoot();
      const verified = tree.verify(hexProof, claimingAddress, rootHash);

      return { verified, proof: hexProof as `0x${string}`[] };
    };

    const memberVerification = verifyAddress(memberTree);
    const topMemberVerification = verifyAddress(topMemberTree);

    // Debug logging in development only
    if (process.env.NODE_ENV === "development") {
      console.group("Whitelist Verification");
      console.log("Address:", address);
      console.log("Member Merkle Root:", memberTree.getHexRoot());
      console.log("Top Member Merkle Root:", topMemberTree.getHexRoot());
      console.log("Is Member Whitelisted:", memberVerification.verified);
      console.log("Is Top Member Whitelisted:", topMemberVerification.verified);
      console.log("Member Merkle Proof:", memberVerification.proof);
      console.log("Top Member Merkle Proof:", topMemberVerification.proof);
      console.groupEnd();
    }

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
