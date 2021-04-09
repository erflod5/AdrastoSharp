import { Instruction } from "../../Abstract/Instruction";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";

export class Break extends Instruction{

    constructor(line: number, column: number){
        super(line,column);
    }

    compile(enviorement: Enviorement) : void{
        if(enviorement.break == null){ 
            throw new Error(this.line,this.column,'Semantico','Break en un ambito incorrecto');
        }
        Generator.getInstance().addComment('Break aqui');
        Generator.getInstance().addGoto(enviorement.break);
        Generator.getInstance().addComment('Break termina');

    }
}