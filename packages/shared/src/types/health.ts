/** 预警严重程度 */
export type AlertSeverity = 'observe' | 'caution' | 'urgent';

/** 食欲等级 */
export type AppetiteLevel = 'low' | 'normal' | 'high';

/** 活动等级 */
export type ActivityLevel = 'low' | 'normal' | 'high';

/** 创建健康日志请求 */
export interface CreateHealthLogDto {
  date: string;
  weight?: number;
  appetiteLevel?: AppetiteLevel;
  activityLevel?: ActivityLevel;
  waterIntake?: number;
  symptoms?: string;
  notes?: string;
}

/** 健康日志响应 */
export interface HealthLogInfo {
  id: number;
  petId: number;
  date: string;
  weight: number | null;
  appetiteLevel: AppetiteLevel | null;
  activityLevel: ActivityLevel | null;
  waterIntake: number | null;
  symptoms: string | null;
  notes: string | null;
  isAlert: boolean;
  alertType: string | null;
  severity: AlertSeverity | null;
  createdAt: string;
}

/** 健康趋势数据点 */
export interface HealthTrendPoint {
  date: string;
  weight: number | null;
  activityLevel: ActivityLevel | null;
  appetiteLevel: AppetiteLevel | null;
}
