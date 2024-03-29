import { Event } from 'nostr-tools';

export interface Meta {
  name: string;
}

export interface RawInscription {
  collection: unknown;
  content_type: string;
  escrow: number | undefined;
  id: string;
  meta: Meta | undefined;
  num: number;
}

export interface BaseUtxo {
  txid: string;
  vout: number;
  status: UtxoStatus;
  value: number;
}

export interface RawUtxo {
  txid: string;
  version: number;
  locktime: number;
  vin: Vin[];
  vout: Vout[];
  size: number;
  weight: number;
  fee: number;
  status: UtxoStatus;
}

export interface Vin {
  txid: string;
  vout: number;
  prevout: null[];
  scriptsig: string;
  scriptsig_asm: string;
  witness: null[];
  is_coinbase: boolean;
  sequence: number;
}

export interface Vout {
  scriptpubkey: string;
  scriptpubkey_asm: string;
  scriptpubkey_type: string;
  scriptpubkey_address: string;
  value: number;
}

export interface Inscription {
  txid: string;
  version: number;
  locktime: number;
  size: number;
  weight: number;
  fee: number;
  status: UtxoStatus;
  inscriptionId: string;
  collection: Collection;
  content_type: string;
  escrow: number | null;
  id: string;
  meta: Meta;
  num: number;
  value: number;
}

export interface Collection {
  creator_address: string | null;
  name: string;
  slug: string;
}

export interface Meta {
  name: string;
}

export interface UtxoStatus {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

export interface SaleOrder {
  title: string;
  txid: string;
  inscriptionId: string;
  value: number;
  usdPrice: string;
  id: string;
  kind: number;
  pubkey: string;
  created_at: number;
  content: string;
  tags: Array<string[]>;
  sig: string;
  collection: null;
  content_length: number;
  content_type: string;
  created: number;
  escrow: Escrow;
  genesis_fee: number;
  genesis_height: number;
  meta: null;
  num: number;
}

export interface Escrow {
  bought_at: string;
  satoshi_price: number;
  seller_address: string;
}

// Ref: https://github.com/nostr-protocol/nips/blob/master/07.md
declare global {
  interface Window {
    nostr: {
      getPublicKey(): Promise<string>; // returns a public key as hex
      signEvent(event: Event): Promise<Event>; // takes an event object, adds `id`, `pubkey` and `sig` and returns it
      getRelays(): Promise<{
        [url: string]: { read: boolean; write: boolean };
      }>; // returns a basic map of relay urls to relay policies
      signSchnorr(key: string): Promise<string>;
    };
  }
}
