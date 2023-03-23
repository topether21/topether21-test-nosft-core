import * as bitcoin from 'bitcoinjs-lib';
import { TESTNET } from './constants';

export const getAddress = (nostrPublicKey: string) => {
  const pubkeyBuffer = Buffer.from(nostrPublicKey, 'hex');
  const addrInfo = bitcoin.payments.p2tr({
    pubkey: pubkeyBuffer,
    network: TESTNET ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
  });
  return addrInfo;
};
