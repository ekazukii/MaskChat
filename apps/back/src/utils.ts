import { utils } from 'ethers';
export type ETHAddress = string;
export type PublicKey = string;

export const isAddress = (address: ETHAddress) => {
  return utils.isAddress(address);
};
