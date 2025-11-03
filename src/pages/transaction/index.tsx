import NetworkSwtich from "@/components/NetworkSwtich";
import { useNetwork } from "@/store/useNetwork";
import { PageContainer, ProDescriptions } from "@ant-design/pro-components";
import { Editor } from "@monaco-editor/react";
import { Input, message, Tabs } from "antd";
import { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import useTransaction from "@/hooks/useTransaction";
import Cell from "@/components/Cell";
import type { ClientTransactionResponse } from "@ckb-ccc/ccc";
import QuerySuspense from "@/components/QuerySuspense";
import type { UseQueryResult } from "@tanstack/react-query";
import { replace, useNavigate, useParams } from "react-router";

const isTxHash = (str: string) => {
  return /^0x[0-9a-fA-F]{64}$/.test(str);
};


export default function TransactionPage() {
  const { txHash: propsTxHash = "" } = useParams();
  // const { networkService } = useNetwork();
  const [txHash, setTxHash] = useState("");
  const query = useTransaction(txHash);
  const navigate = useNavigate();
  useEffect(() => {
    setTxHash(propsTxHash);
  }, [propsTxHash])
  return (
    <PageContainer
      title={
        <div className="flex flex-row justify-center items-center gap-1">
          <div>
            <span>Transaction</span>
            <span className="ml-2">#</span>
          </div>
          <Input
            key={txHash}
            className="font-hash text-base rounded-none bg-transparent border-0 border-b! w-160 px-0 shadow-none"
            defaultValue={txHash}
            onChange={(e) => {
              const nextTxHash = e.target.value;
              if (isTxHash(nextTxHash)) {
                navigate(`/transaction/${nextTxHash}`);
              }
            }}
          />
        </div>
      }
      extra={<NetworkSwtich />}
    >
      <Tabs
        defaultActiveKey="detail"
        items={[
          {
            key: "detail",
            label: "Detail",
            children: <TxDetail txHash={txHash} query={query} />,
          },
          {
            key: "raw",
            label: "Raw",
            children: <TxRaw query={query} />,
          },
        ]}
      />
    </PageContainer>
  )
}

function TxRaw({ query }: { query: UseQueryResult<ClientTransactionResponse | undefined, Error> }) {
  const loading = query.status === "pending";
  return (
    <Editor
      options={{
        readOnly: true
      }}
      height="700px"
      defaultLanguage="json"
      theme="vs-dark"
      onChange={() => { }}
      value={JSON.stringify(!loading ? query.data : null, (_, value) => {
        if (typeof value === 'bigint') {
          return new BigNumber(value).toString();
        }
        return value;
      }, 2,)}
    />
  )
}

function TxDetail({ txHash, query }: { txHash: string, query: UseQueryResult<ClientTransactionResponse | undefined, Error> }) {

  return (
    <QuerySuspense query={query}>
      {(tx) => (
        <ProDescriptions
          column={2}
          dataSource={tx}
        >
          <ProDescriptions.Item
            dataIndex="blockNumber"
            label="Position"
            render={(_, { blockNumber, txIndex }) => {
              return (<div className="font-hash">Block {blockNumber} #{txIndex}</div>)
            }}
          />
          {/* <ProDescriptions.Item dataIndex="blockHash" label="BlockHash" /> */}
          <ProDescriptions.Item dataIndex="status" label="Status" />
          {/* <ProDescriptions.Item dataIndex="txIndex" label="Index in Block" /> */}
          <ProDescriptions.Item
            span={2}
            label="Inputs"
            render={(_, { transaction }) => (
              <div className="flex flex-row flex-wrap gap-2">
                {
                  (transaction as ClientTransactionResponse['transaction']).inputs.map((input) => {
                    const txHash = input.previousOutput.txHash;
                    const index = input.previousOutput.index;
                    return (
                      <Cell key={`${txHash}:${index}`} txHash={txHash} index={index} since={input.since} />
                    )
                  })
                }
              </div>
            )}
          />
          <ProDescriptions.Item
            span={2}
            label="Outputs"
            render={(_, { transaction }) => (
              <div className="flex flex-row flex-wrap gap-2">
                {
                  transaction.outputs.map((output, index) => (
                    <Cell key={`${txHash}:${index}`} txHash={txHash} index={index} showTransacion={false} />
                  ))
                }
              </div>
            )}
          />
        </ProDescriptions>
      )}
    </QuerySuspense>
  )
}