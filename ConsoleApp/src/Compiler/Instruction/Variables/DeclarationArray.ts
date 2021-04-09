import { Instruction } from "../../Abstract/Instruction";
import { Type, Types } from "../../Utils/Type";
import { Expression } from "../../Abstract/Expression";
import { Enviorement } from "../../SymbolTable/Enviorement";
import { Generator } from "../../Generator/Generator";
import { Error } from "../../Utils/Error";

export class DeclarationArray extends Instruction {
    private type: Type;
    private id: string;
    private value: Expression;

    constructor(type: Type, id: string, value: Expression, line: number, column: number) {
        super(line, column);
        this.type = type;
        this.id = id;
        this.value = value;
    }

    compile(enviorement: Enviorement): void {
        const generator = Generator.getInstance();
        generator.addComment('Inicia declaracion de array');
        const value = this.value.compile(enviorement);
        this.validateType(enviorement);
        const newVar = enviorement.addVar(this.id,this.type,false,false);
        if(!newVar) throw new Error(this.line,this.column,'Semantico',`La variable: ${this.id} ya existe en este ambito;`);
        console.log(this.type);
        
        if(value.type.type == Types.ARRAY){
            const temp = generator.newTemporal(); generator.freeTemp(temp);
            const label1 = generator.newLabel(), label2 = generator.newLabel();
            generator.addExpression(temp, value.getValue(), '1', '+');
            generator.addLabel(label1);
            generator.addIf(temp, 'h', '==', label2);
            if(this.type.dimension == value.type.dimension){
                //Llenar de valores por defecto
                this.type.type != Types.STRING && this.type.type != Types.STRUCT ? generator.addSetHeap(temp, '0') : generator.addSetHeap(temp, '-1');
            }
            else{
                //Llenar de -1
                generator.addSetHeap(temp, '-1');
            }
            generator.addExpression(temp, temp, '1', '+');
            generator.addGoto(label1);
            generator.addLabel(label2);
        }
        else if(this.type.dimension != value.type.dimension || this.type.type != value.type.type){
            throw new Error(this.line, this.column, 'Semantico', 'Tipos de dato incorrectos');
        }

        if(newVar.isGlobal){
            generator.addSetStack(newVar.position,value.getValue());
        }
        else{
            const temp = generator.newTemporal(); generator.freeTemp(temp);
            generator.addExpression(temp,'p',newVar.position,'+');
            generator.addSetStack(temp,value.getValue());
        }
        generator.addComment('Finaliza declaracion de array');
    }

    private validateType(enviorement: Enviorement){
        if(this.type.type == Types.STRUCT){
            const struct = enviorement.getStruct(this.type.typeId);
            if(!struct)
                throw new Error(this.line,this.column,'Semantico',`No existe el struct ${this.type.typeId}`);
        }
    }
}