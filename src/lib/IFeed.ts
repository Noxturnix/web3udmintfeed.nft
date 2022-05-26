import type { BigNumber } from "ethers";

export interface IFeed {
  tokenId: BigNumber;
  uri: string;
  blockchain: "ethereum" | "polygon";
  owner: string;
  ownerName: string | null;
  transactionHash: string;
}
