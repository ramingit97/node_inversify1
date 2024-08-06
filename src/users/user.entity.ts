import {hash} from "bcryptjs"
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:"email"})
    readonly email:string;

    @Column({name:"password"})
    password:string;

    @Column({name:"name"})
    name:string;


    constructor(email:string, name:string,password:string){
        this.email = email;
        this.name = name;
        this.password = password;
    }

   

    public async setPassword(passwd:string,salt:number):Promise<void>{
        this.password = await hash(passwd,salt);
    }
}