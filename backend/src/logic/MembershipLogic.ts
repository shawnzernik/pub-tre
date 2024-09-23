import { MembershipDto } from "common/src/models/MembershipDto";
import { EntitiesDataSource } from "../data/EntitiesDataSource";

export class MembershipLogic {
    private entity: MembershipDto;

    public constructor(entity: MembershipDto) {
        this.entity = entity;
    }

    public static async getGroupMemberships(eds: EntitiesDataSource, guid: string): Promise<MembershipDto[]> {
        let sql = `
SELECT
	g.guid AS "groupsGuid",
	u.guid AS "usersGuid",
	CASE 
		WHEN m.guid IS NOT NULL THEN m.guid
		ELSE uuid_generate_v4()
	END AS "guid",
	CASE 
		WHEN m.guid IS NOT NULL THEN m.is_included
		ELSE false
	END AS "isIncluded"
FROM
	"groups" g
	LEFT JOIN "users" u ON 1=1
	LEFT JOIN memberships m ON m.users_guid = u.guid AND g.guid = m.groups_guid
WHERE
	g.guid = $1
ORDER BY
	g.display_name, u.display_name 
        `;
        const params: any[] = [guid];

        const rows = await eds.executeSql(sql, params);
        return rows as MembershipDto[];
    }
    public static async getUserMemberships(eds: EntitiesDataSource, guid: string): Promise<MembershipDto[]> {
        let sql = `
SELECT
	g.guid AS "groupsGuid",
	u.guid AS "usersGuid",
	CASE 
		WHEN m.guid IS NOT NULL THEN m.guid
		ELSE uuid_generate_v4()
	END AS "guid",
	CASE 
		WHEN m.guid IS NOT NULL THEN m.is_included
		ELSE false
	END AS "isIncluded"
FROM
	"groups" g
	LEFT JOIN "users" u ON 1=1
	LEFT JOIN memberships m ON m.users_guid = u.guid AND g.guid = m.groups_guid
WHERE
	u.guid = $1
ORDER BY
	g.display_name, u.display_name 
        `;
        const params: any[] = [guid];

        const rows = await eds.executeSql(sql, params);
        return rows as MembershipDto[];
    }
}
