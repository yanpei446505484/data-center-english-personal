import { lookupDictionary } from '@/skills/dictionarySkill';
import { lemmatize } from '@/skills/lemmatizeSkill';
import { PUMP_WORD_IPA } from './pumpWordGlossary';

/** British-style IPA for specialist alarm vocabulary missing from the general dictionary. */
export const ALARM_WORD_IPA: Record<string, string> = {
  hv: '/ˌeɪtʃ ˈviː/', supply: '/səˈplaɪ/', interruption: '/ˌɪntəˈrʌpʃən/',
  switchgear: '/ˈswɪtʃɡɪə/', trip: '/trɪp/', overcurrent: '/ˌəʊvəˈkʌrənt/',
  protection: '/prəˈtekʃən/', activated: '/ˈæktɪveɪtɪd/', overvoltage: '/ˌəʊvəˈvəʊltɪdʒ/',
  undervoltage: '/ˌʌndəˈvəʊltɪdʒ/', earth: '/ɜːθ/', fault: '/fɔːlt/', spring: '/sprɪŋ/',
  charged: '/tʃɑːdʒd/', cabinet: '/ˈkæbɪnət/', door: '/dɔː/', communication: '/kəˌmjuːnɪˈkeɪʃən/',
  incoming: '/ˈɪnkʌmɪŋ/', fluctuation: '/ˌflʌktʃuˈeɪʃən/', transformer: '/trænsˈfɔːmə/',
  winding: '/ˈwaɪndɪŋ/', temperature: '/ˈtemprətʃə/', overtemperature: '/ˌəʊvəˈtemprətʃə/',
  lv: '/ˌel ˈviː/', bus: '/bʌs/', tie: '/taɪ/', supplying: '/səˈplaɪɪŋ/',
  distribution: '/ˌdɪstrɪˈbjuːʃən/', pdu: '/ˌpiː diː ˈjuː/', rdu: '/ˌɑː diː ˈjuː/',
  input: '/ˈɪnpʊt/', switch: '/swɪtʃ/', imbalance: '/ɪmˈbæləns/', sudden: '/ˈsʌdən/',
  drop: '/drɒp/', common: '/ˈkɒmən/', comprehensive: '/ˌkɒmprɪˈhensɪv/', generator: '/ˈdʒenəreɪtə/',
  shutdown: '/ˈʃʌtdaʊn/', coolant: '/ˈkuːlənt/', oil: '/ɔɪl/', fuel: '/ˈfjuːəl/',
  overspeed: '/ˌəʊvəˈspiːd/', overload: '/ˌəʊvəˈləʊd/', circuit: '/ˈsɜːkɪt/', mode: '/məʊd/',
  temp: '/temp/', battery: '/ˈbætəri/', charger: '/ˈtʃɑːdʒə/', synchronization: '/ˌsɪŋkrənaɪˈzeɪʃən/',
  storage: '/ˈstɔːrɪdʒ/', ups: '/ˌjuː piː ˈes/', output: '/ˈaʊtpʊt/', discharge: '/ˈdɪstʃɑːdʒ/',
  rectifier: '/ˈrektɪfaɪə/', inverter: '/ɪnˈvɜːtə/', static: '/ˈstætɪk/', bypass: '/ˈbaɪpɑːs/',
  ambient: '/ˈæmbiənt/', missing: '/ˈmɪsɪŋ/', internal: '/ɪnˈtɜːnəl/', cell: '/sel/',
  fuse: '/fjuːz/', breaker: '/ˈbreɪkə/', contactor: '/kənˈtæktə/', charge: '/tʃɑːdʒ/',
  overlimit: '/ˌəʊvəˈlɪmɪt/', sampling: '/ˈsɑːmplɪŋ/', difference: '/ˈdɪfrəns/', pack: '/pæk/',
  quantity: '/ˈkwɒntəti/', auxiliary: '/ɔːɡˈzɪliəri/', rack: '/ræk/', hvdc: '/ˌeɪtʃ viː diː ˈsiː/',
  v: '/viː/', cooled: '/kuːld/', chiller: '/ˈtʃɪlə/', loop: '/luːp/', safety: '/ˈseɪfti/',
  air: '/eə/', evaporative: '/ɪˈvæpərətɪv/', cooling: '/ˈkuːlɪŋ/', tower: '/ˈtaʊə/',
  makeup: '/ˈmeɪkʌp/', chilled: '/tʃɪld/', condenser: '/kənˈdensə/', dry: '/draɪ/',
  speed: '/spiːd/', stabilizing: '/ˈsteɪbəlaɪzɪŋ/', device: '/dɪˈvaɪs/', dosing: '/ˈdəʊsɪŋ/',
  demineralized: '/diːˈmɪnərəlaɪzd/', online: '/ˌɒnˈlaɪn/', cleaning: '/ˈkliːnɪŋ/', tank: '/tæŋk/',
  motorized: '/ˈməʊtəraɪzd/', proportional: '/prəˈpɔːʃənəl/', flow: '/fləʊ/', ph: '/ˌpiː ˈeɪtʃ/',
  conductivity: '/ˌkɒndʌkˈtɪvəti/', turbidity: '/tɜːˈbɪdəti/', cdu: '/ˌsiː diː ˈjuː/',
  primary: '/ˈpraɪməri/', secondary: '/ˈsekəndəri/', clogging: '/ˈklɒɡɪŋ/',
  'inlet-outlet': '/ˈɪnlet ˈaʊtlet/', plate: '/pleɪt/', heat: '/hiːt/', exchanger: '/ɪksˈtʃeɪndʒə/',
  feedback: '/ˈfiːdbæk/', expansion: '/ɪkˈspænʃən/', liquid: '/ˈlɪkwɪd/', leakage: '/ˈliːkɪdʒ/',
  immersion: '/ɪˈmɜːʃən/', vfd: '/ˌviː ef ˈdiː/', overtemp: '/ˌəʊvəˈtemp/', phase: '/feɪz/',
  loss: '/lɒs/', offline: '/ˌɒfˈlaɪn/', comm: '/kɒm/', ac: '/ˌeɪ ˈsiː/', compressor: '/kəmˈpresə/',
  humidity: '/hjuːˈmɪdəti/', humidifier: '/hjuːˈmɪdɪfaɪə/', electrode: '/ɪˈlektrəʊd/',
  wet: '/wet/', film: '/fɪlm/', antifreeze: '/ˈæntifriːz/', indoor: '/ˈɪndɔː/', outdoor: '/ˈaʊtdɔː/',
  unit: '/ˈjuːnɪt/', damper: '/ˈdæmpə/', refrigerant: '/rɪˈfrɪdʒərənt/', undercharge: '/ˌʌndəˈtʃɑːdʒ/',
  spray: '/spreɪ/', reset: '/ˌriːˈset/', lockout: '/ˈlɒkaʊt/', cold: '/kəʊld/', aisle: '/aɪl/',
  hall: '/hɔːl/', leak: '/liːk/', 'point-type': '/ˈpɔɪnt taɪp/', detection: '/dɪˈtekʃən/',
  source: '/sɔːs/', circulation: '/ˌsɜːkjəˈleɪʃən/', smoke: '/sməʊk/', detector: '/dɪˈtektə/', float: '/fləʊt/',
  "today's": '/təˈdeɪz/', latest: '/ˈleɪtɪst/', 'on-site': '/ˌɒn ˈsaɪt/', infrastructure: '/ˈɪnfrəstrʌktʃə/',
  outstanding: '/aʊtˈstændɪŋ/', maintenance: '/ˈmeɪntənəns/', arrangements: '/əˈreɪndʒmənts/',
  b: '/biː/', f: '/ef/', resolved: '/rɪˈzɒlvd/', related: '/rɪˈleɪtɪd/', work: '/wɜːk/',
  orders: '/ˈɔːdəz/', formally: '/ˈfɔːməli/', signed: '/saɪnd/', faulty: '/ˈfɔːlti/', meter: '/ˈmiːtə/',
  remain: '/rɪˈmeɪn/', rectification: '/ˌrektɪfɪˈkeɪʃən/', pending: '/ˈpendɪŋ/', arrival: '/əˈraɪvəl/',
  compatible: '/kəmˈpætəbəl/', replacement: '/rɪˈpleɪsmənt/', mpbc: '/ˌem piː biː ˈsiː/',
  order: '/ˈɔːdə/', raised: '/reɪzd/', dingtalk: '/ˈdɪŋtɔːk/', manufacturer: '/ˌmænjuˈfæktʃərə/',
  inspection: '/ɪnˈspekʃən/', crac: '/kræk/', attend: '/əˈtend/', site: '/saɪt/',
  property: '/ˈprɒpəti/', management: '/ˈmænɪdʒmənt/', diesel: '/ˈdiːzəl/',
  exploded: '/ɪkˈspləʊdɪd/', acid: '/ˈæsɪd/', smell: '/smel/', louver: '/ˈluːvə/',
  ventilation: '/ˌventɪˈleɪʃən/', vapour: '/ˈveɪpə/', hazardous: '/ˈhæzədəs/',
  caused: '/kɔːzd/', explode: '/ɪkˈspləʊd/', hopefully: '/ˈhəʊpfəli/',
  dissipated: '/ˈdɪsɪpeɪtɪd/', shift: '/ʃɪft/', "a's": '/eɪz/', mop: '/ˌem əʊ ˈpiː/',
  august: '/ˈɔːɡəst/', alright: '/ɔːlˈraɪt/', root: '/ruːt/', cause: '/kɔːz/',
  stated: '/ˈsteɪtɪd/', investigation: '/ɪnˌvestɪˈɡeɪʃən/', unusual: '/ʌnˈjuːʒuəl/',
  noise: '/nɔɪz/', incident: '/ˈɪnsɪdənt/', "shahnil's": '/ˈʃɑːnɪlz/',
  upload: '/ˌʌpˈləʊd/', revised: '/rɪˈvaɪzd/', eop: '/ˌiː əʊ ˈpiː/',
  sop: '/ˌes əʊ ˈpiː/', okay: '/ˌəʊˈkeɪ/', guys: '/ɡaɪz/', rest: '/rest/',
  revising: '/rɪˈvaɪzɪŋ/', 'walkie-talkies': '/ˌwɔːki ˈtɔːkiz/',
  mtpc: '/ˌem tiː piː ˈsiː/', leaking: '/ˈliːkɪŋ/', vendor: '/ˈvendə/',
  arrive: '/əˈraɪv/', password: '/ˈpɑːswɜːd/', "don't": '/dəʊnt/', drain: '/dreɪn/',
  zhu: '/dʒuː/', wei: '/weɪ/', fixed: '/fɪkst/', "farina's": '/fəˈriːnəz/',
  contact: '/ˈkɒntækt/',
  "it's": '/ɪts/', trend: '/trend/', pwp: '/ˌpiː dʌbəljuː ˈpiː/',
  everything: '/ˈevriθɪŋ/', noticed: '/ˈnəʊtɪst/', m: '/em/', p: '/piː/',
  inspections: '/ɪnˈspekʃənz/', upcoming: '/ˈʌpkʌmɪŋ/', drill: '/drɪl/',
  'refrigerant-pump': '/rɪˈfrɪdʒərənt pʌmp/', 'phase-change': '/ˈfeɪz tʃeɪndʒ/',
  redundancy: '/rɪˈdʌndənsi/', photos: '/ˈfəʊtəʊz/', chat: '/tʃæt/',
  checklist: '/ˈtʃeklɪst/', ahmad: '/ˈɑːməd/', azri: '/ˈæzri/', note: '/nəʊt/',
  br: '/ˌbiː ˈɑː/', c: '/siː/', far: '/fɑː/', retake: '/ˌriːˈteɪk/',
  proceed: '/prəˈsiːd/', engineer: '/ˌendʒɪˈnɪə/', trouble: '/ˈtrʌbəl/',
  elv: '/ˌiː el ˈviː/', acquisition: '/ˌækwɪˈzɪʃən/', jiang: '/dʒjɑːŋ/',
  yongjun: '/ˈjɒŋ dʒuːn/', wu: '/wuː/', jiahuan: '/ˈdʒjɑː hwæn/',
  reference: '/ˈrefrəns/', pm: '/ˌpiː ˈem/', raising: '/ˈreɪzɪŋ/',
  "driver's": '/ˈdraɪvəz/', id: '/ˌaɪ ˈdiː/', vehicle: '/ˈviːɪkəl/',
  registration: '/ˌredʒɪˈstreɪʃən/', purpose: '/ˈpɜːpəs/', visit: '/ˈvɪzɪt/',
  deliver: '/dɪˈlɪvə/', skirting: '/ˈskɜːtɪŋ/', boards: '/bɔːdz/',
  delivery: '/dɪˈlɪvəri/', screenshot: '/ˈskriːnʃɒt/',
  ramakrishnan: '/ˌrɑːməˈkrɪʃnən/', truck: '/trʌk/', mobile: '/ˈməʊbaɪl/',
  duan: '/dwæn/', zhixiang: '/ˌdʒɜː ˈʃjɑːŋ/', star: '/stɑː/', grant: '/ɡrɑːnt/',
  manager: '/ˈmænɪdʒə/', dh: '/ˌdiː ˈeɪtʃ/', progress: '/ˈprəʊɡres/',
  treat: '/triːt/', network: '/ˈnetwɜːk/', cable: '/ˈkeɪbəl/', loose: '/luːs/',
  hi: '/haɪ/', sorry: '/ˈsɒri/', bother: '/ˈbɒðə/', lark: '/lɑːk/',
  mind: '/maɪnd/', "i've": '/aɪv/',
  cocc: '/ˌsiː əʊ siː ˈsiː/', buildings: '/ˈbɪldɪŋz/', affecting: '/əˈfektɪŋ/',
  tanks: '/tæŋks/', concerned: '/kənˈsɜːnd/', originates: '/əˈrɪdʒɪneɪts/',
  activate: '/ˈæktɪveɪt/', 'supply-side': '/səˈplaɪ saɪd/', topping: '/ˈtɒpɪŋ/',
  boundary: '/ˈbaʊndəri/', top: '/tɒp/', affects: '/əˈfekts/', reduced: '/rɪˈdjuːst/',
  brief: '/briːf/', li: '/liː/',
};

const WORD_PATTERN = /[A-Za-z]+(?:[’'][A-Za-z]+)*(?:-[A-Za-z]+)*/g;

export function getAlarmWordIpa(word: string, context = word): string {
  const normalized = word.toLowerCase().replaceAll('’', "'");
  return ALARM_WORD_IPA[normalized]
    || PUMP_WORD_IPA[normalized]
    || lookupDictionary(normalized, lemmatize(normalized), context)?.ipa
    || '';
}

export function getAlarmTextIpa(text: string): string {
  const values = (text.match(WORD_PATTERN) || [])
    .map((word) => getAlarmWordIpa(word, text).replace(/^\//, '').replace(/\/$/, ''))
    .filter(Boolean);
  return values.length > 0 ? `/ ${values.join(' ')} /` : '';
}
