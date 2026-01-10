-- ============================================================
-- SCRIPT DE PEUPLEMENT DU CATALOGUE (RUSSE)
-- Exécuter dans Supabase SQL Editor
-- Images à placer dans public/images-product/
-- ============================================================

DELETE FROM products;

-- 1. BOIS DE CONSTRUCTION (Строительный лес) - 12 articles
INSERT INTO products (name, category, price, promo_price, description, image_path, vedette) VALUES
('Bois massif charpente', 'Bois de construction', 950, NULL, 'Для всех ваших текущих работ по каркасу, балкам, кровле и опалубке. Породы: Ель или Дугласия. Дополнительные услуги: Строгание, Обработка Класс 2.', '/images-product/bois-massif-charpente-sapin-douglas.jpg', true),
('Bois d''ossature C24', 'Bois de construction', 1200, 1100, 'Порода: Ель или Дугласия французского происхождения. Класс механической прочности: C24. Сухая древесина камерной сушки (18+/-2%). Строганая с 4 сторон, 4 фаски.', '/images-product/bois-ossature-epicea-douglas-c24.jpg', true),
('Bois d''emballage et coffrage', 'Bois de construction', 450, NULL, 'Идеально подходит для изготовления ящиков, поддонов, специальной упаковки и опалубки на стройплощадке. Обрезные доски, стропила и балки.', '/images-product/bois-emballage-coffrage-chantier.jpg', false),
('Bois Contre Collé', 'Bois de construction', 4500, NULL, 'Для всех ваших больших пролетов (до 13.50 м), выдерживающих значительные нагрузки. Порода: Ель. Доступна обработка Класс 2.', '/images-product/bois-contre-colle-structure-epicea.jpg', false),
('Bois Lamellé Collé', 'Bois de construction', 8500, 7900, 'Высокотехнологичные изделия для очень больших пролетов. Различные сечения от 120x280 мм до 200x440 мм. Длина до 13 м.', '/images-product/bois-lamelle-colle-grande-portee.jpg', true),
('Poutre en I', 'Bois de construction', 2500, NULL, 'Опора для пола и каркаса (прогоны, стропила). Полки из клееного бруса, сердцевина из твердых древесноволокнистых плит NFB. Ультралегкий и прочный.', '/images-product/poutre-en-i-lamibois-charpente.jpg', false);

-- 2. BOIS SCIÉ (Пиломатериалы) - 12 articles
INSERT INTO products (name, category, price, promo_price, description, image_path, vedette) VALUES
('Доска обрезная 25х100х6000 мм (1 сорт)', 'Bois scié', 350, 310, 'Классическая обрезная доска ГОСТ. Ровная геометрия, минимум обзола. Универсальный материал для стройки.', '/images-product/doska_obrez_25x100.jpg', true),
('Доска обрезная 50х150х6000 мм (1 сорт)', 'Bois scié', 850, NULL, 'Доска "Пятерка". Самый ходовой размер для каркаса, лесов и черновых полов.', '/images-product/doska_obrez_50x150.jpg', false),
('Доска необрезная 25 мм (Столярная)', 'Bois scié', 200, NULL, 'Необрезная доска камерной сушки. Широкая пласть, раскрытая текстура. Для столярных изделий и декора в стиле Рустик.', '/images-product/doska_neobrez_25.jpg', false),
('Брусок 40х40х3000 мм', 'Bois scié', 90, NULL, 'Брусок строганный сухой. Ровный, без сучков. Для мебели и каркасов.', '/images-product/brusok_40x40.jpg', false),
('Доска палубная (Лиственница) 28х140х4000 мм', 'Bois scié', 1800, 1650, 'Гладкая палубная доска сорта Прима. Не боится воды, снега и солнца. Срок службы более 25 лет.', '/images-product/doska_palub_listv.jpg', true),
('Доска заборная строганная 20х95х2000 мм', 'Bois scié', 120, NULL, 'Готовая доска для красивого деревянного забора. Закругленный верх (полукруг).', '/images-product/doska_zabor_20x95.jpg', false),
('Штакетник деревянный 20х45х1500 мм', 'Bois scié', 45, NULL, 'Сухой штакетник. Экономичное решение для ограждения участка.', '/images-product/shtaketnik.jpg', false),
('Доска половая шпунтованная 28х135х6000 мм', 'Bois scié', 980, NULL, 'Европол сосна. Идеальная стыковка, гладкая поверхность. Готовый чистовой пол.', '/images-product/doska_pol_28.jpg', false),
('Доска половая шпунтованная 36х135х6000 мм', 'Bois scié', 1250, NULL, 'Толстая половая доска 36мм. Не прогибается, отличная шумоизоляция. Сорт АБ.', '/images-product/doska_pol_36.jpg', true),
('Горбыль деловой (связка)', 'Bois scié', 500, NULL, 'Связка делового горбыля 3 метра. Для временных ограждений и черновых работ.', '/images-product/gorbyl.jpg', false),
('Опилки древесные (мешок 50л)', 'Bois scié', 100, NULL, 'Сухие стружки и опилки. Отличный утеплитель или подстилка для животных.', '/images-product/opilki.jpg', false),
('Срезки (Дрова)', 'Bois scié', 800, NULL, 'Обрезки досок (дрова) в ящике. Сухие, отлично горят.', '/images-product/srezki.jpg', false);

-- 3. BOIS EXTÉRIEUR (Экстерьерные системы) - 10 articles
INSERT INTO products (name, category, price, promo_price, description, image_path, vedette) VALUES
('Террасная доска "Вельвет" (Лиственница) 28х140х4000', 'Bois d''extérieur', 1900, 1750, 'Рифленая поверхность "антислип". Безопасно даже в дождь. Благородный цвет сибирской лиственницы.', '/images-product/terras_velvet_listv.jpg', true),
('Планкен скошенный (Лиственница) 20х140х4000', 'Bois d''extérieur', 1600, NULL, 'Фасадная доска со скошенным профилем. Обеспечивает вентиляцию фасада и скрывает крепеж. Сорт Прима.', '/images-product/planken_skosh.jpg', true),
('Планкен прямой (Сосна) 20х120х3000', 'Bois d''extérieur', 650, NULL, 'Экономичный вариант для обшивки фасада. Сухая сосна сорта АБ.', '/images-product/planken_pryamoy_sosna.jpg', false),
('Террасная доска ДПК (Венге) 140х25х4000', 'Bois d''extérieur', 2200, NULL, 'Композитная террасная доска. Не требует покраски и ухода. Цвет темно-коричневый (Венге). Гарантия 10 лет.', '/images-product/terras_dpk_wenge.jpg', false),
('Ограждение для террасы (секция 2м)', 'Bois d''extérieur', 4500, NULL, 'Готовая секция перил из лиственницы. Крестообразный узор.', '/images-product/ograzhdenie_terrasy.jpg', false),
('Ступень для крыльца (Лиственница) 40х300х1200', 'Bois d''extérieur', 1500, NULL, 'Цельноламельная ступень. Высокая износостойкость. Скругленная передняя кромка.', '/images-product/stupen_listv.jpg', false),
('Садовый паркет (Плитка) 30х30 см', 'Bois d''extérieur', 350, NULL, 'Модульное покрытие из акации. Легко собирается без инструментов. Для балконов и патио.', '/images-product/sad_parket.jpg', false),
('Брус для перголы 100х100 (Тонированный)', 'Bois d''extérieur', 1800, NULL, 'Обработанный маслом брус для строительства беседок и пергол. Защита от УФ.', '/images-product/brus_pergola.jpg', false),
('Фасадная панель (Термоясень)', 'Bois d''extérieur', 4200, NULL, 'Элитная фасадная отделка. Термообработанный ясень - стабильный и невероятно красивый.', '/images-product/termo_yasen.jpg', false),
('Масло для террас (2.5 л)', 'Bois d''extérieur', 3800, NULL, 'Профессиональное масло с твердым воском. Защищает от воды и посерения.', '/images-product/maslo_terras.jpg', false);

-- 4. BOIS DÉCORATIF (Декоративная отделка) - 10 articles
INSERT INTO products (name, category, price, promo_price, description, image_path, vedette) VALUES
('Вагонка Штиль (Сосна) 14х120х3000 (Сорт А)', 'Bois décoratif', 550, 490, 'Классическая вагонка Штиль. Гладкий профиль без полки. Идеально для потолков и стен.', '/images-product/vagonka_shtil_A.jpg', true),
('Вагонка Штиль (Кедр) 14х140х3000', 'Bois décoratif', 1800, NULL, 'Алтайский кедр. Неповторимый аромат и целебные свойства. Розоватый оттенок древесины.', '/images-product/vagonka_kedr.jpg', true),
('Имитация бруса 20х145х6000 (Карельский профиль)', 'Bois décoratif', 980, NULL, 'Толстая обшивочная доска. Создает полный эффект стены из цельного бруса. Сорт АБ.', '/images-product/imitacia_brusa.jpg', false),
('Блок-хаус 28х140х6000 (Сорт А)', 'Bois décoratif', 1200, NULL, 'Имитация оцилиндрованного бревна. Для внешней и внутренней отделки под "Избу".', '/images-product/block_house.jpg', false),
('Галтель (Потолочный плинтус) 30х30', 'Bois décoratif', 120, NULL, 'Деревянный плинтус бессучковый. Скрывает стык стены и потолка.', '/images-product/galtel.jpg', false),
('Наличник фигурный 70мм', 'Bois décoratif', 150, NULL, 'Резной наличник для окон и дверей. Придает законченный вид интерьеру.', '/images-product/nalichnik.jpg', false),
('Уголок деревянный 40х40', 'Bois décoratif', 90, NULL, 'Внешний уголок для защиты углов стен. Гладкий, шлифованный.', '/images-product/ugolok_40.jpg', false),
('Подоконник деревянный 40х300х2000', 'Bois décoratif', 2100, NULL, 'Клееный щит (сосна). Прочный подоконник, готов к лакировке.', '/images-product/podokonnik.jpg', false),
('Экран для батареи (Ротанг)', 'Bois décoratif', 1800, NULL, 'Декоративный экран. Деревянная рамка с вставкой из искусственного ротанга.', '/images-product/ekran_batarea.jpg', false),
('Решетка декоративная (Бук)', 'Bois décoratif', 2500, NULL, 'Перегородка из массива бука. Для зонирования пространства.', '/images-product/reshetka_buk.jpg', false);

-- 5. PANNEAUX ET VOILES (Панели и щиты) - 8 articles
INSERT INTO products (name, category, price, promo_price, description, image_path, vedette) VALUES
('Фанера ФК 4/4 1525х1525 10мм', 'Panneaux et voiles', 650, NULL, 'Березовая фанера влагостойкая. Сорт строительный. Для черновых полов и упаковки.', '/images-product/fanera_10.jpg', false),
('Фанера ФК 2/4 1525х1525 18мм (Шлифованная)', 'Panneaux et voiles', 1400, 1250, 'Толстая шлифованная фанера. Подходит для мебели и чистовых работ. Лицевая сторона без сучков.', '/images-product/fanera_18_shlif.jpg', true),
('OSB-3 Калевала 9мм 1250х2500', 'Panneaux et voiles', 720, NULL, 'Плита ориентированно-стружечная влагостойкая. Стандарт каркасного домостроения.', '/images-product/osb_9.jpg', false),
('OSB-3 Калевала 12мм 1250х2500', 'Panneaux et voiles', 940, NULL, 'Усиленная плита OSB. Для кровельной обрешетки и несущих стен.', '/images-product/osb_12.jpg', false),
('Мебельный щит (Сосна) 18х600х2000 (Экстра)', 'Panneaux et voiles', 2200, NULL, 'Цельноламельный щит без сучков. Идеален для изготовления столешниц и полок.', '/images-product/shit_sosna_extra.jpg', true),
('Мебельный щит (Дуб) 40х600х1500', 'Panneaux et voiles', 6500, NULL, 'Массив дуба. Тяжелый, твердый, вечный материал для премиальной мебели или ступеней.', '/images-product/shit_dub.jpg', false),
('ДВП (Оргалит) 3.2мм 1220х2440', 'Panneaux et voiles', 250, NULL, 'Древесно-волокнистая плита. Для задних стенок шкафов и временных ограждений.', '/images-product/dvp.jpg', false),
('ЦСП 10мм 1200х3200', 'Panneaux et voiles', 1800, NULL, 'Цементно-стружечная плита. Не горит, не боится воды. Для фасадов и влажных помещений.', '/images-product/csp.jpg', false);

-- 6. BOIS POUR SAUNA (Для бани и сауны) - 8 articles
INSERT INTO products (name, category, price, promo_price, description, image_path, vedette) VALUES
('Вагонка Липа (Сорт Экстра) 15х96х2400', 'Bois pour sauna', 2500, 2200, 'Медовая липа. Не нагревается, не выделяет смолу. Эталон для парной.', '/images-product/vagonka_lipa.jpg', true),
('Полок Липа (Экстра) 27х90х2400', 'Bois pour sauna', 850, NULL, 'Гладкая доска для лежаков. Закругленные края. Приятна к телу.', '/images-product/polok_lipa.jpg', false),
('Вагонка Ольха (Евро) 15х88х2400', 'Bois pour sauna', 2300, NULL, 'Царское дерево. Красноватый оттенок, влагостойкость. Очень красиво стареет.', '/images-product/vagonka_olha.jpg', false),
('Полок Абаш (Африка) 25х95х2400', 'Bois pour sauna', 1400, NULL, 'Пористая древесина. Всегда принимает температуру тела, невозможно обжечься.', '/images-product/polok_abash.jpg', false),
('Дверь для сауны (Стекло Бронза)', 'Bois pour sauna', 4500, NULL, 'Закаленное стекло 8мм, коробка - липа. Магнитный замок, силиконовый уплотнитель.', '/images-product/dver_sauna.jpg', true),
('Абажур угловой (Липа)', 'Bois pour sauna', 800, NULL, 'Деревянный абажур для мягкого рассеянного света в парной.', '/images-product/abazhur.jpg', false),
('Подголовник анатомический (Кедр)', 'Bois pour sauna', 1200, NULL, 'Эргономичный подголовник для комфортного парения.', '/images-product/podgolovnik.jpg', false),
('Камни для печи (Жадеит, 10кг)', 'Bois pour sauna', 1800, NULL, 'Полудрагоценный камень. Дает легкий пар, служит более 5 лет.', '/images-product/kamni.jpg', false);

-- 7. DROVA ET BIOTOPLIVO (Дрова и Биотопливо) - 6 articles
INSERT INTO products (name, category, price, promo_price, description, image_path, vedette) VALUES
('Дрова березовые колотые (Сетка 40л)', 'Drova et Biotoplivо', 250, NULL, 'Сухие березовые дрова. Длинный жар, приятный аромат. В удобной сетке.', '/images-product/drova_bereza.jpg', true),
('Дрова дубовые (Поддон 1м3)', 'Drova et Biotoplivо', 5500, 4900, 'Элитное топливо. Дуб горит в 2 раза дольше березы. Высочайшая теплоотдача.', '/images-product/drova_dub.jpg', true),
('Топливные брикеты RUF (Упаковка 10кг)', 'Drova et Biotoplivо', 180, NULL, 'Брикеты из березовой пыли. Горят жарко, минимум золы. Удобно хранить "Кирпичики".', '/images-product/brikety_ruf.jpg', false),
('Пеллеты древесные 6мм (Мешок 15кг)', 'Drova et Biotoplivо', 350, NULL, 'Светлые пеллеты стандарта DIN+. Для автоматических котлов. Зольность < 0.5%.', '/images-product/pellety.jpg', false),
('Дрова осиновые (Сетка)', 'Drova et Biotoplivо', 220, NULL, 'Осина чистит дымоход от сажи. Рекомендуется протапливать раз в месяц.', '/images-product/drova_osina.jpg', false),
('Уголь древесный березовый (3кг)', 'Drova et Biotoplivо', 290, NULL, 'Отборный крупный уголь для мангала. Без пыли. Быстрый розжиг.', '/images-product/ugol.jpg', false);

-- 8. BOIS BRUT/INDUSTRIEL (Техническое дерево) - 6 articles
INSERT INTO products (name, category, price, promo_price, description, image_path, vedette) VALUES
('Брус опалубочный 100х100 (2 сорт)', 'Bois brut/industriel', 950, NULL, 'Брус с обзолом. Для опалубки фундаментов и временных конструкций.', '/images-product/brus_2sort.jpg', false),
('Доска обрезная 25х150 (2 сорт)', 'Bois brut/industriel', 200, 180, 'Доска с тупым обзолом. Подходит для черновой подшивки крыши и опалубки.', '/images-product/doska_2sort.jpg', true),
('Поддоны деревянные Б/У', 'Bois brut/industriel', 150, NULL, 'Европоддон 1200х800. Целый, крепкий. Для складского хранения.', '/images-product/poddon.jpg', false),
('Колья строительные (пачка 10шт)', 'Bois brut/industriel', 300, NULL, 'Заостренные колья для разметки участка.', '/images-product/kolya.jpg', false),
('Фанера некондиция (Обрезки)', 'Bois brut/industriel', 150, NULL, 'Полосы фанеры. Для мелкого ремонта и поделок.', '/images-product/fanera_obrezki.jpg', false),
('Щиты для лесов строительных', 'Bois brut/industriel', 450, NULL, 'Сбитые щиты из доски 40мм. Готовый настил.', '/images-product/shity_lesa.jpg', false);

