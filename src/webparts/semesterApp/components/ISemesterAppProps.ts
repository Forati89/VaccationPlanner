import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISemesterAppProps {
    context: WebPartContext;
    userPersonID: number; 
    isAdmin: boolean;
    userEmail: string;
}
