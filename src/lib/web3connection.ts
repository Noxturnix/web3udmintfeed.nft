import { ethers } from "ethers";

export const polygonRPC = "https://polygon-rpc.com/";
export const polygonContractAddress = "0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f";
export const ethereumRPC = "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
export const ethereumContractAddress = "0x049aba7510f45BA5b64ea9E658E342F904DB358D";

export const unsAbi = [
  "event NewURI(uint256 indexed tokenId, string uri)",
  "function ownerOf(uint256 tokenId) external view returns (address owner)"
];

export const polygonProvider = new ethers.providers.JsonRpcProvider(polygonRPC);
polygonProvider.polling = false;
polygonProvider.pollingInterval = 4e3;
export const polygonRegistryContract = new ethers.Contract(
  polygonContractAddress,
  unsAbi,
  polygonProvider
);

export const ethereumProvider = new ethers.providers.JsonRpcProvider(ethereumRPC);
ethereumProvider.polling = false;
ethereumProvider.pollingInterval = 15e3;
export const ethereumRegistryContract = new ethers.Contract(
  ethereumContractAddress,
  unsAbi,
  ethereumProvider
);
