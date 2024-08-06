import { IToken, ITokenPayload } from './tokens.interface';
import { Repository } from 'typeorm';
import { injectable,inject } from "inversify";
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { HttpError } from '../errors/http-error.class';
import { TokenEntity } from './tokens.entity';
import { TokenRepository } from './tokens.repo';
const jwt = require('jsonwebtoken');
@injectable()
export class TokenService {

    constructor(
        @inject(TYPES.TokenRepo) private repo:TokenRepository,
        @inject(TYPES.ConfigService) private config:IConfigService
    ) {}

    async findToken(refresh_token:string){
        let findToken:any = await this.repo.findToken(refresh_token)
        return findToken
    }    

    async generateTokens(payload:ITokenPayload){
        const tokens = {
            access_token: await jwt.sign(payload,this.config.get("JWT_ACCESS_SECRET"),{
                expiresIn:this.config.get("REFRESH_EXPIRED")
              }),
              refresh_token: await jwt.sign(payload,this.config.get("JWT_REFRESH_SECRET"),{
                expiresIn:this.config.get("REFRESH_EXPIRED")
              }),
        }
       
        return tokens;
    }

    async saveTokens(data:{user_id:number,refresh_token:string}):Promise<any>{
        // let findToken:TokenEntity|null = await this.repo.findToken(data.refresh_token);
        // return findToken;
        // if(findToken){
        //     let res = await this.tokenRepo.update({user_id:data.user_id},{refresh_token:data.refresh_token})
        //     return findToken;
        // }
        console.log('data22',data);
        
        let saveToken = this.repo.save(data);
        return saveToken;
    }


    async refreshToken(payload:ITokenPayload,refresh_token:string){
        try{
            await jwt.verify(refresh_token,{
                secret:this.config.get("JWT_REFRESH_SECRET")
            })
            let newTokens = await this.generateTokens(payload)
            return newTokens;
        }
        catch(e){
            throw new HttpError(502,'Refresh token expired')
        }
    }

}