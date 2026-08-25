import type { AlarmMeetingPhrase } from './alarmMeetingScripts';

export interface AlarmChatLine {
  id: number;
  speaker: 'A' | 'B' | 'C';
  en: string;
  cn: string;
  phrases: AlarmMeetingPhrase[];
}

/** Reviewed dialogue based on on-site operations chat logs. */
export const ALARM_CHAT_DIALOGUE: AlarmChatLine[] = [
  { id: 1, speaker: 'A', en: 'Should this be handled by the property management team?', cn: '这个应该由物业管理团队处理吧？', phrases: [{ text: 'be handled by', chinese: '由……处理' }, { text: 'property management team', chinese: '物业管理团队' }] },
  { id: 2, speaker: 'B', en: 'What happened to the diesel generator?', cn: '柴油发电机怎么了？', phrases: [{ text: 'what happened to', chinese: '……怎么了' }, { text: 'diesel generator', chinese: '柴油发电机' }] },
  { id: 3, speaker: 'A', en: 'A battery exploded, and there is a strong acid smell now, so we should leave the louver open for ventilation.', cn: '一块蓄电池发生了爆炸，现在酸液气味很重，所以应保持百叶窗开启以便通风。', phrases: [{ text: 'a battery exploded', chinese: '一块蓄电池发生了爆炸' }, { text: 'a strong acid smell', chinese: '强烈的酸液气味' }, { text: 'leave the louver open', chinese: '保持百叶窗开启' }, { text: 'for ventilation', chinese: '以便通风' }] },
  { id: 4, speaker: 'B', en: 'The acid and its vapour are hazardous.', cn: '酸液及其蒸气具有危险性。', phrases: [{ text: 'acid and its vapour', chinese: '酸液及其蒸气' }, { text: 'are hazardous', chinese: '具有危险性' }] },
  { id: 5, speaker: 'A', en: 'When did this happen, and what caused the battery to explode?', cn: '这是什么时候发生的？蓄电池为什么会爆炸？', phrases: [{ text: 'when did this happen', chinese: '这是什么时候发生的' }, { text: 'what caused the battery to explode', chinese: '是什么导致蓄电池爆炸' }] },
  { id: 6, speaker: 'B', en: 'They plan to test the generator tomorrow. Hopefully, the acid smell will have dissipated by then.', cn: '他们计划明天测试发电机，希望届时酸液气味已经消散。', phrases: [{ text: 'test the generator', chinese: '测试发电机' }, { text: 'will have dissipated', chinese: '届时将已经消散' }, { text: 'by then', chinese: '到那时；届时' }] },
  { id: 7, speaker: 'A', en: "This happened during Shift A's MOP work on August 14, 2026.", cn: '这件事发生在2026年8月14日A班执行MOP期间。', phrases: [{ text: "during Shift A's MOP work", chinese: 'A班执行MOP期间' }, { text: 'on August 14, 2026', chinese: '在2026年8月14日' }] },
  { id: 8, speaker: 'B', en: 'Alright.', cn: '好吧。', phrases: [{ text: 'alright', chinese: '好的；好吧' }] },
  { id: 9, speaker: 'A', en: 'They have already replaced the battery, and they will test the generator tomorrow during our shift.', cn: '他们已经更换了蓄电池，明天我们当班期间会测试发电机。', phrases: [{ text: 'have already replaced', chinese: '已经更换' }, { text: 'during our shift', chinese: '我们当班期间' }] },
  { id: 10, speaker: 'B', en: 'The root cause was not stated in the report.', cn: '报告中没有说明根本原因。', phrases: [{ text: 'root cause', chinese: '根本原因' }, { text: 'was not stated', chinese: '未说明' }, { text: 'in the report', chinese: '在报告中' }] },
  { id: 11, speaker: 'A', en: 'It may still be under investigation by the maintenance team.', cn: '运维团队可能仍在调查此事。', phrases: [{ text: 'under investigation', chinese: '正在调查中' }, { text: 'maintenance team', chinese: '运维团队' }] },
  { id: 12, speaker: 'B', en: 'Which diesel generator was it?', cn: '是哪一台柴油发电机？', phrases: [{ text: 'which diesel generator', chinese: '哪一台柴油发电机' }] },
  { id: 13, speaker: 'A', en: 'This one.', cn: '这一台。', phrases: [{ text: 'this one', chinese: '这一台；这个' }] },
  { id: 14, speaker: 'B', en: 'Does this water meter fault require a fault ticket?', cn: '这个水表故障需要开故障工单吗？', phrases: [{ text: 'water meter fault', chinese: '水表故障' }, { text: 'require a fault ticket', chinese: '需要开故障工单' }] },
  { id: 15, speaker: 'A', en: 'No, it has already been closed out.', cn: '不需要，已经处理完成并关闭了。', phrases: [{ text: 'already been closed out', chinese: '已经处理完成并关闭' }] },
  { id: 16, speaker: 'B', en: 'Was there any unusual noise from the water pump last night?', cn: '昨晚水泵有异常噪声吗？', phrases: [{ text: 'unusual noise', chinese: '异常噪声' }, { text: 'water pump', chinese: '水泵' }, { text: 'last night', chinese: '昨晚' }] },
  { id: 17, speaker: 'A', en: 'Do you mean the related incident ticket?', cn: '你是指相关的事件工单吗？', phrases: [{ text: 'do you mean', chinese: '你是指……吗' }, { text: 'related incident ticket', chinese: '相关事件工单' }] },
  { id: 18, speaker: 'B', en: 'Yes.', cn: '是的。', phrases: [{ text: 'yes', chinese: '是的' }] },
  { id: 19, speaker: 'A', en: 'Please let me know next time.', cn: '下次请告诉我。', phrases: [{ text: 'let me know', chinese: '告诉我；通知我' }, { text: 'next time', chinese: '下次' }] },
  { id: 20, speaker: 'B', en: "This incident ticket was raised during Shahnil's shift and was related to the MOP work.", cn: '这张事件工单是在Shahnil值班期间发起的，与MOP作业有关。', phrases: [{ text: 'incident ticket was raised', chinese: '事件工单已发起' }, { text: "during Shahnil's shift", chinese: 'Shahnil值班期间' }, { text: 'related to the MOP work', chinese: '与MOP作业有关' }] },
  { id: 21, speaker: 'A', en: 'I am at B7 tonight. I will upload the revised EOP and SOP later.', cn: '我今晚在B7，稍后会上传修订后的EOP和SOP。', phrases: [{ text: 'at B7 tonight', chinese: '今晚在B7' }, { text: 'upload the revised EOP and SOP', chinese: '上传修订后的EOP和SOP' }] },
  { id: 22, speaker: 'B', en: 'Okay.', cn: '好的。', phrases: [{ text: 'okay', chinese: '好的' }] },
  { id: 23, speaker: 'A', en: 'You guys get some rest. I need to finish revising the EOP and SOP today. Please take the walkie-talkies with you. Would it be okay if I take my break at 4:00?', cn: '你们去休息一下吧。我今天需要完成EOP和SOP的修订。请把对讲机带上。我四点再休息，可以吗？', phrases: [{ text: 'get some rest', chinese: '休息一下' }, { text: 'finish revising', chinese: '完成修订' }, { text: 'take the walkie-talkies with you', chinese: '随身带上对讲机' }, { text: 'take my break at 4:00', chinese: '四点开始休息' }] },
  { id: 24, speaker: 'B', en: 'Has a fault ticket been raised for the B7 MTPC?', cn: 'B7的MTPC是否已经开了故障工单？', phrases: [{ text: 'fault ticket been raised', chinese: '已经开具故障工单' }, { text: 'B7 MTPC', chinese: 'B7的MTPC设备' }] },
  { id: 25, speaker: 'A', en: 'We can raise a fault ticket for this. It may be leaking refrigerant. The vendor is scheduled to arrive at B7 at 9:10 for an inspection.', cn: '这个可以开一张故障工单。设备可能存在制冷剂泄漏。厂家计划9点10分到B7进行检查。', phrases: [{ text: 'raise a fault ticket', chinese: '开具故障工单' }, { text: 'leaking refrigerant', chinese: '制冷剂泄漏' }, { text: 'vendor is scheduled to arrive', chinese: '厂家计划到达' }, { text: 'for an inspection', chinese: '进行检查' }] },
  { id: 26, speaker: 'B', en: 'Do you know the password for this?', cn: '你知道这个的密码吗？', phrases: [{ text: 'know the password', chinese: '知道密码' }, { text: 'password for this', chinese: '这个的密码' }] },
  { id: 27, speaker: 'A', en: "I don't know.", cn: '我不知道。', phrases: [{ text: "don't know", chinese: '不知道' }] },
  { id: 28, speaker: 'B', en: 'Okay.', cn: '好的。', phrases: [{ text: 'okay', chinese: '好的' }] },
  { id: 29, speaker: 'A', en: 'The inspection team needs to drain some water from the system because the conductivity is too high.', cn: '由于电导率过高，巡检团队需要从系统中排出一部分水。', phrases: [{ text: 'inspection team', chinese: '巡检团队' }, { text: 'drain some water', chinese: '排出一部分水' }, { text: 'conductivity is too high', chinese: '电导率过高' }] },
  { id: 30, speaker: 'B', en: 'Zhu Wei is still at B4, and this work has not yet been completed.', cn: '朱伟仍在B4，这项工作还没有完成。', phrases: [{ text: 'is still at B4', chinese: '仍在B4' }, { text: 'has not yet been completed', chinese: '尚未完成' }] },
  { id: 31, speaker: 'A', en: 'This has not been fixed yet. We need to monitor it tonight and continue the repair work tomorrow.', cn: '这个问题还没有修复。今晚需要继续观察，明天继续维修。', phrases: [{ text: 'has not been fixed yet', chinese: '尚未修复' }, { text: 'monitor it tonight', chinese: '今晚继续观察' }, { text: 'continue the repair work', chinese: '继续维修工作' }] },
  { id: 32, speaker: 'B', en: 'Okay.', cn: '好的。', phrases: [{ text: 'okay', chinese: '好的' }] },
  { id: 33, speaker: 'A', en: "Do you have Farina's contact details? Could you help me ask for the password?", cn: '你有Farina的联系方式吗？可以帮我询问一下密码吗？', phrases: [{ text: 'contact details', chinese: '联系方式' }, { text: 'ask for the password', chinese: '询问密码' }] },
];

/** Reviewed dialogue about pump trends, a drill, photos and fault-ticket assignment. */
export const ALARM_TREND_DRILL_DIALOGUE: AlarmChatLine[] = [
  { id: 1, speaker: 'A', en: "It's at B1B2.", cn: '在B1B2位置。', phrases: [{ text: 'at B1B2', chinese: '在B1B2位置' }] },
  { id: 2, speaker: 'B', en: 'Okay.', cn: '好的。', phrases: [{ text: 'okay', chinese: '好的' }] },
  { id: 3, speaker: 'A', en: 'Can you check the trend for B5 PWP1?', cn: '你能查一下B5 PWP1的趋势吗？', phrases: [{ text: 'check the trend', chinese: '查看趋势' }, { text: 'trend for B5 PWP1', chinese: 'B5 PWP1的趋势' }] },
  { id: 4, speaker: 'B', en: 'Okay.', cn: '好的。', phrases: [{ text: 'okay', chinese: '好的' }] },
  { id: 5, speaker: 'A', en: 'These two pumps seem to be running continuously.', cn: '这两台水泵似乎一直在连续运行。', phrases: [{ text: 'these two pumps', chinese: '这两台水泵' }, { text: 'running continuously', chinese: '连续运行' }] },
  { id: 6, speaker: 'B', en: 'Is the fault indicator on?', cn: '故障指示灯亮着吗？', phrases: [{ text: 'fault indicator', chinese: '故障指示灯' }, { text: 'indicator on', chinese: '指示灯亮起' }] },
  { id: 7, speaker: 'A', en: 'Everything is normal, and there is no alarm. I just noticed that both pumps were still running during the 10:00 a.m. and 4:00 p.m. inspections.', cn: '一切正常，也没有告警。我只是注意到，在上午10点和下午4点巡检时，两台水泵仍在运行。', phrases: [{ text: 'there is no alarm', chinese: '没有告警' }, { text: 'both pumps were still running', chinese: '两台水泵仍在运行' }, { text: 'during the 10:00 a.m. and 4:00 p.m. inspections', chinese: '上午10点和下午4点巡检期间' }] },
  { id: 8, speaker: 'B', en: 'We have an upcoming drill for a refrigerant-pump phase-change cooling system failure without loss of redundancy.', cn: '我们稍后要进行氟泵相变冷却系统故障演练，演练场景不涉及冗余损失。', phrases: [{ text: 'upcoming drill', chinese: '即将进行的演练' }, { text: 'refrigerant-pump phase-change cooling system', chinese: '氟泵相变冷却系统' }, { text: 'without loss of redundancy', chinese: '无冗余损失' }] },
  { id: 9, speaker: 'A', en: 'Did you take the photos of B7? Please send them to me.', cn: 'B7的照片拍了吗？请转发给我。', phrases: [{ text: 'take the photos', chinese: '拍照片' }, { text: 'send them to me', chinese: '把它们发给我' }] },
  { id: 10, speaker: 'B', en: 'They are already in the group chat.', cn: '已经发在群聊里了。', phrases: [{ text: 'in the group chat', chinese: '在群聊里' }] },
  { id: 11, speaker: 'C', en: 'Here is the B7 EOP and SOP checklist. Ahmad Azri, please note: there is no rack in B7 BR1B or BR1C.', cn: '这是B7的EOP和SOP清单。Ahmad Azri请注意：B7 BR1B和BR1C均无机架。', phrases: [{ text: 'EOP and SOP checklist', chinese: 'EOP和SOP清单' }, { text: 'please note', chinese: '请注意' }, { text: 'there is no rack', chinese: '没有机架' }] },
  { id: 12, speaker: 'A', en: 'Some of the photos were taken from too far away. Please tell us which specific photos you need, and we will retake them later.', cn: '有些照片拍摄距离太远。请告诉我们具体需要哪些照片，我们稍后重新拍摄。', phrases: [{ text: 'too far away', chinese: '距离太远' }, { text: 'which specific photos you need', chinese: '具体需要哪些照片' }, { text: 'retake them later', chinese: '稍后重新拍摄' }] },
  { id: 13, speaker: 'B', en: "I will take them myself. You can proceed with the drill. Conduct it yourselves today; the engineer will not be coming over.", cn: '我自己拍。你们继续演练。今天由你们自行完成，工程师不会过来。', phrases: [{ text: 'take them myself', chinese: '我自己拍摄' }, { text: 'proceed with the drill', chinese: '继续进行演练' }, { text: 'conduct it yourselves', chinese: '由你们自行完成' }, { text: 'will not be coming over', chinese: '不会过来' }] },
  { id: 14, speaker: 'A', en: 'Has a trouble ticket been raised for this?', cn: '这个问题已经开故障工单了吗？', phrases: [{ text: 'trouble ticket', chinese: '故障工单' }, { text: 'been raised for this', chinese: '已经为此开具' }] },
  { id: 15, speaker: 'B', en: 'Not yet. I will raise a trouble ticket later. The equipment is operating normally on-site.', cn: '还没有。我稍后会开故障工单。现场设备运行正常。', phrases: [{ text: 'not yet', chinese: '还没有' }, { text: 'raise a trouble ticket', chinese: '开故障工单' }, { text: 'operating normally on-site', chinese: '现场运行正常' }] },
  { id: 16, speaker: 'A', en: 'If the equipment is operating normally on-site, the ticket should be assigned to the ELV team because this is a data acquisition issue.', cn: '如果现场设备运行正常，这张工单应分派给弱电团队，因为这是数据采集问题。', phrases: [{ text: 'assigned to the ELV team', chinese: '分派给弱电团队' }, { text: 'data acquisition issue', chinese: '数据采集问题' }, { text: 'operating normally on-site', chinese: '现场运行正常' }] },
  { id: 17, speaker: 'B', en: 'I will assign it to Jiang Yongjun.', cn: '我会把工单分派给江永军。', phrases: [{ text: 'assign it to', chinese: '把它分派给……' }] },
  { id: 18, speaker: 'A', en: 'Please raise a ticket and assign it to Wu Jiahuan. Has it not been raised yet? The reference number is PM-202601110001989.', cn: '请开一张工单并分派给吴佳欢。工单还没有开吗？参考编号是PM-202601110001989。', phrases: [{ text: 'raise a ticket', chinese: '开具工单' }, { text: 'assign it to Wu Jiahuan', chinese: '分派给吴佳欢' }, { text: 'reference number', chinese: '参考编号；工单编号' }] },
  { id: 19, speaker: 'B', en: 'Hold on. I am raising it now.', cn: '请稍等，我现在正在开单。', phrases: [{ text: 'hold on', chinese: '请稍等' }, { text: 'raising it now', chinese: '现在正在开单' }] },
  { id: 20, speaker: 'A', en: 'There is another issue. Does this one require a trouble ticket as well?', cn: '还有一个问题。这个也需要开故障工单吗？', phrases: [{ text: 'another issue', chinese: '另一个问题' }, { text: 'require a trouble ticket', chinese: '需要开故障工单' }, { text: 'as well', chinese: '也；同样' }] },
  { id: 21, speaker: 'B', en: 'Wu asked us to raise a ticket for it.', cn: '吴让我们为这个问题开一张工单。', phrases: [{ text: 'asked us to', chinese: '让我们……' }, { text: 'raise a ticket for it', chinese: '为此开具工单' }] },
  { id: 22, speaker: 'A', en: 'What do you mean by that?', cn: '你这话是什么意思？', phrases: [{ text: 'what do you mean by that', chinese: '你这话是什么意思' }] },
];

/** Reviewed dialogue about visitor access, change tickets and troubleshooting. */
export const ALARM_ACCESS_MAINTENANCE_DIALOGUE: AlarmChatLine[] = [
  { id: 1, speaker: 'A', en: "Do you need the driver's ID number and vehicle registration number?", cn: '需要司机的证件号码和车辆登记号码吗？', phrases: [{ text: "driver's ID number", chinese: '司机证件号码' }, { text: 'vehicle registration number', chinese: '车辆登记号码；车牌号' }] },
  { id: 2, speaker: 'B', en: 'Yes, we do. What is the purpose of the visit, the company name and the driver\'s full name?', cn: '是的，需要。来访目的、公司名称和司机全名分别是什么？', phrases: [{ text: 'purpose of the visit', chinese: '来访目的' }, { text: 'company name', chinese: '公司名称' }, { text: "driver's full name", chinese: '司机全名' }] },
  { id: 3, speaker: 'A', en: 'The purpose is to deliver skirting boards to the site. It is a delivery only.', cn: '来访目的是向园区运送地脚线，仅进行送货。', phrases: [{ text: 'deliver skirting boards', chinese: '运送地脚线' }, { text: 'to the site', chinese: '送到园区；送到现场' }, { text: 'delivery only', chinese: '仅送货' }] },
  { id: 4, speaker: 'B', en: 'Which company is it?', cn: '是哪家公司？', phrases: [{ text: 'which company', chinese: '哪家公司' }] },
  { id: 5, speaker: 'A', en: 'Let me confirm. Please wait a moment, and I will send you a screenshot of the required details.', cn: '我确认一下。请稍等，我会把所需信息的截图发给你。', phrases: [{ text: 'let me confirm', chinese: '我确认一下' }, { text: 'wait a moment', chinese: '稍等一下' }, { text: 'required details', chinese: '所需详细信息' }, { text: 'send you a screenshot', chinese: '把截图发给你' }] },
  { id: 6, speaker: 'A', en: "Driver's name: Ramakrishnan. ID number: [ID number]. Truck registration number: [vehicle registration]. Mobile number: [mobile number].", cn: '司机姓名：Ramakrishnan。证件号：[已隐藏]。货车登记号码：[已隐藏]。手机号：[已隐藏]。', phrases: [{ text: "driver's name", chinese: '司机姓名' }, { text: 'ID number', chinese: '证件号码' }, { text: 'truck registration number', chinese: '货车登记号码；货车车牌号' }, { text: 'mobile number', chinese: '手机号码' }] },
  { id: 7, speaker: 'A', en: "Driver's name: Duan Zhixiang. ID number: [ID number]. Vehicle registration number: [vehicle registration]. Mobile number: [mobile number].", cn: '司机姓名：Duan Zhixiang。证件号：[已隐藏]。车辆登记号码：[已隐藏]。手机号：[已隐藏]。', phrases: [{ text: "driver's name", chinese: '司机姓名' }, { text: 'ID number', chinese: '证件号码' }, { text: 'vehicle registration number', chinese: '车辆登记号码；车牌号' }, { text: 'mobile number', chinese: '手机号码' }] },
  { id: 8, speaker: 'B', en: 'Do you have the company name?', cn: '你有公司名称吗？', phrases: [{ text: 'company name', chinese: '公司名称' }] },
  { id: 9, speaker: 'A', en: 'Let me confirm. The company name is Operation Star, and access is required for one day only.', cn: '我确认一下。公司名称是Operation Star，只需要一天的访问权限。', phrases: [{ text: 'company name', chinese: '公司名称' }, { text: 'access is required', chinese: '需要访问权限' }, { text: 'for one day only', chinese: '仅限一天' }] },
  { id: 10, speaker: 'B', en: 'Okay. I will grant access for one week just in case.', cn: '好的。为防万一，我会先授予一周的访问权限。', phrases: [{ text: 'grant access', chinese: '授予访问权限' }, { text: 'for one week', chinese: '为期一周' }, { text: 'just in case', chinese: '以防万一' }] },
  { id: 11, speaker: 'A', en: 'The request has been submitted to the manager for approval.', cn: '申请已提交给经理审批。', phrases: [{ text: 'submitted to the manager', chinese: '已提交给经理' }, { text: 'for approval', chinese: '等待审批' }] },
  { id: 12, speaker: 'B', en: 'Has the expansion valve been replaced?', cn: '膨胀阀已经更换了吗？', phrases: [{ text: 'expansion valve', chinese: '膨胀阀' }, { text: 'been replaced', chinese: '已经更换' }] },
  { id: 13, speaker: 'A', en: 'This is not related to the replacement. It is a separate change ticket, not the work order for the replacement. The replacement work is being carried out at DH1-4.', cn: '这与更换工作无关。这是另一张变更工单，不是对应更换工作的工单。更换工作正在DH1-4进行。', phrases: [{ text: 'not related to the replacement', chinese: '与更换工作无关' }, { text: 'separate change ticket', chinese: '另一张独立的变更工单' }, { text: 'work order for the replacement', chinese: '对应更换工作的工单' }, { text: 'being carried out at DH1-4', chinese: '正在DH1-4进行' }] },
  { id: 14, speaker: 'B', en: 'Has that expansion valve been replaced?', cn: '那个膨胀阀已经更换了吗？', phrases: [{ text: 'that expansion valve', chinese: '那个膨胀阀' }, { text: 'been replaced', chinese: '已经更换' }] },
  { id: 15, speaker: 'A', en: 'I think the replacement work is still in progress. I will check with the engineer responsible for the work later.', cn: '我认为更换工作仍在进行中。稍后我会向负责这项工作的工程师确认。', phrases: [{ text: 'still in progress', chinese: '仍在进行中' }, { text: 'check with the engineer', chinese: '向工程师确认' }, { text: 'responsible for the work', chinese: '负责这项工作' }] },
  { id: 16, speaker: 'B', en: 'How do I log in to B7? Is it B7 or B5? Please treat this as urgent.', cn: 'B7怎么登录？是B7还是B5？请加急处理。', phrases: [{ text: 'log in to B7', chinese: '登录B7' }, { text: 'treat this as urgent', chinese: '将此事加急处理' }] },
  { id: 17, speaker: 'A', en: 'B7. He knows how to access it.', cn: '是B7。他知道如何访问。', phrases: [{ text: 'knows how to access it', chinese: '知道如何访问' }] },
  { id: 18, speaker: 'B', en: 'Okay, thank you.', cn: '好的，谢谢。', phrases: [{ text: 'thank you', chinese: '谢谢' }] },
  { id: 19, speaker: 'A', en: 'The network cable is loose.', cn: '网线松了。', phrases: [{ text: 'network cable', chinese: '网线' }, { text: 'is loose', chinese: '松动了' }] },
  { id: 20, speaker: 'B', en: 'Hi, sorry to bother you today. What is the password for this? It is urgent.', cn: '你好，不好意思今天打扰你。这个的密码是多少？事情很紧急。', phrases: [{ text: 'sorry to bother you', chinese: '不好意思打扰你' }, { text: 'password for this', chinese: '这个的密码' }, { text: 'it is urgent', chinese: '事情很紧急' }] },
  { id: 21, speaker: 'A', en: 'Hi, sorry. Just open Lark. Do you have access now?', cn: '你好，不好意思。直接打开Lark即可。你现在可以访问了吗？', phrases: [{ text: 'just open Lark', chinese: '直接打开Lark' }, { text: 'have access now', chinese: '现在可以访问' }] },
  { id: 22, speaker: 'B', en: "Never mind. I've got it now. Thanks.", cn: '没事，我现在已经知道了。谢谢。', phrases: [{ text: 'never mind', chinese: '没事；不用了' }, { text: "I've got it now", chinese: '我现在已经知道了；我已经弄好了' }] },
];

/** Reviewed dialogue about low water pressure and emergency response. */
export const ALARM_WATER_SUPPLY_DIALOGUE: AlarmChatLine[] = [
  { id: 1, speaker: 'A', en: 'Go to the site and check this. If it is confirmed as a fault, raise a fault ticket.', cn: '到现场检查一下。如果确认是故障，就开一张故障工单。', phrases: [{ text: 'go to the site', chinese: '到现场' }, { text: 'confirmed as a fault', chinese: '确认是故障' }, { text: 'raise a fault ticket', chinese: '开故障工单' }] },
  { id: 2, speaker: 'B', en: 'This is probably another sensor issue.', cn: '这可能也是一个传感器问题。', phrases: [{ text: 'probably another sensor issue', chinese: '可能也是一个传感器问题' }] },
  { id: 3, speaker: 'A', en: 'Yes.', cn: '是的。', phrases: [{ text: 'yes', chinese: '是的' }] },
  { id: 4, speaker: 'B', en: 'Ask COCC to check the other buildings, as they also have an alarm.', cn: '让COCC检查其他楼宇，因为那些楼宇也有告警。', phrases: [{ text: 'ask COCC to check', chinese: '让COCC检查' }, { text: 'the other buildings', chinese: '其他楼宇' }, { text: 'also have an alarm', chinese: '也有告警' }] },
  { id: 5, speaker: 'A', en: 'Is low water pressure also affecting this line?', cn: '这一路是否也受到低水压影响？', phrases: [{ text: 'low water pressure', chinese: '水压低；低水压' }, { text: 'affecting this line', chinese: '影响这一路管线' }] },
  { id: 6, speaker: 'B', en: 'Yes.', cn: '是的。', phrases: [{ text: 'yes', chinese: '是的' }] },
  { id: 7, speaker: 'A', en: 'All the water tanks need to be checked. I am concerned that the issue originates from the incoming water supply.', cn: '所有水箱都需要检查。我担心问题来自进水供水端。', phrases: [{ text: 'water tanks need to be checked', chinese: '水箱需要检查' }, { text: 'the issue originates from', chinese: '问题来自……' }, { text: 'incoming water supply', chinese: '进水供水端' }] },
  { id: 8, speaker: 'B', en: 'In that case, we should activate the emergency response process.', cn: '既然如此，我们应该启动应急响应流程。', phrases: [{ text: 'in that case', chinese: '既然如此；在这种情况下' }, { text: 'activate the emergency response process', chinese: '启动应急响应流程' }] },
  { id: 9, speaker: 'A', en: 'It appears to be a supply-side issue. At B1B2, they are manually topping up the water tanks.', cn: '看起来是供水端的问题。在B1B2，他们正在手动给水箱补水。', phrases: [{ text: 'supply-side issue', chinese: '供水端问题' }, { text: 'manually topping up', chinese: '正在手动补充' }, { text: 'water tanks', chinese: '水箱' }] },
  { id: 10, speaker: 'B', en: 'COCC reported that conditions were normal.', cn: 'COCC报告称现场情况正常。', phrases: [{ text: 'reported that', chinese: '报告称……' }, { text: 'conditions were normal', chinese: '情况正常' }] },
  { id: 11, speaker: 'A', en: 'Okay.', cn: '好的。', phrases: [{ text: 'okay', chinese: '好的' }] },
  { id: 12, speaker: 'B', en: 'Could the pressure in the boundary supply line be too low?', cn: '会不会是边界供水管线的压力过低？', phrases: [{ text: 'boundary supply line', chinese: '边界供水管线' }, { text: 'be too low', chinese: '过低' }] },
  { id: 13, speaker: 'A', en: 'The water pressure is far too low. When they top up their tanks, it affects our supply pressure.', cn: '水压确实太低了。他们给水箱补水时，会影响我们的供水压力。', phrases: [{ text: 'far too low', chinese: '实在太低；远低于正常值' }, { text: 'top up their tanks', chinese: '给他们的水箱补水' }, { text: 'affects our supply pressure', chinese: '影响我们的供水压力' }] },
  { id: 14, speaker: 'B', en: 'Yes, it reduced our pressure. After they finished topping up the tanks, our pressure returned to normal.', cn: '是的，这导致我们的水压下降。他们完成水箱补水后，我们的水压恢复了正常。', phrases: [{ text: 'reduced our pressure', chinese: '导致我们的压力下降' }, { text: 'finished topping up the tanks', chinese: '完成水箱补水' }, { text: 'returned to normal', chinese: '恢复正常' }] },
  { id: 15, speaker: 'A', en: 'Please brief Li on this issue.', cn: '请把这个问题告知李。', phrases: [{ text: 'brief Li on', chinese: '向李说明……' }, { text: 'this issue', chinese: '这个问题' }] },
  { id: 16, speaker: 'B', en: 'Okay.', cn: '好的。', phrases: [{ text: 'okay', chinese: '好的' }] },
];
