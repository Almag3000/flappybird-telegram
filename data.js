// Zone layout uses a 380×240 coordinate canvas (SVG units).
// Each zone: {id, name, x, y, w, h, label?}
// label — short text for small zones (optional, falls back to name)

const MAPS = [
  {
    id: "dubai",
    name: "Дубай",
    subtitle: "Небоскрёб Шаркира",
    mission: "На вершине мира",
    region: "Ближний Восток",
    image: "🏙️",
    difficulty: 2,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "lobby",     name: "Вестибюль / Вход",       x: 140, y: 200, w: 100, h: 36 },
        { id: "atrium",    name: "Атриум / Арт-инсталляция", x: 70, y: 135, w: 240, h: 58 },
        { id: "vip",       name: "VIP-зал",                 x: 10,  y: 75,  w: 105, h: 52 },
        { id: "technical", name: "Тех. этажи",              x: 265, y: 75,  w: 105, h: 52 },
        { id: "offices",   name: "Офисы Атласа",            x: 125, y: 50,  w: 130, h: 52 },
        { id: "server",    name: "Сервер-комната",          x: 230, y: 6,   w: 90,  h: 38, label: "Серверная" },
        { id: "roof",      name: "Вертолётная площадка",    x: 60,  y: 6,   w: 120, h: 38, label: "Крыша" },
      ],
    },
    codes: [
      { target: "Ключ-карта — серверная", code: "Ключ-карта", location: "Охранник в офисах Атласа (уровень 3)", type: "key", note: "Нужна для доступа к серверной комнате", zoneId: "offices" },
      { target: "Оружейный шкаф (охрана)", code: "Случайный", location: "Подсказка — на планшете в VIP-зале", type: "random", note: "Меняется каждую сессию", zoneId: "vip" },
    ],
    weapons: [
      { name: "Пистолет (silenced)", location: "Шкафчик в комнате охраны, уровень 1", zone: "Ограниченная зона", icon: "🔫", zoneId: "lobby" },
      { name: "Снайперская винтовка", location: "Техническое помещение у вертолётной площадки", zone: "Ограниченная зона", icon: "🎯", zoneId: "roof" },
      { name: "Штурмовая винтовка (AUG)", location: "Пункт охраны, уровень 2 (атриум)", zone: "Ограниченная зона", icon: "🔫", zoneId: "atrium" },
      { name: "Дробовик", location: "Комната охраны крыши, рядом с вертолётом", zone: "Ограниченная зона", icon: "🔫", zoneId: "roof" },
    ],
    tools: [
      { name: "Провод (удавка)", location: "Арт-инсталляция, уровень 2 — на полу у скульптуры", icon: "🪢", zoneId: "atrium" },
      { name: "Монтировка", location: "Технический коридор, уровень 3", icon: "🔧", zoneId: "technical" },
      { name: "Ключ от склада", location: "На стойке ресепшен, уровень 1", icon: "🔑", zoneId: "lobby" },
      { name: "Таблетки (яд)", location: "Ванная комната VIP-зала", icon: "💊", zoneId: "vip" },
      { name: "Отвёртка", location: "Технические этажи, около щитка", icon: "🪛", zoneId: "technical" },
      { name: "Огнетушитель", location: "Атриум, рядом с лифтом", icon: "🧯", zoneId: "atrium" },
    ],
    tips: [
      "Костюм художника открывает доступ к зонам арт-инсталляции",
      "Шахта лифта — тихий маршрут между этажами без встречи с охраной",
      "На крыше есть бочки, которые можно столкнуть на цель сверху",
    ],
  },

  {
    id: "dartmoor",
    name: "Дартмур",
    subtitle: "Поместье Торнбридж",
    mission: "Смерть в семье",
    region: "Великобритания",
    image: "🏰",
    difficulty: 1,
    zoneLayout: {
      w: 380, h: 260,
      zones: [
        { id: "stable",   name: "Конюшня",         x: 10,  y: 10,  w: 95,  h: 65 },
        { id: "basement", name: "Подвал / Морг",   x: 115, y: 10,  w: 150, h: 65 },
        { id: "greenhouse", name: "Оранжерея",     x: 275, y: 10,  w: 95,  h: 65 },
        { id: "maze",     name: "Сад / Лабиринт",  x: 10,  y: 85,  w: 95,  h: 80 },
        { id: "library",  name: "Библиотека",       x: 115, y: 85,  w: 100, h: 80 },
        { id: "alexa",    name: "Кабинет Алексы",  x: 225, y: 85,  w: 145, h: 80 },
        { id: "foyer",    name: "Фойе (1 этаж)",   x: 115, y: 175, w: 150, h: 50 },
        { id: "kitchen",  name: "Кухня",            x: 275, y: 175, w: 95,  h: 50 },
        { id: "entrance", name: "Главный вход",     x: 155, y: 230, w: 70,  h: 25, label: "Вход" },
      ],
    },
    codes: [
      { target: "Сейф Алексы Карлайл", code: "Случайный", location: "Кабинет Алексы, 2 этаж", type: "random", note: "Код в дневнике Хьюберта или в комнате прислуги", zoneId: "alexa" },
      { target: "Замок подвала", code: "Ключ", location: "Ключ у дворецкого (Персиваль)", type: "key", note: "Также можно взломать отмычкой", zoneId: "basement" },
    ],
    weapons: [
      { name: "Охотничья винтовка (трофей)", location: "Охотничий зал, 1 этаж — на стене", zone: "Свободная зона", icon: "🎯", zoneId: "library" },
      { name: "Пистолет охранника", location: "Комната охраны, 1 этаж рядом с кухней", zone: "Ограниченная зона", icon: "🔫", zoneId: "foyer" },
      { name: "Дробовик (антиквариат)", location: "Библиотека, застеклённый шкаф", zone: "Свободная зона", icon: "🔫", zoneId: "library" },
    ],
    tools: [
      { name: "Ядохимикаты (удобрение)", location: "Оранжерея — на полке с горшками, справа от входа", icon: "☠️", zoneId: "greenhouse" },
      { name: "Крысиный яд", location: "Кухня — на нижней полке у раковины", icon: "☠️", zoneId: "kitchen" },
      { name: "Эмбальмирующая жидкость", location: "Морг в подвале — на столе у тела", icon: "💉", zoneId: "basement" },
      { name: "Лопата", location: "Конюшня — прислонена к стене у денников", icon: "⛏️", zoneId: "stable" },
      { name: "Монтировка", location: "Конюшня — ящик с инструментами, у западной стены", icon: "🔧", zoneId: "stable" },
      { name: "Подкова (метательный)", location: "Конюшня — висит на крюке", icon: "🔨", zoneId: "stable" },
      { name: "Топор (пожарный)", location: "Библиотека — на специальном держателе у стены", icon: "🪓", zoneId: "library" },
      { name: "Нож (кухонный)", location: "Кухня — на разделочной доске и в подставке", icon: "🔪", zoneId: "kitchen" },
      { name: "Огнетушитель", location: "Фойе — у лестницы, и у входа в оранжерею", icon: "🧯", zoneId: "foyer" },
    ],
    tips: [
      "Детектив — лучший костюм: даёт доступ почти во все зоны",
      "Оранжерея соединяется с конюшней через боковой выход",
      "В морге есть вентиляционный ход, ведущий под главную лестницу",
      "Садовый лабиринт — отличное место для тихих устранений, камер нет",
    ],
  },

  {
    id: "berlin",
    name: "Берлин",
    subtitle: "Клуб 'Apex'",
    mission: "Хищник вершины",
    region: "Германия",
    image: "🎵",
    difficulty: 3,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "parking",   name: "Парковка / Вход",     x: 140, y: 200, w: 100, h: 36 },
        { id: "main_floor",name: "Главный танцпол",      x: 80,  y: 120, w: 220, h: 72 },
        { id: "bar",       name: "Бар",                  x: 270, y: 50,  w: 100, h: 65 },
        { id: "vip",       name: "VIP-терраса",          x: 10,  y: 50,  w: 100, h: 65 },
        { id: "dj",        name: "DJ-кабина",            x: 155, y: 55,  w: 70,  h: 58, label: "DJ" },
        { id: "toilets",   name: "Туалеты",              x: 10,  y: 125, w: 62,  h: 60, label: "WC" },
        { id: "technical", name: "Тех. помещения",       x: 310, y: 125, w: 60,  h: 60, label: "Тех." },
        { id: "back_yard", name: "Задний двор / Мото",   x: 10,  y: 195, w: 120, h: 40 },
        { id: "boiler",    name: "Котельная",            x: 250, y: 195, w: 120, h: 40 },
      ],
    },
    codes: [
      { target: "Сейф в офисе клуба", code: "Случайный", location: "Подсобка у бара — за стойкой", type: "random", note: "Код — на стикере под столом барменши", zoneId: "bar" },
    ],
    weapons: [
      { name: "Пистолет с глушителем", location: "Раздевалка охраны, технические помещения", zone: "Ограниченная зона", icon: "🔫", zoneId: "technical" },
      { name: "Дробовик", location: "Котельная — на верстаке", zone: "Ограниченная зона", icon: "🔫", zoneId: "boiler" },
      { name: "Пистолет-пулемёт (SMG)", location: "Склад за танцполом, нижний уровень", zone: "Ограниченная зона", icon: "🔫", zoneId: "main_floor" },
    ],
    tools: [
      { name: "Монтировка", location: "Технические помещения — у щитка с предохранителями", icon: "🔧", zoneId: "technical" },
      { name: "Провод (удавка)", location: "Задний двор — у мотоциклов, на ящике", icon: "🪢", zoneId: "back_yard" },
      { name: "Кусачки", location: "Котельная — на трубе", icon: "✂️", zoneId: "boiler" },
      { name: "Нож (барный)", location: "Бар — под стойкой", icon: "🔪", zoneId: "bar" },
      { name: "Бутылка пива", location: "Бар и туалеты — на полках", icon: "🍺", zoneId: "bar" },
      { name: "Огнетушитель", location: "Тех. помещения и у выхода на парковку", icon: "🧯", zoneId: "technical" },
    ],
    tips: [
      "Байкерский костюм — лучший для задней зоны с мотоциклами",
      "Через канализацию можно незаметно уйти с карты",
      "Электрощиток у туалетов можно взорвать для диверсии",
    ],
  },

  {
    id: "chongqing",
    name: "Чунцин",
    subtitle: "Квартал и Объект ЦРУ",
    mission: "Конец эпохи",
    region: "Китай",
    image: "🌆",
    difficulty: 3,
    zoneLayout: {
      w: 380, h: 260,
      zones: [
        { id: "market",    name: "Рынок / Улица",          x: 10,  y: 10,  w: 110, h: 60 },
        { id: "noodle",    name: "Лапшичная",              x: 130, y: 10,  w: 90,  h: 60 },
        { id: "laundry",   name: "Прачечная",              x: 230, y: 10,  w: 140, h: 60 },
        { id: "residential",name:"Жилой квартал",          x: 10,  y: 80,  w: 150, h: 70 },
        { id: "rooftops",  name: "Крыши квартала",         x: 170, y: 80,  w: 100, h: 70 },
        { id: "facility1", name: "Объект ЦРУ — Офисы",    x: 280, y: 80,  w: 90,  h: 70, label: "ЦРУ·1" },
        { id: "facility2", name: "Объект ЦРУ — Сервер",   x: 280, y: 160, w: 90,  h: 55, label: "ЦРУ·2" },
        { id: "facility3", name: "Объект ЦРУ — Реактор",  x: 280, y: 225, w: 90,  h: 30, label: "ЦРУ·3" },
        { id: "tunnel",    name: "Тоннель / Выход",        x: 170, y: 200, w: 100, h: 55, label: "Тоннель" },
      ],
    },
    codes: [
      { target: "Дверь на Объект ЦРУ", code: "0118", location: "Металлическая дверь в переулке, восток квартала", type: "fixed", note: "Постоянный код, не меняется", zoneId: "facility1" },
      { target: "Серверная комната", code: "Ключ-карта", location: "Агент на Уровне 1 объекта", type: "key", note: "Или взломать терминал хакерским устройством", zoneId: "facility2" },
      { target: "Сейф Имогены Рулло", code: "Случайный", location: "Офис Рулло, Уровень 1 объекта", type: "random", note: "Код на стикере в кабинете или у помощника", zoneId: "facility1" },
    ],
    weapons: [
      { name: "Пистолет с глушителем", location: "Охранная комната Объекта, Уровень 1", zone: "Ограниченная зона", icon: "🔫", zoneId: "facility1" },
      { name: "Штурмовая винтовка", location: "Арсенал Объекта, Уровень 2", zone: "Ограниченная зона", icon: "🔫", zoneId: "facility2" },
      { name: "Снайперская винтовка", location: "Крыша жилого квартала, северо-западный угол", zone: "Свободная зона", icon: "🎯", zoneId: "rooftops" },
    ],
    tools: [
      { name: "Кухонный нож", location: "Лапшичная — на стойке у повара", icon: "🔪", zoneId: "noodle" },
      { name: "Ключ от прачечной", location: "Менеджер прачечной — у него в кармане", icon: "🔑", zoneId: "laundry" },
      { name: "Монтировка", location: "Технический переулок — у стены рядом с лестницей на крышу", icon: "🔧", zoneId: "residential" },
      { name: "EMP-устройство", location: "Объект ЦРУ, Уровень 2 — на столе техника", icon: "⚡", zoneId: "facility2" },
      { name: "Химикаты (яд)", location: "Прачечная — на полке с химией, у стиральных машин", icon: "☠️", zoneId: "laundry" },
      { name: "Карп (рыба)", location: "Рынок — прилавок с рыбой", icon: "🐟", zoneId: "market" },
      { name: "Хакерское устройство", location: "Квартира хакера, крыши квартала (восток)", icon: "💻", zoneId: "rooftops" },
    ],
    tips: [
      "Код 0118 — постоянный вход на Объект ЦРУ, не меняется",
      "Реактор на Уровне 3 можно перегрузить — массовый несчастный случай",
      "EMP отключает камеры и электронные замки в радиусе",
    ],
  },

  {
    id: "mendoza",
    name: "Мендоса",
    subtitle: "Виноградник Юлия",
    mission: "Прощание",
    region: "Аргентина",
    image: "🍷",
    difficulty: 2,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "vineyards_n", name: "Виноградник (север)", x: 10,  y: 10,  w: 160, h: 70 },
        { id: "bunker",      name: "Бункер (код 2019)",   x: 180, y: 10,  w: 90,  h: 70, label: "Бункер" },
        { id: "vineyards_s", name: "Виноградник (юг)",    x: 280, y: 10,  w: 90,  h: 70 },
        { id: "tasting",     name: "Дегустац. зал",       x: 10,  y: 90,  w: 130, h: 65 },
        { id: "press",       name: "Прессовый цех",       x: 150, y: 90,  w: 100, h: 65 },
        { id: "farm",        name: "Ферма / Склад",        x: 260, y: 90,  w: 110, h: 65 },
        { id: "villa",       name: "Особняк Юлия",        x: 10,  y: 165, w: 150, h: 65 },
        { id: "parking",     name: "Парковка / Вход",     x: 170, y: 195, w: 100, h: 40 },
        { id: "patio",       name: "Патио / Бассейн",     x: 280, y: 165, w: 90,  h: 65 },
      ],
    },
    codes: [
      { target: "Бункер (подземный склад)", code: "2019", location: "Люк в северной части виноградника", type: "fixed", note: "Постоянный код. Внутри: снайперка, пистолет, ценные предметы", zoneId: "bunker" },
      { target: "Сейф в кабинете особняка", code: "Случайный", location: "Кабинет на 2 этаже особняка", type: "random", note: "Код на листке в спальне или у управляющего", zoneId: "villa" },
    ],
    weapons: [
      { name: "Снайперская винтовка", location: "Бункер — на стеллаже", zone: "Ограниченная зона", icon: "🎯", zoneId: "bunker" },
      { name: "Пистолет (silenced)", location: "Бункер — в ящике", zone: "Ограниченная зона", icon: "🔫", zoneId: "bunker" },
      { name: "Штурмовая винтовка", location: "Склад фермы — у охранника", zone: "Ограниченная зона", icon: "🔫", zoneId: "farm" },
    ],
    tools: [
      { name: "Нож для фруктов", location: "Дегустационный зал — на подносе у входа", icon: "🔪", zoneId: "tasting" },
      { name: "Бутылка вина (удар/яд)", location: "Дегустационный зал — на стойке. Особняк — в столовой", icon: "🍾", zoneId: "tasting" },
      { name: "Яд (удобрение)", location: "Склад фермы — мешки у трактора", icon: "☠️", zoneId: "farm" },
      { name: "Монтировка", location: "Прессовый цех — рядом с прессом для винограда", icon: "🔧", zoneId: "press" },
      { name: "Лопата", location: "Виноградник, северная часть — у рабочих", icon: "⛏️", zoneId: "vineyards_n" },
    ],
    tips: [
      "Бункер с кодом 2019 — постоянный источник хорошего оружия",
      "Пресс для винограда — нестандартное устранение цели",
      "Вышка снайпера в южных виноградниках — отличная позиция",
    ],
  },

  {
    id: "paris",
    name: "Париж",
    subtitle: "Дворец Уолески",
    mission: "Показ мод",
    region: "Франция",
    image: "🗼",
    difficulty: 1,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "roof",     name: "Крыша / Чердак",     x: 100, y: 6,   w: 180, h: 42 },
        { id: "vip_cab",  name: "VIP-кабинеты",       x: 10,  y: 55,  w: 130, h: 60 },
        { id: "auction",  name: "Аукционный зал",      x: 150, y: 55,  w: 220, h: 60 },
        { id: "kitchen",  name: "Кухня",               x: 280, y: 125, w: 90,  h: 60 },
        { id: "lobby",    name: "Вестибюль",           x: 110, y: 125, w: 160, h: 60 },
        { id: "security", name: "Охрана",              x: 10,  y: 125, w: 90,  h: 60, label: "Охрана" },
        { id: "basement", name: "Подвал",              x: 90,  y: 195, w: 200, h: 40 },
        { id: "entrance", name: "Вход",                x: 160, y: 215, w: 60,  h: 22, label: "Вход" },
      ],
    },
    codes: [
      { target: "Сейф Викки Вандерсон", code: "Случайный", location: "Личная комната Викки, 2 этаж", type: "random", note: "Код на записке в переговорной. Сейф за картиной", zoneId: "vip_cab" },
      { target: "Оружейный шкаф в подвале", code: "Случайный", location: "Подвал, у технических помещений", type: "random", note: "Код у охранника подвала (проверить его планшет)", zoneId: "basement" },
    ],
    weapons: [
      { name: "Штурмовая винтовка", location: "Оружейная комната, 1 этаж — западное крыло", zone: "Ограниченная зона", icon: "🔫", zoneId: "security" },
      { name: "Дробовик", location: "Оружейная комната, 1 этаж", zone: "Ограниченная зона", icon: "🔫", zoneId: "security" },
      { name: "Снайперская винтовка", location: "Чердак / крыша — специальный схрон", zone: "Ограниченная зона", icon: "🎯", zoneId: "roof" },
      { name: "Пистолет", location: "Охранная комната, подвал", zone: "Ограниченная зона", icon: "🔫", zoneId: "basement" },
    ],
    tools: [
      { name: "Тесак", location: "Кухня, 1 этаж, восточное крыло — на разделочном столе", icon: "🔪", zoneId: "kitchen" },
      { name: "Кухонный нож", location: "Кухня — на стойке и в подставке ножей", icon: "🔪", zoneId: "kitchen" },
      { name: "Монтировка", location: "Подвал — у лестницы в технические помещения", icon: "🔧", zoneId: "basement" },
      { name: "Яд (флакон)", location: "Подсобка у VIP-кабинетов", icon: "☠️", zoneId: "vip_cab" },
      { name: "Огнетушитель", location: "Подвал и вестибюль — у стен", icon: "🧯", zoneId: "lobby" },
      { name: "Рыба (метательный)", location: "Кухня — на разделочном столе", icon: "🐟", zoneId: "kitchen" },
    ],
    tips: [
      "Костюм охранника VIP даёт проход почти везде",
      "Через кухню можно незаметно попасть в подвал",
      "Снайперская позиция на крыше — цель ходит по подиуму",
    ],
  },

  {
    id: "sapienza",
    name: "Сапиенца",
    subtitle: "Приморский город",
    mission: "Мир завтрашнего дня",
    region: "Италия",
    image: "🌊",
    difficulty: 2,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "plaza",     name: "Городская площадь",   x: 10,  y: 10,  w: 140, h: 65 },
        { id: "church",    name: "Церковь / Колокольня", x: 160, y: 10,  w: 100, h: 65 },
        { id: "lighthouse",name: "Маяк",                 x: 270, y: 10,  w: 100, h: 65, label: "Маяк" },
        { id: "villa_ext", name: "Вилла (фасад, сад)",   x: 10,  y: 85,  w: 180, h: 70 },
        { id: "villa_int", name: "Вилла (интерьер)",     x: 200, y: 85,  w: 170, h: 70 },
        { id: "lab",       name: "Подземная лаборатория",x: 60,  y: 165, w: 200, h: 65, label: "Лаборатория" },
        { id: "catacombs", name: "Катакомбы / Пляж",    x: 270, y: 165, w: 100, h: 65, label: "Катакомбы" },
      ],
    },
    codes: [
      { target: "Сейф в вилле Карузо", code: "Случайный", location: "Кабинет Сильвио, 2 этаж виллы", type: "random", note: "Код на записке у доктора или в спальне", zoneId: "villa_int" },
      { target: "Дверь в лабораторию", code: "Ключ-карта", location: "У охранника лаборатории (у входа в подвал)", type: "key", note: "Или через вентиляцию / катакомбы", zoneId: "lab" },
    ],
    weapons: [
      { name: "Снайперская винтовка", location: "Колокольня церкви — на верхнем ярусе", zone: "Свободная зона", icon: "🎯", zoneId: "church" },
      { name: "Пистолет", location: "Дом над пляжем (охрана) — прикроватная тумбочка", zone: "Ограниченная зона", icon: "🔫", zoneId: "catacombs" },
      { name: "Дробовик", location: "Оружейная лаборатории, нижний уровень", zone: "Ограниченная зона", icon: "🔫", zoneId: "lab" },
    ],
    tools: [
      { name: "Яд (вирусный образец)", location: "Подземная лаборатория — холодильник на нижнем ярусе", icon: "☠️", zoneId: "lab" },
      { name: "Отрава (пузырёк)", location: "Лаборатория — рабочий стол биолога", icon: "💉", zoneId: "lab" },
      { name: "Монтировка", location: "Катакомбы — у стены рядом со спуском к пляжу", icon: "🔧", zoneId: "catacombs" },
      { name: "Нож для бумаги", location: "Кабинет виллы — на столе", icon: "🔪", zoneId: "villa_int" },
      { name: "Ключ от церкви", location: "У священника на площади", icon: "🔑", zoneId: "plaza" },
    ],
    tips: [
      "Маяк — отличная снайперская позиция для всей территории у виллы",
      "Катакомбы — незаметный маршрут от пляжа до подвала виллы",
      "Доктор Агостини Коста появляется на вилле и в лаборатории попеременно",
    ],
  },

  {
    id: "miami",
    name: "Майами",
    subtitle: "Гонки Миллениум",
    mission: "Финишная черта",
    region: "США",
    image: "🏎️",
    difficulty: 1,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "track",     name: "Трасса",               x: 10,  y: 10,  w: 360, h: 50 },
        { id: "pitlane",   name: "Пит-лейн",             x: 10,  y: 70,  w: 180, h: 60 },
        { id: "paddock",   name: "Паддок Kronstadt",     x: 200, y: 70,  w: 170, h: 60 },
        { id: "hq",        name: "Штаб Kronstadt",       x: 10,  y: 140, w: 170, h: 65 },
        { id: "backstage", name: "Backstage / Сцена",    x: 190, y: 140, w: 100, h: 65 },
        { id: "medical",   name: "Медпункт",             x: 300, y: 140, w: 70,  h: 65, label: "Мед." },
      ],
    },
    codes: [
      { target: "Сейф в офисе Kronstadt", code: "Случайный", location: "Кабинет директора, 2 этаж штаба", type: "random", note: "Код на стикере у секретарши или в столовой", zoneId: "hq" },
    ],
    weapons: [
      { name: "Пистолет", location: "Комната охраны штаба Kronstadt", zone: "Ограниченная зона", icon: "🔫", zoneId: "hq" },
      { name: "Снайперская винтовка", location: "Технический балкон над трассой", zone: "Ограниченная зона", icon: "🎯", zoneId: "track" },
    ],
    tools: [
      { name: "Гаечный ключ", location: "Пит-лейн — на рабочем месте механика", icon: "🔧", zoneId: "pitlane" },
      { name: "Отвёртка", location: "Паддок — на ящике с инструментами", icon: "🪛", zoneId: "paddock" },
      { name: "Огнетушитель", location: "Пит-лейн и backstage — у стен", icon: "🧯", zoneId: "pitlane" },
      { name: "Сонный порошок", location: "Медпункт — на столе", icon: "💊", zoneId: "medical" },
      { name: "Скальпель", location: "Медпункт — в лотке", icon: "🔪", zoneId: "medical" },
    ],
    tips: [
      "Костюм механика — лучший для зон пит-лейн и паддока",
      "Нестандартное устранение: испортить болид в пит-лейн",
    ],
  },

  {
    id: "whittleton",
    name: "Уиттлтон Крик",
    subtitle: "Тихий американский пригород",
    mission: "Другая жизнь",
    region: "США",
    image: "🏡",
    difficulty: 2,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "jan_house",  name: "Дом Яна (штаб)",       x: 10,  y: 10,  w: 130, h: 80 },
        { id: "jan_bunker", name: "Бункер Яна",           x: 10,  y: 100, w: 130, h: 65, label: "Бункер" },
        { id: "alec_house", name: "Дом Алека Уэйта",      x: 150, y: 10,  w: 110, h: 80 },
        { id: "nina_house", name: "Дом Нины Кейн",        x: 270, y: 10,  w: 100, h: 80 },
        { id: "arnie_house",name: "Дом Арни Берга",       x: 270, y: 100, w: 100, h: 65 },
        { id: "street",     name: "Улица Мейпл",          x: 150, y: 100, w: 110, h: 65 },
        { id: "park",       name: "Парк / Барбекю",       x: 10,  y: 175, w: 180, h: 60 },
        { id: "garage",     name: "Гараж Пита",           x: 200, y: 175, w: 170, h: 60 },
        { id: "construction",name:"Стройплощадка",         x: 150, y: 90,  w: 110, h: 5 }, // thin line
      ],
    },
    codes: [
      { target: "Бункер Яна (подземный)", code: "Случайный", location: "Под домом Яна, вход в гараже", type: "random", note: "Код на стикере в его кабинете или у телохранителя", zoneId: "jan_bunker" },
      { target: "Сейф Алека Уэйта", code: "Случайный", location: "Кабинет Алека, 1 этаж", type: "random", note: "Код на блокноте или у жены (Нина Кейн знает)", zoneId: "alec_house" },
    ],
    weapons: [
      { name: "Охотничья винтовка", location: "Дом Арни Берга — в оружейном шкафу на 1 этаже", zone: "Свободная зона", icon: "🎯", zoneId: "arnie_house" },
      { name: "Пистолет", location: "Бункер Яна — на полке", zone: "Ограниченная зона", icon: "🔫", zoneId: "jan_bunker" },
      { name: "Автомат", location: "Бункер Яна — оружейная стойка", zone: "Ограниченная зона", icon: "🔫", zoneId: "jan_bunker" },
    ],
    tools: [
      { name: "Кухонный нож", location: "Дом Яна — кухня. Дом Алека — кухня", icon: "🔪", zoneId: "jan_house" },
      { name: "Яд для лужайки", location: "Гараж Пита — полки с химией", icon: "☠️", zoneId: "garage" },
      { name: "Монтировка", location: "Стройплощадка — на поддоне с материалами", icon: "🔧", zoneId: "street" },
      { name: "Лопата", location: "Сад дома Яна — у клумбы", icon: "⛏️", zoneId: "jan_house" },
      { name: "Гаечный ключ", location: "Гараж Пита — на верстаке", icon: "🔧", zoneId: "garage" },
      { name: "Сонный газ (баллон)", location: "Стройплощадка — у строительного вагончика", icon: "💨", zoneId: "street" },
    ],
    tips: [
      "Барбекю в парковой зоне собирает несколько жителей — удобно для яда",
      "Бункер Яна полон оружия, если знать код",
    ],
  },

  {
    id: "sgail",
    name: "Остров Шгайл",
    subtitle: "Замок Общества 'Ковчег'",
    mission: "Общество Ковчега",
    region: "Атлантический океан",
    image: "🏯",
    difficulty: 3,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "pier",      name: "Причал / Вход",         x: 150, y: 205, w: 80,  h: 30 },
        { id: "outer",     name: "Внешний двор",          x: 80,  y: 150, w: 220, h: 50 },
        { id: "inner",     name: "Внутренний двор",       x: 120, y: 90,  w: 140, h: 55 },
        { id: "chapel",    name: "Часовня",               x: 10,  y: 90,  w: 100, h: 115 },
        { id: "gallery",   name: "Галерея",               x: 270, y: 90,  w: 100, h: 115 },
        { id: "ritual",    name: "Ритуальный зал",        x: 120, y: 10,  w: 140, h: 74 },
        { id: "catacombs", name: "Катакомбы",             x: 10,  y: 10,  w: 100, h: 74, label: "Катак." },
        { id: "quarters",  name: "Жилые покои",           x: 270, y: 10,  w: 100, h: 74, label: "Покои" },
      ],
    },
    codes: [
      { target: "Оружейная замка", code: "Ключ", location: "У мажордома (Людвиг Бауэр)", type: "key", note: "Ключ в кармане, лучше нокаут в тихой зоне", zoneId: "inner" },
      { target: "Сейф в кабинете магистра", code: "Случайный", location: "Кабинет на верхнем этаже жилых покоев", type: "random", note: "Код на ритуальном манускрипте в часовне", zoneId: "quarters" },
    ],
    weapons: [
      { name: "Снайперская винтовка", location: "Оружейная замка — стена", zone: "Ограниченная зона", icon: "🎯", zoneId: "inner" },
      { name: "Пистолет", location: "Пост охраны у причала", zone: "Ограниченная зона", icon: "🔫", zoneId: "pier" },
      { name: "Штурмовая винтовка", location: "Оружейная замка", zone: "Ограниченная зона", icon: "🔫", zoneId: "inner" },
    ],
    tools: [
      { name: "Меч (ритуальный)", location: "Ритуальный зал — на алтаре", icon: "⚔️", zoneId: "ritual" },
      { name: "Яд (ритуальный кубок)", location: "Часовня — на столе у алтаря", icon: "☠️", zoneId: "chapel" },
      { name: "Монтировка", location: "Катакомбы — у стены рядом с бочками", icon: "🔧", zoneId: "catacombs" },
      { name: "Кинжал", location: "Галерея — в витрине (можно взять)", icon: "🗡️", zoneId: "gallery" },
    ],
    tips: [
      "Одеяние члена Общества даёт проход по всему замку",
      "Катакомбы — незаметный маршрут между крыльями замка",
      "Ритуальный меч — нестандартное устранение для испытаний",
    ],
  },

  {
    id: "hokkaido",
    name: "Хоккайдо",
    subtitle: "Клиника GAMA",
    mission: "Ситус Инверсус",
    region: "Япония",
    image: "🗻",
    difficulty: 3,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "ski",       name: "Горнолыжный склон",    x: 10,  y: 10,  w: 160, h: 65 },
        { id: "lobby",     name: "Лобби клиники",        x: 180, y: 10,  w: 190, h: 65 },
        { id: "onsen",     name: "Баня / Онсен",         x: 10,  y: 85,  w: 100, h: 70 },
        { id: "restaurant",name: "Ресторан",             x: 120, y: 85,  w: 120, h: 70 },
        { id: "wards",     name: "Палаты пациентов",     x: 250, y: 85,  w: 120, h: 70 },
        { id: "or",        name: "Операционные",         x: 10,  y: 165, w: 180, h: 65, label: "Операц." },
        { id: "lab",       name: "Подземная лаборатория",x: 200, y: 165, w: 170, h: 65, label: "Лаб." },
      ],
    },
    codes: [
      { target: "Хирургический отсек", code: "Ключ-карта", location: "У хирурга или анестезиолога", type: "key", note: "Уровень доступа 2 или выше", zoneId: "or" },
      { target: "Подземная лаборатория", code: "Ключ-карта", location: "У главного охранника лаборатории", type: "key", note: "Белый бейдж — максимальный доступ", zoneId: "lab" },
    ],
    weapons: [
      { name: "Скальпель", location: "Операционный зал — лоток с инструментами", zone: "Ограниченная зона", icon: "🔪", zoneId: "or" },
      { name: "Пистолет", location: "Комнаты охраны, 1 этаж", zone: "Ограниченная зона", icon: "🔫", zoneId: "lobby" },
    ],
    tools: [
      { name: "Летальная инъекция", location: "Аптечный шкаф, палатный коридор", icon: "💉", zoneId: "wards" },
      { name: "Сонные таблетки", location: "Ресторан — на кухне", icon: "💊", zoneId: "restaurant" },
      { name: "Нож для суши", location: "Ресторанная кухня — на разделочной доске", icon: "🔪", zoneId: "restaurant" },
      { name: "Провод (удавка)", location: "Баня — в шкафчике для вещей", icon: "🪢", zoneId: "onsen" },
    ],
    tips: [
      "Костюм хирурга — абсолютный пропуск в операционные зоны",
      "Баня — одна из немногих зон без камер видеонаблюдения",
    ],
  },

  {
    id: "bangkok",
    name: "Бангкок",
    subtitle: "Отель 'Клуб 27'",
    mission: "Клуб 27",
    region: "Таиланд",
    image: "🎸",
    difficulty: 2,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "lobby",    name: "Вестибюль отеля",      x: 100, y: 200, w: 180, h: 36 },
        { id: "restaurant",name:"Ресторан 'Клуб 27'",   x: 10,  y: 130, w: 170, h: 62 },
        { id: "kitchen",  name: "Кухня",                x: 190, y: 130, w: 100, h: 62 },
        { id: "studio",   name: "Муз. студия",          x: 300, y: 130, w: 70,  h: 62, label: "Студия" },
        { id: "penthouse",name: "Пентхаус",             x: 10,  y: 60,  w: 200, h: 62 },
        { id: "rooms",    name: "Номера гостей",        x: 220, y: 60,  w: 150, h: 62 },
        { id: "laundry",  name: "Прачечная / Тех. этаж",x: 10,  y: 10,  w: 360, h: 44 },
      ],
    },
    codes: [
      { target: "Сейф в пентхаусе", code: "Случайный", location: "Пентхаус, спальня Крейга Блэка", type: "random", note: "Код у личного менеджера или в кабинете директора отеля", zoneId: "penthouse" },
    ],
    weapons: [
      { name: "Пистолет", location: "Комната охраны, 1 этаж за рецепцией", zone: "Ограниченная зона", icon: "🔫", zoneId: "lobby" },
      { name: "Штурмовая винтовка", location: "Оружейная на техническом этаже", zone: "Ограниченная зона", icon: "🔫", zoneId: "laundry" },
    ],
    tools: [
      { name: "Кухонный нож", location: "Кухня ресторана — несколько штук", icon: "🔪", zoneId: "kitchen" },
      { name: "Яд (флакон)", location: "Кухня — в медицинском наборе у шеф-повара", icon: "☠️", zoneId: "kitchen" },
      { name: "Монтировка", location: "Прачечная — у стиральных машин", icon: "🔧", zoneId: "laundry" },
      { name: "Провод (удавка)", location: "Прачечная — на полке", icon: "🪢", zoneId: "laundry" },
      { name: "Гитара (оружие)", location: "Музыкальная студия — у стены", icon: "🎸", zoneId: "studio" },
    ],
    tips: [
      "Музыкальная студия — изолированная зона, отличное место для нокаута",
      "Через прачечную можно незаметно попасть на технический этаж",
    ],
  },

  {
    id: "colorado",
    name: "Колорадо",
    subtitle: "Ферма Пич",
    mission: "Борцы за свободу",
    region: "США",
    image: "🌽",
    difficulty: 3,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "gate",      name: "Ворота / КПП",         x: 160, y: 205, w: 60,  h: 30 },
        { id: "training",  name: "Тренировочный лагерь", x: 10,  y: 130, w: 180, h: 65 },
        { id: "farmhouse", name: "Фермерский дом",       x: 200, y: 130, w: 170, h: 65 },
        { id: "barn",      name: "Амбар",                x: 10,  y: 60,  w: 130, h: 62 },
        { id: "silo",      name: "Зернохранилище",       x: 150, y: 60,  w: 100, h: 62, label: "Зернохр." },
        { id: "bunker",    name: "Подземный бункер",     x: 260, y: 60,  w: 110, h: 62, label: "Бункер" },
        { id: "perimeter", name: "Периметр",             x: 10,  y: 10,  w: 360, h: 42 },
      ],
    },
    codes: [
      { target: "Бункер (главный вход)", code: "Ключ / Код", location: "Полевой командир — командная комната", type: "key", note: "Или взорвать генератор для отключения замка", zoneId: "bunker" },
      { target: "Оружейный склад в амбаре", code: "Случайный", location: "Доска объявлений в тренировочном лагере", type: "random", note: "Меняется каждую сессию", zoneId: "barn" },
    ],
    weapons: [
      { name: "Снайперская винтовка", location: "Зернохранилище — верхний ярус", zone: "Ограниченная зона", icon: "🎯", zoneId: "silo" },
      { name: "Автомат (AR)", location: "Оружейный склад в амбаре", zone: "Ограниченная зона", icon: "🔫", zoneId: "barn" },
      { name: "Дробовик", location: "Фермерский дом — 1 этаж, шкаф", zone: "Ограниченная зона", icon: "🔫", zoneId: "farmhouse" },
      { name: "Пистолет (несколько)", location: "Бункер — оружейная комната", zone: "Ограниченная зона", icon: "🔫", zoneId: "bunker" },
    ],
    tools: [
      { name: "Динамит", location: "Амбар — ящик у стены", icon: "💣", zoneId: "barn" },
      { name: "Яд (гербицид)", location: "Зернохранилище — бочки у входа", icon: "☠️", zoneId: "silo" },
      { name: "Монтировка", location: "Тренировочный лагерь — у мастерской", icon: "🔧", zoneId: "training" },
      { name: "Лопата", location: "Фермерский дом — задний двор", icon: "⛏️", zoneId: "farmhouse" },
    ],
    tips: [
      "Самая сложная карта: вся территория — ограниченная зона",
      "Костюм ополченца — единственный свободный пропуск везде",
      "Бункер — оптимальное место для накопления оружия",
    ],
  },

  {
    id: "mumbai",
    name: "Мумбаи",
    subtitle: "Трущобы и ткацкая фабрика",
    mission: "Преследуя призрака",
    region: "Индия",
    image: "🎪",
    difficulty: 3,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "beach",   name: "Пляж / Рыбный рынок", x: 10,  y: 165, w: 180, h: 65 },
        { id: "slums",   name: "Трущобы (Чоул)",       x: 10,  y: 85,  w: 180, h: 72 },
        { id: "factory", name: "Ткацкая фабрика",      x: 200, y: 85,  w: 170, h: 150 },
        { id: "rooftops",name: "Крыши трущоб",         x: 10,  y: 10,  w: 180, h: 68 },
        { id: "hq",      name: "Штаб Вана Шаха",       x: 200, y: 10,  w: 170, h: 68 },
      ],
    },
    codes: [
      { target: "Сейф Вана Шаха", code: "Случайный", location: "Кабинет на верхнем этаже штаба", type: "random", note: "Код у помощника или на доске в переговорной", zoneId: "hq" },
    ],
    weapons: [
      { name: "Снайперская винтовка", location: "Крыша ткацкой фабрики — специальная позиция", zone: "Ограниченная зона", icon: "🎯", zoneId: "factory" },
      { name: "Пистолет", location: "Охрана штаба — при себе и в комнате охраны", zone: "Ограниченная зона", icon: "🔫", zoneId: "hq" },
    ],
    tools: [
      { name: "Рыба (метательная)", location: "Рыбный рынок — прилавки", icon: "🐟", zoneId: "beach" },
      { name: "Нож разделочный", location: "Рыбный рынок и трущобные кухни", icon: "🔪", zoneId: "beach" },
      { name: "Монтировка", location: "Ткацкая фабрика — рабочее место у станков", icon: "🔧", zoneId: "factory" },
      { name: "Яд (химия с фабрики)", location: "Химический склад фабрики", icon: "☠️", zoneId: "factory" },
    ],
    tips: [
      "Цель-призрак Shaikh меняет локацию — слушать радиоподсказки",
      "Крыши трущоб соединены между собой — быстрое перемещение",
    ],
  },

  {
    id: "marrakesh",
    name: "Марракеш",
    subtitle: "Консульство и рынок",
    mission: "Позолоченная клетка",
    region: "Марокко",
    image: "🕌",
    difficulty: 2,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "bazaar",    name: "Базар / Рынок",        x: 10,  y: 10,  w: 160, h: 220 },
        { id: "school",    name: "Школа",                x: 180, y: 10,  w: 90,  h: 105 },
        { id: "consulate", name: "Шведское консульство", x: 280, y: 10,  w: 90,  h: 105, label: "Консул." },
        { id: "shisha",    name: "Штаб армии (Shisha)",  x: 180, y: 125, w: 190, h: 105 },
      ],
    },
    codes: [
      { target: "Сейф в консульстве", code: "Случайный", location: "Кабинет консула, 2 этаж", type: "random", note: "Код на документах на рабочем столе или у секретаря", zoneId: "consulate" },
    ],
    weapons: [
      { name: "Снайперская винтовка", location: "Крыша над рестораном Shisha — снайпер армии", zone: "Ограниченная зона", icon: "🎯", zoneId: "shisha" },
      { name: "Пистолет", location: "Охранная комната консульства", zone: "Ограниченная зона", icon: "🔫", zoneId: "consulate" },
    ],
    tools: [
      { name: "Разделочный нож", location: "Ресторан Shisha — кухня", icon: "🔪", zoneId: "shisha" },
      { name: "Монтировка", location: "Переулки медины — у стены стройки", icon: "🔧", zoneId: "bazaar" },
      { name: "Яд (специи)", location: "Рынок — лавка торговца специями", icon: "☠️", zoneId: "bazaar" },
    ],
    tips: [
      "Переулки медины — лучший путь для незаметного перемещения",
      "Крыши рынка соединены и не охраняются",
    ],
  },

  {
    id: "hawkesbay",
    name: "Бухта Хоукс",
    subtitle: "Пляжный дом",
    mission: "Ночной зов",
    region: "Новая Зеландия",
    image: "🌙",
    difficulty: 1,
    zoneLayout: {
      w: 380, h: 200,
      zones: [
        { id: "beach",    name: "Пляж / Берег",         x: 10,  y: 10,  w: 360, h: 50 },
        { id: "garden",   name: "Сад (снаружи)",         x: 10,  y: 70,  w: 150, h: 60 },
        { id: "ground_fl",name: "Гостиная (1 эт.)",      x: 170, y: 70,  w: 200, h: 60 },
        { id: "bedroom",  name: "Спальни (2 эт.)",       x: 170, y: 140, w: 200, h: 50, label: "Спальни" },
        { id: "garage",   name: "Гараж",                 x: 10,  y: 140, w: 150, h: 50 },
      ],
    },
    codes: [
      { target: "Сейф в спальне", code: "Случайный", location: "Спальня на 2 этаже", type: "random", note: "Код у охранника или в блокноте на кухне", zoneId: "bedroom" },
    ],
    weapons: [
      { name: "Пистолет", location: "Гараж — в ящике инструментов", zone: "Свободная зона", icon: "🔫", zoneId: "garage" },
      { name: "Снайперская винтовка", location: "Чердак дома — в чехле", zone: "Ограниченная зона", icon: "🎯", zoneId: "bedroom" },
    ],
    tools: [
      { name: "Кухонный нож", location: "Кухня — на разделочной доске", icon: "🔪", zoneId: "ground_fl" },
      { name: "Монтировка", location: "Гараж — на стеллаже", icon: "🔧", zoneId: "garage" },
      { name: "Провод (удавка)", location: "Гараж — на крюке у стены", icon: "🪢", zoneId: "garage" },
    ],
    tips: [
      "Самая маленькая карта — идеальна для быстрых заданий",
      "Цель появляется на пляже в начале — снайперский выстрел с берега",
    ],
  },

  {
    id: "ambrose",
    name: "Остров Амброуз",
    subtitle: "Пиратская база",
    mission: "Скрытый приз",
    region: "Андаманское море",
    image: "🏴‍☠️",
    difficulty: 2,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "pier",    name: "Причал",               x: 150, y: 205, w: 80,  h: 30 },
        { id: "camp",    name: "Пляжный лагерь",        x: 10,  y: 145, w: 180, h: 52 },
        { id: "village", name: "Деревня",               x: 200, y: 145, w: 170, h: 52 },
        { id: "jungle",  name: "Джунгли",               x: 10,  y: 75,  w: 180, h: 62 },
        { id: "hq",      name: "Штаб пиратов",          x: 200, y: 75,  w: 170, h: 62 },
        { id: "lighthouse",name:"Маяк",                 x: 10,  y: 10,  w: 110, h: 58, label: "Маяк" },
        { id: "caves",   name: "Пещеры",                x: 130, y: 10,  w: 240, h: 58 },
      ],
    },
    codes: [
      { target: "Сейф в штабе", code: "Случайный", location: "Кабинет командира, штаб", type: "random", note: "Код на доске в деревне или у заместителя", zoneId: "hq" },
    ],
    weapons: [
      { name: "АК-47 / варианты", location: "По всему лагерю — у охраны", zone: "Ограниченная зона", icon: "🔫", zoneId: "camp" },
      { name: "Снайперская винтовка", location: "Маяк — на верхней площадке", zone: "Ограниченная зона", icon: "🎯", zoneId: "lighthouse" },
    ],
    tools: [
      { name: "Мачете", location: "Джунгли — у входа в пещеры, на пнях", icon: "⚔️", zoneId: "jungle" },
      { name: "Динамит", location: "Склад у причала — деревянные ящики", icon: "💣", zoneId: "pier" },
      { name: "Нож", location: "Деревня — прилавок кухни", icon: "🔪", zoneId: "village" },
    ],
    tips: [
      "Пещеры — тайный проход между частями острова",
      "Маяк — отличная снайперская позиция с видом на деревню и штаб",
    ],
  },

  {
    id: "newyork",
    name: "Нью-Йорк",
    subtitle: "Банк Мэйфлауэр",
    mission: "Золотая рука",
    region: "США",
    image: "🏦",
    difficulty: 3,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "lobby",    name: "Вестибюль банка",       x: 110, y: 200, w: 160, h: 36 },
        { id: "hall",     name: "Зал для клиентов",      x: 80,  y: 135, w: 220, h: 58 },
        { id: "offices1", name: "Офисы 1-2 эт.",         x: 10,  y: 75,  w: 170, h: 52, label: "Офисы 1-2" },
        { id: "offices3", name: "Офис директора (3 эт.)",x: 190, y: 75,  w: 180, h: 52, label: "Директор" },
        { id: "security", name: "Охранный центр",        x: 10,  y: 10,  w: 130, h: 58, label: "Охрана" },
        { id: "server",   name: "Серверная",             x: 150, y: 10,  w: 100, h: 58 },
        { id: "vault",    name: "Хранилище",             x: 260, y: 10,  w: 110, h: 58 },
      ],
    },
    codes: [
      { target: "Хранилище банка", code: "Биометрия", location: "Подвальный уровень — биометрия директора", type: "key", note: "Нужно лицо директора (нокаут) или спец. устройство", zoneId: "vault" },
      { target: "Сейф директора", code: "Случайный", location: "Кабинет директора, 3 этаж", type: "random", note: "Код у зам. директора или в охранном центре", zoneId: "offices3" },
    ],
    weapons: [
      { name: "Пистолет", location: "Охранный центр — в шкафчиках", zone: "Ограниченная зона", icon: "🔫", zoneId: "security" },
      { name: "Дробовик", location: "Охранный пост у хранилища", zone: "Ограниченная зона", icon: "🔫", zoneId: "vault" },
    ],
    tools: [
      { name: "EMP (банковский)", location: "Серверная — на рабочем столе техника", icon: "⚡", zoneId: "server" },
      { name: "Монтировка", location: "Технический коридор — у щитка", icon: "🔧", zoneId: "security" },
      { name: "Пресс-папье (удар)", location: "Офисы — на столах", icon: "📎", zoneId: "offices1" },
    ],
    tips: [
      "Банкир — костюм для доступа в офисы без вопросов",
      "Хранилище содержит ценные предметы для Freelancer",
      "Камеры везде — охранный центр нейтрализовать первым",
    ],
  },

  {
    id: "haven",
    name: "Остров Хэйвен",
    subtitle: "Роскошный курорт",
    mission: "Последний отдых",
    region: "Мальдивы",
    image: "🏝️",
    difficulty: 2,
    zoneLayout: {
      w: 380, h: 240,
      zones: [
        { id: "pier",     name: "Пляж / Причал",         x: 10,  y: 190, w: 360, h: 44 },
        { id: "hotel",    name: "Главный отель",          x: 10,  y: 115, w: 200, h: 68 },
        { id: "spa",      name: "Спа / Бассейн",         x: 220, y: 115, w: 150, h: 68 },
        { id: "it",       name: "IT-центр",              x: 10,  y: 55,  w: 130, h: 52 },
        { id: "bungalows",name: "Жилые бунгало",         x: 150, y: 55,  w: 220, h: 52 },
        { id: "restaurant",name:"Ресторан",              x: 10,  y: 10,  w: 360, h: 38 },
      ],
    },
    codes: [
      { target: "IT-центр (серверная)", code: "Ключ-карта", location: "IT-директор или старший техник", type: "key", note: "Можно пройти в вентиляцию через бунгало", zoneId: "it" },
      { target: "Сейф в президентском бунгало", code: "Случайный", location: "Бунгало у воды, спальня", type: "random", note: "Код у консьержа или в записке у бассейна", zoneId: "bungalows" },
    ],
    weapons: [
      { name: "Пистолет", location: "Охранная комната отеля — в сейфе", zone: "Ограниченная зона", icon: "🔫", zoneId: "hotel" },
      { name: "Снайперская винтовка", location: "Техническая зона — специальная позиция", zone: "Ограниченная зона", icon: "🎯", zoneId: "it" },
    ],
    tools: [
      { name: "Нож для фруктов", location: "Ресторан — барная стойка", icon: "🔪", zoneId: "restaurant" },
      { name: "Яд (спа-смесь)", location: "Спа-зона — подсобка с препаратами", icon: "☠️", zoneId: "spa" },
      { name: "Монтировка", location: "IT-центр — ящик с инструментами", icon: "🔧", zoneId: "it" },
    ],
    tips: [
      "Сотрудник спа — хороший костюм для перемещения по курорту",
      "Бунгало расположены далеко — идеально для тихих устранений",
      "IT-центр отключает часть охраны при нейтрализации",
    ],
  },
];

const CODE_TYPES = {
  fixed:  { label: "Постоянный", color: "#4ade80", icon: "🔒" },
  random: { label: "Случайный",  color: "#facc15", icon: "🎲" },
  key:    { label: "Ключ/Карта", color: "#60a5fa", icon: "🗝️" },
};
