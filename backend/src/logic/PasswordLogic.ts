import * as crypto from "crypto";
import { PasswordEntity } from "../data/PasswordEntity";

export class PasswordLogic {
    private entity: PasswordEntity;

    constructor(entity?: PasswordEntity) {
        console.log("PasswordLogic.constructor()");

        if (entity) {
            this.entity = entity;
        } else {
            this.entity = new PasswordEntity();
            this.entity.iterations = 100000;
            this.entity.salt = crypto.randomBytes(32).toString("hex");
        }
    }

    public computeHash(password: string): PasswordEntity {
        console.log("PasswordLogic.computeHash()");

        this.entity.hash = crypto.pbkdf2Sync(
            password,
            this.entity.salt,
            this.entity.iterations,
            64,
            "sha512"
        ).toString("hex");
        return this.entity;
    }
}