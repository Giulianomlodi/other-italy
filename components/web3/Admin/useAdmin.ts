// useAdmin.ts
import { useEffect, useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { italyABI } from "@/other-italy-abi";

interface AdminState {
  isActiveMint: boolean;
  membersBaseURI: string;
  topMembersBaseURI: string;
  membersMerkleRoot: string;
  topMembersMerkleRoot: string;
}

export const useAdmin = (contractAddress: `0x${string}`) => {
  const { address } = useAccount();
  const [adminState, setAdminState] = useState<AdminState>({
    isActiveMint: false,
    membersBaseURI: "",
    topMembersBaseURI: "",
    membersMerkleRoot: "",
    topMembersMerkleRoot: "",
  });

  // Read contract states
  const { data: activeMint } = useReadContract({
    address: contractAddress,
    abi: italyABI,
    functionName: "activeMint",
  });

  const { data: membersMerkleRoot } = useReadContract({
    address: contractAddress,
    abi: italyABI,
    functionName: "membersMerkleRoot",
  });

  const { data: topMembersMerkleRoot } = useReadContract({
    address: contractAddress,
    abi: italyABI,
    functionName: "topMembersMerkleRoot",
  });

  // Write contract functions
  const { writeContract: write, isPending } = useWriteContract();

  // Update state when contract data changes
  useEffect(() => {
    if (typeof activeMint === "boolean") {
      setAdminState((prev) => ({ ...prev, isActiveMint: activeMint }));
    }
    if (membersMerkleRoot) {
      setAdminState((prev) => ({
        ...prev,
        membersMerkleRoot: membersMerkleRoot as string,
      }));
    }
    if (topMembersMerkleRoot) {
      setAdminState((prev) => ({
        ...prev,
        topMembersMerkleRoot: topMembersMerkleRoot as string,
      }));
    }
  }, [activeMint, membersMerkleRoot, topMembersMerkleRoot]);

  // Admin functions
  const setActiveMint = async (state: boolean) => {
    try {
      await write({
        address: contractAddress,
        abi: italyABI,
        functionName: "setActiveMint",
        args: [state],
      });
    } catch (error) {
      console.error("Error setting active mint:", error);
      throw error;
    }
  };

  const updateBaseURIs = async (membersURI: string, topMembersURI: string) => {
    try {
      await write({
        address: contractAddress,
        abi: italyABI,
        functionName: "updateBaseURIs",
        args: [membersURI, topMembersURI],
      });
    } catch (error) {
      console.error("Error updating base URIs:", error);
      throw error;
    }
  };

  const updateMerkleRoots = async (
    membersRoot: string,
    topMembersRoot: string
  ) => {
    try {
      await write({
        address: contractAddress,
        abi: italyABI,
        functionName: "updateMerkleRoots",
        args: [membersRoot as `0x${string}`, topMembersRoot as `0x${string}`],
      });
    } catch (error) {
      console.error("Error updating merkle roots:", error);
      throw error;
    }
  };

  const mintTo = async (to: `0x${string}`, isTopMember: boolean) => {
    try {
      await write({
        address: contractAddress,
        abi: italyABI,
        functionName: "mintTo",
        args: [to, isTopMember],
      });
    } catch (error) {
      console.error("Error minting to address:", error);
      throw error;
    }
  };

  return {
    adminState,
    isPending,
    setActiveMint,
    updateBaseURIs,
    updateMerkleRoots,
    mintTo,
  };
};
