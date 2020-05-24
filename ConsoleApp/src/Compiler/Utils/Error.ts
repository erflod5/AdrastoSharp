
export class Error{
    private line : number;
    private column : number;
    private type : string;
    private description : string;

    constructor(line: number, column: number, type: string, description: string){
        this.line = line;
        this.column = column;
        this.type = type;
        this.description = description;
    }

    public toString() : string{
        return `Error ${this.type} en la (${this.line},${this.column}) = ${this.description}`;
    }
}