import BaseAuthenticator from "./Base";
import { Algorithm, BearerAuthenticateOpts, BearerClassOptions, BearerLoginOpts, IBearerClass, User } from "../types/BearerAuthenticator";

class BearerAuthenticator extends BaseAuthenticator implements IBearerClass {
  secret: string;
  algorithm: Algorithm;
  constructor(options: BearerClassOptions) {
    super(options);
    this.secret = options.secret;
    this.algorithm = options.algorithm || { name: 'HMAC', hash: 'SHA-256' };
  }

  async verifyJWT(token: string): Promise<boolean> {
      const [headerB64, payloadB64, signatureB64] = token.split('.');
      const header = JSON.parse(this.base64UrlDecode(headerB64));
      const signature = Uint8Array.from(this.base64UrlDecode(signatureB64), c => c.charCodeAt(0));
      
      if (header.alg !== 'HS256') {
        throw new Error('Invalid algorithm');
      }
      
      const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(this.secret), this.algorithm, true, ['verify']);
      const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
      const valid = await crypto.subtle.verify(this.algorithm, key, signature, data);
  
      if (!valid) return false;

      const payload = JSON.parse(this.base64UrlDecode(payloadB64));
      const expiration = payload.exp;

      if (!expiration) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return expiration > currentTime;
  }

  async isAuthenticated(opts: BearerAuthenticateOpts): Promise<boolean> {
    const authorization = opts.request.headers.get('Authorization');
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return false;
    }

    const [, token] = authorization.split('Bearer ');
    try {
      return await this.verifyJWT(token);
    } catch (error) {
      return false;
    }
  }

  private base64UrlEncode(data: string): string {
    const base64 = btoa(data);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private base64UrlDecode(base64Url: string): string {
    var str: string = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
      str += '=';
    }
    return atob(str);
  }

  async login<UserType extends User>({ payload, users = this.users}: BearerLoginOpts<UserType>): Promise<string> {
    const { password, ...tokenPayload } = payload;

    const user = users.find(user => user.username === tokenPayload.username && user.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    };

    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
    const encodedPayload = this.base64UrlEncode(JSON.stringify(tokenPayload));
    
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(this.secret), this.algorithm, true, ['sign']);
    const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);
    const signature = await crypto.subtle.sign(this.algorithm, key, data);
    const encodedSignature = this.base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
    
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;    
  }
}

export default BearerAuthenticator;
