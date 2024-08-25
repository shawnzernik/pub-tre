import { Repository } from 'typeorm';
import { UserEntity } from './UserEntity';

export class UserRepository extends Repository<UserEntity> { }