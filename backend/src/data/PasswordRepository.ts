import { Repository } from 'typeorm';
import { PasswordEntity } from './PasswordEntity';

export class PasswordRepository extends Repository<PasswordEntity> { }