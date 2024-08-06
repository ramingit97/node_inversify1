import {Entity,Column,PrimaryGeneratedColumn,BaseEntity} from 'typeorm'


@Entity('tokens')
export class TokenEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    refresh_token:string;

    @Column({unique:true})
    user_id:number;
    
}