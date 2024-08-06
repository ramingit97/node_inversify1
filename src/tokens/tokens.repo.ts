import { Repository, getRepository } from "typeorm";
import { inject, injectable } from "inversify";
import { TokenEntity } from "./tokens.entity";


@injectable()
export class TokenRepository{
    constructor(private readonly userRepo: Repository<TokenEntity>) {}

    async findToken(refresh_token:string|undefined){
        // const allUsers = await TokenEntity.findOne({where:{id:1}})
        // return allUsers;
    }

    async save(token:{user_id:number,refresh_token:string}){
        let tokenEntity = new TokenEntity()
        tokenEntity.user_id = token.user_id;
        tokenEntity.refresh_token = token.refresh_token;
        Object.assign(tokenEntity,token);
        return await TokenEntity.save(tokenEntity) ;
    }
    
}