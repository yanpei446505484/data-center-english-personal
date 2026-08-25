export interface AlarmMeetingPhrase {
  text: string;
  chinese: string;
}

export interface AlarmMeetingLine {
  id: number;
  en: string;
  cn: string;
  phrases: AlarmMeetingPhrase[];
}

/** Standard spoken update for an on-site alarm and maintenance meeting. */
export const ALARM_MEETING_SCRIPTS: AlarmMeetingLine[] = [
  {
    id: 1,
    en: "Today's meeting will review the latest status of on-site infrastructure alarms and outstanding maintenance arrangements.",
    cn: '今天的会议将回顾现场基础设施告警的最新状态以及尚未完成的维护安排。',
    phrases: [
      { text: "today's meeting", chinese: '今天的会议' },
      { text: 'review the latest status', chinese: '回顾最新状态' },
      { text: 'on-site infrastructure alarms', chinese: '现场基础设施告警' },
      { text: 'outstanding maintenance arrangements', chinese: '尚未完成的维护安排' },
    ],
  },
  {
    id: 2,
    en: 'As of today, there are no active alarms in B5.',
    cn: '截至今天，B5目前没有活动告警。',
    phrases: [
      { text: 'as of today', chinese: '截至今天' },
      { text: 'active alarms', chinese: '活动告警' },
    ],
  },
  {
    id: 3,
    en: 'The two alarms previously reported in B7 have been resolved, and the related event work orders have been formally signed off.',
    cn: '此前B7报告的两条告警均已解决，相关事件工单也已正式签字关闭。',
    phrases: [
      { text: 'previously reported', chinese: '此前报告的' },
      { text: 'have been resolved', chinese: '已经解决' },
      { text: 'event work orders', chinese: '事件工单' },
      { text: 'formally signed off', chinese: '已正式签字关闭' },
    ],
  },
  {
    id: 4,
    en: 'Three alarms related to faulty water meter sensors remain outstanding.',
    cn: '目前仍有三条与水表传感器故障有关的告警尚未解决。',
    phrases: [
      { text: 'faulty water meter sensors', chinese: '发生故障的水表传感器' },
      { text: 'remain outstanding', chinese: '仍未解决' },
    ],
  },
  {
    id: 5,
    en: 'Rectification work is currently on hold pending the arrival of compatible replacement sensors.',
    cn: '整改工作目前暂停，等待匹配的替换传感器到货。',
    phrases: [
      { text: 'rectification work', chinese: '整改工作' },
      { text: 'on hold', chinese: '暂停；暂缓' },
      { text: 'pending the arrival of', chinese: '等待……到货' },
      { text: 'compatible replacement sensors', chinese: '匹配的替换传感器' },
    ],
  },
  {
    id: 6,
    en: 'An abnormal condition has been identified on the B52F-2 MPBC06 device.',
    cn: 'B52F-2 MPBC06设备已发现异常情况。',
    phrases: [
      { text: 'abnormal condition', chinese: '异常情况' },
      { text: 'has been identified', chinese: '已被发现；已确认' },
    ],
  },
  {
    id: 7,
    en: 'An event work order has been raised in DingTalk, and the equipment manufacturer will conduct an on-site inspection.',
    cn: '相关事件工单已通过钉钉发起，设备制造商将到现场检查。',
    phrases: [
      { text: 'event work order', chinese: '事件工单' },
      { text: 'raised in DingTalk', chinese: '已在钉钉中发起' },
      { text: 'equipment manufacturer', chinese: '设备制造商' },
      { text: 'conduct an on-site inspection', chinese: '进行现场检查' },
    ],
  },
  {
    id: 8,
    en: 'The manufacturer responsible for the B7 CRAC unit is scheduled to attend the site next week and carry out the required maintenance.',
    cn: '负责B7精密空调机组的制造商计划于下周到场，并完成所需的维护工作。',
    phrases: [
      { text: 'responsible for', chinese: '负责……' },
      { text: 'CRAC unit', chinese: '精密空调机组' },
      { text: 'scheduled to attend the site', chinese: '计划到场' },
      { text: 'carry out the required maintenance', chinese: '完成所需的维护工作' },
    ],
  },
];
