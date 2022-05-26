import axios from "axios";
import type { BigNumber } from "ethers";

interface UDMetadata {
  name: string;
  description: string;
}

export const lookupDomainFromTokenId = async (tokenId: BigNumber) =>
  (await axios.get<UDMetadata>(`https://metadata.unstoppabledomains.com/metadata/${tokenId}`)).data
    .name;
