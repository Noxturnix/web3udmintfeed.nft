import type { BigNumber } from "ethers";

export interface UDDomain {
  tokenId: BigNumber;
  uri: string;
  blockchain: "ethereum" | "polygon";
  owner: string;
  transactionHash: string;
}
