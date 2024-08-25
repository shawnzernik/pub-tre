import { Repository } from 'typeorm';
import { MembershipEntity } from './MembershipEntity';

export class MembershipRepository extends Repository<MembershipEntity> { }