import { Instruction } from "../../Abstract/Instruction";
import { Type } from "../../Utils/Type";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";

export class Declaration extends Instruction{
    private type: Type;
    private idList: Array<string>;
    private value: Expression;

    constructor(type: Type, idList: Array<string>, value: Expression, line: number, column: number){
        super(line,column);
        this.type = type;
        this.idList = idList;
        this.value = value;
    }

    compile(enviorement: Enviorement) : void{
        
    }
}