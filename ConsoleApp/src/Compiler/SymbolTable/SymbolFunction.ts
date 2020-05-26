import { Type } from "../Utils/Type";
import { FunctionSt } from "../Instruction/Functions/FunctionSt";

export class SymbolFunction {
    type: Type;
    id: string;
    uniqueId: string;
    size: number;
    function: FunctionSt;

    constructor(func: FunctionSt,uniqueId: string) {
        this.type = func.type;
        this.id = func.id;
        this.size = func.params.length;
        this.uniqueId = uniqueId;
        this.function = func;
    }
}