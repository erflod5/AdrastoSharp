import { Instruction } from "../../Abstract/Instruction";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";

export class Continue extends Instruction{

    constructor(line: number, column: number){
        super(line,column);
    }

    compile(enviorement: Enviorement){
        if(enviorement.continue == null){ 
            throw new Error(this.line,this.column,'Semantico','Continue en un ambito incorrecto');
        }
        Generator.getInstance().addGoto(enviorement.continue);
    }
}