export class EditDto{
    constructor(
        public authority:string,
        public password:string,
        public team:string,
        public nickname:string,
        public userId:number,
        public username:string,
        public mail:string,
        public biography:string
    ){}
}