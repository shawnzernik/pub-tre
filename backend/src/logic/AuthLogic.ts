import fs from "fs";
import { UserDto } from "common/src/models/UserDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";
import { PasswordEntity } from "../data/PasswordEntity";
import { PasswordLogic } from "./PasswordLogic";
import { JwtToken } from "common/src/logic/JwtToken";
import { Config } from "../Config";
import { SecurableDto } from "common/src/models/SecurableDto";

export class AuthLogic {
    private static invalidLoginMsg = "Invalid login!";
    private static invalidTokenMsg = "Invalid token!";

    public user: UserDto | undefined;
    public securables: SecurableDto[] | undefined;

    private constructor() { }

    public tokenize(): string {
        const key = fs.readFileSync(Config.jwtPrivateKeyFile, { encoding: "utf8" });
        const token = new JwtToken(this);
        const ret = token.sign(key);
        return ret;
    }

    public static async passwordLogin(eds: EntitiesDataSource, email: string, password: string): Promise<AuthLogic> {
        const user = await eds.userRepository().findOneBy({ emailAddress: email });
        if (!user)
            throw new Error(AuthLogic.invalidLoginMsg);

        const passwords = await eds.passwordRepository().findBy({ usersGuid: user.guid });
        if (!passwords || passwords.length < 1)
            throw new Error(AuthLogic.invalidLoginMsg);

        passwords.sort((a, b) => {
            return b.created.getTime() - a.created.getTime();
        });

        const rehashedPassword = new PasswordEntity();
        rehashedPassword.iterations = passwords[0].iterations;
        rehashedPassword.salt = passwords[0].salt;

        const passLogic = new PasswordLogic(rehashedPassword);
        passLogic.computeHash(password);

        if (passwords[0].hash !== rehashedPassword.hash)
            throw new Error(AuthLogic.invalidLoginMsg);

        const ret = new AuthLogic();
        ret.user = user;
        ret.securables = await AuthLogic.loadAllowedSecurablesForUser(eds, user);
        return ret;
    }
    public static async tokenLogin(token: string): Promise<AuthLogic> {
        const key = fs.readFileSync(Config.jwtPrivateKeyFile, { encoding: "utf8" });
        let payload = null;
        try { payload = JwtToken.verify(token, key); }
        catch (err) {
            console.log(`AuthLogic.tokenLogin ${token} - Error ${err}`);
            throw new Error(AuthLogic.invalidTokenMsg);
        }

        if (!payload || !payload.data || !payload.data["user"] || !payload.data["securables"])
            throw new Error(AuthLogic.invalidTokenMsg);

        const ret = new AuthLogic();
        ret.user = payload.data["user"] as UserDto;
        ret.securables = payload.data["securables"] as SecurableDto[];
        return ret;
    }

    private static async loadAllowedSecurablesForUser(eds: EntitiesDataSource, user: UserDto): Promise<SecurableDto[]> {
        const ret = await eds.securableRepository()
            .createQueryBuilder("s")
            .where(`s.guid IN (
                SELECT
                    p.securables_guid 
                FROM 
                    "users" u
                    JOIN "memberships" m ON u.guid = m.guid
                    JOIN "groups" g ON g.guid  = m.groups_guid
                    JOIN "permissions" p ON p.groups_guid  = m.groups_guid
                WHERE
                    p.is_allowed  = TRUE
                    AND u.guid = :guid
                GROUP BY p.securables_guid 
            )`, { guid: user.guid })
            .getMany();

        return ret || [];
    }
}