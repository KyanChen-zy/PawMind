export interface DiagnosisResult {
  summary: string;
  detail: Record<string, any>;
}

export function getMockDiagnosis(type: string): DiagnosisResult {
  switch (type) {
    case 'oral':
      return {
        summary: '口腔健康评分 85/100，整体状况良好，建议定期清洁牙齿。',
        detail: {
          score: 85,
          maxScore: 100,
          items: [
            { name: '牙齿', status: 'good', note: '无明显牙结石' },
            { name: '牙龈', status: 'normal', note: '轻微红肿，建议观察' },
            { name: '口气', status: 'mild', note: '轻微口臭，可使用洁牙产品' },
          ],
        },
      };
    case 'stool':
      return {
        summary: '粪便形态正常，布里斯托评分4型，颜色正常，消化状况良好。',
        detail: {
          bristolType: 4,
          bristolDescription: '香肠状，表面光滑',
          color: 'normal',
          colorNote: '棕褐色，正常',
          consistency: 'normal',
          recommendation: '饮食均衡，继续保持',
        },
      };
    case 'skin':
      return {
        summary: '皮肤检测发现轻微红肿，建议观察3天，若无改善请就医。',
        detail: {
          overallStatus: 'mild_issue',
          findings: [
            { area: '背部', status: 'mild_redness', severity: 'low' },
          ],
          recommendation: '观察3天，避免抓挠，保持皮肤清洁干燥',
          urgency: 'observe',
        },
      };
    case 'report':
      return {
        summary: '血液检查共5项指标，2项异常（ALT、AST偏高），建议复查。',
        detail: {
          totalItems: 5,
          abnormalCount: 2,
          items: [
            { name: 'ALT', value: 120, unit: 'U/L', range: '10-88', status: 'high' },
            { name: 'AST', value: 95, unit: 'U/L', range: '10-82', status: 'high' },
            { name: 'BUN', value: 18, unit: 'mg/dL', range: '7-27', status: 'normal' },
            { name: 'CREA', value: 1.1, unit: 'mg/dL', range: '0.5-1.8', status: 'normal' },
            { name: 'GLU', value: 95, unit: 'mg/dL', range: '70-143', status: 'normal' },
          ],
          recommendation: '肝脏指标偏高，建议2周后复查，注意饮食清淡',
        },
      };
    case 'medicine':
      return {
        summary: '识别到阿莫西林，这是一种常用抗生素，宠物使用需遵医嘱。',
        detail: {
          medicineName: '阿莫西林（Amoxicillin）',
          type: '抗生素',
          commonUse: '用于细菌感染治疗',
          petWarning: '⚠️ 宠物用药需严格遵医嘱，剂量与人类不同，请勿自行给药',
          sideEffects: ['胃肠道不适', '过敏反应（罕见）'],
          recommendation: '请携带此药品前往宠物医院，由兽医确认是否适用及正确剂量',
        },
      };
    default:
      return {
        summary: '暂无该类型的诊断结果。',
        detail: { type, message: 'unknown diagnosis type' },
      };
  }
}
