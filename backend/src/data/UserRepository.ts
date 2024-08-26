import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './UserEntity';
import { Config } from '../Config';

export class UserRepository extends Repository<UserEntity> {
}