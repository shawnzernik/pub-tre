import { Repository } from 'typeorm';
import { PermissionEntity } from './PermissionEntity';

export class PermissionRepository extends Repository<PermissionEntity> { }