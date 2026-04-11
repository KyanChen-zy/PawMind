/** 用户注册请求 */
export interface RegisterDto {
  email: string;
  password: string;
  nickname: string;
}

/** 用户登录请求 */
export interface LoginDto {
  email: string;
  password: string;
}

/** 认证响应 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

/** 用户信息（不含密码） */
export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  avatar: string | null;
  createdAt: string;
}
