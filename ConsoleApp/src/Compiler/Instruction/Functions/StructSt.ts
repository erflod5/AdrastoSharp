import { Instruction } from "../../Abstract/Instruction";
import { Param } from "../../Utils/Param";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { Types } from "../../Utils/Type";

export class StructSt extends Instruction {
    private id: string;
    private attributes: Array<Param>;

    constructor(id: string, attributes: Array<Param>, line: number, column: number) {
        super(line, column);
        this.id = id;
        this.attributes = attributes;
    }

    compile(enviorement: Enviorement): void {        
        if(!enviorement.addStruct(this.id,this.attributes.length,this.attributes))
            throw new Error(this.line,this.column,'Semantico',`Ya existe un struct con el id ${this.id}`);
        this.validateParams(enviorement);
    }

    private validateParams(enviorement: Enviorement){
        const set = new Set<string>();
        this.attributes.forEach((param)=>{
            if(set.has(param.id.toLowerCase()))
                throw new Error(this.line,this.column,'Semantico',`Ya existe un parametro con el id ${param.id}`);
            if(param.type.type == Types.STRUCT) {
                const struct = enviorement.getStruct(param.type.typeId);
                if(!struct)
                    throw new Error(this.line,this.column,'Semantico',`No existe el struct ${param.type.typeId}`);
            }
            set.add(param.id.toLowerCase());
        });
    }
}