export interface AlarmSummaryEntry {
  id: number;
  category: string;
  alarm: string;
}

export const ALARM_SUMMARY: AlarmSummaryEntry[] = [
  {
    "id": 1,
    "category": "High Voltage System",
    "alarm": "HV Power Supply Interruption"
  },
  {
    "id": 2,
    "category": "High Voltage System",
    "alarm": "HV Switchgear Trip"
  },
  {
    "id": 3,
    "category": "High Voltage System",
    "alarm": "HV Overcurrent Protection Activated"
  },
  {
    "id": 4,
    "category": "High Voltage System",
    "alarm": "HV Overvoltage Protection Activated"
  },
  {
    "id": 5,
    "category": "High Voltage System",
    "alarm": "HV Undervoltage Protection Activated"
  },
  {
    "id": 6,
    "category": "High Voltage System",
    "alarm": "HV Earth Fault Protection Activated"
  },
  {
    "id": 7,
    "category": "High Voltage System",
    "alarm": "HV Spring Not Charged"
  },
  {
    "id": 8,
    "category": "High Voltage System",
    "alarm": "HV Cabinet Door Open Trip"
  },
  {
    "id": 9,
    "category": "High Voltage System",
    "alarm": "HV Equipment Communication Interruption"
  },
  {
    "id": 10,
    "category": "High Voltage System",
    "alarm": "HV Incoming Voltage Abnormal Fluctuation"
  },
  {
    "id": 11,
    "category": "Transformer",
    "alarm": "Transformer Winding High Temperature"
  },
  {
    "id": 12,
    "category": "Transformer",
    "alarm": "Transformer Fan Failure"
  },
  {
    "id": 13,
    "category": "Transformer",
    "alarm": "Transformer Overtemperature Trip"
  },
  {
    "id": 14,
    "category": "Transformer",
    "alarm": "Transformer Cabinet Door Open Trip"
  },
  {
    "id": 15,
    "category": "Transformer",
    "alarm": "Transformer Equipment Communication Interruption"
  },
  {
    "id": 16,
    "category": "Low Voltage Distribution",
    "alarm": "LV Cabinet Power Supply Interruption"
  },
  {
    "id": 17,
    "category": "Low Voltage Distribution",
    "alarm": "LV Cabinet Fault Trip"
  },
  {
    "id": 18,
    "category": "Low Voltage Distribution",
    "alarm": "LV Bus Tie Closed (Supplying)"
  },
  {
    "id": 19,
    "category": "Low Voltage Distribution",
    "alarm": "LV Distribution Equipment Communication Interruption"
  },
  {
    "id": 20,
    "category": "Low Voltage Distribution",
    "alarm": "PDU/RDU Input Switch Fault / Open"
  },
  {
    "id": 21,
    "category": "Low Voltage Distribution",
    "alarm": "PDU/RDU Current Imbalance / Sudden Drop"
  },
  {
    "id": 22,
    "category": "Low Voltage Distribution",
    "alarm": "RDU Common Comprehensive Fault Alarm"
  },
  {
    "id": 23,
    "category": "Diesel Generator",
    "alarm": "Generator Start"
  },
  {
    "id": 24,
    "category": "Diesel Generator",
    "alarm": "Generator Start Failure"
  },
  {
    "id": 25,
    "category": "Diesel Generator",
    "alarm": "Generator Shutdown (Emergency Stop)"
  },
  {
    "id": 26,
    "category": "Diesel Generator",
    "alarm": "Generator Coolant High Temperature"
  },
  {
    "id": 27,
    "category": "Diesel Generator",
    "alarm": "Generator Coolant Low Temperature"
  },
  {
    "id": 28,
    "category": "Diesel Generator",
    "alarm": "Generator Low Oil Pressure"
  },
  {
    "id": 29,
    "category": "Diesel Generator",
    "alarm": "Generator Low Fuel Level"
  },
  {
    "id": 30,
    "category": "Diesel Generator",
    "alarm": "Generator Overspeed"
  },
  {
    "id": 31,
    "category": "Diesel Generator",
    "alarm": "Generator Overload Protection"
  },
  {
    "id": 32,
    "category": "Diesel Generator",
    "alarm": "Generator Overcurrent Protection"
  },
  {
    "id": 33,
    "category": "Diesel Generator",
    "alarm": "Generator Short Circuit Protection"
  },
  {
    "id": 34,
    "category": "Diesel Generator",
    "alarm": "Generator Earth Fault"
  },
  {
    "id": 35,
    "category": "Diesel Generator",
    "alarm": "Generator Manual Mode"
  },
  {
    "id": 36,
    "category": "Diesel Generator",
    "alarm": "Generator High Temp Shutdown"
  },
  {
    "id": 37,
    "category": "Diesel Generator",
    "alarm": "Generator Battery Voltage Abnormal"
  },
  {
    "id": 38,
    "category": "Diesel Generator",
    "alarm": "Generator Charger Failure"
  },
  {
    "id": 39,
    "category": "Diesel Generator",
    "alarm": "Generator Synchronization Failure"
  },
  {
    "id": 40,
    "category": "Diesel Generator",
    "alarm": "Generator Equipment Communication Interruption"
  },
  {
    "id": 41,
    "category": "Fuel Storage / Day Tank",
    "alarm": "High Fuel Level Alarm"
  },
  {
    "id": 42,
    "category": "Fuel Storage / Day Tank",
    "alarm": "Low Fuel Level Alarm"
  },
  {
    "id": 43,
    "category": "Fuel Storage / Day Tank",
    "alarm": "Fuel Storage Equipment Communication Interruption"
  },
  {
    "id": 44,
    "category": "UPS System",
    "alarm": "UPS Input Low Voltage"
  },
  {
    "id": 45,
    "category": "UPS System",
    "alarm": "UPS Input High Voltage"
  },
  {
    "id": 46,
    "category": "UPS System",
    "alarm": "UPS Output Voltage Abnormal"
  },
  {
    "id": 47,
    "category": "UPS System",
    "alarm": "UPS Battery Discharge"
  },
  {
    "id": 48,
    "category": "UPS System",
    "alarm": "UPS Battery Switch Open"
  },
  {
    "id": 49,
    "category": "UPS System",
    "alarm": "UPS Battery Voltage Abnormal"
  },
  {
    "id": 50,
    "category": "UPS System",
    "alarm": "UPS Rectifier Failure"
  },
  {
    "id": 51,
    "category": "UPS System",
    "alarm": "UPS Inverter Failure"
  },
  {
    "id": 52,
    "category": "UPS System",
    "alarm": "UPS Charger Failure"
  },
  {
    "id": 53,
    "category": "UPS System",
    "alarm": "UPS Fan Failure"
  },
  {
    "id": 54,
    "category": "UPS System",
    "alarm": "UPS Static Bypass Switch Failure"
  },
  {
    "id": 55,
    "category": "UPS System",
    "alarm": "UPS Bypass Supply Mode"
  },
  {
    "id": 56,
    "category": "UPS System",
    "alarm": "UPS Ambient High Temperature"
  },
  {
    "id": 57,
    "category": "UPS System",
    "alarm": "UPS Output Overload"
  },
  {
    "id": 58,
    "category": "UPS System",
    "alarm": "UPS Battery Missing Alarm"
  },
  {
    "id": 59,
    "category": "UPS System",
    "alarm": "UPS Module Internal Fault"
  },
  {
    "id": 60,
    "category": "UPS System",
    "alarm": "UPS Input/Output/Bypass Cabinet Power Interruption"
  },
  {
    "id": 61,
    "category": "UPS System",
    "alarm": "UPS Cabinet Fault Trip"
  },
  {
    "id": 62,
    "category": "UPS System",
    "alarm": "UPS Equipment Communication Interruption"
  },
  {
    "id": 63,
    "category": "Battery Pack",
    "alarm": "Battery Cell Voltage Abnormal"
  },
  {
    "id": 64,
    "category": "Battery Pack",
    "alarm": "Battery Cell Temperature Abnormal"
  },
  {
    "id": 65,
    "category": "Battery Pack",
    "alarm": "Battery Fuse Failure"
  },
  {
    "id": 66,
    "category": "Battery Pack",
    "alarm": "Battery Breaker/Contactor Abnormal"
  },
  {
    "id": 67,
    "category": "Battery Pack",
    "alarm": "Battery Overvoltage Protection"
  },
  {
    "id": 68,
    "category": "Battery Pack",
    "alarm": "Battery Undervoltage Protection"
  },
  {
    "id": 69,
    "category": "Battery Pack",
    "alarm": "Battery Charge/Discharge Current Overlimit"
  },
  {
    "id": 70,
    "category": "Battery Pack",
    "alarm": "Battery Sampling Fault (Voltage/Temperature)"
  },
  {
    "id": 71,
    "category": "Battery Pack",
    "alarm": "Battery Internal Temperature Difference Large"
  },
  {
    "id": 72,
    "category": "Battery Pack",
    "alarm": "Battery Pack Configuration Quantity Error"
  },
  {
    "id": 73,
    "category": "Battery Pack",
    "alarm": "Battery Auxiliary Power Alarm"
  },
  {
    "id": 74,
    "category": "Battery Pack",
    "alarm": "Battery Rack Status Alarm"
  },
  {
    "id": 75,
    "category": "Battery Pack",
    "alarm": "Battery Communication Alarm"
  },
  {
    "id": 76,
    "category": "Battery Pack",
    "alarm": "Battery Pack Communication Interruption"
  },
  {
    "id": 77,
    "category": "HVDC / 48V Power Supply",
    "alarm": "HVDC Input Low Voltage"
  },
  {
    "id": 78,
    "category": "HVDC / 48V Power Supply",
    "alarm": "HVDC Output Voltage Abnormal"
  },
  {
    "id": 79,
    "category": "HVDC / 48V Power Supply",
    "alarm": "HVDC Rectifier Module Failure"
  },
  {
    "id": 80,
    "category": "HVDC / 48V Power Supply",
    "alarm": "HVDC Battery Discharge"
  },
  {
    "id": 81,
    "category": "HVDC / 48V Power Supply",
    "alarm": "HVDC Equipment Communication Interruption"
  },
  {
    "id": 82,
    "category": "HVDC / 48V Power Supply",
    "alarm": "48V Power Output Voltage Abnormal"
  },
  {
    "id": 83,
    "category": "HVDC / 48V Power Supply",
    "alarm": "48V Power Battery Discharge"
  },
  {
    "id": 84,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Water Cooled Chiller General Fault"
  },
  {
    "id": 85,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Chiller Loop Fault"
  },
  {
    "id": 86,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Chiller Safety Protection Fault"
  },
  {
    "id": 87,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Air Cooled Chiller Fault"
  },
  {
    "id": 88,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Evaporative Cooling Chiller Fault"
  },
  {
    "id": 89,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Cooling Tower Fault"
  },
  {
    "id": 90,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Cooling Tower Level Abnormal"
  },
  {
    "id": 91,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Cooling Tower Makeup Pump Failure"
  },
  {
    "id": 92,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Chilled/Condenser Water Pump Failure"
  },
  {
    "id": 93,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Pump Dry Run Alarm"
  },
  {
    "id": 94,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Pump Speed Abnormal"
  },
  {
    "id": 95,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Pressure Stabilizing Makeup Device Fault"
  },
  {
    "id": 96,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Dosing Device Fault"
  },
  {
    "id": 97,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Demineralized Water Device Fault"
  },
  {
    "id": 98,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Condenser Online Cleaning Device Fault"
  },
  {
    "id": 99,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Bypass Filter Device Fault"
  },
  {
    "id": 100,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Water Tank High/Low Level"
  },
  {
    "id": 101,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Motorized Proportional Valve Fault (Open/Close Failure)"
  },
  {
    "id": 102,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Motorized On/Off Valve Fault (Open/Close Failure)"
  },
  {
    "id": 103,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Pressure Sensor Fault"
  },
  {
    "id": 104,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Temperature Sensor Fault"
  },
  {
    "id": 105,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Flow Sensor Fault"
  },
  {
    "id": 106,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Water System pH Abnormal"
  },
  {
    "id": 107,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Conductivity Abnormal"
  },
  {
    "id": 108,
    "category": "Water System (Chiller/Pump/Valve/Tank)",
    "alarm": "Turbidity Abnormal"
  },
  {
    "id": 109,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "CDU Shutdown / General Fault"
  },
  {
    "id": 110,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Primary Side Temperature Abnormal"
  },
  {
    "id": 111,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Secondary Side Supply/Return Temperature Abnormal"
  },
  {
    "id": 112,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Primary/Secondary Side Pressure Abnormal"
  },
  {
    "id": 113,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Filter Clogging Alarm"
  },
  {
    "id": 114,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Pump Group Fault (Overload/Speed/Inlet-Outlet Pressure)"
  },
  {
    "id": 115,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Plate Heat Exchanger Fault"
  },
  {
    "id": 116,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Valve Feedback Abnormal"
  },
  {
    "id": 117,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Expansion Tank Makeup Abnormal"
  },
  {
    "id": 118,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Liquid Leakage / Water Immersion Alarm"
  },
  {
    "id": 119,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "VFD Fault"
  },
  {
    "id": 120,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Inverter Fault (Overcurrent/Overvoltage/Undervoltage/Overtemp/Phase Loss)"
  },
  {
    "id": 121,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Sensor Fault"
  },
  {
    "id": 122,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Main/Backup Power Loss"
  },
  {
    "id": 123,
    "category": "CDU (Coolant Distribution Unit)",
    "alarm": "Equipment Communication Offline / Expansion Module Comm Fault"
  },
  {
    "id": 124,
    "category": "Precision Air Conditioning",
    "alarm": "AC General System Fault"
  },
  {
    "id": 125,
    "category": "Precision Air Conditioning",
    "alarm": "Fan Failure"
  },
  {
    "id": 126,
    "category": "Precision Air Conditioning",
    "alarm": "Compressor Failure"
  },
  {
    "id": 127,
    "category": "Precision Air Conditioning",
    "alarm": "Water Valve Failure"
  },
  {
    "id": 128,
    "category": "Precision Air Conditioning",
    "alarm": "Filter Clogging"
  },
  {
    "id": 129,
    "category": "Precision Air Conditioning",
    "alarm": "Supply/Return Air Temperature Abnormal"
  },
  {
    "id": 130,
    "category": "Precision Air Conditioning",
    "alarm": "Supply/Return Air Humidity Abnormal"
  },
  {
    "id": 131,
    "category": "Precision Air Conditioning",
    "alarm": "Water Leakage / Immersion Alarm"
  },
  {
    "id": 132,
    "category": "Precision Air Conditioning",
    "alarm": "Humidifier Fault (Electrode/Wet Film)"
  },
  {
    "id": 133,
    "category": "Precision Air Conditioning",
    "alarm": "Antifreeze Protection Activated"
  },
  {
    "id": 134,
    "category": "Precision Air Conditioning",
    "alarm": "High/Low Pressure Protection / Discharge Temp Protection"
  },
  {
    "id": 135,
    "category": "Precision Air Conditioning",
    "alarm": "Flow Abnormal Alarm"
  },
  {
    "id": 136,
    "category": "Precision Air Conditioning",
    "alarm": "Sensor Fault"
  },
  {
    "id": 137,
    "category": "Precision Air Conditioning",
    "alarm": "VFD Communication Fault"
  },
  {
    "id": 138,
    "category": "Precision Air Conditioning",
    "alarm": "Indoor/Outdoor Unit Communication Fault"
  },
  {
    "id": 139,
    "category": "Precision Air Conditioning",
    "alarm": "AC Main/Backup Power Loss"
  },
  {
    "id": 140,
    "category": "Precision Air Conditioning",
    "alarm": "Air Damper Fault"
  },
  {
    "id": 141,
    "category": "Precision Air Conditioning",
    "alarm": "Water Pump Failure"
  },
  {
    "id": 142,
    "category": "Precision Air Conditioning",
    "alarm": "Equipment Communication Interruption"
  },
  {
    "id": 143,
    "category": "Phase Change Cooling",
    "alarm": "Compressor Fault (High Pressure/Low Pressure/Overtemp/Overload)"
  },
  {
    "id": 144,
    "category": "Phase Change Cooling",
    "alarm": "Fan Failure"
  },
  {
    "id": 145,
    "category": "Phase Change Cooling",
    "alarm": "Refrigerant Alarm: Undercharge / Leakage"
  },
  {
    "id": 146,
    "category": "Phase Change Cooling",
    "alarm": "Pump Failure (Refrigerant Pump / Spray Pump)"
  },
  {
    "id": 147,
    "category": "Phase Change Cooling",
    "alarm": "Storage Tank Temperature/Pressure Abnormal"
  },
  {
    "id": 148,
    "category": "Phase Change Cooling",
    "alarm": "Protection Activated (Overcurrent/Overtemp)"
  },
  {
    "id": 149,
    "category": "Phase Change Cooling",
    "alarm": "Sensor Fault"
  },
  {
    "id": 150,
    "category": "Phase Change Cooling",
    "alarm": "Power Circuit Fault"
  },
  {
    "id": 151,
    "category": "Phase Change Cooling",
    "alarm": "Equipment Reset Lockout Fault"
  },
  {
    "id": 152,
    "category": "Environment / Water Leak Detection",
    "alarm": "Cold Aisle High/Low Temperature"
  },
  {
    "id": 153,
    "category": "Environment / Water Leak Detection",
    "alarm": "Cold Aisle High/Low Humidity"
  },
  {
    "id": 154,
    "category": "Environment / Water Leak Detection",
    "alarm": "Data Hall Water Leak Alarm"
  },
  {
    "id": 155,
    "category": "Environment / Water Leak Detection",
    "alarm": "Point-type Water Leak Detection Alarm"
  },
  {
    "id": 156,
    "category": "Environment / Water Leak Detection",
    "alarm": "Refrigerant Leakage Alarm"
  },
  {
    "id": 157,
    "category": "Water Source Heat Pump / Heat Exchanger",
    "alarm": "Water Source Heat Pump Fault"
  },
  {
    "id": 158,
    "category": "Water Source Heat Pump / Heat Exchanger",
    "alarm": "Heat Exchanger Unit Fault"
  },
  {
    "id": 159,
    "category": "Water Source Heat Pump / Heat Exchanger",
    "alarm": "Heat Exchanger Cold Side Pressure / Supply Temp Abnormal"
  },
  {
    "id": 160,
    "category": "Water Source Heat Pump / Heat Exchanger",
    "alarm": "Heat Exchanger Circulation Pump Failure"
  },
  {
    "id": 161,
    "category": "Others",
    "alarm": "Smoke Detector Alarm"
  },
  {
    "id": 162,
    "category": "Others",
    "alarm": "Float Level Switch Fault"
  }
];

export const ALARM_CATEGORIES = [...new Set(ALARM_SUMMARY.map((entry) => entry.category))];

