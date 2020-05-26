import { Symbol } from "../SymbolTable/Symbol";
import { Type } from "./Type";
import { Generator } from "../Generator/Generator";

export class Retorno{
    private value : string;
    isTemp : boolean;
    type : Type;
    trueLabel : string;
    falseLabel : string;
    symbol : Symbol | null;

    constructor(value: string, isTemp: boolean, type: Type, symbol: Symbol | null= null){
        this.value = value;
        this.isTemp = isTemp;
        this.type = type;
        this.symbol = symbol;
        this.trueLabel = this.falseLabel = '';
    }

    public getValue(){
        Generator.getInstance().freeTemp(this.value);
        return this.value;
    }
}