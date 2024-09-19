import { CSSProperties } from "react";
import { Theme } from "./Theme";

export class NavigationTheme {
    public static applicationIconName = "layout-text-window-reverse";
    public static debugStage = false;
    public static menuWidthEm = 18;
    public static topIconSizeEm = 2;

    public static stage: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        display: "flex",
        flexDirection: "column",
        zIndex: "0"
    };
    public static stageTop: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        display: "flex",
        flexDirection: "row",
        gap: "4em",
        alignItems: "center",
        width: "100%",
        padding: "1em",
        backgroundColor: Theme.darkPrimary
    };
    public static stageTopMenu: CSSProperties = {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: this.debugStage ? "1px solid black" : undefined,
        height: "fit-content",
        color: Theme.lightNeutral,
        cursor: "pointer"
    };
    public static stageTopMenuIcon: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        color: Theme.lightText
    };
    public static stageMiddle: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "calc(100vh - 7.5em)"
    };
    public static stageMiddleMenu: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        border: this.debugStage ? "1px solid black" : undefined,
        width:  this.menuWidthEm + "em",
        padding: "1em",
        backgroundColor: Theme.mediumNeutral,
        borderRight: "2pt solid " + Theme.darkPrimary
    };
    public static stageMiddleMenuItem: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: Theme.darkText
    };
    public static stageMiddleContent: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: "1em",
        border: this.debugStage ? "1px solid black" : undefined,
        width: "100%",
        // width: "calc(100vw - " + this.menuWidthEm + "em" + ")",
        padding: "1em",
        overflow: "auto"
    };
    public static stageBottom: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        padding: "1em",
        backgroundColor: Theme.darkPrimary
    };
    public static stageBottomItem: CSSProperties = {
        border: this.debugStage ? "1px solid black" : undefined,
        color: Theme.mediumNeutral
    };

    public static fade: CSSProperties = {
        zIndex: "10",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "#000000aa",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    };
    public static fadeMessage: CSSProperties = {
        backgroundColor: Theme.lightNeutral,
        padding: "1em",
        border: "0.01em solid" + Theme.darkNeutral,
        boxShadow: "0.5em 0.5em 0.5em #000",
        borderRadius: "1em",
        width: "fit-contents",
        maxWidth: "75%"
    };
    public static fadeMessageTitle: CSSProperties = {
        fontSize: "2em",
        fontFamily: Theme.HeadingFont,
        color: Theme.darkText
    }
    public static fadeMessageContent: CSSProperties = {
        fontFamily: Theme.BodyFont,
        paddingTop: "1em",
        paddingBottom: "1em"
    }
    public static fadeMessageButtons: CSSProperties = {}
};