import { BLOCKSTREAM_API, TURBO_API } from '~/constants';
import { omit } from 'lodash';
import axios from 'axios';
import { RawInscription, RawUtxo } from '~/types';

const getInscriptions = async (
  address: string
): Promise<Array<RawInscription>> =>
  (await axios.get(`${TURBO_API}/wallet/${address}/inscriptions`)).data;

const getUtxoForInscription = async (
  inscription: RawInscription,
  address: string
) => {
  const {
    data: {
      inscription: { outpoint },
    },
  } = await axios.get(`${TURBO_API}/inscription/${inscription.id}/outpoint`);

  const txid = outpoint
    .substring(0, outpoint.length - 8)
    .match(/[a-fA-F0-9]{2}/g)
    .reverse()
    .join('');

  const utxo: RawUtxo = (await axios.get(`${BLOCKSTREAM_API}/tx/${txid}`)).data;
  const { value } =
    utxo.vout.find((v) => v.scriptpubkey_address === address) || {};
  return {
    ...omit(utxo, 'vin', 'vout'),
    inscriptionId: inscription?.id,
    ...inscription,
    value,
  };
};

interface GetInscriptionsWithUtxoProps {
  address: string;
  offset: number;
  limit: number;
}

export const getInscriptionsWithUtxo = async ({
  address,
  offset,
  limit,
}: GetInscriptionsWithUtxoProps) => {
  const from = offset;
  const to = from + limit;
  const data = await getInscriptions(address);
  const inscriptions = data?.slice(from, to);
  const inscriptionsWithUtxo = (
    await Promise.allSettled(
      inscriptions.map((inscription) =>
        getUtxoForInscription(inscription, address)
      )
    )
  )
    .filter((i) => i.status === 'fulfilled')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .map((i) => i.value as Inscription);
  const result = {
    inscriptionsWithUtxo,
    count: data.length,
    size: inscriptionsWithUtxo.length,
  };
  return result;
};
