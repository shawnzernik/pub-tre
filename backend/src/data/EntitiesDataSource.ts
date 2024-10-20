import { DataSource } from "typeorm";
import { GroupEntity } from "./GroupEntity";
import { MembershipEntity } from "./MembershipEntity";
import { PasswordEntity } from "./PasswordEntity";
import { PermissionEntity } from "./PermissionEntity";
import { SecurableEntity } from "./SecurableEntity";
import { UserEntity } from "./UserEntity";
import { FinetuneEntity } from "./FinetuneEntity";
import { Config } from "../Config";
import { UserRepository } from "./UserRepository";
import { GroupRepository } from "./GroupRepository";
import { MembershipRepository } from "./MembershipsRepository";
import { PasswordRepository } from "./PasswordRepository";
import { PermissionRepository } from "./PermissionsRepository";
import { SecurableRepository } from "./SecurableRepository";
import { MenuEntity } from "./MenuEntity";
import { MenuRepository } from "./MenuRepository";
import { ListRepository } from "./ListRepository";
import { ListEntity } from "./ListEntity";
import { ListFilterEntity } from "./ListFilterEntity";
import { SettingEntity } from "./SettingEntity";
import { ListFilterRepository } from "./ListFilterRepository";
import { SettingRepository } from "./SettingRepository";
import { DatasetEntity } from "./DatasetEntity";
import { DatasetRepository } from "./DatasetRepository";
import { LogRepository } from "./LogRepository";
import { LogEntity } from "./LogEntity";
import { PromptEntity } from "./PromptEntity";
import { PromptRepository } from "./PromptRepository";
import { FinetuneRepository } from "./FinetuneRepository";

export class EntitiesDataSource extends DataSource {
    public constructor() {
        super({
            type: "postgres",
            host: Config.dbHost,
            port: Config.dbPort,
            database: Config.dbName,
            username: Config.dbUsername,
            password: Config.dbPassword,
            entities: [
                GroupEntity,
                MembershipEntity,
                PasswordEntity,
                PermissionEntity,
                SecurableEntity,
                UserEntity,
                FinetuneEntity,
                MenuEntity,
                ListEntity,
                ListFilterEntity,
                SettingEntity,
                DatasetEntity,
                LogEntity,
                PromptEntity,
            ],
        });
    }

    public async executeSql(sql: string, params: any[]): Promise<any[]> {
        const queryRunner = this.createQueryRunner();

        try {
            await queryRunner.connect();
            const result = await queryRunner.query(sql, params);
            return result;
        }
        catch (err) {
            throw new Error(`Error executing:\n${sql}\n${err}`);
        }
        finally {
            await queryRunner.release();
        }
    }

    private _groupRepository: GroupRepository | undefined;
    public groupRepository() {
        if (!this._groupRepository)
            this._groupRepository = new GroupRepository(GroupEntity, this.createEntityManager(), this.createQueryRunner());
        return this._groupRepository;
    }

    private _membershipRepository: MembershipRepository | undefined;
    public membershipRepository() {
        if (!this._membershipRepository)
            this._membershipRepository = new MembershipRepository(MembershipEntity, this.createEntityManager(), this.createQueryRunner());
        return this._membershipRepository;
    }

    private _passwordRepository: PasswordRepository | undefined;
    public passwordRepository() {
        if (!this._passwordRepository)
            this._passwordRepository = new PasswordRepository(PasswordEntity, this.createEntityManager(), this.createQueryRunner());
        return this._passwordRepository;
    }

    private _permissionRepository: PermissionRepository | undefined;
    public permissionRepository() {
        if (!this._permissionRepository)
            this._permissionRepository = new PermissionRepository(PermissionEntity, this.createEntityManager(), this.createQueryRunner());
        return this._permissionRepository;
    }

    private _securableRepository: SecurableRepository | undefined;
    public securableRepository() {
        if (!this._securableRepository)
            this._securableRepository = new SecurableRepository(SecurableEntity, this.createEntityManager(), this.createQueryRunner());
        return this._securableRepository;
    }

    private _userRepository: UserRepository | undefined;
    public userRepository() {
        if (!this._userRepository)
            this._userRepository = new UserRepository(UserEntity, this.createEntityManager(), this.createQueryRunner());
        return this._userRepository;
    }

    private _finetuneRepository: FinetuneRepository | undefined;
    public finetuneRepository() {
        if (!this._finetuneRepository)
            this._finetuneRepository = new FinetuneRepository(FinetuneEntity, this.createEntityManager(), this.createQueryRunner());
        return this._finetuneRepository;
    }

    private _menuRepository: MenuRepository | undefined;
    public menuRepository() {
        if (!this._menuRepository)
            this._menuRepository = new MenuRepository(MenuEntity, this.createEntityManager(), this.createQueryRunner());
        return this._menuRepository;
    }

    private _listRepository: ListRepository | undefined;
    public listRepository() {
        if (!this._listRepository)
            this._listRepository = new ListRepository(ListEntity, this.createEntityManager(), this.createQueryRunner());
        return this._listRepository;
    }

    private _listFilterRepository: ListFilterRepository | undefined;
    public listFilterRepository() {
        if (!this._listFilterRepository)
            this._listFilterRepository = new ListFilterRepository(ListFilterEntity, this.createEntityManager(), this.createQueryRunner());
        return this._listFilterRepository;
    }

    private _settingRepository: SettingRepository | undefined;
    public settingRepository() {
        if (!this._settingRepository)
            this._settingRepository = new SettingRepository(SettingEntity, this.createEntityManager(), this.createQueryRunner());
        return this._settingRepository;
    }

    private _datasetRepository: DatasetRepository | undefined;
    public datasetRepository() {
        if (!this._datasetRepository)
            this._datasetRepository = new DatasetRepository(DatasetEntity, this.createEntityManager(), this.createQueryRunner());
        return this._datasetRepository;
    }

    private _logRepository: LogRepository | undefined;
    public logRepository() {
        if (!this._logRepository)
            this._logRepository = new LogRepository(LogEntity, this.createEntityManager(), this.createQueryRunner());
        return this._logRepository;
    }

    private _promptRepository: PromptRepository | undefined;
    public promptRepository() {
        if (!this._promptRepository)
            this._promptRepository = new PromptRepository(PromptEntity, this.createEntityManager(), this.createQueryRunner());
        return this._promptRepository;
    }
}