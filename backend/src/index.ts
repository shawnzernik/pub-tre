import express from "express";
import { AuthService } from "./tre/services/AuthService";
import { GroupService } from "./tre/services/GroupService";
import { MembershipService } from "./tre/services/MembershipService";
import { PasswordService } from "./tre/services/PasswordService";
import { PermissionService } from "./tre/services/PermissionService";
import { SecurableService } from "./tre/services/SecurableService";
import { UserService } from "./tre/services/UserService";
import { MenuService } from "./tre/services/MenusService";
import { ListService } from "./tre/services/ListService";
import { ListFilterService } from "./tre/services/ListFilterService";
import { SettingService } from "./tre/services/SettingService";
import { Logger } from "./tre/Logger";
import { WebApp } from "./tre/WebApp";

const app = new WebApp((logger: Logger, app: express.Express) => {
    new AuthService(logger, app);
    new GroupService(logger, app);
    new MembershipService(logger, app);
    new PasswordService(logger, app);
    new PermissionService(logger, app);
    new SecurableService(logger, app);
    new UserService(logger, app);
    new MenuService(logger, app);
    new ListService(logger, app);
    new ListFilterService(logger, app);
    new SettingService(logger, app);

    // add app routes here
});
app.execute();
