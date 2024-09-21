INSERT INTO LISTS ( "guid", "title", "url_key", "top_menu_guid", "left_menu_guid", "sql", "edit_url", "delete_url", "autoload" ) VALUES
--( 'guid', 'title', 'urlKey', 'topGuid', 'leftGuid', 'sql', 'editUrl', 'deleteUrl', 'autoload' )

( '24ebb2fe-b803-4e6d-8516-155ab0e910ef', 'List List', 'lists', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', 'e1b4b1c6-0c4f-4a62-9c8f-8c8f3b9a4d61', 'SELECT * FROM "lists"', '/static/pages/list.html', '/api/v0/list', 'false' ),
( '59f75ec4-ec64-4b18-906c-8275c9ac7a43', 'Menu List', 'menus', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', '35697b22-5894-44e7-b574-d0cf7f63af80', 'SELECT * FROM "menus"', '/static/pages/menu.html', '/api/v0/menu', 'false' ),
( '150be2e8-d8dd-4f88-b17e-96a83927ec47', 'Permission List', 'permissions', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', '9cba8197-65ed-42ed-a37c-f8a4e2f774e2', 'SELECT * FROM "permissions"', '/static/pages/permissions.html', '/api/v0/permission', 'false' ),
( '6e1714d3-249b-4ea5-b959-ad90d0d9cfcf', 'Membership List', 'memberships', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', 'ad90d1f8-fdd4-45e4-93b2-731f64a82c50', 'SELECT * FROM "memberships"', '/static/pages/memberships.html', '/api/v0/membership', 'false' ),
( '3050d3ae-d26b-4341-a7a2-e75ba40de46d', 'Securable List', 'securables', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', '46c065f9-16cc-4b8b-9f22-421177576460', 'SELECT * FROM "securable"', '/static/pages/securable.html', '/api/v0/securable', 'false' ),
( '220331be-8d3c-4969-b1f2-4bc578038003', 'Group List', 'groups', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', 'd7db605a-ec82-4da6-8fae-df4d5bfb173d', 'SELECT * FROM "groups"', '/static/pages/group.html', '/api/v0/group', 'false' ),
( 'ac5ee873-c05f-4c64-8ec6-f426f9cd6226', 'User List', 'users', 'b1e3c680-0f62-4931-8a68-4be9b4b070f7', '67fa4231-5b8e-4639-89cb-5f15a9207a83', 'SELECT * FROM "user"', '/static/pages/user.html', '/api/v0/user', 'false' );

INSERT INTO "securables" ("guid", "display_name")
SELECT
	"guid",
	CONCAT(
		'List:Item:',
		title
	)
FROM "lists";