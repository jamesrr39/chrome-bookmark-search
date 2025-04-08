import { Bookmark } from "./Bookmark";

export type Result = {
    bookmark: Bookmark;
    score?: number;
    resultType: {
        cssClass: string;
        name: string;
    };
}