import { Instruction } from "../../Abstract/Instruction";
import { Type, Types } from "../../Utils/Type";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";

export class Declaration extends Instruction {
    private type: Type;
    private idList: Array<string>;
    private value: Expression;

    constructor(type: Type, idList: Array<string>, value: Expression, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.idList = idList;
        this.value = value;
    }

    compile(enviorement: Enviorement): void {
        const generator = Generator.getInstance();
        const value = this.value.compile(enviorement);
        if(!this.sameType(this.type,value.type)){
            throw new Error(this.line,this.column,'Semantico',`Tipos de datos diferentes ${this.type.type}, ${value.type.type}`);
        }
        this.idList.forEach((id)=>{
            const newVar = enviorement.addVar(id,this.type,false,false);
            if(!newVar) throw new Error(this.line,this.column,'Semantico',`La variable: ${id} ya existe en este ambito;`);
        
            if(newVar.isGlobal){
                if(this.type.type == Types.BOOLEAN){
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addSetStack(newVar.position,'1');
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addSetStack(newVar.position,'0');
                    generator.addLabel(templabel);
                }
                else{
                    generator.addSetStack(newVar.position,value.getValue());
                }
            }
            else{
                const temp = generator.newTemporal();
                generator.addExpression(temp,'p',newVar.position,'+');
                if(this.type.type == Types.BOOLEAN){
                    const templabel = generator.newLabel();
                    generator.addLabel(value.trueLabel);
                    generator.addSetStack(temp,'1');
                    generator.addGoto(templabel);
                    generator.addLabel(value.falseLabel);
                    generator.addSetStack(temp,'0');
                    generator.addLabel(templabel);
                }
                else{
                    generator.addSetStack(temp,value.getValue());
                }
            }
        });
    }
}

/**/