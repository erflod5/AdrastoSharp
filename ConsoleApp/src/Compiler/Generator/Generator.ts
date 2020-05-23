export class Generator{
    private static generator: Generator;
    private temporal : number;
    private label : number;
    private code : string[];
    private tempStorage : Map<string,string>;

    private constructor(){
        this.temporal = this.label = 0;
        this.code = new Array();
        this.tempStorage = new Map();
    }

    public static getInstance(){
        return this.generator || (this.generator = new this());
    }

    public clearCode(){
        this.temporal = this.label = 0;
        this.code = new Array();
        this.tempStorage = new Map();
    }

    public addCode(code : string){
        this.code.push(code);
    }

    public getCode() : string{
        return this.code.join('\n');
    }

    public newTemporal() : string{
        return 'T' + this.temporal++;
    }

    public newLabel() : string{
        return 'L' + this.label++;
    }

    public addLabel(label : string){
        this.code.push(`${label}:`);
    }

    public addExpression(target : string, left: any, right: any = '', operator: string = ''){
        this.code.push(`${target} = ${left + operator + right};`);
    }

    public addGoto(label : string){
        this.code.push(`goto ${label};`);
    }

    public addIf(left: any, right: any, operator: string, label : string){
        this.code.push(`if (${left + operator + right}) goto ${label};`);
    }

    public nextHeap(){
        this.code.push('h = h + 1;');
    }

    public addGetHeap(target : any, index: any){
        this.code.push(`${target} = Heap[${index}];`);
    }

    public addSetHeap(index: any, value : any){
        this.code.push(`Heap[${index}] = ${value};`);
    }
    
    public addGetStack(target : any, index: any){
        this.code.push(`${target} = Stack[${index}];`);
    }

    public addSetStack(index: any, value : any){
        this.code.push(`Stack[${index}] = ${value};`);
    }

    public addNextEnv(size: number){
        this.code.push(`p = p + ${size};`);
    }

    public addAntEnv(size: number){
        this.code.push(`p = p - ${size};`);
    }

    public addCall(id: string){
        this.code.push(`call ${id}();`);
    }

    public addBegin(id: string){
        this.code.push('begin ')
    }

    public addEnd(){
        this.code.push('end');
    }
}