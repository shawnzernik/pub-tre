import { DataSource } from "typeorm";
import { GroupEntity } from "./GroupEntity";
import { MembershipEntity } from "./MembershipEntity";
import { PasswordEntity } from "./PasswordEntity";
import { PermissionEntity } from "./PermissionEntity";
import { SecurableEntity } from "./SecurableEntity";
import { UserEntity } from "./UserEntity";
import { Config } from "../Config";
import { UserRepository } from "./UserRepository";
import { GroupRepository } from "./GroupRepository";
import { MembershipRepository } from "./MembershipsRepository";
import { PasswordRepository } from "./PasswordRepository";
import { PermissionRepository } from "./PermissionsRepository";
import { SecurableRepository } from "./SecurableRepository";
import { MenuEntity } from "./MenuEntity";
import { MenuRepository } from "./MenuRepository";

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
                MenuEntity
			],
		});
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

	private _menuRepository: MenuRepository | undefined;
	public menuRepository() {
		if (!this._menuRepository)
			this._menuRepository = new MenuRepository(MenuEntity, this.createEntityManager(), this.createQueryRunner());
		return this._menuRepository;
	}
}