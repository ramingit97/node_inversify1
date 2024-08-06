import { injectable,inject } from "inversify";
import { UserLoginDto } from "./dto/login-user.dto";
import { UserRepository } from "./repo/user.repo";
import { TYPES } from "../types";
import { HttpError } from "../errors/http-error.class";
import { User } from "./user.entity";
import { TokenService } from "../tokens/tokens.service";
const bcrypt = require("bcrypt");
const uuid = require("uuid")

@injectable()
export class UserService{

    constructor(
        @inject(TYPES.UserRepo) private userRepository:UserRepository,
        @inject(TYPES.TokenService) private tokenService:TokenService,
    
    ) {}

    async createUser(body:any){
        console.log("body",body);
        const newUser = new User(body.email,body.name,body.password);
        let res = await this.registration(newUser);
        console.log('res',res);
        return res;
    }

    async registration(userData:User){
        const candidate = await this.userRepository.findByEmail(userData.email);
        if(candidate){
            throw new HttpError(404,'User with email already exists')
        }
        const hashPassword = await bcrypt.hash(userData.password,3);
        const newUser = new User(userData.email,userData.name,userData.password);
        await newUser.setPassword(userData.password,10)
        console.log('newUser',newUser);
        
        const user = await this.userRepository.createUser(newUser);

        const tokens = await this.tokenService.generateTokens({...newUser});
        await this.tokenService.saveTokens({
            user_id:newUser.id,
            refresh_token:tokens.refresh_token
        })
        return {user:newUser,...tokens}
    }


    async allUsers(){
        return this.userRepository.findAll(); 
        // throw new Error("Errrorrorro cixdi");
    }

    async getUserById(id:number){
        let findUser =await this.userRepository.findById(id); 
        if(!findUser){
            throw new HttpError(404,'User not found')
        }
        return findUser;
    }


    validateUser: (dto: UserLoginDto) => true
}