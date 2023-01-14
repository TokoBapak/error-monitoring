export interface IAuthentication {
    validateAccessToken(token: string): Promise<boolean>;

}