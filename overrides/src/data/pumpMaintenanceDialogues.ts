import type { AlarmChatLine } from './alarmChatDialogue';

export interface PumpMaintenanceScenario {
  id: number;
  kind: '故障维修' | '日常巡检';
  title: string;
  causeCn: string;
  lines: AlarmChatLine[];
}

export const PUMP_PRINCIPLE_CN = '冷却水泵由电机驱动叶轮，为冷冻水或冷却水回路提供流量和扬程。变频系统可根据压差、流量和温度需求调速，但必须同时满足最小流量、设备稳定区间和冗余要求。';

export const PUMP_MAINTENANCE_DIALOGUES: PumpMaintenanceScenario[] = [
  {
    id: 1, kind: '故障维修', title: '流量归零并伴随尖锐异响',
    causeCn: '可能原因包括泵内积气、失去灌泵条件、吸入侧受阻或气蚀；仅凭声音不能直接确认。',
    lines: [
      { id: 1, speaker: 'A', en: 'The flow reading has dropped to zero, and there is a sharp abnormal noise from the pump.', cn: '流量读数已经降到零，水泵传出尖锐异响。', phrases: [{ text: 'flow reading has dropped to zero', chinese: '流量读数已降至零' }, { text: 'sharp abnormal noise', chinese: '尖锐异响' }] },
      { id: 2, speaker: 'B', en: 'Stop the pump if it is safe to do so. Possible causes include trapped air, loss of prime, a suction restriction or cavitation.', cn: '如果可以安全停泵，应立即停泵。可能原因包括积气、失去灌泵条件、吸入侧受阻或气蚀。', phrases: [{ text: 'safe to do so', chinese: '可以安全执行' }, { text: 'loss of prime', chinese: '失去灌泵条件' }, { text: 'suction restriction', chinese: '吸入侧受阻' }] },
      { id: 3, speaker: 'A', en: 'How should we troubleshoot it?', cn: '我们应该怎样排查？', phrases: [{ text: 'troubleshoot it', chinese: '排查该问题' }] },
      { id: 4, speaker: 'B', en: 'Follow the approved isolation procedure, verify the valve lineup, tank level, suction pressure and strainer condition, then vent and prime the pump in accordance with the manufacturer instructions.', cn: '执行经批准的隔离程序，核对阀门状态、水箱液位、吸入压力和过滤器状况，然后按照厂家说明进行排气和灌泵。', phrases: [{ text: 'approved isolation procedure', chinese: '经批准的隔离程序' }, { text: 'verify the valve lineup', chinese: '核对阀门状态' }, { text: 'in accordance with', chinese: '按照……' }] },
    ],
  },
  {
    id: 2, kind: '故障维修', title: '变频转速不稳、压力波动',
    causeCn: '可能与压力变送器偏差、信号线路、PID控制参数、阀门动作或系统需求波动有关。',
    lines: [
      { id: 1, speaker: 'A', en: 'The pump speed and system pressure are fluctuating repeatedly.', cn: '水泵转速和系统压力反复波动。', phrases: [{ text: 'system pressure', chinese: '系统压力' }, { text: 'fluctuating repeatedly', chinese: '反复波动' }] },
      { id: 2, speaker: 'B', en: 'Do not assume that the pressure sensor is faulty. We need to check the control loop, signal wiring, valve response and demand trend.', cn: '不要直接认定压力传感器故障。我们需要检查控制回路、信号线路、阀门响应和需求趋势。', phrases: [{ text: 'do not assume', chinese: '不要直接认定' }, { text: 'control loop', chinese: '控制回路' }, { text: 'demand trend', chinese: '需求趋势' }] },
      { id: 3, speaker: 'A', en: 'How can we verify the pressure signal?', cn: '怎样验证压力信号？', phrases: [{ text: 'verify the pressure signal', chinese: '验证压力信号' }] },
      { id: 4, speaker: 'B', en: 'Compare the transmitter reading with a calibrated reference gauge and review the trend. Change VFD or PID settings only through an approved change procedure.', cn: '将变送器读数与经过校准的参考压力表进行比较并查看趋势。只有通过批准的变更程序才能修改变频器或PID参数。', phrases: [{ text: 'calibrated reference gauge', chinese: '经过校准的参考压力表' }, { text: 'approved change procedure', chinese: '批准的变更程序' }] },
    ],
  },
  {
    id: 3, kind: '故障维修', title: '轴承过热、温度告警',
    causeCn: '润滑异常只是可能原因之一，还需检查轴承损伤、对中、负载、冷却和振动。',
    lines: [
      { id: 1, speaker: 'A', en: 'The bearing temperature alarm is active, and the measured temperature is above 80 degrees Celsius.', cn: '轴承温度告警已触发，实测温度超过80摄氏度。', phrases: [{ text: 'bearing temperature alarm', chinese: '轴承温度告警' }, { text: 'measured temperature', chinese: '实测温度' }] },
      { id: 2, speaker: 'B', en: 'Treat this as an abnormal condition. Possible causes include incorrect lubrication, bearing damage, misalignment, excessive load or inadequate cooling.', cn: '应将其作为异常情况处理。可能原因包括润滑不当、轴承损伤、对中不良、负载过大或冷却不足。', phrases: [{ text: 'abnormal condition', chinese: '异常情况' }, { text: 'incorrect lubrication', chinese: '润滑不当' }, { text: 'bearing damage', chinese: '轴承损伤' }] },
      { id: 3, speaker: 'A', en: 'Do we need to replace the bearing?', cn: '需要更换轴承吗？', phrases: [{ text: 'replace the bearing', chinese: '更换轴承' }] },
      { id: 4, speaker: 'B', en: 'We cannot decide that from temperature alone. Isolate the pump, inspect the bearing, grease condition, alignment and vibration, and follow the manufacturer limits before deciding.', cn: '不能仅凭温度决定。应隔离水泵，检查轴承、润滑脂状态、对中和振动，并根据厂家限值决定是否更换。', phrases: [{ text: 'from temperature alone', chinese: '仅凭温度' }, { text: 'grease condition', chinese: '润滑脂状态' }, { text: 'manufacturer limits', chinese: '厂家限值' }] },
    ],
  },
  {
    id: 4, kind: '故障维修', title: '频繁启停、自动跳闸',
    causeCn: '需结合跳闸代码检查控制逻辑、压力波动、止回阀、液位和电气保护，禁止反复强制复位。',
    lines: [
      { id: 1, speaker: 'A', en: 'The chilled water pump is cycling frequently and has tripped several times.', cn: '冷冻水泵频繁启停，并已多次跳闸。', phrases: [{ text: 'cycling frequently', chinese: '频繁启停' }, { text: 'tripped several times', chinese: '多次跳闸' }] },
      { id: 2, speaker: 'B', en: 'Record the trip code and do not reset it repeatedly. The cause may be hydraulic, control-related or electrical.', cn: '记录跳闸代码，不要反复复位。原因可能来自水力系统、控制系统或电气系统。', phrases: [{ text: 'record the trip code', chinese: '记录跳闸代码' }, { text: 'do not reset it repeatedly', chinese: '不要反复复位' }] },
      { id: 3, speaker: 'A', en: 'What should we inspect first?', cn: '我们应该先检查什么？', phrases: [{ text: 'inspect first', chinese: '首先检查' }] },
      { id: 4, speaker: 'B', en: 'Review the event log, suction and discharge pressures, tank level, check-valve operation, control setpoints and electrical protection status.', cn: '检查事件记录、吸入与排出压力、水箱液位、止回阀动作、控制设定值和电气保护状态。', phrases: [{ text: 'event log', chinese: '事件记录' }, { text: 'check-valve operation', chinese: '止回阀动作' }, { text: 'electrical protection status', chinese: '电气保护状态' }] },
    ],
  },
  {
    id: 5, kind: '故障维修', title: '电机过载、电流超标',
    causeCn: '需排查电源不平衡、机械卡涩、叶轮污染、对中、轴承和运行点，不能只根据过滤器堵塞下结论。',
    lines: [
      { id: 1, speaker: 'A', en: 'The motor overload alarm is active, and the operating current is above the rated value.', cn: '电机过载告警已触发，运行电流高于额定值。', phrases: [{ text: 'motor overload alarm', chinese: '电机过载告警' }, { text: 'rated value', chinese: '额定值' }] },
      { id: 2, speaker: 'B', en: 'Stop and isolate the pump in accordance with the approved procedure. Do not reset the overload protection until the cause has been identified.', cn: '按照批准的程序停泵并隔离。在查明原因之前，不要复位过载保护。', phrases: [{ text: 'stop and isolate', chinese: '停机并隔离' }, { text: 'overload protection', chinese: '过载保护' }, { text: 'cause has been identified', chinese: '原因已经查明' }] },
      { id: 3, speaker: 'A', en: 'Which checks are required?', cn: '需要进行哪些检查？', phrases: [{ text: 'checks are required', chinese: '需要进行的检查' }] },
      { id: 4, speaker: 'B', en: 'Check phase current and voltage, insulation condition, bearings, alignment, shaft rotation, impeller condition, valves and the actual operating point.', cn: '检查各相电流和电压、绝缘状态、轴承、对中、轴转动、叶轮、阀门以及实际运行点。', phrases: [{ text: 'phase current and voltage', chinese: '各相电流和电压' }, { text: 'shaft rotation', chinese: '轴转动情况' }, { text: 'operating point', chinese: '运行点' }] },
    ],
  },
  {
    id: 6, kind: '故障维修', title: '机械密封渗漏',
    causeCn: '可能与密封磨损、干运转、轴偏心、振动或压力异常有关，应根据泄漏程度采取隔离措施。',
    lines: [
      { id: 1, speaker: 'A', en: 'Water is leaking from the mechanical seal, and the leakage rate is increasing.', cn: '机械密封处正在漏水，泄漏量逐渐增加。', phrases: [{ text: 'mechanical seal', chinese: '机械密封' }, { text: 'leakage rate', chinese: '泄漏速率；泄漏量' }] },
      { id: 2, speaker: 'B', en: 'Assess the leak and protect nearby electrical equipment. Seal wear, dry running, misalignment, vibration or abnormal pressure may be involved.', cn: '评估泄漏并保护附近电气设备。可能涉及密封磨损、干运转、对中不良、振动或压力异常。', phrases: [{ text: 'assess the leak', chinese: '评估泄漏' }, { text: 'nearby electrical equipment', chinese: '附近电气设备' }, { text: 'dry running', chinese: '干运转' }] },
      { id: 3, speaker: 'A', en: 'Can the seal be repaired on-site?', cn: '密封可以在现场修复吗？', phrases: [{ text: 'repaired on-site', chinese: '在现场修复' }] },
      { id: 4, speaker: 'B', en: 'Isolate and depressurise the pump before inspection. Repair or replace the seal components in accordance with the manufacturer procedure, then perform a controlled leak test.', cn: '检查前先隔离水泵并泄压。按照厂家程序维修或更换密封部件，然后进行受控泄漏测试。', phrases: [{ text: 'isolate and depressurise', chinese: '隔离并泄压' }, { text: 'seal components', chinese: '密封部件' }, { text: 'controlled leak test', chinese: '受控泄漏测试' }] },
    ],
  },
  {
    id: 7, kind: '故障维修', title: '远程控制失效、仅本地可用',
    causeCn: '应依次检查就地/远程选择、联锁、模块供电、网络或RS-485通信状态，不能先认定线路松动。',
    lines: [
      { id: 1, speaker: 'A', en: 'The pump cannot be started or stopped remotely, but local control is still available.', cn: '水泵无法远程启停，但本地控制仍然可用。', phrases: [{ text: 'started or stopped remotely', chinese: '远程启停' }, { text: 'local control', chinese: '本地控制' }] },
      { id: 2, speaker: 'B', en: 'Check the local-remote selector, permissives and interlocks, module power supply and communication status before touching the wiring.', cn: '接触线路之前，先检查就地/远程选择开关、允许条件和联锁、模块电源及通信状态。', phrases: [{ text: 'local-remote selector', chinese: '就地/远程选择开关' }, { text: 'permissives and interlocks', chinese: '允许条件和联锁' }, { text: 'communication status', chinese: '通信状态' }] },
      { id: 3, speaker: 'A', en: 'What if the RS-485 connection is loose?', cn: '如果RS-485连接松动怎么办？', phrases: [{ text: 'RS-485 connection', chinese: 'RS-485连接' }] },
      { id: 4, speaker: 'B', en: 'Use the approved electrical isolation procedure before tightening or reconnecting conductors. Restore the network settings and complete a local and remote functional test.', cn: '紧固或重新连接导线之前，应执行批准的电气隔离程序。恢复网络设置后，完成本地和远程功能测试。', phrases: [{ text: 'electrical isolation procedure', chinese: '电气隔离程序' }, { text: 'reconnecting conductors', chinese: '重新连接导线' }, { text: 'functional test', chinese: '功能测试' }] },
    ],
  },
  {
    id: 8, kind: '故障维修', title: '低频运行振动超标',
    causeCn: '可能原因包括共振、对中不良、基础松动、减振件老化、水力不平衡或轴承问题。',
    lines: [
      { id: 1, speaker: 'A', en: 'The pump vibration increases significantly at low speed.', cn: '水泵在低速运行时振动明显增大。', phrases: [{ text: 'vibration increases significantly', chinese: '振动明显增大' }, { text: 'at low speed', chinese: '在低速时' }] },
      { id: 2, speaker: 'B', en: 'This may be a resonance or mechanical condition. We need vibration readings across the speed range before identifying the cause.', cn: '这可能是共振或机械问题。在确定原因前，需要测量整个转速范围内的振动。', phrases: [{ text: 'resonance or mechanical condition', chinese: '共振或机械问题' }, { text: 'across the speed range', chinese: '整个转速范围内' }] },
      { id: 3, speaker: 'A', en: 'Can we tighten the anchor bolts while the pump is running?', cn: '可以在水泵运行时紧固地脚螺栓吗？', phrases: [{ text: 'tighten the anchor bolts', chinese: '紧固地脚螺栓' }, { text: 'while the pump is running', chinese: '水泵运行期间' }] },
      { id: 4, speaker: 'B', en: 'No. Stop and isolate the pump first. Then inspect alignment, the base, anchor bolts, vibration isolators, bearings and hydraulic conditions.', cn: '不可以。应先停泵并隔离，然后检查对中、基础、地脚螺栓、减振器、轴承和水力状况。', phrases: [{ text: 'stop and isolate the pump', chinese: '停泵并隔离' }, { text: 'vibration isolators', chinese: '减振器' }, { text: 'hydraulic conditions', chinese: '水力状况' }] },
    ],
  },
  {
    id: 9, kind: '故障维修', title: '出口压力不足、扬程偏低',
    causeCn: '需检查转速、吸入条件、阀门、过滤器、积气、叶轮磨损和仪表准确性。',
    lines: [
      { id: 1, speaker: 'A', en: 'The pump discharge pressure and flow are below the expected values.', cn: '水泵出口压力和流量低于预期值。', phrases: [{ text: 'discharge pressure and flow', chinese: '出口压力和流量' }, { text: 'below the expected values', chinese: '低于预期值' }] },
      { id: 2, speaker: 'B', en: 'Check speed, suction pressure, valve positions, strainer differential pressure, trapped air, impeller condition and instrument accuracy.', cn: '检查转速、吸入压力、阀门位置、过滤器压差、积气、叶轮状况和仪表准确性。', phrases: [{ text: 'strainer differential pressure', chinese: '过滤器压差' }, { text: 'instrument accuracy', chinese: '仪表准确性' }] },
      { id: 3, speaker: 'A', en: 'Should we use chemical cleaning?', cn: '需要进行化学清洗吗？', phrases: [{ text: 'chemical cleaning', chinese: '化学清洗' }] },
      { id: 4, speaker: 'B', en: 'Only after confirming fouling and obtaining an approved method statement. Verify chemical compatibility, concentration, exposure time, flushing and waste-disposal requirements.', cn: '只有确认结垢并取得批准的作业方案后才能实施。必须核实药剂兼容性、浓度、接触时间、冲洗和废液处置要求。', phrases: [{ text: 'approved method statement', chinese: '批准的作业方案' }, { text: 'chemical compatibility', chinese: '药剂兼容性' }, { text: 'waste-disposal requirements', chinese: '废液处置要求' }] },
    ],
  },
  {
    id: 10, kind: '故障维修', title: '电机过热停机',
    causeCn: '可能与冷却风道、风扇、负载、电源质量、轴承、环境温度或测温元件有关。',
    lines: [
      { id: 1, speaker: 'A', en: 'The pump stopped on a motor overtemperature alarm.', cn: '水泵因电机超温告警而停机。', phrases: [{ text: 'motor overtemperature alarm', chinese: '电机超温告警' }, { text: 'stopped on', chinese: '因……而停机' }] },
      { id: 2, speaker: 'B', en: 'Keep it stopped and review the alarm history, current, voltage, cooling fan, air path, bearings and temperature sensor.', cn: '保持停机状态，并检查告警历史、电流、电压、冷却风扇、风道、轴承和温度传感器。', phrases: [{ text: 'keep it stopped', chinese: '保持停机' }, { text: 'alarm history', chinese: '告警历史' }, { text: 'air path', chinese: '风道' }] },
      { id: 3, speaker: 'A', en: 'Can we restart after cleaning the fan?', cn: '清理风扇后可以重启吗？', phrases: [{ text: 'restart after cleaning', chinese: '清理后重启' }] },
      { id: 4, speaker: 'B', en: 'Restart only after the cause has been cleared, the motor has cooled, insulation and mechanical checks are acceptable, and the approved return-to-service procedure has been completed.', cn: '只有在原因消除、电机冷却、绝缘和机械检查合格，并完成批准的恢复运行程序后，才能重启。', phrases: [{ text: 'cause has been cleared', chinese: '原因已经消除' }, { text: 'return-to-service procedure', chinese: '恢复运行程序' }] },
    ],
  },
  {
    id: 11, kind: '日常巡检', title: '轻微异响、参数正常',
    causeCn: '轻微异响不能直接认定为正常磨损，应记录基线并检查声音、振动和温度趋势。',
    lines: [
      { id: 1, speaker: 'A', en: 'Pressure and flow are normal, but I can hear a slight unusual noise.', cn: '压力和流量正常，但我听到轻微异响。', phrases: [{ text: 'slight unusual noise', chinese: '轻微异响' }] },
      { id: 2, speaker: 'B', en: 'Do not classify it as normal without checking. Record the location, sound character, load, vibration and bearing temperature.', cn: '未经检查不要将其归类为正常。记录声音位置、特征、负载、振动和轴承温度。', phrases: [{ text: 'classify it as normal', chinese: '将其归类为正常' }, { text: 'sound character', chinese: '声音特征' }] },
      { id: 3, speaker: 'A', en: 'Should we add grease now?', cn: '现在需要补充润滑脂吗？', phrases: [{ text: 'add grease', chinese: '补充润滑脂' }] },
      { id: 4, speaker: 'B', en: 'Only if the lubrication schedule and manufacturer instructions require it. Over-greasing can also damage the bearing.', cn: '只有润滑计划和厂家说明要求时才补充。过量加脂也会损坏轴承。', phrases: [{ text: 'lubrication schedule', chinese: '润滑计划' }, { text: 'over-greasing', chinese: '过量加脂' }] },
    ],
  },
  {
    id: 12, kind: '日常巡检', title: '压力参数小幅漂移',
    causeCn: '先用参考仪表确认偏差，不能仅凭后台趋势直接在线校准。',
    lines: [
      { id: 1, speaker: 'A', en: 'The pump pressure reading shows a small drift, while the operating condition remains stable.', cn: '水泵压力读数出现小幅漂移，但运行工况仍然稳定。', phrases: [{ text: 'shows a small drift', chinese: '出现小幅漂移' }, { text: 'operating condition remains stable', chinese: '运行工况保持稳定' }] },
      { id: 2, speaker: 'B', en: 'First compare it with a calibrated reference instrument and check the signal loop.', cn: '先与经过校准的参考仪表比较，并检查信号回路。', phrases: [{ text: 'calibrated reference instrument', chinese: '经过校准的参考仪表' }, { text: 'signal loop', chinese: '信号回路' }] },
      { id: 3, speaker: 'A', en: 'Can we calibrate it online?', cn: '可以在线校准吗？', phrases: [{ text: 'calibrate it online', chinese: '在线校准' }] },
      { id: 4, speaker: 'B', en: 'Only under an approved calibration procedure and after confirming that the adjustment will not disrupt automatic control or alarms.', cn: '只有在批准的校准程序下，并确认调整不会干扰自动控制或告警后，才可以进行。', phrases: [{ text: 'approved calibration procedure', chinese: '批准的校准程序' }, { text: 'disrupt automatic control', chinese: '干扰自动控制' }] },
    ],
  },
  {
    id: 13, kind: '日常巡检', title: '电机和泵体表面积尘',
    causeCn: '表面积尘可能影响散热，应采用不会把灰尘吹入设备的清洁方法。',
    lines: [
      { id: 1, speaker: 'A', en: 'There is light dust accumulation on the motor and pump casing.', cn: '电机和泵体外壳表面有少量积尘。', phrases: [{ text: 'light dust accumulation', chinese: '少量积尘' }, { text: 'pump casing', chinese: '泵体外壳' }] },
      { id: 2, speaker: 'B', en: 'Check that the ventilation openings are clear and that there is no oil or water contamination.', cn: '检查通风口是否畅通，并确认没有油污或水污染。', phrases: [{ text: 'ventilation openings', chinese: '通风口' }, { text: 'oil or water contamination', chinese: '油污或水污染' }] },
      { id: 3, speaker: 'A', en: 'Should we clean it during this inspection?', cn: '本次巡检需要清洁吗？', phrases: [{ text: 'during this inspection', chinese: '本次巡检期间' }] },
      { id: 4, speaker: 'B', en: 'Use an approved vacuum or lint-free method. Do not blow dust into the motor, and isolate the equipment before removing any guard.', cn: '使用批准的吸尘或无绒清洁方法。不要把灰尘吹入电机；拆除任何防护罩之前必须隔离设备。', phrases: [{ text: 'lint-free method', chinese: '无绒清洁方法' }, { text: 'removing any guard', chinese: '拆除任何防护罩' }] },
    ],
  },
  {
    id: 14, kind: '日常巡检', title: '地脚螺栓轻微松动',
    causeCn: '禁止在设备运行时紧固旋转设备基础连接件，应停机隔离后按规定扭矩处理。',
    lines: [
      { id: 1, speaker: 'A', en: 'One of the pump anchor bolts appears to be loose.', cn: '一个水泵地脚螺栓看起来有松动。', phrases: [{ text: 'pump anchor bolts', chinese: '水泵地脚螺栓' }, { text: 'appears to be loose', chinese: '看起来松动' }] },
      { id: 2, speaker: 'B', en: 'Check the vibration reading and condition of the base, but do not tighten it while the pump is running.', cn: '检查振动读数和基础状况，但不要在水泵运行时紧固。', phrases: [{ text: 'condition of the base', chinese: '基础状况' }, { text: 'while the pump is running', chinese: '水泵运行期间' }] },
      { id: 3, speaker: 'A', en: 'Does the pump need to be stopped?', cn: '需要停泵吗？', phrases: [{ text: 'need to be stopped', chinese: '需要停机' }] },
      { id: 4, speaker: 'B', en: 'Yes. Use the approved isolation and LOTO procedure, inspect all anchor points, and tighten them to the specified torque.', cn: '需要。执行批准的隔离和LOTO程序，检查所有锚固点，并按规定扭矩紧固。', phrases: [{ text: 'isolation and LOTO procedure', chinese: '隔离和上锁挂牌程序' }, { text: 'specified torque', chinese: '规定扭矩' }] },
    ],
  },
  {
    id: 15, kind: '日常巡检', title: '管道保温层轻微破损',
    causeCn: '破损的保温和防潮层可能造成结露、腐蚀和滴水风险，应使用兼容材料完整修复。',
    lines: [
      { id: 1, speaker: 'A', en: 'The insulation on the pump inlet pipe is slightly damaged.', cn: '水泵入口管道的保温层有轻微破损。', phrases: [{ text: 'pump inlet pipe', chinese: '水泵入口管道' }, { text: 'slightly damaged', chinese: '轻微破损' }] },
      { id: 2, speaker: 'B', en: 'Check for condensation, wet insulation, corrosion and water dripping near electrical equipment.', cn: '检查是否存在结露、保温材料受潮、腐蚀以及电气设备附近滴水。', phrases: [{ text: 'wet insulation', chinese: '受潮的保温材料' }, { text: 'water dripping', chinese: '滴水' }] },
      { id: 3, speaker: 'A', en: 'How should we repair it?', cn: '应该怎样修复？', phrases: [{ text: 'repair it', chinese: '修复它' }] },
      { id: 4, speaker: 'B', en: 'Use compatible closed-cell insulation and restore the vapour barrier completely. Record the defect and inspect the repair again.', cn: '使用兼容的闭孔保温材料，并完整恢复防潮层。记录缺陷并再次检查修复部位。', phrases: [{ text: 'closed-cell insulation', chinese: '闭孔保温材料' }, { text: 'restore the vapour barrier', chinese: '恢复防潮层' }] },
    ],
  },
  {
    id: 16, kind: '日常巡检', title: '变频运行参数需要优化',
    causeCn: '节能调整必须同时满足最小流量、压差、温度、稳定性和冗余要求，并通过变更审批。',
    lines: [
      { id: 1, speaker: 'A', en: 'The cooling load has decreased, and the pump may be operating at a higher speed than necessary.', cn: '冷负荷已经下降，水泵转速可能高于实际需要。', phrases: [{ text: 'cooling load has decreased', chinese: '冷负荷已经下降' }, { text: 'higher speed than necessary', chinese: '转速高于实际需要' }] },
      { id: 2, speaker: 'B', en: 'Review differential pressure, minimum flow, valve positions, temperature performance and redundancy before changing the setpoint.', cn: '修改设定值之前，应检查压差、最小流量、阀门位置、温度表现和冗余。', phrases: [{ text: 'differential pressure', chinese: '压差' }, { text: 'minimum flow', chinese: '最小流量' }, { text: 'changing the setpoint', chinese: '修改设定值' }] },
      { id: 3, speaker: 'A', en: 'Can we reduce the frequency online?', cn: '可以在线降低频率吗？', phrases: [{ text: 'reduce the frequency online', chinese: '在线降低频率' }] },
      { id: 4, speaker: 'B', en: 'Only through an approved change and test plan, with defined limits, monitoring and a rollback method.', cn: '只有通过批准的变更和测试计划，并设定明确限值、监控措施和回退方法后，才可以调整。', phrases: [{ text: 'approved change and test plan', chinese: '批准的变更和测试计划' }, { text: 'rollback method', chinese: '回退方法' }] },
    ],
  },
  {
    id: 17, kind: '日常巡检', title: '接线端子轻微氧化',
    causeCn: '正常温度不能排除连接电阻风险；禁止带电打磨、涂膏或紧固端子。',
    lines: [
      { id: 1, speaker: 'A', en: 'Infrared inspection shows normal temperature, but there are slight oxidation marks on the motor terminals.', cn: '红外检查显示温度正常，但电机端子有轻微氧化痕迹。', phrases: [{ text: 'infrared inspection', chinese: '红外检查' }, { text: 'oxidation marks', chinese: '氧化痕迹' }, { text: 'motor terminals', chinese: '电机端子' }] },
      { id: 2, speaker: 'B', en: 'Record the condition and compare phases and previous trends. Normal temperature does not by itself prove that the connection is healthy.', cn: '记录状况，并比较各相和历史趋势。温度正常本身不能证明连接健康。', phrases: [{ text: 'compare phases', chinese: '比较各相' }, { text: 'previous trends', chinese: '历史趋势' }, { text: 'connection is healthy', chinese: '连接状态健康' }] },
      { id: 3, speaker: 'A', en: 'Should we clean the terminals now?', cn: '现在需要清洁端子吗？', phrases: [{ text: 'clean the terminals', chinese: '清洁端子' }] },
      { id: 4, speaker: 'B', en: 'Not while energised. Plan an outage, isolate and prove dead, then inspect, clean and torque the terminals in accordance with the approved procedure.', cn: '带电时不能处理。应安排停电，隔离并验电确认无电，然后按照批准的程序检查、清洁并紧固端子。', phrases: [{ text: 'not while energised', chinese: '带电时不能处理' }, { text: 'isolate and prove dead', chinese: '隔离并验电确认无电' }, { text: 'torque the terminals', chinese: '按扭矩紧固端子' }] },
    ],
  },
  {
    id: 18, kind: '日常巡检', title: '备用泵长期未轮换',
    causeCn: '备用泵应按批准的轮换计划在正确阀门状态和充水条件下试运，禁止无水空载运行。',
    lines: [
      { id: 1, speaker: 'A', en: 'The standby pump has not been rotated within the required interval.', cn: '备用泵没有在规定周期内进行轮换。', phrases: [{ text: 'standby pump', chinese: '备用泵' }, { text: 'required interval', chinese: '规定周期' }] },
      { id: 2, speaker: 'B', en: 'Review the rotation schedule and confirm that the duty pump and system redundancy will not be affected.', cn: '检查轮换计划，并确认不会影响运行泵和系统冗余。', phrases: [{ text: 'rotation schedule', chinese: '轮换计划' }, { text: 'duty pump', chinese: '运行泵；主用泵' }, { text: 'system redundancy', chinese: '系统冗余' }] },
      { id: 3, speaker: 'A', en: 'Should we perform a no-load test?', cn: '需要进行空载试验吗？', phrases: [{ text: 'no-load test', chinese: '空载试验' }] },
      { id: 4, speaker: 'B', en: 'Do not run the pump dry. Use the approved valve lineup, confirm that the pump is flooded and vented, then perform a controlled rotation test and record the results.', cn: '不要让水泵干运转。按照批准的阀门状态，确认水泵已充水并排气，然后进行受控轮换试验并记录结果。', phrases: [{ text: 'do not run the pump dry', chinese: '不要让水泵干运转' }, { text: 'flooded and vented', chinese: '已充水并排气' }, { text: 'controlled rotation test', chinese: '受控轮换试验' }] },
    ],
  },
  {
    id: 19, kind: '日常巡检', title: '压力表读数响应滞后',
    causeCn: '可能与导压管积气、阻塞、脉动阻尼或仪表问题有关；禁止未经隔离进行带压排放。',
    lines: [
      { id: 1, speaker: 'A', en: 'The local pressure gauge is responding more slowly than the control-system reading.', cn: '现场压力表的响应比控制系统读数慢。', phrases: [{ text: 'local pressure gauge', chinese: '现场压力表' }, { text: 'control-system reading', chinese: '控制系统读数' }] },
      { id: 2, speaker: 'B', en: 'Possible causes include trapped air, a blocked impulse line, damping or a faulty gauge. Verify the readings with a calibrated instrument.', cn: '可能原因包括积气、导压管堵塞、阻尼或压力表故障。使用校准仪表验证读数。', phrases: [{ text: 'blocked impulse line', chinese: '导压管堵塞' }, { text: 'faulty gauge', chinese: '故障压力表' }, { text: 'calibrated instrument', chinese: '校准仪表' }] },
      { id: 3, speaker: 'A', en: 'Can we vent the impulse line now?', cn: '现在可以给导压管排气吗？', phrases: [{ text: 'vent the impulse line', chinese: '给导压管排气' }] },
      { id: 4, speaker: 'B', en: 'Only under an approved procedure. Isolate and depressurise the relevant section, use the designed vent point, control the discharge and wear the required PPE.', cn: '只有按照批准的程序才可以。隔离相关管段并泄压，使用设计排气点，控制排放并佩戴规定的个人防护用品。', phrases: [{ text: 'isolate and depressurise', chinese: '隔离并泄压' }, { text: 'designed vent point', chinese: '设计排气点' }, { text: 'required PPE', chinese: '规定的个人防护用品' }] },
    ],
  },
  {
    id: 20, kind: '日常巡检', title: '运行噪声高于历史基线',
    causeCn: '噪声升高不能直接归因于正常磨损，应结合声级、振动、温度和运行点趋势判断。',
    lines: [
      { id: 1, speaker: 'A', en: 'The pump noise level is slightly above the historical baseline, although the operating condition appears stable.', cn: '水泵噪声水平略高于历史基线，但运行工况看起来稳定。', phrases: [{ text: 'historical baseline', chinese: '历史基线' }, { text: 'appears stable', chinese: '看起来稳定' }] },
      { id: 2, speaker: 'B', en: 'Record the sound level, vibration, bearing temperature, speed and load. Do not assume that the increase is normal wear.', cn: '记录声级、振动、轴承温度、转速和负载。不要认定噪声升高只是正常磨损。', phrases: [{ text: 'record the sound level', chinese: '记录声级' }, { text: 'normal wear', chinese: '正常磨损' }] },
      { id: 3, speaker: 'A', en: 'When should we escalate the issue?', cn: '什么时候需要升级处理？', phrases: [{ text: 'escalate the issue', chinese: '升级处理该问题' }] },
      { id: 4, speaker: 'B', en: 'Escalate it if the trend continues to rise, limits are exceeded, or vibration, temperature, leakage or performance also deteriorates.', cn: '如果趋势持续上升、超过限值，或振动、温度、泄漏、性能同时恶化，就应升级处理。', phrases: [{ text: 'trend continues to rise', chinese: '趋势持续上升' }, { text: 'limits are exceeded', chinese: '超过限值' }, { text: 'performance also deteriorates', chinese: '性能也随之恶化' }] },
    ],
  },
];
