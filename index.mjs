
window.addEventListener('load', ()=>{
  
  /**
   * history
   * @type { (string | null)[] }
   */
  let history = [
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
    {str: '', result: []},
  ];
  history.cur = 0;

  /**
   * wordle answer
   * @type { { id: number, name: string, type: string, class: string } }
   */
  let answer = null;

  /**
   * max characters of ship name
   * @type { number }
   */
  const maxCharacterNumber = 8;

  /**
   * max numbers of challenge
   * @type { number }
   */
  const maxChallengeCount = 10;

  /**
   * ship list
   * @type { { id: number, chars: string, name: string, type: string, class: string }[] }
   */
  const ShipList = [
    { id:   1, chars: 'ムツキ'        , name: '睦月'                              , type: '駆逐艦'      , class: '睦月型'                               },
    { id:   2, chars: 'キサラギ'      , name: '如月'                              , type: '駆逐艦'      , class: '睦月型'                               },
    { id:   6, chars: 'ナガツキ'      , name: '長月'                              , type: '駆逐艦'      , class: '睦月型'                               },
    { id:   7, chars: 'ミカヅキ'      , name: '三日月'                            , type: '駆逐艦'      , class: '睦月型'                               },
    { id:   9, chars: 'フブキ'        , name: '吹雪'                              , type: '駆逐艦'      , class: '吹雪型'                               },
    { id:  10, chars: 'シラユキ'      , name: '白雪'                              , type: '駆逐艦'      , class: '吹雪型'                               },
    { id:  11, chars: 'ミユキ'        , name: '深雪'                              , type: '駆逐艦'      , class: '吹雪型'                               },
    { id:  12, chars: 'イソナミ'      , name: '磯波'                              , type: '駆逐艦'      , class: '吹雪型'                               },
    { id:  13, chars: 'アヤナミ'      , name: '綾波'                              , type: '駆逐艦'      , class: '綾波型'                               },
    { id:  14, chars: 'シキナミ'      , name: '敷波'                              , type: '駆逐艦'      , class: '綾波型'                               },
    { id:  15, chars: 'アケボノ'      , name: '曙'                                , type: '駆逐艦'      , class: '綾波型'                               },
    { id:  16, chars: 'ウシオ'        , name: '潮'                                , type: '駆逐艦'      , class: '綾波型'                               },
    { id:  17, chars: 'カゲロウ'      , name: '陽炎'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id:  18, chars: 'シラヌイ'      , name: '不知火'                            , type: '駆逐艦'      , class: '陽炎型'                               },
    { id:  19, chars: 'クロシオ'      , name: '黒潮'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id:  20, chars: 'ユキカゼ'      , name: '雪風'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id:  21, chars: 'ナガラ'        , name: '長良'                              , type: '軽巡洋艦'    , class: '長良型'                               },
    { id:  22, chars: 'イスズ'        , name: '五十鈴'                            , type: '軽巡洋艦'    , class: '長良型'                               },
    { id:  23, chars: 'ユラ'          , name: '由良'                              , type: '軽巡洋艦'    , class: '長良型'                               },
    { id:  24, chars: 'オオイ'        , name: '大井'                              , type: '軽巡洋艦'    , class: '球磨型'                               },
    { id:  25, chars: 'キタカミ'      , name: '北上'                              , type: '軽巡洋艦'    , class: '球磨型'                               },
    { id:  26, chars: 'フソウ'        , name: '扶桑'                              , type: '戦艦'        , class: '扶桑型'                               },
    { id:  27, chars: 'ヤマシロ'      , name: '山城'                              , type: '戦艦'        , class: '扶桑型'                               },
    { id:  28, chars: 'サツキ'        , name: '皐月'                              , type: '駆逐艦'      , class: '睦月型'                               },
    { id:  29, chars: 'フミヅキ'      , name: '文月'                              , type: '駆逐艦'      , class: '睦月型'                               },
    { id:  30, chars: 'キクヅキ'      , name: '菊月'                              , type: '駆逐艦'      , class: '睦月型'                               },
    { id:  31, chars: 'モチヅキ'      , name: '望月'                              , type: '駆逐艦'      , class: '睦月型'                               },
    { id:  32, chars: 'ハツユキ'      , name: '初雪'                              , type: '駆逐艦'      , class: '吹雪型'                               },
    { id:  33, chars: 'ムラクモ'      , name: '叢雲'                              , type: '駆逐艦'      , class: '吹雪型'                               },
    { id:  34, chars: 'アカツキ'      , name: '暁'                                , type: '駆逐艦'      , class: '暁型'                                 },
    { id:  35, chars: 'ヒビキ'        , name: '響'                                , type: '駆逐艦'      , class: '暁型'                                 },
    { id:  36, chars: 'イカヅチ'      , name: '雷'                                , type: '駆逐艦'      , class: '暁型'                                 },
    { id:  37, chars: 'イナヅマ'      , name: '電'                                , type: '駆逐艦'      , class: '暁型'                                 },
    { id:  38, chars: 'ハツハル'      , name: '初春'                              , type: '駆逐艦'      , class: '初春型'                               },
    { id:  39, chars: 'ネノヒ'        , name: '子日'                              , type: '駆逐艦'      , class: '初春型'                               },
    { id:  40, chars: 'ワカバ'        , name: '若葉'                              , type: '駆逐艦'      , class: '初春型'                               },
    { id:  41, chars: 'ハツシモ'      , name: '初霜'                              , type: '駆逐艦'      , class: '初春型'                               },
    { id:  42, chars: 'シラツユ'      , name: '白露'                              , type: '駆逐艦'      , class: '白露型'                               },
    { id:  43, chars: 'シグレ'        , name: '時雨'                              , type: '駆逐艦'      , class: '白露型'                               },
    { id:  44, chars: 'ムラサメ'      , name: '村雨'                              , type: '駆逐艦'      , class: '白露型'                               },
    { id:  45, chars: 'ユウダチ'      , name: '夕立'                              , type: '駆逐艦'      , class: '白露型'                               },
    { id:  46, chars: 'サミダレ'      , name: '五月雨'                            , type: '駆逐艦'      , class: '白露型'                               },
    { id:  47, chars: 'スズカゼ'      , name: '涼風'                              , type: '駆逐艦'      , class: '白露型'                               },
    { id:  48, chars: 'アラレ'        , name: '霰'                                , type: '駆逐艦'      , class: '朝潮型'                               },
    { id:  49, chars: 'カスミ'        , name: '霞'                                , type: '駆逐艦'      , class: '朝潮型'                               },
    { id:  50, chars: 'シマカゼ'      , name: '島風'                              , type: '駆逐艦'      , class: '島風型'                               },
    { id:  51, chars: 'テンリュウ'    , name: '天龍'                              , type: '軽巡洋艦'    , class: '天龍型'                               },
    { id:  52, chars: 'タツタ'        , name: '龍田'                              , type: '軽巡洋艦'    , class: '天龍型'                               },
    { id:  53, chars: 'ナトリ'        , name: '名取'                              , type: '軽巡洋艦'    , class: '長良型'                               },
    { id:  54, chars: 'センダイ'      , name: '川内'                              , type: '軽巡洋艦'    , class: '川内型'                               },
    { id:  55, chars: 'ジンツウ'      , name: '神通'                              , type: '軽巡洋艦'    , class: '川内型'                               },
    { id:  56, chars: 'ナカ'          , name: '那珂'                              , type: '軽巡洋艦'    , class: '川内型'                               },
    { id:  59, chars: 'フルタカ'      , name: '古鷹'                              , type: '重巡洋艦'    , class: '古鷹型'                               },
    { id:  60, chars: 'カコ'          , name: '加古'                              , type: '重巡洋艦'    , class: '古鷹型'                               },
    { id:  61, chars: 'アオバ'        , name: '青葉'                              , type: '重巡洋艦'    , class: '青葉型'                               },
    { id:  62, chars: 'ミョウコウ'    , name: '妙高'                              , type: '重巡洋艦'    , class: '妙高型'                               },
    { id:  63, chars: 'ナチ'          , name: '那智'                              , type: '重巡洋艦'    , class: '妙高型'                               },
    { id:  64, chars: 'アシガラ'      , name: '足柄'                              , type: '重巡洋艦'    , class: '妙高型'                               },
    { id:  65, chars: 'ハグロ'        , name: '羽黒'                              , type: '重巡洋艦'    , class: '妙高型'                               },
    { id:  66, chars: 'タカオ'        , name: '高雄'                              , type: '重巡洋艦'    , class: '高雄型'                               },
    { id:  67, chars: 'アタゴ'        , name: '愛宕'                              , type: '重巡洋艦'    , class: '高雄型'                               },
    { id:  68, chars: 'マヤ'          , name: '摩耶'                              , type: '重巡洋艦'    , class: '高雄型'                               },
    { id:  69, chars: 'チョウカイ'    , name: '鳥海'                              , type: '重巡洋艦'    , class: '高雄型'                               },
    { id:  70, chars: 'モガミ'        , name: '最上'                              , type: '重巡洋艦'    , class: '最上型'                               },
    { id:  71, chars: 'トネ'          , name: '利根'                              , type: '重巡洋艦'    , class: '利根型'                               },
    { id:  72, chars: 'チクマ'        , name: '筑摩'                              , type: '重巡洋艦'    , class: '利根型'                               },
    { id:  74, chars: 'ショウホウ'    , name: '祥鳳'                              , type: '軽空母'      , class: '祥鳳型'                               },
    { id:  75, chars: 'ヒヨウ'        , name: '飛鷹'                              , type: '軽空母'      , class: '飛鷹型'                               },
    { id:  76, chars: 'リュウジョウ'  , name: '龍驤'                              , type: '軽空母'      , class: '龍驤型'                               },
    { id:  77, chars: 'イセ'          , name: '伊勢'                              , type: '戦艦'        , class: '伊勢型'                               },
    { id:  78, chars: 'コンゴウ'      , name: '金剛'                              , type: '巡洋戦艦'    , class: '金剛型'                               },
    { id:  79, chars: 'ハルナ'        , name: '榛名'                              , type: '巡洋戦艦'    , class: '金剛型'                               },
    { id:  80, chars: 'ナガト'        , name: '長門'                              , type: '戦艦'        , class: '長門型'                               },
    { id:  81, chars: 'ムツ'          , name: '陸奥'                              , type: '戦艦'        , class: '長門型'                               },
    { id:  83, chars: 'アカギ'        , name: '赤城'                              , type: '正規空母'    , class: '赤城型'                               },
    { id:  84, chars: 'カガ'          , name: '加賀'                              , type: '正規空母'    , class: '加賀型'                               },
    { id:  85, chars: 'キリシマ'      , name: '霧島'                              , type: '巡洋戦艦'    , class: '金剛型'                               },
    { id:  86, chars: 'ヒエイ'        , name: '比叡'                              , type: '巡洋戦艦'    , class: '金剛型'                               },
    { id:  87, chars: 'ヒュウガ'      , name: '日向'                              , type: '戦艦'        , class: '伊勢型'                               },
    { id:  89, chars: 'ホウショウ'    , name: '鳳翔'                              , type: '軽空母'      , class: '鳳翔型'                               },
    { id:  90, chars: 'ソウリュウ'    , name: '蒼龍'                              , type: '正規空母'    , class: '蒼龍型'                               },
    { id:  91, chars: 'ヒリュウ'      , name: '飛龍'                              , type: '正規空母'    , class: '飛龍型'                               },
    { id:  92, chars: 'ジュンヨウ'    , name: '隼鷹'                              , type: '軽空母'      , class: '飛鷹型'                               },
    { id:  93, chars: 'オボロ'        , name: '朧'                                , type: '駆逐艦'      , class: '綾波型'                               },
    { id:  94, chars: 'サザナミ'      , name: '漣'                                , type: '駆逐艦'      , class: '綾波型'                               },
    { id:  95, chars: 'アサシオ'      , name: '朝潮'                              , type: '駆逐艦'      , class: '朝潮型'                               },
    { id:  96, chars: 'オオシオ'      , name: '大潮'                              , type: '駆逐艦'      , class: '朝潮型'                               },
    { id:  97, chars: 'ミチシオ'      , name: '満潮'                              , type: '駆逐艦'      , class: '朝潮型'                               },
    { id:  98, chars: 'アラシオ'      , name: '荒潮'                              , type: '駆逐艦'      , class: '朝潮型'                               },
    { id:  99, chars: 'クマ'          , name: '球磨'                              , type: '軽巡洋艦'    , class: '球磨型'                               },
    { id: 100, chars: 'タマ'          , name: '多摩'                              , type: '軽巡洋艦'    , class: '球磨型'                               },
    { id: 101, chars: 'キソ'          , name: '木曾'                              , type: '軽巡洋艦'    , class: '球磨型'                               },
    { id: 102, chars: 'チトセ'        , name: '千歳'                              , type: '水上機母艦'  , class: '千歳型'                               },
    { id: 103, chars: 'チヨダ'        , name: '千代田'                            , type: '水上機母艦'  , class: '千歳型'                               },
    { id: 110, chars: 'ショウカク'    , name: '翔鶴'                              , type: '正規空母'    , class: '翔鶴型'                               },
    { id: 111, chars: 'ズイカク'      , name: '瑞鶴'                              , type: '正規空母'    , class: '翔鶴型'                               },
    { id: 113, chars: 'キヌ'          , name: '鬼怒'                              , type: '軽巡洋艦'    , class: '長良型'                               },
    { id: 114, chars: 'アブクマ'      , name: '阿武隈'                            , type: '軽巡洋艦'    , class: '長良型'                               },
    { id: 115, chars: 'ユウバリ'      , name: '夕張'                              , type: '軽巡洋艦'    , class: '夕張型'                               },
    { id: 116, chars: 'ズイホウ'      , name: '瑞鳳'                              , type: '軽空母'      , class: '祥鳳型'                               },
    { id: 120, chars: 'ミクマ'        , name: '三隈'                              , type: '重巡洋艦'    , class: '最上型'                               },
    { id: 122, chars: 'マイカゼ'      , name: '舞風'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 123, chars: 'キヌガサ'      , name: '衣笠'                              , type: '重巡洋艦'    , class: '青葉型'                               },
    { id: 124, chars: 'スズヤ'        , name: '鈴谷'                              , type: '重巡洋艦'    , class: '最上型'                               },
    { id: 125, chars: 'クマノ'        , name: '熊野'                              , type: '重巡洋艦'    , class: '最上型'                               },
    { id: 126, chars: 'イムヤ'        , name: '伊168'                             , type: '潜水艦'      , class: '海大VI型'                             },
    { id: 127, chars: 'ゴーヤ'        , name: '伊58'                              , type: '潜水艦'      , class: '巡潜乙型改二'                         },
    { id: 128, chars: 'ハチ'          , name: '伊8'                               , type: '潜水艦'      , class: '巡潜3型'                              },
    { id: 131, chars: 'ヤマト'        , name: '大和'                              , type: '戦艦'        , class: '大和型'                               },
    { id: 132, chars: 'アキグモ'      , name: '秋雲'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 133, chars: 'ユウグモ'      , name: '夕雲'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 134, chars: 'マキグモ'      , name: '巻雲'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 135, chars: 'ナガナミ'      , name: '長波'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 137, chars: 'アガノ'        , name: '阿賀野'                            , type: '軽巡洋艦'    , class: '阿賀野型'                             },
    { id: 138, chars: 'ノシロ'        , name: '能代'                              , type: '軽巡洋艦'    , class: '阿賀野型'                             },
    { id: 139, chars: 'ヤハギ'        , name: '矢矧'                              , type: '軽巡洋艦'    , class: '阿賀野型'                             },
    { id: 140, chars: 'サカワ'        , name: '酒匂'                              , type: '軽巡洋艦'    , class: '阿賀野型'                             },
    { id: 143, chars: 'ムサシ'        , name: '武蔵'                              , type: '戦艦'        , class: '大和型'                               },
    { id: 147, chars: 'ベールヌイ'    , name: 'Верный'                            , type: '駆逐艦'      , class: '暁型'                                 },
    { id: 153, chars: 'タイホウ'      , name: '大鳳'                              , type: '装甲空母'    , class: '大鳳型'                               },
    { id: 154, chars: 'カトリ'        , name: '香取'                              , type: '軽巡洋艦'    , class: '香取型'                               },
    { id: 155, chars: 'シオイ'        , name: '伊401'                             , type: '潜水艦'      , class: '潜特型'                               },
    { id: 161, chars: 'アキツマル'    , name: 'あきつ丸'                          , type: '揚陸艦'      , class: '特種船丙型'                           },
    { id: 162, chars: 'カモイ'        , name: '神威'                              , type: '補給艦'      , class: '神威型'                               },
    { id: 163, chars: 'マルユ'        , name: 'まるゆ'                            , type: '潜水艦'      , class: '三式潜航輸送艇'                       },
    { id: 164, chars: 'ヤヨイ'        , name: '弥生'                              , type: '駆逐艦'      , class: '睦月型'                               },
    { id: 165, chars: 'ウヅキ'        , name: '卯月'                              , type: '駆逐艦'      , class: '睦月型'                               },
    { id: 167, chars: 'イソカゼ'      , name: '磯風'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 168, chars: 'ウラカゼ'      , name: '浦風'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 169, chars: 'タニカゼ'      , name: '谷風'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 170, chars: 'ハマカゼ'      , name: '浜風'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 171, chars: 'ビスマルク'    , name: 'Bismarck'                          , type: '巡洋戦艦'    , class: 'Bismarck級'                           },
    { id: 174, chars: 'レーベ'        , name: 'Z1'                                , type: '駆逐艦'      , class: 'Z1型'                                 },
    { id: 175, chars: 'マックス'      , name: 'Z3'                                , type: '駆逐艦'      , class: 'Z1型'                                 },
    { id: 176, chars: 'プリンツ'      , name: 'Prinz Eugen'                       , type: '重巡洋艦'    , class: 'Admiral Hipper級'                     },
    { id: 181, chars: 'アマツカゼ'    , name: '天津風'                            , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 182, chars: 'アカシ'        , name: '明石'                              , type: '工作艦'      , class: '明石型'                               },
    { id: 183, chars: 'オオヨド'      , name: '大淀'                              , type: '軽巡洋艦'    , class: '大淀型'                               },
    { id: 184, chars: 'タイゲイ'      , name: '大鯨'                              , type: '潜水母艦'    , class: '大鯨型'                               },
    { id: 185, chars: 'リュウホウ'    , name: '龍鳳'                              , type: '軽空母'      , class: '龍鳳型'                               },
    { id: 186, chars: 'トキツカゼ'    , name: '時津風'                            , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 190, chars: 'ハツカゼ'      , name: '初風'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 191, chars: 'イク'          , name: '伊19'                              , type: '潜水艦'      , class: '巡潜乙型'                             },
    { id: 299, chars: 'スキャンプ'    , name: 'Scamp'                             , type: '潜水艦'      , class: 'Gato級'                               },
    { id: 331, chars: 'アマギ'        , name: '天城'                              , type: '正規空母'    , class: '雲龍型'                               },
    { id: 331, chars: 'カツラギ'      , name: '葛城'                              , type: '正規空母'    , class: '雲龍型'                               },
    { id: 404, chars: 'ウンリュウ'    , name: '雲龍'                              , type: '正規空母'    , class: '雲龍型'                               },
    { id: 405, chars: 'ハルサメ'      , name: '春雨'                              , type: '駆逐艦'      , class: '白露型'                               },
    { id: 409, chars: 'ハヤシモ'      , name: '早霜'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 410, chars: 'キヨシモ'      , name: '清霜'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 413, chars: 'アサグモ'      , name: '朝雲'                              , type: '駆逐艦'      , class: '朝潮型'                               },
    { id: 414, chars: 'ヤマグモ'      , name: '山雲'                              , type: '駆逐艦'      , class: '朝潮型'                               },
    { id: 415, chars: 'ノワキ'        , name: '野分'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 421, chars: 'アキヅキ'      , name: '秋月'                              , type: '駆逐艦'      , class: '秋月型'                               },
    { id: 422, chars: 'テルヅキ'      , name: '照月'                              , type: '駆逐艦'      , class: '秋月型'                               },
    { id: 423, chars: 'ハツヅキ'      , name: '初月'                              , type: '駆逐艦'      , class: '秋月型'                               },
    { id: 424, chars: 'タカナミ'      , name: '高波'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 425, chars: 'アサシモ'      , name: '朝霜'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 431, chars: 'ユー'          , name: 'U-511'                             , type: '潜水艦'      , class: 'UボートIXC型'                         },
    { id: 432, chars: 'グラーフ'      , name: 'Graf Zeppelin'                     , type: '正規空母'    , class: 'Graf Zeppelin級'                      },
    { id: 433, chars: 'サラトガ'      , name: 'Saratoga'                          , type: '正規空母'    , class: 'Lexington級'                          },
    { id: 436, chars: 'ロー'          , name: '呂500'                             , type: '潜水艦'      , class: '呂号潜水艦'                           },
    { id: 439, chars: 'ウォースパイト', name: 'Warspite'                          , type: '戦艦'        , class: 'Queen Elizabeth級'                    },
    { id: 440, chars: 'アイオワ'      , name: 'Iowa'                              , type: '戦艦'        , class: 'Iowa級'                               },
    { id: 441, chars: 'リットリオ'    , name: 'Littolio'                          , type: '巡洋戦艦'    , class: 'V.Veneto級'                           },
    { id: 442, chars: 'ローマ'        , name: 'Roma'                              , type: '巡洋戦艦'    , class: 'V.Veneto級'                           },
    { id: 443, chars: 'リベッチオ'    , name: 'Libeccio'                          , type: '駆逐艦'      , class: 'Maestrale級'                          },
    { id: 444, chars: 'アクィラ'      , name: 'Aquila'                            , type: '正規空母'    , class: 'Apila級'                              },
    { id: 445, chars: 'アキツシマ'    , name: '秋津洲'                            , type: '水上機母艦'  , class: '秋津洲型'                             },
    { id: 446, chars: 'イタリア'      , name: 'Italia'                            , type: '巡洋戦艦'    , class: 'V.Veneto級'                           },
    { id: 448, chars: 'ザラ'          , name: 'Zara'                              , type: '重巡洋艦'    , class: 'Zara級'                               },
    { id: 449, chars: 'ポーラ'        , name: 'Pola'                              , type: '重巡洋艦'    , class: 'Zara級'                               },
    { id: 451, chars: 'ミズホ'        , name: '瑞穂'                              , type: '水上機母艦'  , class: '瑞穂型'                               },
    { id: 452, chars: 'オキナミ'      , name: '沖波'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 453, chars: 'カザグモ'      , name: '風雲'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 454, chars: 'アラシ'        , name: '嵐'                                , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 455, chars: 'ハギカゼ'      , name: '萩風'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 456, chars: 'オヤシオ'      , name: '親潮'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 457, chars: 'ヤマカゼ'      , name: '山風'                              , type: '駆逐艦'      , class: '白露型'                               },
    { id: 458, chars: 'ウミカゼ'      , name: '海風'                              , type: '駆逐艦'      , class: '白露型'                               },
    { id: 459, chars: 'カワカゼ'      , name: '江風'                              , type: '駆逐艦'      , class: '白露型'                               },
    { id: 460, chars: 'ハヤスイ'      , name: '速吸'                              , type: '補給艦'      , class: '改風早型'                             },
    { id: 465, chars: 'カシマ'        , name: '鹿島'                              , type: '練習巡洋艦'  , class: '香取型'                               },
    { id: 472, chars: 'カミカゼ'      , name: '神風'                              , type: '駆逐艦'      , class: '神風型'                               },
    { id: 473, chars: 'アサカゼ'      , name: '朝風'                              , type: '駆逐艦'      , class: '神風型'                               },
    { id: 474, chars: 'ハルカゼ'      , name: '春風'                              , type: '駆逐艦'      , class: '神風型'                               },
    { id: 475, chars: 'マツカゼ'      , name: '松風'                              , type: '駆逐艦'      , class: '神風型'                               },
    { id: 476, chars: 'ハタカゼ'      , name: '旗風'                              , type: '駆逐艦'      , class: '神風型'                               },
    { id: 479, chars: 'アマギリ'      , name: '天霧'                              , type: '駆逐艦'      , class: '綾波型'                               },
    { id: 480, chars: 'サギリ'        , name: '狭霧'                              , type: '駆逐艦'      , class: '綾波型'                               },
    { id: 481, chars: 'ミナヅキ'      , name: '水無月'                            , type: '駆逐艦'      , class: '睦月型'                               },
    { id: 483, chars: 'ニム'          , name: '伊26'                              , type: '潜水艦'      , class: '巡潜乙型'                             },
    { id: 484, chars: 'ハマナミ'      , name: '浜波'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 485, chars: 'フジナミ'      , name: '藤波'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 486, chars: 'ウラナミ'      , name: '浦波'                              , type: '駆逐艦'      , class: '吹雪型'                               },
    { id: 491, chars: 'テスト'        , name: 'Commandant Teste'                  , type: '水上機母艦'  , class: 'C.Teste級'                            },
    { id: 492, chars: 'リシュリュー'  , name: 'Richelieu'                         , type: '巡洋戦艦'    , class: 'Richelieu級'                          },
    { id: 493, chars: 'シオン'        , name: '伊400'                             , type: '潜水空母'    , class: '潜特型'                               },
    { id: 494, chars: 'ヒトミ'        , name: '伊13'                              , type: '潜水空母'    , class: '巡潜甲型改二'                         },
    { id: 494, chars: 'イヨ'          , name: '伊14'                              , type: '潜水空母'    , class: '巡潜甲型改二'                         },
    { id: 511, chars: 'ガングート'    , name: 'Гангут'                            , type: '巡洋戦艦'    , class: 'Гангут級'                             },
    { id: 514, chars: 'シェフィールド', name: 'Sheffield'                         , type: '軽巡洋艦'    , class: 'Town級'                               },
    { id: 515, chars: 'アークロイヤル', name: 'Ark Royal'                         , type: '正規空母'    , class: 'Ark Royal級'                          },
    { id: 516, chars: 'タシュケント'  , name: 'Ташкент'                           , type: '駆逐艦'      , class: 'Ташкент級'                            },
    { id: 517, chars: 'シムシュ'      , name: '占守'                              , type: '海防艦'      , class: '占守型'                               },
    { id: 518, chars: 'クナシリ'      , name: '国後'                              , type: '海防艦'      , class: '占守型'                               },
    { id: 519, chars: 'ジャーヴィス'  , name: 'Jervis'                            , type: '駆逐艦'      , class: 'J級'                                  },
    { id: 520, chars: 'ジェーナス'    , name: 'Janus'                             , type: '駆逐艦'      , class: 'J級'                                  },
    { id: 521, chars: 'カスガマル'    , name: '春日丸'                            , type: '軽空母'      , class: '春日丸級'                             },
    { id: 522, chars: 'ヤワタマル'    , name: '八幡丸'                            , type: '軽空母'      , class: '春日丸級'                             },
    { id: 524, chars: 'エトロフ'      , name: '択捉'                              , type: '海防艦'      , class: '択捉型'                               },
    { id: 525, chars: 'マツワ'        , name: '松輪'                              , type: '海防艦'      , class: '択捉型'                               },
    { id: 526, chars: 'タイヨウ'      , name: '大鷹'                              , type: '軽空母'      , class: '大鷹型'                               },
    { id: 527, chars: 'キシナミ'      , name: '岸波'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 528, chars: 'ハヤナミ'      , name: '早波'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 531, chars: 'サド'          , name: '佐渡'                              , type: '海防艦'      , class: '択捉型'                               },
    { id: 532, chars: 'スズツキ'      , name: '涼月'                              , type: '駆逐艦'      , class: '秋月型'                               },
    { id: 533, chars: 'フユツキ'      , name: '冬月'                              , type: '駆逐艦'      , class: '秋月型'                               },
    { id: 534, chars: 'シンヨウ'      , name: '神鷹'                              , type: '軽空母'      , class: '大鷹型'                               },
    { id: 535, chars: 'ルイージ'      , name: 'Luigi Torelli'                     , type: '潜水艦'      , class: 'Guglielmo Marconi級'                  },
    { id: 540, chars: 'ツシマ'        , name: '対馬'                              , type: '海防艦'      , class: '択捉型'                               },
    { id: 544, chars: 'ガンビアベイ'  , name: 'Gambier Bay'                       , type: '軽空母'      , class: 'Casablanca級'                         },
    { id: 549, chars: 'イントレピッド', name: 'Intrepid'                          , type: '正規空母'    , class: 'Essex級'                              },
    { id: 551, chars: 'ヒブリ'        , name: '日振'                              , type: '海防艦'      , class: '日振型'                               },
    { id: 552, chars: 'ダイトウ'      , name: '大東'                              , type: '海防艦'      , class: '日振型'                               },
    { id: 561, chars: 'サミュエル'    , name: 'Samuel B. Roberts'                 , type: '駆逐艦'      , class: 'John C. Buttler級'                    },
    { id: 562, chars: 'ジョンストン'  , name: 'Johnston'                          , type: '駆逐艦'      , class: 'Fletcher級'                           },
    { id: 565, chars: 'フカエ'        , name: '福江'                              , type: '海防艦'      , class: '択捉型'                               },
    { id: 570, chars: 'ヒラト'        , name: '平戸'                              , type: '海防艦'      , class: '択捉型'                               },
    { id: 571, chars: 'ネルソン'      , name: 'Nelson'                            , type: '戦艦'        , class: 'Nelson級'                             },
    { id: 574, chars: 'ゴトランド'    , name: 'Gotland'                           , type: '軽巡洋艦'    , class: 'Gotland級'                            },
    { id: 575, chars: 'マエストラーレ', name: 'Maestrale'                         , type: '駆逐艦'      , class: 'Maestrale級'                          },
    { id: 581, chars: 'ニッシン'      , name: '日進'                              , type: '水上機母艦'  , class: '日進型'                               },
    { id: 583, chars: 'ミネグモ'      , name: '峯雲'                              , type: '駆逐艦'      , class: '朝潮型'                               },
    { id: 584, chars: 'ハチジョウ'    , name: '八丈'                              , type: '海防艦'      , class: '占守型'                               },
    { id: 585, chars: 'イシガキ'      , name: '石垣'                              , type: '海防艦'      , class: '占守型'                               },
    { id: 589, chars: 'アブルッツィ'  , name: 'Luigi di Savoia Duca degli Abrizzi', type: '軽巡洋艦'    , class: 'Luigi di Savoia Duca degli Abrizzi級' },
    { id: 590, chars: 'ガリバルディ'  , name: 'Giuseppe Garibaldi'                , type: '軽巡洋艦'    , class: 'Luigi di Savoia Duca degli Abrizzi級' },
    { id: 595, chars: 'ヒューストン'  , name: 'Houston'                           , type: '重巡洋艦'    , class: 'Northampton級'                        },
    { id: 596, chars: 'フレッチャー'  , name: 'Fletcher'                          , type: '駆逐艦'      , class: 'Fletcher級'                           },
    { id: 597, chars: 'アトランタ'    , name: 'Atlanta'                           , type: '軽巡洋艦'    , class: 'Atlanta級'                            },
    { id: 598, chars: 'ホノルル'      , name: 'Honolulu'                          , type: '軽巡洋艦'    , class: 'Brooklyn級'                           },
    { id: 601, chars: 'コロラド'      , name: 'Colorado'                          , type: '戦艦'        , class: 'Colorado級'                           },
    { id: 602, chars: 'サウスダコタ'  , name: 'South Dakota'                      , type: '巡洋戦艦'    , class: 'South Dakota級'                       },
    { id: 603, chars: 'ホーネット'    , name: 'Hornet'                            , type: '正規空母'    , class: 'Yorktown級'                           },
    { id: 604, chars: 'デロイテル'    , name: 'De Ruyter'                         , type: '軽巡洋艦'    , class: 'De Ruyter級'                          },
    { id: 611, chars: 'ミクラ'        , name: '御蔵'                              , type: '海防艦'      , class: '御蔵型'                               },
    { id: 612, chars: 'ヤシロ'        , name: '屋代'                              , type: '海防艦'      , class: '御蔵型'                               },
    { id: 613, chars: 'パース'        , name: 'Perth'                             , type: '軽巡洋艦'    , class: 'Perth級'                              },
    { id: 614, chars: 'グレカーレ'    , name: 'Grecale'                           , type: '駆逐艦'      , class: 'Maestrale級'                          },
    { id: 615, chars: 'ヘレナ'        , name: 'Helena'                            , type: '軽巡洋艦'    , class: 'St. Louis級'                          },
    { id: 621, chars: 'シンシュウマル', name: '神州丸'                            , type: '揚陸艦'      , class: '陸軍特種船'                           },
    { id: 625, chars: 'アキシモ'      , name: '秋霜'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 631, chars: 'ウスグモ'      , name: '薄雲'                              , type: '駆逐艦'      , class: '吹雪型'                               },
    { id: 632, chars: 'アリアケ'      , name: '有明'                              , type: '駆逐艦'      , class: '初春型'                               },
    { id: 634, chars: 'ジンゲイ'      , name: '迅鯨'                              , type: '潜水母艦'    , class: '迅鯨型'                               },
    { id: 635, chars: 'チョウゲイ'    , name: '長鯨'                              , type: '潜水母艦'    , class: '迅鯨型'                               },
    { id: 636, chars: 'ヨナ'          , name: '伊47'                              , type: '潜水艦'      , class: '巡潜丙型'                             },
    { id: 637, chars: 'ヨツ'          , name: '第四号海防艦'                      , type: '海防艦'      , class: '丁型海防艦'                           },
    { id: 637, chars: 'ミト'          , name: '第三〇号号海防艦'                  , type: '海防艦'      , class: '丁型海防艦'                           },
    { id: 641, chars: 'マツ'          , name: '松'                                , type: '駆逐艦'      , class: '松型'                                 },
    { id: 642, chars: 'タケ'          , name: '竹'                                , type: '駆逐艦'      , class: '松型'                                 },
    { id: 643, chars: 'ウメ'          , name: '梅'                                , type: '駆逐艦'      , class: '松型'                                 },
    { id: 644, chars: 'モモ'          , name: '桃'                                , type: '駆逐艦'      , class: '松型'                                 },
    { id: 645, chars: 'ソウヤ'        , name: '宗谷'                              , type: '南極観測船'  , class: '天領丸型'                             },
    { id: 651, chars: 'タンヨウ'      , name: '丹陽'                              , type: '駆逐艦'      , class: '陽炎型'                               },
    { id: 653, chars: 'シロッコ'      , name: 'Scirocco'                          , type: '駆逐艦'      , class: 'Maestrale級'                          },
    { id: 654, chars: 'ワシントン'    , name: 'Wasington'                         , type: '巡洋戦艦'    , class: 'North Carolina級'                     },
    { id: 655, chars: 'ノーザンプトン', name: 'Northampton'                       , type: '重巡洋艦'    , class: 'Northampton級'                        },
    { id: 671, chars: 'マキナミ'      , name: '巻波'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 671, chars: 'タマナミ'      , name: '玉波'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 671, chars: 'スズナミ'      , name: '凉波'                              , type: '駆逐艦'      , class: '夕雲型'                               },
    { id: 877, chars: 'カブール'      , name: 'Conte di Cavour'                   , type: '戦艦'        , class: 'Conte di Cavour級'                    },
    { id: 882, chars: 'フーミィ'      , name: '伊203'                             , type: '潜水艦'      , class: '潜高型'                               },
    { id: 884, chars: 'ウンヨウ'      , name: '雲鷹'                              , type: '軽空母'      , class: '大鷹型'                               },
    { id: 885, chars: 'ヴィクトリアス', name: 'Victorious'                        , type: '装甲空母'    , class: 'Illustorious級'                       },
    { id: 895, chars: 'ショウナン'    , name: '昭南'                              , type: '海防艦'      , class: '日振型'                               },
    { id: 900, chars: 'ヤマシオマル'  , name: '山汐丸'                            , type: '特設護衛空母', class: '特2TL型'                              },
    // { id: 0, chars: '', name: '', type: '', class: '' },
  ];

  // set popup remove eventlistener
  document.querySelector('div#popup').addEventListener('click', ()=>{
    document.querySelector('div#popup').classList.remove('display');
    document.querySelector('div#popup-window').dataset.beforeInput = document.querySelector('div#popup-window').dataset.default;
  });

  // set keypad eventlistener
  document.querySelectorAll('div#keypad > div > div').forEach((/** @type { Element } */ button)=>{
    if(button.classList.contains('none')) return;
    if(button.id == 'enter-btn'){
      button.addEventListener('click', ()=>pushEnterKey());
      return;
    }
    if(button.id == 'delete-btn'){
      button.addEventListener('click', ()=>pushDeleteKey());
      return;
    }
    if(button.id === 'reset-btn'){
      button.addEventListener('click', ()=>pushResetKey());
      return;
    }
    const char = button.dataset.beforeInput;
    button.addEventListener('click', ()=>pushKeyboard(char));
  });

  // key inputs
  /**
   * push character key
   * @param { string } character input character
   */
  function pushKeyboard(character){
    if(history[history.cur].str.length < maxCharacterNumber + 1)
      history[history.cur].str += character;
    console.log(`[${character}    ]`, history);
    flipCharacters();
  }
  /**
   * push enter key
   */
  function pushEnterKey(){
    if(!isShipName(history[history.cur].str)){
      makePopupWindow(`"${history[history.cur].str}"という名前の艦娘はいません`);
      return;
    }
    history[history.cur].result = checkShipName(history[history.cur].str);
    flipCharacters();
    if(history.cur == maxChallengeCount - 1){
      // game over
      return;
    }
    history.cur++;
    console.log(`[Enter ]`, history);
  }
  /**
   * push delete key
   */
  function pushDeleteKey(){
    history[history.cur].str = history[history.cur].str.slice(0, -1);
    console.log(`[Delete]`, history);
    flipCharacters();
  }
  /**
   * push reset (new game) key
   */
  function pushResetKey(){
    // 
  }

  /**
   * flip ship-name history
   */
  function flipCharacters(){
    history.forEach((hist, index)=>{
      const target = document.querySelector(`div.history:nth-child(${index + 1})`);
      const chars = hist.str.split('');
      Array.from(target.children).forEach((charbox, index)=>{
        charbox.dataset.beforeInput = chars[index] ?? '';
        charbox.classList.remove('wrong', 'exist', 'true');
        if(hist.result[index]) charbox.classList.add(hist.result[index]);
      });
    });
  }

  /**
   * check exist ship-name
   * @param { string } target
   * @return { boolean } is target in ship-name list
   */
  function isShipName(target){
    return ShipList.map(v=>v.chars).includes(target);
  }

  /**
   * check target is answer, and make result array
   * @param { string } target
   * @return { ('wrong'|'exist'|'true'|null)[] }
   */
  function checkShipName(target){
    const result = [null, null, null, null, null, null, null];
    const ans = answer.chars;
    const count = new Count(answer.chars.split(''));

    // true
    for(const index in result){
      if(!target[index] || !ans[index]) continue;
      if(target[index] == ans[index]){
        count.remove(target[index]);
        result[index] = 'true';
      }
    }

    // exist
    for(const index in result){
      if(!target[index]) continue;
      if(result[index]) continue;
      console.log(`[${count.get().map(v=>`'${v}'`).join(', ')}].have('${target[index]}')`, '=>', count.have(target[index]));
      if(count.have(target[index])){
        count.remove(target[index]);
        result[index] = 'exist';
        continue;
      }
      result[index] = 'wrong';
    }
    
    return result;
  }
  
  /**
   * start new game (init history)
   */
  function startNewGame(){
    history = [
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
      {str: '', result: []},
    ];
    history.cur = 0;
    answer = ShipList[Math.floor(Math.random() * ShipList.length)];
    console.log('answer:', answer); // debug
    flipCharacters();
  }

  /**
   * make popup window
   * @param { string } message
   */
  function makePopupWindow(message){
    document.querySelector('div#popup-window').dataset.beforeInput = message;
    document.querySelector('div#popup').classList.add('display');
  }
  
  /**
   * class Count
   */
  class Count{
  
    /**
     * @type { Map<string, number> }
     */
    #field;
  
    /**
     * @param { string[] } targetArray
     */
    constructor(targetArray){
      this.#field = new Map();
      if(targetArray instanceof Array) targetArray.forEach((target)=>this.add(target));
    }
  
    /**
     * get amount(count) of target
     * @param { string } target
     */
    amount(target){
      return this.#field.get(target) ?? 0;
    }
  
    /**
     * does list have target
     * @param { string } target
     * @returns { boolean }
     */
    have(target){
      return this.#field.get(target) ? true : false;
    }
  
    /**
     * add target to list
     * @param { string } target 
     */
    add(target){
      this.#field.set(target, (this.#field.get(target) ?? 0) + 1);
    }
  
    /**
     * remove 1 target
     * @param { string } target 
     * @returns { boolean } if target is not exist, return false.
     */
    remove(target){
      let now = this.#field.get(target) ?? 0;
      if(now == 0) return false;
      if(now == 1) this.#field.delete(target);
      else this.#field.set(target, now - 1);
      return true;
    }
  
    /**
     * get amounts as array
     * @returns { string[] }
     */
    get(){
      return Array.from(this.#field.keys()).map((key)=>new Array(this.#field.get(key)).fill(key)).flat().sort();
    }
  }

  startNewGame();
});

