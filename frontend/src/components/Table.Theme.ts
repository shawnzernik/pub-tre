import { CSSProperties } from "react";
import { Theme } from "./Theme";

export class TableTheme {
    static table: CSSProperties = {
        border: "1pt solid " + Theme.mediumNeutral
    };
    static tableHeadTd: CSSProperties = {
        border: "1pt solid " + Theme.mediumNeutral,
        background: Theme.mediumNeutral,
        color: Theme.darkText
    }
    static tableRowTd: CSSProperties = {
        border: "1pt solid " + Theme.mediumNeutral
    }
    static tableRowTdIcon: CSSProperties = {
        color: Theme.darkText,
        cursor: "pointer"
    }

}