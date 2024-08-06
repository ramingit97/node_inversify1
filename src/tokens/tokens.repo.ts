import { Repository, getRepository } from "typeorm";
import { inject, injectable } from "inversify";
import { TokenEntity } from "./tokens.entity";
import { ITokenDto } from "./tokens.interface";


@injectable()
export class TokenRepository{
    constructor(private readonly userRepo: Repository<TokenEntity>) {}

    async findToken(refresh_token:string|undefined){
        // const allUsers = await TokenEntity.findOne({where:{id:1}})
        // return allUsers;
    }

    async save(token:ITokenDto){
        let tokenEntity = new TokenEntity()
        Object.assign(tokenEntity,token);
        return await TokenEntity.save(tokenEntity) ;
    }
    
}