import { Instruction } from "../../Abstract/Instruction";
import { Param } from "../../Utils/Param";
import { Type, Types } from "../../Utils/Type";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Error } from "../../Utils/Error";
import { Generator } from "../../Generator/Generator";

export class FunctionSt extends Instruction{
    id: string;
    params: Array<Param>;
    type: Type;
    private body: Instruction;
    private preCompile: boolean;

    constructor(type: Type,id: string, params: Array<Param>, body: Instruction, line: number, column: number){
        super(line,column);
        this.id = id;
        this.type = type;
        this.params = params;
        this.body = body;
        this.preCompile = true;
    }

    compile(enviorement: Enviorement){
        if(this.preCompile){
            this.preCompile = false;
            this.validateParams(enviorement);
            const uniqueId = this.uniqueId(enviorement);
            if(!enviorement.addFunc(this,uniqueId))
                throw new Error(this.line,this.column,'Semantico',`Ya existe una funcion con el id: ${this.id}`);
            return;
        }

        const symbolFunc = enviorement.getFunc(this.id);
        if(symbolFunc != undefined){
            const generator = Generator.getInstance();
            const newEnv = new Enviorement(enviorement);
            const returnLbl = generator.newLabel();
            const tempStorage = generator.getTempStorage();

            newEnv.setEnviorementFunc(this.id,symbolFunc,returnLbl);
            this.params.forEach((param)=>{
                newEnv.addVar(param.id,param.type,false,false);
            });
            generator.clearTempStorage();

            generator.addBegin(symbolFunc.uniqueId);
            this.body.compile(newEnv);
            generator.addLabel(returnLbl);
            generator.addEnd();

            generator.setTempStorage(tempStorage);
        }
    }

    private validateParams(enviorement: Enviorement){
        const set = new Set<string>();
        this.params.forEach((param)=>{
            if(set.has(param.id.toLowerCase()))
                throw new Error(this.line,this.column,'Semantico',`Ya existe un parametro con el id ${param.id}`);
            if(param.type.type == Types.STRUCT ){
                const struct = enviorement.structExists(param.type.typeId);
                if(!struct)
                    throw new Error(this.line,this.column,'Semantico',`No existe el struct ${param.type.typeId}`);
                param.type.struct = struct;
            }
            set.add(param.id.toLowerCase());
        });
    }

    public uniqueId(enviorement: Enviorement) : string{
        let id = `${enviorement.prop}_${this.id}`;
        if(this.params.length == 0)
            return id + '_empty';
        this.params.forEach((param)=>{
            id += `_${param.getUnicType()}`;
        });
        return id;
    }
}