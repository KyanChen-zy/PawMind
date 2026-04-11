/** 成长记录内容类型 */
export type GrowthContentType = 'photo' | 'video' | 'text';

/** 创建成长记录请求 */
export interface CreateGrowthRecordDto {
  contentType: GrowthContentType;
  mediaUrl?: string;
  description?: string;
  tags?: string[];
}

/** 成长记录响应 */
export interface GrowthRecordInfo {
  id: number;
  petId: number;
  contentType: GrowthContentType;
  mediaUrl: string | null;
  description: string | null;
  tags: string[];
  createdAt: string;
}
