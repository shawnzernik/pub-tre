import { Repository } from 'typeorm';
import { SecurableEntity } from './SecurableEntity';

export class SecurableRepository extends Repository<SecurableEntity> { }