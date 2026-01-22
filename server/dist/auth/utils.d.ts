export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}
export declare class AuthUtils {
    static hashPassword(password: string): Promise<string>;
    static verifyPassword(password: string, hash: string): Promise<boolean>;
    static generateToken(payload: JWTPayload): string;
    static verifyToken(token: string): JWTPayload;
}
//# sourceMappingURL=utils.d.ts.map