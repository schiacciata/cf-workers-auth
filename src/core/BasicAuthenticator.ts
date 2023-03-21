import { BasicAuthenticateOpts, BasicClassOptions, IBasicClass, User, BasicLoginOpts } from "../types/BasicAuthenticator";
import BaseAuthenticator from "./Base";

class BasicAuthenticator extends BaseAuthenticator implements IBasicClass {
    constructor(options: BasicClassOptions) {
        super(options);
    }
    
    isAuthenticated({
        request,
        users = this.users,
    }: BasicAuthenticateOpts): boolean {
        const header = request.headers.get('Authorization');
        if (!header || !header.startsWith('Basic ')) return false;
        
        const [, credentials] = header.split('Basic ');
        if (!credentials) return false;

        const find = users.find((user) => `${user.username}:${user.password}` === atob(credentials));
        return !!find;
    }

    login({
        username,
        password,
        users = this.users,
    }: BasicLoginOpts): User | undefined {
        const find = users.find((user) => user.username === username && user.password === password);
        if (!find) return;

        return find;
    }
};

export default BasicAuthenticator;