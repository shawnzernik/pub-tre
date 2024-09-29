import { Repository } from 'typeorm';
import { SettingEntity } from './SettingEntity';

export class SettingRepository extends Repository<SettingEntity> {
    async findByKey(value: string): Promise<SettingEntity> {
        const ret = await this.findOneBy({key: value});
        if(!ret)
            throw new Error(`Could not locate setting by key '${value}'!`);

        return ret as SettingEntity;
    }
}