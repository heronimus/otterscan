import React from "react";
import { ethers } from "ethers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import ContentFrame from "../ContentFrame";
import InfoRow from "../components/InfoRow";
import BlockLink from "../components/BlockLink";
import AddressHighlighter from "../components/AddressHighlighter";
import AddressOrENSName from "../components/AddressOrENSName";
import Copy from "../components/Copy";
import Timestamp from "../components/Timestamp";
import InternalTransfer from "../components/InternalTransfer";
import InternalSelfDestruct from "../components/InternalSelfDestruct";
import MethodName from "../components/MethodName";
import GasValue from "../components/GasValue";
import FormattedBalance from "../components/FormattedBalance";
import TokenTransferItem from "../TokenTransferItem";
import { InternalTransfers, TransactionData } from "../types";

type DetailsProps = {
  txData: TransactionData;
  internalTransfers?: InternalTransfers;
  sendsEthToMiner: boolean;
};

const Details: React.FC<DetailsProps> = ({
  txData,
  internalTransfers,
  sendsEthToMiner,
}) => (
  <ContentFrame tabs>
    <InfoRow title="Transaction Hash">
      <div className="flex items-baseline space-x-2">
        <span className="font-hash">{txData.transactionHash}</span>
        <Copy value={txData.transactionHash} />
      </div>
    </InfoRow>
    <InfoRow title="Status">
      {txData.status ? (
        <span className="flex items-center w-min rounded-lg space-x-1 px-3 py-1 bg-green-50 text-green-500 text-xs">
          <FontAwesomeIcon icon={faCheckCircle} size="1x" />
          <span>Success</span>
        </span>
      ) : (
        <span className="flex items-center w-min rounded-lg space-x-1 px-3 py-1 bg-red-50 text-red-500 text-xs">
          <FontAwesomeIcon icon={faTimesCircle} size="1x" />
          <span>Fail</span>
        </span>
      )}
    </InfoRow>
    <InfoRow title="Block">
      <div className="flex items-baseline space-x-2">
        <BlockLink blockTag={txData.blockNumber} />
        <span className="rounded text-xs bg-gray-100 text-gray-500 px-2 py-1">
          {txData.confirmations} Block Confirmations
        </span>
      </div>
    </InfoRow>
    <InfoRow title="Timestamp">
      <Timestamp value={txData.timestamp} />
    </InfoRow>
    <InfoRow title="From">
      <div className="flex items-baseline space-x-2 -ml-1">
        <AddressHighlighter address={txData.from}>
          <AddressOrENSName address={txData.from} minerAddress={txData.miner} />
        </AddressHighlighter>
        <Copy value={txData.from} />
      </div>
    </InfoRow>
    <InfoRow title="Interacted With (To)">
      <div className="flex items-baseline space-x-2 -ml-1">
        <AddressHighlighter address={txData.to}>
          <AddressOrENSName address={txData.to} minerAddress={txData.miner} />
        </AddressHighlighter>
        <Copy value={txData.to} />
      </div>
      {internalTransfers && (
        <>
          <div className="mt-2 space-y-1">
            {internalTransfers.transfers.map((t, i) => (
              <InternalTransfer key={i} txData={txData} transfer={t} />
            ))}
          </div>
          <div className="mt-2 space-y-1">
            {internalTransfers.selfDestructs.map((t, i) => (
              <InternalSelfDestruct key={i} txData={txData} transfer={t} />
            ))}
          </div>
        </>
      )}
    </InfoRow>
    <InfoRow title="Transaction Action">
      <MethodName data={txData.data} />
    </InfoRow>
    {txData.tokenTransfers.length > 0 && (
      <InfoRow title={`Tokens Transferred (${txData.tokenTransfers.length})`}>
        <div className="space-y-2">
          {txData.tokenTransfers.map((t, i) => (
            <TokenTransferItem key={i} t={t} tokenMetas={txData.tokenMetas} />
          ))}
        </div>
      </InfoRow>
    )}
    <InfoRow title="Value">
      <span className="rounded bg-gray-100 px-2 py-1 text-xs">
        {ethers.utils.formatEther(txData.value)} Ether
      </span>
    </InfoRow>
    <InfoRow title="Transaction Fee">
      <FormattedBalance value={txData.fee} /> Ether
    </InfoRow>
    <InfoRow title="Gas Price">
      <div className="flex items-baseline space-x-1">
        <span>
          <FormattedBalance value={txData.gasPrice} /> Ether (
          <FormattedBalance value={txData.gasPrice} decimals={9} /> Gwei)
        </span>
        {sendsEthToMiner && (
          <span className="rounded text-yellow-500 bg-yellow-100 text-xs px-2 py-1">
            Flashbots
          </span>
        )}
      </div>
    </InfoRow>
    <InfoRow title="Ether Price">N/A</InfoRow>
    <InfoRow title="Gas Limit">
      <GasValue value={txData.gasLimit} />
    </InfoRow>
    <InfoRow title="Gas Used by Transaction">
      <GasValue value={txData.gasUsed} /> (
      {(txData.gasUsedPerc * 100).toFixed(2)}%)
    </InfoRow>
    <InfoRow title="Nonce">{txData.nonce}</InfoRow>
    <InfoRow title="Position in Block">
      <span className="rounded px-2 py-1 bg-gray-100 text-gray-500 text-xs">
        {txData.transactionIndex}
      </span>
    </InfoRow>
    <InfoRow title="Input Data">
      <textarea
        className="w-full h-40 bg-gray-50 text-gray-500 font-mono focus:outline-none border rounded p-2"
        value={txData.data}
        readOnly
      />
    </InfoRow>
  </ContentFrame>
);

export default React.memo(Details);
