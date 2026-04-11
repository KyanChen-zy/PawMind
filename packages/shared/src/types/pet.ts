/** 宠物物种 */
export type PetSpecies = 'cat' | 'dog' | 'other';

/** 宠物性别 */
export type PetGender = 'male' | 'female' | 'unknown';

/** 宠物状态 */
export type PetStatus = 'active' | 'archived';

/** 创建宠物请求 */
export interface CreatePetDto {
  name: string;
  species: PetSpecies;
  breed: string;
  birthday: string;
  gender: PetGender;
  weight: number;
}

/** 更新宠物请求 */
export interface UpdatePetDto {
  name?: string;
  breed?: string;
  birthday?: string;
  gender?: PetGender;
  weight?: number;
  avatar?: string;
  personalityTags?: string[];
}

/** 宠物信息响应 */
export interface PetInfo {
  id: number;
  name: string;
  species: PetSpecies;
  breed: string;
  birthday: string;
  gender: PetGender;
  weight: number;
  avatar: string | null;
  personalityTags: string[];
  status: PetStatus;
  createdAt: string;
  updatedAt: string;
}
