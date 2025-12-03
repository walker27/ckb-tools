import NetworkSwtich from "@/components/NetworkSwtich";
import { useNetwork } from "@/store/useNetwork";
import { PageContainer, ProDescriptions } from "@ant-design/pro-components";
import { Editor } from "@monaco-editor/react";
import { Input, message, Tabs } from "antd";
import { useEffect, useState, type PropsWithChildren, type ReactNode } from "react";
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
      <h2 className="text-2xl mt-5">Cell Demo (testnet)</h2>

      <Block label="CKB">
        <Cell txHash={"0xaec423c2af7fe844b476333190096b10fc5726e6d9ac58a9b71f71ffac204fee"} index={1} showTransacion />
      </Block>

      <Block label="Script or TypeID?">
        <Cell txHash={"0xaec423c2af7fe844b476333190096b10fc5726e6d9ac58a9b71f71ffac204fee"} index={0} showTransacion />
      </Block>

      <Block label="UDT">
        <Cell txHash={"0x08318afd38bec39d495acb77afbc4e0f0f6e62e3f75842ae72964225240f08fc"} index={1} showTransacion />
        <Cell txHash={"0xb2c54c3ff8677794127d9db6d1843d73f2c935afd329dc20a9a692a9decec941"} index={1} showTransacion />
      </Block>

      <Block label="DAO">
        <Cell txHash={"0x27800e41d447aa3c84996a0f5edd2df284d05bb39f17031ab6f2a5147230c921"} index={0} showTransacion />
        <Cell txHash={"0x8d6010484c84868d56dbe0db2e5adb5d5dd7d5a03e901fcf4a59df3c7feafbb9"} index={0} showTransacion />
      </Block>

      <Block label="Spore Cluster">
        <Cell txHash={"0x012f343cd71443fdb0aa608e6934b310e8671aa86d928e24d487188fa6d0eca9"} index={0} showTransacion />
      </Block>

      <Block label="Spore">
        <Cell txHash={"0x012f343cd71443fdb0aa608e6934b310e8671aa86d928e24d487188fa6d0eca9"} index={1} showTransacion />
      </Block>

      <Block label="CKBFS">
        <Cell txHash={"0x27c3702ac9a1f255bd1a274da1c7b18bdf0bb1e2b3cfd1e6902355697551ca9a"} index={0} showTransacion />
      </Block>
    </PageContainer>
  )
}

function Block({ label, children }: PropsWithChildren<{ label: ReactNode }>) {

  return (
    <div className="mt-5">
      <h3 className="text-xl">{label}</h3>
      <div className="flex flex-row flex-wrap gap-2 mt-2">
        {children}
      </div>
    </div>
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