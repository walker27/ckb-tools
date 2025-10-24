


import { useNetwork } from "@/store/useNetwork";
import { useQuery } from "@tanstack/react-query";

const isTxHash = (str: string) => {
  return /^0x[0-9a-fA-F]{64}$/.test(str);
};
export default function useTransaction(txHash: string) {
  const { network, networkService } = useNetwork();
  return useQuery({
    queryKey: ["transaction", network, txHash],
    queryFn: () => {
      if(!isTxHash(txHash)) return null;
      return networkService.getTransaction(txHash);
    },
  })
}