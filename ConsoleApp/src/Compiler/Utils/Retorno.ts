import { Symbol } from "../SymbolTable/Symbol";

export class Retorno{
    value : string;
    isTemp : boolean;
    type : any;
    trueLabel : string;
    falseLabel : string;
    symbol : Symbol | null;

    constructor(value: string, isTemp: boolean, type: any, symbol: Symbol| null){
        this.value = value;
        this.isTemp = isTemp;
        this.type = type;
        this.symbol = symbol;
        this.trueLabel = this.falseLabel = '';
    }
}