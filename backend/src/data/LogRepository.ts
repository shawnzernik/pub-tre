import { Repository } from 'typeorm';
import { LogEntity } from './LogEntity';

export class LogRepository extends Repository<LogEntity> { }
