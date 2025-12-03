import { Script, type ScriptLike } from "@ckb-ccc/core";


type UDTParams = {
  name: string;
  icon: string;
  symbol: string;
  decimalPlaces: number;
  type: ScriptLike;
  manager?: string;
  tags?: string[];
};

export class UDT {
  public readonly name: string;
  public readonly icon: string;
  public readonly symbol: string;
  public readonly decimalPlaces: number;
  public readonly type: ScriptLike;
  public readonly typeHash: string;
  public readonly manager?: string;
  public readonly tags: string[];
  constructor(params: UDTParams) {
    this.name = params.name;
    this.icon = params.icon;
    this.symbol = params.symbol;
    this.decimalPlaces = params.decimalPlaces;
    this.type = params.type;
    this.manager = params.manager;
    this.tags = params.tags || [];
    this.typeHash = Script.from(params.type).hash();
  }
}

export function registerUDT(args: UDTParams) {
  return new UDT(args);
}