BEGIN;

INSERT INTO clubs (id, slug, name, description, city, created_at, updated_at) VALUES
  (601, 'demo-club', 'Демо клуб', 'Тестовые данные клуба', 'Москва', now(), now());

INSERT INTO players (id, name, sex, ntrp) VALUES
  (2001, 'Кортов Алексей', 'male', '3.0'),
  (2002, 'Кортин Борис', 'male', '3.0'),
  (2003, 'Кортев Владимир', 'male', '3.0'),
  (2004, 'Кортский Георгий', 'male', '3.0'),
  (2005, 'Кортцев Дмитрий', 'male', '3.0'),
  (2006, 'Кортников Егор', 'male', '3.0'),
  (2007, 'Кортяр Жан', 'male', '3.0'),
  (2008, 'Кортченко Захар', 'male', '3.0'),
  (2009, 'Кортушкин Иван', 'male', '3.0'),
  (2010, 'Кортутин Константин', 'male', '3.0'),
  (2011, 'Кортянин Лев', 'male', '3.0'),
  (2012, 'Кортицкий Максим', 'male', '3.0'),
  (2013, 'Кортягин Никита', 'male', '3.0'),
  (2014, 'Кортман Олег', 'male', '3.0'),
  (2015, 'Кортович Павел', 'male', '3.0'),
  (2016, 'Кортарёв Роман', 'male', '3.0'),
  (2017, 'Кортятов Сергей', 'male', '3.0'),
  (2018, 'Кортицин Тимур', 'male', '3.0'),
  (2019, 'Кортель Ульян', 'male', '3.0'),
  (2020, 'Кортор Фёдор', 'male', '3.0'),
  (2021, 'Кортягулов Харитон', 'male', '3.0'),
  (2022, 'Кортарин Эдуард', 'male', '3.0'),
  (2023, 'Кортяев Юрий', 'male', '3.0'),
  (2024, 'Кортюков Ярослав', 'male', '3.0'),
  (2025, 'Кортяткин Адам', 'male', '3.0'),
  (2026, 'Кортцков Богдан', 'male', '3.0'),
  (2027, 'Кортяров Виталий', 'male', '3.0'),
  (2028, 'Кортевич Григорий', 'male', '3.0'),
  (2029, 'Кортастов Данил', 'male', '3.0'),
  (2030, 'Кортевский Елисей', 'male', '3.0'),
  (2031, 'Теннисов Кирилл', 'male', '3.0'),
  (2032, 'Теннисин Леонид', 'male', '3.0'),
  (2033, 'Теннисев Марат', 'male', '3.0'),
  (2034, 'Теннисский Назар', 'male', '3.0'),
  (2035, 'Теннисцев Платон', 'male', '3.0'),
  (2036, 'Теннисников Руслан', 'male', '3.0'),
  (2037, 'Теннисяр Станислав', 'male', '3.0'),
  (2038, 'Теннисченко Тихон', 'male', '3.0'),
  (2039, 'Теннисушкин Филипп', 'male', '3.0'),
  (2040, 'Теннисутин Христиан', 'male', '3.0'),
  (2041, 'Теннисянин Эмиль', 'male', '3.0'),
  (2042, 'Теннисицкий Юлиан', 'male', '3.0'),
  (2043, 'Теннисягин Ян', 'male', '3.0'),
  (2044, 'Теннисман Артём', 'male', '3.0'),
  (2045, 'Теннисович Вадим', 'male', '3.0'),
  (2046, 'Теннисарёв Глеб', 'male', '3.0'),
  (2047, 'Теннисятов Демид', 'male', '3.0'),
  (2048, 'Теннисицин Евграф', 'male', '3.0'),
  (2049, 'Теннисель Илья', 'male', '3.0'),
  (2050, 'Теннисор Клим', 'male', '3.0'),
  (2051, 'Теннисягулов Лука', 'male', '3.0'),
  (2052, 'Теннисарин Матвей', 'male', '3.0'),
  (2053, 'Теннисяев Николай', 'male', '3.0'),
  (2054, 'Теннисюков Остап', 'male', '3.0'),
  (2055, 'Теннисяткин Родион', 'male', '3.0'),
  (2056, 'Теннисцков Святослав', 'male', '3.0'),
  (2057, 'Теннисяров Тарас', 'male', '3.0'),
  (2058, 'Теннисевич Фома', 'male', '3.0'),
  (2059, 'Теннисастов Хасан', 'male', '3.0'),
  (2060, 'Теннисевский Эрик', 'male', '3.0'),
  (2061, 'Сетов Яков', 'male', '3.0'),
  (2062, 'Сетин Арсений', 'male', '3.0'),
  (2063, 'Сетев Валентин', 'male', '3.0'),
  (2064, 'Сетский Гавриил', 'male', '3.0'),
  (2065, 'Сетцев Данила', 'male', '3.0'),
  (2066, 'Сетников Евгений', 'male', '3.0'),
  (2067, 'Сетяр Игорь', 'male', '3.0'),
  (2068, 'Сетченко Кай', 'male', '3.0'),
  (2069, 'Сетушкин Лион', 'male', '3.0'),
  (2070, 'Сетутин Мирон', 'male', '3.0'),
  (2071, 'Сетянин Никон', 'male', '3.0'),
  (2072, 'Сетицкий Орест', 'male', '3.0'),
  (2073, 'Сетягин Пётр', 'male', '3.0'),
  (2074, 'Сетман Роберт', 'male', '3.0'),
  (2075, 'Сетович Савва', 'male', '3.0'),
  (2076, 'Сетарёв Тамерлан', 'male', '3.0'),
  (2077, 'Сетятов Фёдорий', 'male', '3.0'),
  (2078, 'Сетицин Холмог', 'male', '3.0'),
  (2079, 'Сетель Эльдар', 'male', '3.0'),
  (2080, 'Сетор Юстин', 'male', '3.0'),
  (2081, 'Сетягулов Ярема', 'male', '3.0'),
  (2082, 'Сетарин Андрей', 'male', '3.0'),
  (2083, 'Сетяев Вениамин', 'male', '3.0'),
  (2084, 'Сетюков Герман', 'male', '3.0'),
  (2085, 'Сетяткин Давид', 'male', '3.0'),
  (2086, 'Сетцков Еремей', 'male', '3.0'),
  (2087, 'Сетяров Казимир', 'male', '3.0'),
  (2088, 'Сетевич Лазарь', 'male', '3.0'),
  (2089, 'Сетастов Марк', 'male', '3.0'),
  (2090, 'Сетевский Нестор', 'male', '3.0'),
  (2091, 'Сервисов Оскар', 'male', '3.0'),
  (2092, 'Сервисин Ринат', 'male', '3.0'),
  (2093, 'Сервисев Степан', 'male', '3.0'),
  (2094, 'Сервисский Тимофей', 'male', '3.0'),
  (2095, 'Сервисцев Феликс', 'male', '3.0'),
  (2096, 'Сервисников Харис', 'male', '3.0'),
  (2097, 'Сервисяр Эльмир', 'male', '3.0'),
  (2098, 'Сервисченко Юстус', 'male', '3.0'),
  (2099, 'Сервисушкин Ярополк', 'male', '3.0'),
  (2100, 'Сервисутин Авдей', 'male', '3.0');

INSERT INTO club_members (club_id, player_id) VALUES
  (601, 2001),
  (601, 2002),
  (601, 2003),
  (601, 2004),
  (601, 2005),
  (601, 2006),
  (601, 2007),
  (601, 2008),
  (601, 2009),
  (601, 2010),
  (601, 2011),
  (601, 2012),
  (601, 2013),
  (601, 2014),
  (601, 2015),
  (601, 2016),
  (601, 2017),
  (601, 2018),
  (601, 2019),
  (601, 2020),
  (601, 2021),
  (601, 2022),
  (601, 2023),
  (601, 2024),
  (601, 2025),
  (601, 2026),
  (601, 2027),
  (601, 2028),
  (601, 2029),
  (601, 2030),
  (601, 2031),
  (601, 2032),
  (601, 2033),
  (601, 2034),
  (601, 2035),
  (601, 2036),
  (601, 2037),
  (601, 2038),
  (601, 2039),
  (601, 2040),
  (601, 2041),
  (601, 2042),
  (601, 2043),
  (601, 2044),
  (601, 2045),
  (601, 2046),
  (601, 2047),
  (601, 2048),
  (601, 2049),
  (601, 2050),
  (601, 2051),
  (601, 2052),
  (601, 2053),
  (601, 2054),
  (601, 2055),
  (601, 2056),
  (601, 2057),
  (601, 2058),
  (601, 2059),
  (601, 2060),
  (601, 2061),
  (601, 2062),
  (601, 2063),
  (601, 2064),
  (601, 2065),
  (601, 2066),
  (601, 2067),
  (601, 2068),
  (601, 2069),
  (601, 2070),
  (601, 2071),
  (601, 2072),
  (601, 2073),
  (601, 2074),
  (601, 2075),
  (601, 2076),
  (601, 2077),
  (601, 2078),
  (601, 2079),
  (601, 2080),
  (601, 2081),
  (601, 2082),
  (601, 2083),
  (601, 2084),
  (601, 2085),
  (601, 2086),
  (601, 2087),
  (601, 2088),
  (601, 2089),
  (601, 2090),
  (601, 2091),
  (601, 2092),
  (601, 2093),
  (601, 2094),
  (601, 2095),
  (601, 2096),
  (601, 2097),
  (601, 2098),
  (601, 2099),
  (601, 2100);

INSERT INTO tournaments (id, name, format, tournament_type, status, is_public, slug, club_id, start_date, end_date, creator_id, settings) VALUES
  (801, 'Демо Пирамида (одиночная)', 'pyramid', 'single', 'ongoing', true, 'demo-pyramid-single', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (802, 'Демо Пирамида (парная)', 'pyramid', 'double', 'ongoing', true, 'demo-pyramid-double', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (803, 'Демо Круговой (одиночная)', 'round_robin', 'single', 'ongoing', true, 'demo-rr-single', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (804, 'Демо Круговой (парная)', 'round_robin', 'double', 'ongoing', true, 'demo-rr-double', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (805, 'Демо Олимпийка (одиночная)', 'single_elimination', 'single', 'ongoing', true, 'demo-se-single', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (806, 'Демо Олимпийка (парная)', 'single_elimination', 'double', 'ongoing', true, 'demo-se-double', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (807, 'Демо Двойная сетка (одиночная)', 'double_elimination', 'single', 'ongoing', true, 'demo-de-single', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (808, 'Демо Двойная сетка (парная)', 'double_elimination', 'double', 'ongoing', true, 'demo-de-double', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (809, 'Демо Группы+ПО (одиночная)', 'groups_playoff', 'single', 'ongoing', true, 'demo-gp-single', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (810, 'Демо Группы+ПО (парная)', 'groups_playoff', 'double', 'ongoing', true, 'demo-gp-double', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (811, 'Демо Швейцарка (одиночная)', 'swiss', 'single', 'ongoing', true, 'demo-swiss-single', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (812, 'Демо Швейцарка (парная)', 'swiss', 'double', 'ongoing', true, 'demo-swiss-double', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (813, 'Демо Произвольный (одиночная)', 'custom', 'single', 'ongoing', true, 'demo-custom-single', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb),
  (814, 'Демо Произвольный (парная)', 'custom', 'double', 'ongoing', true, 'demo-custom-double', 601, '2024-01-01', '2024-12-31', 3, '{}'::jsonb);

INSERT INTO tournament_participants (tournament_id, player_id, level, position) VALUES
  (801, 2018, 1, 1),
  (801, 2087, 2, 1),
  (801, 2013, 2, 2),
  (801, 2073, 3, 2),
  (801, 2007, 3, 3),
  (801, 2066, 3, 1),
  (801, 2033, 4, 2),
  (801, 2042, 4, 1),
  (801, 2077, 4, 4),
  (801, 2051, 4, 3),
  (801, 2029, 5, 2),
  (801, 2063, 5, 3),
  (801, 2011, 5, 1),
  (801, 2031, 5, 5),
  (801, 2084, 5, 4),
  (801, 2093, 6, 6),
  (801, 2040, 6, 2),
  (801, 2026, 6, 4),
  (801, 2017, 6, 5),
  (801, 2065, 6, 3),
  (801, 2006, 6, 1),
  (801, 2015, 7, 6),
  (801, 2055, 7, 2),
  (801, 2095, 7, 5),
  (801, 2064, 7, 7),
  (801, 2020, 7, 1),
  (801, 2099, 7, 4),
  (801, 2035, 7, 3),
  (801, 2070, 8, 3),
  (801, 2097, 8, 5),
  (801, 2005, 8, 4),
  (801, 2008, 8, 7),
  (801, 2091, 8, 8),
  (801, 2009, 8, 6),
  (801, 2014, 8, 2),
  (801, 2010, 8, 1),
  (801, 2067, 9, 3),
  (801, 2088, 9, 2),
  (801, 2002, 9, 7),
  (801, 2080, 9, 5),
  (801, 2059, 9, 6),
  (801, 2072, 9, 9),
  (801, 2048, 9, 8),
  (801, 2049, 9, 1),
  (801, 2043, 9, 4),
  (801, 2100, 10, 1),
  (801, 2074, 10, 6),
  (801, 2050, 10, 4),
  (801, 2004, 10, 3),
  (801, 2021, 10, 9),
  (801, 2060, 10, 7),
  (801, 2058, 10, 8),
  (801, 2071, 10, 2),
  (801, 2016, 10, 10),
  (801, 2047, 10, 5),
  (801, 2001, 11, 3),
  (801, 2022, 11, 6),
  (801, 2032, 11, 9),
  (801, 2045, 11, 2),
  (801, 2096, 11, 4),
  (801, 2024, 11, 7),
  (801, 2061, 11, 11),
  (801, 2086, 11, 1),
  (801, 2062, 11, 8),
  (801, 2079, 11, 5),
  (801, 2023, 11, 10),
  (801, 2025, 12, 3),
  (801, 2085, 12, 10),
  (801, 2078, 12, 5),
  (801, 2075, 12, 2),
  (801, 2037, 12, 7),
  (801, 2012, 12, 1),
  (801, 2098, 12, 4),
  (801, 2082, 12, 8),
  (801, 2092, 12, 6),
  (801, 2034, 12, 9),
  (801, 2081, 12, 11),
  (801, 2030, 12, 12),
  (801, 2056, 13, 13),
  (801, 2090, 13, 1),
  (801, 2076, 13, 2),
  (801, 2038, 13, 7),
  (801, 2039, 13, 10),
  (801, 2052, 13, 6),
  (801, 2028, 13, 3),
  (801, 2089, 13, 5),
  (801, 2057, 13, 8),
  (801, 2003, 13, 9),
  (801, 2083, 13, 11),
  (801, 2019, 13, 4),
  (801, 2046, 13, 12),
  (801, 2069, 14, 1),
  (801, 2068, 14, 4),
  (801, 2027, 14, 5),
  (801, 2054, 14, 11),
  (801, 2036, 14, 6),
  (801, 2041, 14, 12),
  (801, 2053, 14, 9),
  (801, 2044, 14, 14),
  (801, 2094, 14, 3);

INSERT INTO tournament_participants (tournament_id, player_id) VALUES
  (803, 2001),
  (803, 2002),
  (803, 2003),
  (803, 2004),
  (803, 2005),
  (803, 2006),
  (803, 2007),
  (803, 2008),
  (803, 2009),
  (803, 2010),
  (803, 2011),
  (803, 2012),
  (803, 2013),
  (803, 2014),
  (803, 2015),
  (803, 2016);

INSERT INTO tournament_participants (tournament_id, player_id) VALUES
  (805, 2017),
  (805, 2018),
  (805, 2019),
  (805, 2020),
  (805, 2021),
  (805, 2022),
  (805, 2023),
  (805, 2024),
  (805, 2025),
  (805, 2026),
  (805, 2027),
  (805, 2028),
  (805, 2029),
  (805, 2030),
  (805, 2031),
  (805, 2032);

INSERT INTO tournament_participants (tournament_id, player_id) VALUES
  (807, 2033),
  (807, 2034),
  (807, 2035),
  (807, 2036),
  (807, 2037),
  (807, 2038),
  (807, 2039),
  (807, 2040),
  (807, 2041),
  (807, 2042),
  (807, 2043),
  (807, 2044),
  (807, 2045),
  (807, 2046),
  (807, 2047),
  (807, 2048);

INSERT INTO tournament_participants (tournament_id, player_id) VALUES
  (809, 2049),
  (809, 2050),
  (809, 2051),
  (809, 2052),
  (809, 2053),
  (809, 2054),
  (809, 2055),
  (809, 2056),
  (809, 2057),
  (809, 2058),
  (809, 2059),
  (809, 2060),
  (809, 2061),
  (809, 2062),
  (809, 2063),
  (809, 2064);

INSERT INTO tournament_participants (tournament_id, player_id) VALUES
  (811, 2065),
  (811, 2066),
  (811, 2067),
  (811, 2068),
  (811, 2069),
  (811, 2070),
  (811, 2071),
  (811, 2072),
  (811, 2073),
  (811, 2074),
  (811, 2075),
  (811, 2076),
  (811, 2077),
  (811, 2078),
  (811, 2079),
  (811, 2080);

INSERT INTO tournament_participants (tournament_id, player_id) VALUES
  (813, 2081),
  (813, 2082),
  (813, 2083),
  (813, 2084),
  (813, 2085),
  (813, 2086),
  (813, 2087),
  (813, 2088),
  (813, 2089),
  (813, 2090),
  (813, 2091),
  (813, 2092),
  (813, 2093),
  (813, 2094),
  (813, 2095),
  (813, 2096);

INSERT INTO teams (id, tournament_id, player1_id, player2_id) VALUES
  (7001, 802, 2001, 2002),
  (7002, 802, 2002, 2004),
  (7003, 802, 2003, 2006),
  (7004, 802, 2004, 2008),
  (7005, 802, 2005, 2010),
  (7006, 802, 2006, 2012),
  (7007, 802, 2007, 2014),
  (7008, 802, 2008, 2016),
  (7009, 802, 2009, 2018),
  (7010, 802, 2010, 2020),
  (7011, 802, 2011, 2022),
  (7012, 802, 2012, 2024),
  (7013, 802, 2013, 2026),
  (7014, 802, 2014, 2028),
  (7015, 802, 2015, 2030),
  (7016, 802, 2016, 2032),
  (7017, 802, 2017, 2034),
  (7018, 802, 2018, 2036),
  (7019, 802, 2019, 2038),
  (7020, 802, 2020, 2040),
  (7021, 802, 2021, 2042),
  (7022, 802, 2022, 2044),
  (7023, 802, 2023, 2046),
  (7024, 802, 2024, 2048),
  (7025, 802, 2025, 2050),
  (7026, 802, 2026, 2052),
  (7027, 802, 2027, 2054),
  (7028, 802, 2028, 2056),
  (7029, 802, 2029, 2058),
  (7030, 802, 2030, 2060),
  (7031, 802, 2031, 2062),
  (7032, 802, 2032, 2064),
  (7033, 802, 2033, 2066),
  (7034, 802, 2034, 2068),
  (7035, 802, 2035, 2070),
  (7036, 802, 2036, 2072),
  (7037, 802, 2037, 2074),
  (7038, 802, 2038, 2076),
  (7039, 802, 2039, 2078),
  (7040, 802, 2040, 2080),
  (7041, 802, 2041, 2082),
  (7042, 802, 2042, 2084),
  (7043, 802, 2043, 2086),
  (7044, 802, 2044, 2088),
  (7045, 802, 2045, 2090),
  (7046, 802, 2046, 2092),
  (7047, 802, 2047, 2094),
  (7048, 802, 2048, 2096),
  (7049, 802, 2049, 2098),
  (7050, 802, 2050, 2100),
  (7051, 804, 2001, 2006),
  (7052, 804, 2002, 2009),
  (7053, 804, 2003, 2012),
  (7054, 804, 2004, 2015),
  (7055, 804, 2005, 2002),
  (7056, 804, 2006, 2005),
  (7057, 804, 2007, 2008),
  (7058, 804, 2008, 2011),
  (7059, 804, 2009, 2014),
  (7060, 804, 2010, 2001),
  (7061, 804, 2011, 2004),
  (7062, 804, 2012, 2007),
  (7063, 804, 2013, 2010),
  (7064, 804, 2014, 2013),
  (7065, 804, 2015, 2016),
  (7066, 804, 2016, 2003),
  (7067, 806, 2017, 2022),
  (7068, 806, 2018, 2025),
  (7069, 806, 2019, 2028),
  (7070, 806, 2020, 2031),
  (7071, 806, 2021, 2018),
  (7072, 806, 2022, 2021),
  (7073, 806, 2023, 2024),
  (7074, 806, 2024, 2027),
  (7075, 806, 2025, 2030),
  (7076, 806, 2026, 2017),
  (7077, 806, 2027, 2020),
  (7078, 806, 2028, 2023),
  (7079, 806, 2029, 2026),
  (7080, 806, 2030, 2029),
  (7081, 806, 2031, 2032),
  (7082, 806, 2032, 2019),
  (7083, 808, 2033, 2038),
  (7084, 808, 2034, 2041),
  (7085, 808, 2035, 2044),
  (7086, 808, 2036, 2047),
  (7087, 808, 2037, 2034),
  (7088, 808, 2038, 2037),
  (7089, 808, 2039, 2040),
  (7090, 808, 2040, 2043),
  (7091, 808, 2041, 2046),
  (7092, 808, 2042, 2033),
  (7093, 808, 2043, 2036),
  (7094, 808, 2044, 2039),
  (7095, 808, 2045, 2042),
  (7096, 808, 2046, 2045),
  (7097, 808, 2047, 2048),
  (7098, 808, 2048, 2035),
  (7099, 810, 2049, 2054),
  (7100, 810, 2050, 2057),
  (7101, 810, 2051, 2060),
  (7102, 810, 2052, 2063),
  (7103, 810, 2053, 2050),
  (7104, 810, 2054, 2053),
  (7105, 810, 2055, 2056),
  (7106, 810, 2056, 2059),
  (7107, 810, 2057, 2062),
  (7108, 810, 2058, 2049),
  (7109, 810, 2059, 2052),
  (7110, 810, 2060, 2055),
  (7111, 810, 2061, 2058),
  (7112, 810, 2062, 2061),
  (7113, 810, 2063, 2064),
  (7114, 810, 2064, 2051),
  (7115, 812, 2065, 2070),
  (7116, 812, 2066, 2073),
  (7117, 812, 2067, 2076),
  (7118, 812, 2068, 2079),
  (7119, 812, 2069, 2066),
  (7120, 812, 2070, 2069),
  (7121, 812, 2071, 2072),
  (7122, 812, 2072, 2075),
  (7123, 812, 2073, 2078),
  (7124, 812, 2074, 2065),
  (7125, 812, 2075, 2068),
  (7126, 812, 2076, 2071),
  (7127, 812, 2077, 2074),
  (7128, 812, 2078, 2077),
  (7129, 812, 2079, 2080),
  (7130, 812, 2080, 2067),
  (7131, 814, 2081, 2086),
  (7132, 814, 2082, 2089),
  (7133, 814, 2083, 2092),
  (7134, 814, 2084, 2095),
  (7135, 814, 2085, 2082),
  (7136, 814, 2086, 2085),
  (7137, 814, 2087, 2088),
  (7138, 814, 2088, 2091),
  (7139, 814, 2089, 2094),
  (7140, 814, 2090, 2081),
  (7141, 814, 2091, 2084),
  (7142, 814, 2092, 2087),
  (7143, 814, 2093, 2090),
  (7144, 814, 2094, 2093),
  (7145, 814, 2095, 2096),
  (7146, 814, 2096, 2083);

INSERT INTO tournament_participants (tournament_id, team_id, level, position) VALUES
  (802, 7034, 1, 1),
  (802, 7014, 2, 2),
  (802, 7039, 2, 1),
  (802, 7041, 3, 2),
  (802, 7032, 3, 1),
  (802, 7025, 3, 3),
  (802, 7047, 4, 3),
  (802, 7026, 4, 2),
  (802, 7010, 4, 1),
  (802, 7030, 4, 4),
  (802, 7011, 5, 1),
  (802, 7046, 5, 4),
  (802, 7036, 5, 2),
  (802, 7045, 5, 3),
  (802, 7005, 5, 5),
  (802, 7018, 6, 1),
  (802, 7009, 6, 6),
  (802, 7021, 6, 2),
  (802, 7017, 6, 3),
  (802, 7038, 6, 5),
  (802, 7028, 6, 4),
  (802, 7027, 7, 6),
  (802, 7024, 7, 5),
  (802, 7001, 7, 3),
  (802, 7037, 7, 2),
  (802, 7048, 7, 7),
  (802, 7006, 7, 4),
  (802, 7049, 7, 1),
  (802, 7031, 8, 7),
  (802, 7019, 8, 2),
  (802, 7003, 8, 6),
  (802, 7007, 8, 8),
  (802, 7042, 8, 5),
  (802, 7012, 8, 1),
  (802, 7004, 8, 3),
  (802, 7023, 8, 4),
  (802, 7033, 9, 1),
  (802, 7044, 9, 2),
  (802, 7008, 9, 6),
  (802, 7020, 9, 7),
  (802, 7015, 9, 3),
  (802, 7016, 9, 5),
  (802, 7040, 9, 4),
  (802, 7022, 9, 8),
  (802, 7002, 9, 9),
  (802, 7050, 10, 5),
  (802, 7029, 10, 1),
  (802, 7013, 10, 2),
  (802, 7043, 10, 9),
  (802, 7035, 10, 3);

INSERT INTO tournament_participants (tournament_id, team_id) VALUES
  (804, 7051),
  (804, 7052),
  (804, 7053),
  (804, 7054),
  (804, 7055),
  (804, 7056),
  (804, 7057),
  (804, 7058),
  (804, 7059),
  (804, 7060),
  (804, 7061),
  (804, 7062),
  (804, 7063),
  (804, 7064),
  (804, 7065),
  (804, 7066);

INSERT INTO tournament_participants (tournament_id, team_id) VALUES
  (806, 7067),
  (806, 7068),
  (806, 7069),
  (806, 7070),
  (806, 7071),
  (806, 7072),
  (806, 7073),
  (806, 7074),
  (806, 7075),
  (806, 7076),
  (806, 7077),
  (806, 7078),
  (806, 7079),
  (806, 7080),
  (806, 7081),
  (806, 7082);

INSERT INTO tournament_participants (tournament_id, team_id) VALUES
  (808, 7083),
  (808, 7084),
  (808, 7085),
  (808, 7086),
  (808, 7087),
  (808, 7088),
  (808, 7089),
  (808, 7090),
  (808, 7091),
  (808, 7092),
  (808, 7093),
  (808, 7094),
  (808, 7095),
  (808, 7096),
  (808, 7097),
  (808, 7098);

INSERT INTO tournament_participants (tournament_id, team_id) VALUES
  (810, 7099),
  (810, 7100),
  (810, 7101),
  (810, 7102),
  (810, 7103),
  (810, 7104),
  (810, 7105),
  (810, 7106),
  (810, 7107),
  (810, 7108),
  (810, 7109),
  (810, 7110),
  (810, 7111),
  (810, 7112),
  (810, 7113),
  (810, 7114);

INSERT INTO tournament_participants (tournament_id, team_id) VALUES
  (812, 7115),
  (812, 7116),
  (812, 7117),
  (812, 7118),
  (812, 7119),
  (812, 7120),
  (812, 7121),
  (812, 7122),
  (812, 7123),
  (812, 7124),
  (812, 7125),
  (812, 7126),
  (812, 7127),
  (812, 7128),
  (812, 7129),
  (812, 7130);

INSERT INTO tournament_participants (tournament_id, team_id) VALUES
  (814, 7131),
  (814, 7132),
  (814, 7133),
  (814, 7134),
  (814, 7135),
  (814, 7136),
  (814, 7137),
  (814, 7138),
  (814, 7139),
  (814, 7140),
  (814, 7141),
  (814, 7142),
  (814, 7143),
  (814, 7144),
  (814, 7145),
  (814, 7146);

INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-08 11:39:52+00', 801, 'single', 2001, 2006, '[[7, 5], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-11 19:45:09+00', 801, 'single', 2002, 2013, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-05 18:07:00+00', 801, 'single', 2003, 2020, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-20 23:14:41+00', 801, 'single', 2004, 2027, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-16 11:52:19+00', 801, 'single', 2005, 2034, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-25 04:27:12+00', 801, 'single', 2006, 2041, '[[6, 1], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-08 12:05:54+00', 801, 'single', 2007, 2048, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-07 09:16:52+00', 801, 'single', 2008, 2055, '[[6, 4], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-13 08:04:43+00', 801, 'single', 2009, 2062, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-06 05:42:33+00', 801, 'single', 2010, 2069, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-23 10:53:41+00', 801, 'single', 2011, 2076, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-21 00:12:16+00', 801, 'single', 2012, 2083, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-28 19:44:12+00', 801, 'single', 2013, 2090, '[[6, 2], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-14 03:37:11+00', 801, 'single', 2014, 2097, '[[6, 1], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-29 15:05:45+00', 801, 'single', 2015, 2004, '[[6, 0], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-11 11:14:49+00', 801, 'single', 2016, 2011, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-14 15:51:35+00', 801, 'single', 2017, 2018, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-29 07:01:12+00', 801, 'single', 2018, 2025, '[[7, 5], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-31 20:37:57+00', 801, 'single', 2019, 2032, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-25 16:35:35+00', 801, 'single', 2020, 2039, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-30 22:10:44+00', 801, 'single', 2021, 2046, '[[6, 0], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-22 11:27:05+00', 801, 'single', 2022, 2053, '[[6, 4], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-01 11:44:29+00', 801, 'single', 2023, 2060, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-20 15:26:27+00', 801, 'single', 2024, 2067, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-17 06:45:44+00', 801, 'single', 2025, 2074, '[[6, 2], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-06 00:34:05+00', 801, 'single', 2026, 2081, '[[6, 0], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-19 01:11:32+00', 801, 'single', 2027, 2088, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-07 16:03:04+00', 801, 'single', 2028, 2095, '[[6, 2], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-19 08:41:33+00', 801, 'single', 2029, 2002, '[[6, 3], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-06 01:54:41+00', 801, 'single', 2030, 2009, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-21 05:43:44+00', 801, 'single', 2031, 2016, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-28 05:42:20+00', 801, 'single', 2032, 2023, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-28 19:11:55+00', 801, 'single', 2033, 2030, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-13 15:56:31+00', 801, 'single', 2034, 2037, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-12 21:18:35+00', 801, 'single', 2035, 2044, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-14 23:40:13+00', 801, 'single', 2036, 2051, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-21 03:57:49+00', 801, 'single', 2037, 2058, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-26 09:30:48+00', 801, 'single', 2038, 2065, '[[6, 1], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-22 01:11:40+00', 801, 'single', 2039, 2072, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-29 20:48:23+00', 801, 'single', 2040, 2079, '[[6, 1], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-21 11:40:20+00', 801, 'single', 2041, 2086, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-23 14:26:14+00', 801, 'single', 2042, 2093, '[[6, 2], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-26 23:50:42+00', 801, 'single', 2043, 2100, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-08 18:38:01+00', 801, 'single', 2044, 2007, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-22 02:03:39+00', 801, 'single', 2045, 2014, '[[7, 5], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-10-02 05:53:08+00', 801, 'single', 2046, 2021, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-05 22:53:25+00', 801, 'single', 2047, 2028, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-02 22:33:45+00', 801, 'single', 2048, 2035, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-30 04:34:36+00', 801, 'single', 2049, 2042, '[[6, 4], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-28 01:34:02+00', 801, 'single', 2050, 2049, '[[6, 3], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-15 12:14:37+00', 801, 'single', 2051, 2056, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-18 13:09:42+00', 801, 'single', 2052, 2063, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-11 11:54:22+00', 801, 'single', 2053, 2070, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-05 19:40:01+00', 801, 'single', 2054, 2077, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-18 03:04:33+00', 801, 'single', 2055, 2084, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-27 14:01:32+00', 801, 'single', 2056, 2091, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-03 09:02:53+00', 801, 'single', 2057, 2098, '[[6, 3], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-06 08:58:16+00', 801, 'single', 2058, 2005, '[[6, 3], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-05 20:06:03+00', 801, 'single', 2059, 2012, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-09 13:11:41+00', 801, 'single', 2060, 2019, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-13 14:05:30+00', 801, 'single', 2061, 2026, '[[6, 2], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-15 22:46:21+00', 801, 'single', 2062, 2033, '[[6, 1], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-24 09:03:21+00', 801, 'single', 2063, 2040, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-11 08:42:11+00', 801, 'single', 2064, 2047, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-26 09:48:32+00', 801, 'single', 2065, 2054, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-04 16:11:14+00', 801, 'single', 2066, 2061, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-15 10:15:32+00', 801, 'single', 2067, 2068, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-22 22:41:32+00', 801, 'single', 2068, 2075, '[[6, 1], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-29 20:58:28+00', 801, 'single', 2069, 2082, '[[6, 0], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-12 14:21:41+00', 801, 'single', 2070, 2089, '[[6, 0], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-25 07:10:17+00', 801, 'single', 2071, 2096, '[[6, 4], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-03 21:13:49+00', 801, 'single', 2072, 2003, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-17 08:16:06+00', 801, 'single', 2073, 2010, '[[6, 3], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-21 21:41:41+00', 801, 'single', 2074, 2017, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-18 00:30:30+00', 801, 'single', 2075, 2024, '[[6, 3], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-09 15:42:08+00', 801, 'single', 2076, 2031, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-04 06:45:34+00', 801, 'single', 2077, 2038, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-02 10:09:49+00', 801, 'single', 2078, 2045, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-09 04:58:37+00', 801, 'single', 2079, 2052, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-20 11:30:33+00', 801, 'single', 2080, 2059, '[[6, 0], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-13 10:36:38+00', 801, 'single', 2081, 2066, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-09 01:19:14+00', 801, 'single', 2082, 2073, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-28 10:02:57+00', 801, 'single', 2083, 2080, '[[6, 0], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-29 01:29:45+00', 801, 'single', 2084, 2087, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-06 10:29:41+00', 801, 'single', 2085, 2094, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-17 06:04:32+00', 801, 'single', 2086, 2001, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-16 04:41:17+00', 801, 'single', 2087, 2008, '[[6, 3], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-30 22:09:01+00', 801, 'single', 2088, 2015, '[[7, 5], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-12 08:54:30+00', 801, 'single', 2089, 2022, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-01 13:17:51+00', 801, 'single', 2090, 2029, '[[6, 0], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-25 12:17:26+00', 801, 'single', 2091, 2036, '[[6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-27 03:26:12+00', 801, 'single', 2092, 2043, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-16 00:55:39+00', 801, 'single', 2093, 2050, '[[6, 0], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-31 03:57:29+00', 801, 'single', 2094, 2057, '[[7, 5], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-10 19:54:43+00', 801, 'single', 2095, 2064, '[[6, 1], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-16 22:53:43+00', 801, 'single', 2096, 2071, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-17 16:59:47+00', 801, 'single', 2097, 2078, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-25 08:26:01+00', 801, 'single', 2098, 2085, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-23 23:30:04+00', 801, 'single', 2099, 2092, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-09 07:18:54+00', 801, 'single', 2100, 2099, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-23 13:38:09+00', 801, 'single', 2001, 2006, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-21 06:32:44+00', 801, 'single', 2002, 2013, '[[6, 2], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-22 15:09:27+00', 801, 'single', 2003, 2020, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-20 00:22:32+00', 801, 'single', 2004, 2027, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-03 00:24:47+00', 801, 'single', 2005, 2034, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-22 14:31:48+00', 801, 'single', 2006, 2041, '[[6, 4], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-09 05:09:08+00', 801, 'single', 2007, 2048, '[[6, 2], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-03 01:54:21+00', 801, 'single', 2008, 2055, '[[6, 2], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-16 18:14:16+00', 801, 'single', 2009, 2062, '[[6, 0], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-14 07:24:24+00', 801, 'single', 2010, 2069, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-09 22:07:52+00', 801, 'single', 2011, 2076, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-09 09:11:08+00', 801, 'single', 2012, 2083, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-22 10:33:13+00', 801, 'single', 2013, 2090, '[[6, 3], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-08 07:33:54+00', 801, 'single', 2014, 2097, '[[6, 2], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-19 00:43:58+00', 801, 'single', 2015, 2004, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-26 01:39:55+00', 801, 'single', 2016, 2011, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-08 06:03:56+00', 801, 'single', 2017, 2018, '[[6, 4], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-20 00:48:47+00', 801, 'single', 2018, 2025, '[[6, 3], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-31 14:11:03+00', 801, 'single', 2019, 2032, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-06 22:28:41+00', 801, 'single', 2020, 2039, '[[6, 4], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-31 02:55:12+00', 801, 'single', 2021, 2046, '[[6, 3], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-22 12:01:41+00', 801, 'single', 2022, 2053, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-28 21:17:28+00', 801, 'single', 2023, 2060, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-03 09:29:02+00', 801, 'single', 2024, 2067, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-26 07:36:34+00', 801, 'single', 2025, 2074, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-05 07:10:30+00', 801, 'single', 2026, 2081, '[[6, 1], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-06 14:10:03+00', 801, 'single', 2027, 2088, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-03 10:30:30+00', 801, 'single', 2028, 2095, '[[6, 4], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-18 22:24:20+00', 801, 'single', 2029, 2002, '[[6, 2], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-13 21:26:25+00', 801, 'single', 2030, 2009, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-09 19:02:48+00', 801, 'single', 2031, 2016, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-26 21:40:05+00', 801, 'single', 2032, 2023, '[[6, 0], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-23 19:42:43+00', 801, 'single', 2033, 2030, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-25 18:40:52+00', 801, 'single', 2034, 2037, '[[6, 3], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-22 18:09:00+00', 801, 'single', 2035, 2044, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-30 13:31:12+00', 801, 'single', 2036, 2051, '[[6, 4], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-23 13:34:54+00', 801, 'single', 2037, 2058, '[[6, 2], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-04 18:23:02+00', 801, 'single', 2038, 2065, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-03 19:54:45+00', 801, 'single', 2039, 2072, '[[6, 0], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-26 07:59:41+00', 801, 'single', 2040, 2079, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-27 13:29:05+00', 801, 'single', 2041, 2086, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-23 03:34:29+00', 801, 'single', 2042, 2093, '[[6, 2], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-16 08:40:51+00', 801, 'single', 2043, 2100, '[[6, 1], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-25 19:03:42+00', 801, 'single', 2044, 2007, '[[6, 0], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-03 16:09:57+00', 801, 'single', 2045, 2014, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-06 21:33:18+00', 801, 'single', 2046, 2021, '[[6, 2], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-02 23:14:56+00', 801, 'single', 2047, 2028, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-19 22:43:33+00', 801, 'single', 2048, 2035, '[[6, 0], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-17 12:13:07+00', 801, 'single', 2049, 2042, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-26 14:02:16+00', 801, 'single', 2050, 2049, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-26 04:36:39+00', 801, 'single', 2051, 2056, '[[6, 2], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-18 06:32:31+00', 801, 'single', 2052, 2063, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-27 23:11:29+00', 801, 'single', 2053, 2070, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-17 11:57:33+00', 801, 'single', 2054, 2077, '[[6, 4], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-08 23:42:13+00', 801, 'single', 2055, 2084, '[[7, 5], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-24 12:48:51+00', 801, 'single', 2056, 2091, '[[6, 1], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-21 03:59:31+00', 801, 'single', 2057, 2098, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-27 16:10:46+00', 801, 'single', 2058, 2005, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-14 12:25:42+00', 801, 'single', 2059, 2012, '[[6, 1], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-01 19:02:41+00', 801, 'single', 2060, 2019, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-01 21:21:10+00', 801, 'single', 2061, 2026, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-04 17:18:25+00', 801, 'single', 2062, 2033, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-18 13:23:41+00', 801, 'single', 2063, 2040, '[[6, 1], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-04 06:47:35+00', 801, 'single', 2064, 2047, '[[6, 4], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-28 08:40:48+00', 801, 'single', 2065, 2054, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-15 20:20:52+00', 801, 'single', 2066, 2061, '[[6, 4], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-26 08:07:52+00', 801, 'single', 2067, 2068, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-19 13:34:34+00', 801, 'single', 2068, 2075, '[[7, 5], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-21 01:14:57+00', 801, 'single', 2069, 2082, '[[7, 5], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-14 16:26:44+00', 801, 'single', 2070, 2089, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-09 18:01:24+00', 801, 'single', 2071, 2096, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-26 07:23:29+00', 801, 'single', 2072, 2003, '[[6, 3], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-03 17:36:04+00', 801, 'single', 2073, 2010, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-16 03:00:10+00', 801, 'single', 2074, 2017, '[[6, 0], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-28 18:55:53+00', 801, 'single', 2075, 2024, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-09 03:29:39+00', 801, 'single', 2076, 2031, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-17 01:44:34+00', 801, 'single', 2077, 2038, '[[6, 4], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-29 08:45:30+00', 801, 'single', 2078, 2045, '[[6, 4], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-04 04:05:01+00', 801, 'single', 2079, 2052, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-18 07:04:57+00', 801, 'single', 2080, 2059, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-21 08:19:46+00', 801, 'single', 2081, 2066, '[[6, 2], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-28 04:14:25+00', 801, 'single', 2082, 2073, '[[6, 0], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-25 05:53:44+00', 801, 'single', 2083, 2080, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-17 11:08:02+00', 801, 'single', 2084, 2087, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-04 04:10:43+00', 801, 'single', 2085, 2094, '[[7, 5], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-06 21:28:40+00', 801, 'single', 2086, 2001, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-26 20:09:40+00', 801, 'single', 2087, 2008, '[[6, 1], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-05 05:18:06+00', 801, 'single', 2088, 2015, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-05 06:26:34+00', 801, 'single', 2089, 2022, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-27 14:09:58+00', 801, 'single', 2090, 2029, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-12 20:00:00+00', 801, 'single', 2091, 2036, '[[6, 0], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-21 03:16:47+00', 801, 'single', 2092, 2043, '[[6, 0], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-21 06:45:54+00', 801, 'single', 2093, 2050, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-01 09:41:33+00', 801, 'single', 2094, 2057, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-23 10:31:17+00', 801, 'single', 2095, 2064, '[[6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-22 18:47:28+00', 801, 'single', 2096, 2071, '[[6, 3], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-05 17:55:15+00', 801, 'single', 2097, 2078, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-13 11:24:44+00', 801, 'single', 2098, 2085, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-28 18:46:00+00', 801, 'single', 2099, 2092, '[[7, 5], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-16 05:42:19+00', 801, 'single', 2100, 2099, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-13 06:58:16+00', 801, 'single', 2001, 2006, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-13 17:52:05+00', 801, 'single', 2002, 2013, '[[6, 1], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-04 08:05:54+00', 801, 'single', 2003, 2020, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-04 04:47:54+00', 801, 'single', 2004, 2027, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-03 03:50:36+00', 801, 'single', 2005, 2034, '[[6, 3], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-04 10:31:57+00', 801, 'single', 2006, 2041, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-11 00:21:49+00', 801, 'single', 2007, 2048, '[[6, 2], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-01 01:19:48+00', 801, 'single', 2008, 2055, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-15 19:36:50+00', 801, 'single', 2009, 2062, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-17 07:13:55+00', 801, 'single', 2010, 2069, '[[6, 2], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-23 14:40:21+00', 801, 'single', 2011, 2076, '[[6, 1], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-10 09:10:06+00', 801, 'single', 2012, 2083, '[[6, 3], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-06 22:22:42+00', 801, 'single', 2013, 2090, '[[6, 0], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-04 11:20:34+00', 801, 'single', 2014, 2097, '[[6, 2], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-08 07:31:27+00', 801, 'single', 2015, 2004, '[[6, 3], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-27 04:15:00+00', 801, 'single', 2016, 2011, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-05 08:30:44+00', 801, 'single', 2017, 2018, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-21 07:02:50+00', 801, 'single', 2018, 2025, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-03 11:58:54+00', 801, 'single', 2019, 2032, '[[6, 3], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-16 15:36:00+00', 801, 'single', 2020, 2039, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-07 15:37:05+00', 801, 'single', 2021, 2046, '[[6, 2], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-24 10:04:21+00', 801, 'single', 2022, 2053, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-31 08:57:10+00', 801, 'single', 2023, 2060, '[[6, 2], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-29 22:14:15+00', 801, 'single', 2024, 2067, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-01 19:51:48+00', 801, 'single', 2025, 2074, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-19 18:31:28+00', 801, 'single', 2026, 2081, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-19 00:07:01+00', 801, 'single', 2027, 2088, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-25 20:25:29+00', 801, 'single', 2028, 2095, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-06 03:43:22+00', 801, 'single', 2029, 2002, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-12 18:59:18+00', 801, 'single', 2030, 2009, '[[6, 4], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-11 05:09:29+00', 801, 'single', 2031, 2016, '[[7, 5], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-14 11:37:54+00', 801, 'single', 2032, 2023, '[[6, 3], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-04 07:53:29+00', 801, 'single', 2033, 2030, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-24 20:27:22+00', 801, 'single', 2034, 2037, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-29 00:59:27+00', 801, 'single', 2035, 2044, '[[6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-10-01 08:14:28+00', 801, 'single', 2036, 2051, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-15 05:56:14+00', 801, 'single', 2037, 2058, '[[6, 1], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-03 11:20:03+00', 801, 'single', 2038, 2065, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-15 04:53:18+00', 801, 'single', 2039, 2072, '[[6, 1], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-18 01:42:08+00', 801, 'single', 2040, 2079, '[[6, 4], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-30 23:01:47+00', 801, 'single', 2041, 2086, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-19 10:43:14+00', 801, 'single', 2042, 2093, '[[6, 2], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-14 05:00:48+00', 801, 'single', 2043, 2100, '[[6, 2], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-13 21:16:03+00', 801, 'single', 2044, 2007, '[[6, 2], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-22 00:31:49+00', 801, 'single', 2045, 2014, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-09 18:08:12+00', 801, 'single', 2046, 2021, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-06 21:29:06+00', 801, 'single', 2047, 2028, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-07 03:41:46+00', 801, 'single', 2048, 2035, '[[6, 2], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-14 16:33:19+00', 801, 'single', 2049, 2042, '[[6, 1], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-10 06:28:47+00', 801, 'single', 2050, 2049, '[[6, 4], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-08 14:39:01+00', 801, 'single', 2051, 2056, '[[6, 2], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-22 06:42:02+00', 801, 'single', 2052, 2063, '[[6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-26 05:15:47+00', 801, 'single', 2053, 2070, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-05 03:19:34+00', 801, 'single', 2054, 2077, '[[7, 5], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-18 05:46:44+00', 801, 'single', 2055, 2084, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-26 21:52:03+00', 801, 'single', 2056, 2091, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-17 08:47:09+00', 801, 'single', 2057, 2098, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-03 00:12:25+00', 801, 'single', 2058, 2005, '[[6, 1], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-23 18:26:45+00', 801, 'single', 2059, 2012, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-25 20:15:42+00', 801, 'single', 2060, 2019, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-08 05:27:41+00', 801, 'single', 2061, 2026, '[[6, 2], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-25 17:04:25+00', 801, 'single', 2062, 2033, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-23 15:55:34+00', 801, 'single', 2063, 2040, '[[6, 2], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-26 16:39:11+00', 801, 'single', 2064, 2047, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-26 05:31:37+00', 801, 'single', 2065, 2054, '[[6, 2], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-30 09:44:29+00', 801, 'single', 2066, 2061, '[[6, 1], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-19 14:36:29+00', 801, 'single', 2067, 2068, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-16 15:12:16+00', 801, 'single', 2068, 2075, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-13 14:03:22+00', 801, 'single', 2069, 2082, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-04 01:39:08+00', 801, 'single', 2070, 2089, '[[6, 0], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-22 16:10:00+00', 801, 'single', 2071, 2096, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-13 11:41:56+00', 801, 'single', 2072, 2003, '[[6, 1], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-21 09:11:46+00', 801, 'single', 2073, 2010, '[[6, 3], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-19 22:58:03+00', 801, 'single', 2074, 2017, '[[7, 5], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-25 09:19:41+00', 801, 'single', 2075, 2024, '[[7, 5], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-17 13:58:44+00', 801, 'single', 2076, 2031, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-13 21:15:03+00', 801, 'single', 2077, 2038, '[[6, 3], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-02 20:55:04+00', 801, 'single', 2078, 2045, '[[6, 0], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-10 16:15:46+00', 801, 'single', 2079, 2052, '[[6, 0], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-29 17:38:20+00', 801, 'single', 2080, 2059, '[[6, 0], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-13 20:26:21+00', 801, 'single', 2081, 2066, '[[6, 0], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-19 13:48:58+00', 801, 'single', 2082, 2073, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-21 14:00:24+00', 801, 'single', 2083, 2080, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-05 06:34:31+00', 801, 'single', 2084, 2087, '[[7, 5], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-01 14:05:13+00', 801, 'single', 2085, 2094, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-09 12:56:09+00', 801, 'single', 2086, 2001, '[[6, 2], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-25 16:11:01+00', 801, 'single', 2087, 2008, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-18 02:34:06+00', 801, 'single', 2088, 2015, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-30 04:02:51+00', 801, 'single', 2089, 2022, '[[6, 0], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-18 14:32:23+00', 801, 'single', 2090, 2029, '[[6, 0], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-29 08:10:02+00', 801, 'single', 2091, 2036, '[[6, 1], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-10 10:27:14+00', 801, 'single', 2092, 2043, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-09 23:13:17+00', 801, 'single', 2093, 2050, '[[7, 5], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-08 21:47:29+00', 801, 'single', 2094, 2057, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-08 15:27:49+00', 801, 'single', 2095, 2064, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-22 12:53:32+00', 801, 'single', 2096, 2071, '[[6, 2], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-04 06:15:07+00', 801, 'single', 2097, 2078, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-03 04:10:04+00', 801, 'single', 2098, 2085, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-16 08:35:50+00', 801, 'single', 2099, 2092, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-08 15:37:39+00', 801, 'single', 2100, 2099, '[[6, 4], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-28 22:48:28+00', 801, 'single', 2001, 2006, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-29 12:14:15+00', 801, 'single', 2002, 2013, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-01 10:42:02+00', 801, 'single', 2003, 2020, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-04 19:25:22+00', 801, 'single', 2004, 2027, '[[6, 3], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-01 20:11:28+00', 801, 'single', 2005, 2034, '[[6, 2], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-18 15:39:09+00', 801, 'single', 2006, 2041, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-09 07:43:16+00', 801, 'single', 2007, 2048, '[[6, 0], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-23 16:42:36+00', 801, 'single', 2008, 2055, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-10 06:06:54+00', 801, 'single', 2009, 2062, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-24 23:13:04+00', 801, 'single', 2010, 2069, '[[6, 3], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-01 07:17:13+00', 801, 'single', 2011, 2076, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-24 00:26:09+00', 801, 'single', 2012, 2083, '[[6, 3], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-24 17:29:06+00', 801, 'single', 2013, 2090, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-05 20:26:06+00', 801, 'single', 2014, 2097, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-17 02:33:36+00', 801, 'single', 2015, 2004, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-07 08:17:44+00', 801, 'single', 2016, 2011, '[[6, 3], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-20 07:03:21+00', 801, 'single', 2017, 2018, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-23 20:00:30+00', 801, 'single', 2018, 2025, '[[6, 2], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-21 05:36:42+00', 801, 'single', 2019, 2032, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-10 09:35:45+00', 801, 'single', 2020, 2039, '[[7, 5], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-21 05:37:24+00', 801, 'single', 2021, 2046, '[[6, 0], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-13 07:43:41+00', 801, 'single', 2022, 2053, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-20 12:03:33+00', 801, 'single', 2023, 2060, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-12 06:24:33+00', 801, 'single', 2024, 2067, '[[6, 0], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-08 19:29:44+00', 801, 'single', 2025, 2074, '[[6, 4], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-24 19:58:36+00', 801, 'single', 2026, 2081, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-01 15:50:29+00', 801, 'single', 2027, 2088, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-07 01:32:02+00', 801, 'single', 2028, 2095, '[[7, 5], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-30 03:57:49+00', 801, 'single', 2029, 2002, '[[7, 5], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-09 16:45:08+00', 801, 'single', 2030, 2009, '[[6, 2], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-02 08:11:42+00', 801, 'single', 2031, 2016, '[[6, 4], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-22 07:45:39+00', 801, 'single', 2032, 2023, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-21 04:26:41+00', 801, 'single', 2033, 2030, '[[6, 1], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-28 02:26:21+00', 801, 'single', 2034, 2037, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-20 19:03:27+00', 801, 'single', 2035, 2044, '[[6, 0], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-17 06:01:26+00', 801, 'single', 2036, 2051, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-23 04:14:09+00', 801, 'single', 2037, 2058, '[[6, 4], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-10-01 14:38:41+00', 801, 'single', 2038, 2065, '[[6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-28 14:44:35+00', 801, 'single', 2039, 2072, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-08 22:57:47+00', 801, 'single', 2040, 2079, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-22 21:18:18+00', 801, 'single', 2041, 2086, '[[6, 4], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-21 20:47:26+00', 801, 'single', 2042, 2093, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-17 13:30:02+00', 801, 'single', 2043, 2100, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-29 06:11:44+00', 801, 'single', 2044, 2007, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-14 06:24:40+00', 801, 'single', 2045, 2014, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-15 05:29:23+00', 801, 'single', 2046, 2021, '[[6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-04 14:31:58+00', 801, 'single', 2047, 2028, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-05 13:41:24+00', 801, 'single', 2048, 2035, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-20 19:21:15+00', 801, 'single', 2049, 2042, '[[6, 3], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-21 05:27:49+00', 801, 'single', 2050, 2049, '[[6, 0], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-07 17:25:27+00', 801, 'single', 2051, 2056, '[[6, 2], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-11 03:55:16+00', 801, 'single', 2052, 2063, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-13 04:44:39+00', 801, 'single', 2053, 2070, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-23 15:13:25+00', 801, 'single', 2054, 2077, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-21 03:19:14+00', 801, 'single', 2055, 2084, '[[6, 2], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-16 06:47:12+00', 801, 'single', 2056, 2091, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-31 17:47:09+00', 801, 'single', 2057, 2098, '[[7, 5], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-14 21:20:31+00', 801, 'single', 2058, 2005, '[[7, 5], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-01 23:21:14+00', 801, 'single', 2059, 2012, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-26 22:30:11+00', 801, 'single', 2060, 2019, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-01 00:23:21+00', 801, 'single', 2061, 2026, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-27 20:15:45+00', 801, 'single', 2062, 2033, '[[6, 4], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-29 05:26:52+00', 801, 'single', 2063, 2040, '[[6, 2], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-23 22:43:51+00', 801, 'single', 2064, 2047, '[[6, 3], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-26 23:29:31+00', 801, 'single', 2065, 2054, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-13 20:32:57+00', 801, 'single', 2066, 2061, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-31 19:19:38+00', 801, 'single', 2067, 2068, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-01 12:44:14+00', 801, 'single', 2068, 2075, '[[6, 4], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-04 21:47:01+00', 801, 'single', 2069, 2082, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-29 21:56:40+00', 801, 'single', 2070, 2089, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-13 07:36:54+00', 801, 'single', 2071, 2096, '[[6, 3], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-18 11:57:48+00', 801, 'single', 2072, 2003, '[[6, 3], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-13 05:59:33+00', 801, 'single', 2073, 2010, '[[6, 0], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-17 10:29:23+00', 801, 'single', 2074, 2017, '[[6, 3], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-09 04:28:19+00', 801, 'single', 2075, 2024, '[[6, 4], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-06 05:16:32+00', 801, 'single', 2076, 2031, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-27 20:07:58+00', 801, 'single', 2077, 2038, '[[6, 0], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-16 15:11:06+00', 801, 'single', 2078, 2045, '[[7, 5], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-13 01:15:23+00', 801, 'single', 2079, 2052, '[[6, 2], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-10 12:36:57+00', 801, 'single', 2080, 2059, '[[6, 3], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-24 04:37:06+00', 801, 'single', 2081, 2066, '[[6, 1], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-07 06:06:19+00', 801, 'single', 2082, 2073, '[[6, 1], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-30 01:18:51+00', 801, 'single', 2083, 2080, '[[6, 4], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-13 14:05:04+00', 801, 'single', 2084, 2087, '[[6, 0], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-08 14:41:40+00', 801, 'single', 2085, 2094, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-16 06:35:24+00', 801, 'single', 2086, 2001, '[[6, 1], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-24 20:43:27+00', 801, 'single', 2087, 2008, '[[6, 4], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-22 02:41:28+00', 801, 'single', 2088, 2015, '[[6, 1], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-24 00:22:29+00', 801, 'single', 2089, 2022, '[[6, 3], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-11 20:54:54+00', 801, 'single', 2090, 2029, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-07 10:45:22+00', 801, 'single', 2091, 2036, '[[6, 1], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-12 17:20:39+00', 801, 'single', 2092, 2043, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-23 19:46:06+00', 801, 'single', 2093, 2050, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-23 15:24:12+00', 801, 'single', 2094, 2057, '[[6, 2], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-21 07:52:15+00', 801, 'single', 2095, 2064, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-24 21:01:59+00', 801, 'single', 2096, 2071, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-14 17:30:14+00', 801, 'single', 2097, 2078, '[[6, 0], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-25 07:43:15+00', 801, 'single', 2098, 2085, '[[6, 4], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-14 10:08:12+00', 801, 'single', 2099, 2092, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-31 22:36:34+00', 801, 'single', 2100, 2099, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-18 22:21:13+00', 801, 'single', 2001, 2006, '[[7, 5], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-26 05:01:47+00', 801, 'single', 2002, 2013, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-27 06:03:23+00', 801, 'single', 2003, 2020, '[[6, 0], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-26 19:54:27+00', 801, 'single', 2004, 2027, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-14 21:34:19+00', 801, 'single', 2005, 2034, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-09 23:55:37+00', 801, 'single', 2006, 2041, '[[6, 2], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-28 20:26:11+00', 801, 'single', 2007, 2048, '[[6, 2], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-13 05:34:41+00', 801, 'single', 2008, 2055, '[[6, 3], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-15 02:36:38+00', 801, 'single', 2009, 2062, '[[7, 5], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-14 06:28:11+00', 801, 'single', 2010, 2069, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-23 21:59:12+00', 801, 'single', 2011, 2076, '[[6, 2], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-09 20:16:19+00', 801, 'single', 2012, 2083, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-18 06:36:37+00', 801, 'single', 2013, 2090, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-27 16:06:51+00', 801, 'single', 2014, 2097, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-07 10:16:42+00', 801, 'single', 2015, 2004, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-19 01:15:44+00', 801, 'single', 2016, 2011, '[[6, 3], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-08 11:31:34+00', 801, 'single', 2017, 2018, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-04 06:45:49+00', 801, 'single', 2018, 2025, '[[6, 1], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-19 21:52:36+00', 801, 'single', 2019, 2032, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-31 18:46:48+00', 801, 'single', 2020, 2039, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-23 23:33:40+00', 801, 'single', 2021, 2046, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-26 05:24:19+00', 801, 'single', 2022, 2053, '[[7, 5], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-22 02:36:29+00', 801, 'single', 2023, 2060, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-05 19:29:46+00', 801, 'single', 2024, 2067, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-15 02:04:53+00', 801, 'single', 2025, 2074, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-06 17:30:59+00', 801, 'single', 2026, 2081, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-21 15:35:37+00', 801, 'single', 2027, 2088, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-05 20:22:54+00', 801, 'single', 2028, 2095, '[[6, 3], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-28 13:50:38+00', 801, 'single', 2029, 2002, '[[6, 3], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-17 04:06:38+00', 801, 'single', 2030, 2009, '[[6, 3], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-09 07:17:03+00', 801, 'single', 2031, 2016, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-17 23:46:30+00', 801, 'single', 2032, 2023, '[[6, 4], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-18 06:03:23+00', 801, 'single', 2033, 2030, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-14 09:57:28+00', 801, 'single', 2034, 2037, '[[6, 0], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-12 10:48:17+00', 801, 'single', 2035, 2044, '[[6, 1], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-27 09:41:34+00', 801, 'single', 2036, 2051, '[[6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-03 06:18:40+00', 801, 'single', 2037, 2058, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-21 09:51:49+00', 801, 'single', 2038, 2065, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-28 18:14:17+00', 801, 'single', 2039, 2072, '[[6, 1], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-28 12:07:46+00', 801, 'single', 2040, 2079, '[[6, 4], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-20 12:14:42+00', 801, 'single', 2041, 2086, '[[6, 0], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-11 22:22:52+00', 801, 'single', 2042, 2093, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-22 02:33:37+00', 801, 'single', 2043, 2100, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-03 04:51:17+00', 801, 'single', 2044, 2007, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-24 05:06:26+00', 801, 'single', 2045, 2014, '[[6, 3], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-09 20:56:51+00', 801, 'single', 2046, 2021, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-10 11:11:23+00', 801, 'single', 2047, 2028, '[[6, 0], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-14 16:54:43+00', 801, 'single', 2048, 2035, '[[6, 0], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-07 11:54:04+00', 801, 'single', 2049, 2042, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-20 15:39:04+00', 801, 'single', 2050, 2049, '[[7, 5], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-31 08:56:03+00', 801, 'single', 2051, 2056, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-03 04:01:50+00', 801, 'single', 2052, 2063, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-13 16:17:41+00', 801, 'single', 2053, 2070, '[[6, 1], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-05 03:39:15+00', 801, 'single', 2054, 2077, '[[6, 4], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-04 10:08:33+00', 801, 'single', 2055, 2084, '[[6, 2], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-23 04:09:54+00', 801, 'single', 2056, 2091, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-29 07:45:05+00', 801, 'single', 2057, 2098, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-23 17:00:32+00', 801, 'single', 2058, 2005, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-03 09:38:42+00', 801, 'single', 2059, 2012, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-23 06:17:41+00', 801, 'single', 2060, 2019, '[[6, 4], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-15 11:00:41+00', 801, 'single', 2061, 2026, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-14 20:37:18+00', 801, 'single', 2062, 2033, '[[6, 2], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-20 23:13:37+00', 801, 'single', 2063, 2040, '[[6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-18 06:48:45+00', 801, 'single', 2064, 2047, '[[6, 1], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-20 05:25:57+00', 801, 'single', 2065, 2054, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-19 03:50:13+00', 801, 'single', 2066, 2061, '[[6, 0], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-01 17:02:25+00', 801, 'single', 2067, 2068, '[[6, 4], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-21 16:58:10+00', 801, 'single', 2068, 2075, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-22 08:12:10+00', 801, 'single', 2069, 2082, '[[6, 0], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-02 22:36:32+00', 801, 'single', 2070, 2089, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-13 09:40:06+00', 801, 'single', 2071, 2096, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-21 19:11:49+00', 801, 'single', 2072, 2003, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-20 08:54:24+00', 801, 'single', 2073, 2010, '[[7, 5], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-12 19:35:05+00', 801, 'single', 2074, 2017, '[[6, 4], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-20 15:03:25+00', 801, 'single', 2075, 2024, '[[6, 0], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-13 10:09:26+00', 801, 'single', 2076, 2031, '[[6, 0], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-25 22:54:07+00', 801, 'single', 2077, 2038, '[[6, 0], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-15 22:29:28+00', 801, 'single', 2078, 2045, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-27 18:10:48+00', 801, 'single', 2079, 2052, '[[6, 1], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-25 04:26:25+00', 801, 'single', 2080, 2059, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-06 19:48:28+00', 801, 'single', 2081, 2066, '[[6, 0], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-06 15:22:04+00', 801, 'single', 2082, 2073, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-12 18:16:42+00', 801, 'single', 2083, 2080, '[[6, 0], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-31 08:39:04+00', 801, 'single', 2084, 2087, '[[6, 3], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-07 00:07:45+00', 801, 'single', 2085, 2094, '[[6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-02 03:12:48+00', 801, 'single', 2086, 2001, '[[6, 2], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-19 02:20:04+00', 801, 'single', 2087, 2008, '[[6, 2], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-22 16:36:14+00', 801, 'single', 2088, 2015, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-05 05:33:50+00', 801, 'single', 2089, 2022, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-30 21:44:06+00', 801, 'single', 2090, 2029, '[[6, 2], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-12 18:33:52+00', 801, 'single', 2091, 2036, '[[6, 0], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-09 19:45:44+00', 801, 'single', 2092, 2043, '[[6, 4], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-05 07:20:42+00', 801, 'single', 2093, 2050, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-16 10:59:40+00', 801, 'single', 2094, 2057, '[[6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-23 21:36:45+00', 801, 'single', 2095, 2064, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-16 18:27:27+00', 801, 'single', 2096, 2071, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-22 11:00:51+00', 801, 'single', 2097, 2078, '[[6, 0], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-02 10:21:21+00', 801, 'single', 2098, 2085, '[[6, 3], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-10 07:02:54+00', 801, 'single', 2099, 2092, '[[7, 5], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-28 14:01:01+00', 801, 'single', 2100, 2099, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-24 17:58:51+00', 802, 'double', 7001, 7008, '[[6, 2], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-14 22:25:45+00', 802, 'double', 7002, 7017, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-11 11:54:30+00', 802, 'double', 7003, 7026, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-27 13:06:01+00', 802, 'double', 7004, 7035, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-02 10:08:18+00', 802, 'double', 7005, 7044, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-06 19:38:06+00', 802, 'double', 7006, 7003, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-06 14:29:45+00', 802, 'double', 7007, 7012, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-02 13:03:16+00', 802, 'double', 7008, 7021, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-24 11:14:25+00', 802, 'double', 7009, 7030, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-26 19:14:41+00', 802, 'double', 7010, 7039, '[[7, 5], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-14 00:08:47+00', 802, 'double', 7011, 7048, '[[6, 4], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-24 21:33:39+00', 802, 'double', 7012, 7007, '[[7, 5], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-02 16:03:42+00', 802, 'double', 7013, 7016, '[[7, 5], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-26 10:00:12+00', 802, 'double', 7014, 7025, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-02 02:52:03+00', 802, 'double', 7015, 7034, '[[6, 3], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-23 00:44:41+00', 802, 'double', 7016, 7043, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-24 14:39:42+00', 802, 'double', 7017, 7002, '[[6, 3], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-23 00:19:19+00', 802, 'double', 7018, 7011, '[[6, 0], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-11 01:57:51+00', 802, 'double', 7019, 7020, '[[7, 5], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-18 23:20:27+00', 802, 'double', 7020, 7029, '[[6, 2], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-18 19:55:24+00', 802, 'double', 7021, 7038, '[[6, 4], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-25 03:50:08+00', 802, 'double', 7022, 7047, '[[6, 3], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-28 00:05:04+00', 802, 'double', 7023, 7006, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-25 22:04:37+00', 802, 'double', 7024, 7015, '[[6, 2], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-20 04:02:21+00', 802, 'double', 7025, 7024, '[[6, 2], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-05 17:55:51+00', 802, 'double', 7026, 7033, '[[7, 5], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-10 14:27:18+00', 802, 'double', 7027, 7042, '[[7, 5], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-06 21:28:55+00', 802, 'double', 7028, 7001, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-29 08:55:42+00', 802, 'double', 7029, 7010, '[[6, 2], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-05 23:42:19+00', 802, 'double', 7030, 7019, '[[7, 5], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-12 03:34:47+00', 802, 'double', 7031, 7028, '[[6, 2], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-06 09:38:39+00', 802, 'double', 7032, 7037, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-26 11:10:23+00', 802, 'double', 7033, 7046, '[[6, 0], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-26 16:27:19+00', 802, 'double', 7034, 7005, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-03 22:13:43+00', 802, 'double', 7035, 7014, '[[6, 2], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-15 11:41:24+00', 802, 'double', 7036, 7023, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-19 23:16:12+00', 802, 'double', 7037, 7032, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-23 18:46:35+00', 802, 'double', 7038, 7041, '[[6, 4], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-03 04:20:01+00', 802, 'double', 7039, 7050, '[[6, 2], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-29 17:58:35+00', 802, 'double', 7040, 7009, '[[6, 3], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-07 12:36:13+00', 802, 'double', 7041, 7018, '[[6, 2], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-27 08:58:26+00', 802, 'double', 7042, 7027, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-07 09:12:08+00', 802, 'double', 7043, 7036, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-14 02:08:11+00', 802, 'double', 7044, 7045, '[[6, 0], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-13 00:11:04+00', 802, 'double', 7045, 7004, '[[6, 4], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-10 12:57:07+00', 802, 'double', 7046, 7013, '[[6, 3], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-15 15:53:41+00', 802, 'double', 7047, 7022, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-06 21:33:37+00', 802, 'double', 7048, 7031, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-10 08:33:27+00', 802, 'double', 7049, 7040, '[[6, 0], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-16 18:33:42+00', 802, 'double', 7050, 7049, '[[6, 0], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-21 14:17:18+00', 802, 'double', 7001, 7008, '[[6, 4], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-02 07:40:51+00', 802, 'double', 7002, 7017, '[[6, 1], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-05 11:46:40+00', 802, 'double', 7003, 7026, '[[6, 2], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-30 11:36:10+00', 802, 'double', 7004, 7035, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-01 17:44:03+00', 802, 'double', 7005, 7044, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-20 07:05:05+00', 802, 'double', 7006, 7003, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-24 07:16:45+00', 802, 'double', 7007, 7012, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-17 02:01:19+00', 802, 'double', 7008, 7021, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-23 23:59:16+00', 802, 'double', 7009, 7030, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-22 06:06:34+00', 802, 'double', 7010, 7039, '[[6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-10 21:11:15+00', 802, 'double', 7011, 7048, '[[6, 4], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-04 15:28:41+00', 802, 'double', 7012, 7007, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-07 22:12:46+00', 802, 'double', 7013, 7016, '[[6, 2], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-27 09:42:36+00', 802, 'double', 7014, 7025, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-13 02:32:48+00', 802, 'double', 7015, 7034, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-28 07:35:55+00', 802, 'double', 7016, 7043, '[[7, 5], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-16 13:14:22+00', 802, 'double', 7017, 7002, '[[6, 2], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-09 08:00:24+00', 802, 'double', 7018, 7011, '[[6, 1], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-27 07:04:00+00', 802, 'double', 7019, 7020, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-07 04:44:57+00', 802, 'double', 7020, 7029, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-16 12:35:11+00', 802, 'double', 7021, 7038, '[[6, 0], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-16 19:21:51+00', 802, 'double', 7022, 7047, '[[6, 1], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-29 21:32:08+00', 802, 'double', 7023, 7006, '[[6, 0], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-01 02:40:18+00', 802, 'double', 7024, 7015, '[[6, 2], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-02 20:47:05+00', 802, 'double', 7025, 7024, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-17 11:28:39+00', 802, 'double', 7026, 7033, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-07 21:27:59+00', 802, 'double', 7027, 7042, '[[6, 1], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-10 15:03:11+00', 802, 'double', 7028, 7001, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-30 18:50:39+00', 802, 'double', 7029, 7010, '[[7, 5], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-15 02:22:34+00', 802, 'double', 7030, 7019, '[[6, 4], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-20 01:57:13+00', 802, 'double', 7031, 7028, '[[7, 5], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-17 23:37:36+00', 802, 'double', 7032, 7037, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-10 17:17:09+00', 802, 'double', 7033, 7046, '[[6, 3], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-20 09:57:02+00', 802, 'double', 7034, 7005, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-24 13:56:32+00', 802, 'double', 7035, 7014, '[[6, 0], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-09 22:57:21+00', 802, 'double', 7036, 7023, '[[6, 0], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-24 15:20:32+00', 802, 'double', 7037, 7032, '[[6, 2], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-02 18:01:09+00', 802, 'double', 7038, 7041, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-01 14:32:23+00', 802, 'double', 7039, 7050, '[[7, 5], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-18 04:34:07+00', 802, 'double', 7040, 7009, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-06 04:26:01+00', 802, 'double', 7041, 7018, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-19 21:24:40+00', 802, 'double', 7042, 7027, '[[6, 2], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-20 01:27:52+00', 802, 'double', 7043, 7036, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-09 02:11:47+00', 802, 'double', 7044, 7045, '[[6, 3], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-02 21:35:00+00', 802, 'double', 7045, 7004, '[[6, 3], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-13 12:26:25+00', 802, 'double', 7046, 7013, '[[7, 5], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-10 23:01:19+00', 802, 'double', 7047, 7022, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-03 17:40:29+00', 802, 'double', 7048, 7031, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-09 15:41:11+00', 802, 'double', 7049, 7040, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-19 12:34:05+00', 802, 'double', 7050, 7049, '[[6, 1], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-16 12:31:51+00', 802, 'double', 7001, 7008, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-03 01:00:14+00', 802, 'double', 7002, 7017, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-28 02:06:26+00', 802, 'double', 7003, 7026, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-07 04:17:32+00', 802, 'double', 7004, 7035, '[[7, 5], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-11 17:50:36+00', 802, 'double', 7005, 7044, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-04 07:38:45+00', 802, 'double', 7006, 7003, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-20 05:29:42+00', 802, 'double', 7007, 7012, '[[6, 4], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-25 02:41:30+00', 802, 'double', 7008, 7021, '[[6, 4], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-27 11:07:36+00', 802, 'double', 7009, 7030, '[[6, 4], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-08 21:21:13+00', 802, 'double', 7010, 7039, '[[6, 4], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-29 17:17:51+00', 802, 'double', 7011, 7048, '[[6, 2], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-03 22:12:35+00', 802, 'double', 7012, 7007, '[[7, 5], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-31 20:32:41+00', 802, 'double', 7013, 7016, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-10 00:23:05+00', 802, 'double', 7014, 7025, '[[6, 3], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-01 20:53:02+00', 802, 'double', 7015, 7034, '[[6, 2], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-19 01:31:20+00', 802, 'double', 7016, 7043, '[[6, 2], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-19 18:57:28+00', 802, 'double', 7017, 7002, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-04 02:33:57+00', 802, 'double', 7018, 7011, '[[6, 1], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-17 22:09:35+00', 802, 'double', 7019, 7020, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-01 14:59:22+00', 802, 'double', 7020, 7029, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-09 16:39:36+00', 802, 'double', 7021, 7038, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-28 09:29:48+00', 802, 'double', 7022, 7047, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-18 12:07:31+00', 802, 'double', 7023, 7006, '[[6, 1], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-23 06:24:08+00', 802, 'double', 7024, 7015, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-23 12:04:02+00', 802, 'double', 7025, 7024, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-21 01:03:41+00', 802, 'double', 7026, 7033, '[[6, 3], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-28 17:06:06+00', 802, 'double', 7027, 7042, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-08 15:08:32+00', 802, 'double', 7028, 7001, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-12 10:13:16+00', 802, 'double', 7029, 7010, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-28 01:25:32+00', 802, 'double', 7030, 7019, '[[6, 2], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-18 22:12:25+00', 802, 'double', 7031, 7028, '[[6, 3], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-13 05:35:47+00', 802, 'double', 7032, 7037, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-08 11:05:17+00', 802, 'double', 7033, 7046, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-07 21:35:45+00', 802, 'double', 7034, 7005, '[[6, 0], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-09 05:32:10+00', 802, 'double', 7035, 7014, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-25 04:51:20+00', 802, 'double', 7036, 7023, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-26 22:24:02+00', 802, 'double', 7037, 7032, '[[6, 3], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-05 09:47:03+00', 802, 'double', 7038, 7041, '[[6, 3], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-10-01 03:53:33+00', 802, 'double', 7039, 7050, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-03 20:26:42+00', 802, 'double', 7040, 7009, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-30 23:40:01+00', 802, 'double', 7041, 7018, '[[6, 0], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-12 21:09:49+00', 802, 'double', 7042, 7027, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-09 11:30:25+00', 802, 'double', 7043, 7036, '[[6, 4], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-05 20:59:10+00', 802, 'double', 7044, 7045, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-13 17:00:50+00', 802, 'double', 7045, 7004, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-13 22:44:31+00', 802, 'double', 7046, 7013, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-04 15:05:30+00', 802, 'double', 7047, 7022, '[[6, 2], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-30 02:54:25+00', 802, 'double', 7048, 7031, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-07 13:41:52+00', 802, 'double', 7049, 7040, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-08 10:26:24+00', 802, 'double', 7050, 7049, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-19 00:05:39+00', 802, 'double', 7001, 7008, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-19 15:56:07+00', 802, 'double', 7002, 7017, '[[6, 4], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-18 19:35:00+00', 802, 'double', 7003, 7026, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-07 12:45:57+00', 802, 'double', 7004, 7035, '[[6, 3], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-20 02:21:27+00', 802, 'double', 7005, 7044, '[[6, 3], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-30 19:37:45+00', 802, 'double', 7006, 7003, '[[6, 0], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-14 23:51:44+00', 802, 'double', 7007, 7012, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-19 08:19:59+00', 802, 'double', 7008, 7021, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-19 14:39:22+00', 802, 'double', 7009, 7030, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-05 10:30:00+00', 802, 'double', 7010, 7039, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-28 08:33:09+00', 802, 'double', 7011, 7048, '[[6, 0], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-04 20:44:11+00', 802, 'double', 7012, 7007, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-08 10:15:40+00', 802, 'double', 7013, 7016, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-19 14:38:03+00', 802, 'double', 7014, 7025, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-11 21:50:56+00', 802, 'double', 7015, 7034, '[[6, 3], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-04 13:22:36+00', 802, 'double', 7016, 7043, '[[6, 0], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-19 10:00:47+00', 802, 'double', 7017, 7002, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-17 08:50:32+00', 802, 'double', 7018, 7011, '[[6, 1], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-12 09:52:21+00', 802, 'double', 7019, 7020, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-26 12:04:34+00', 802, 'double', 7020, 7029, '[[6, 3], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-02 02:56:07+00', 802, 'double', 7021, 7038, '[[6, 0], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-12 10:36:48+00', 802, 'double', 7022, 7047, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-24 14:15:32+00', 802, 'double', 7023, 7006, '[[6, 3], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-08 21:00:39+00', 802, 'double', 7024, 7015, '[[6, 1], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-25 13:12:57+00', 802, 'double', 7025, 7024, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-12 04:40:40+00', 802, 'double', 7026, 7033, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-26 01:48:17+00', 802, 'double', 7027, 7042, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-23 07:34:36+00', 802, 'double', 7028, 7001, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-20 08:24:58+00', 802, 'double', 7029, 7010, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-27 07:03:00+00', 802, 'double', 7030, 7019, '[[6, 4], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-12 18:47:08+00', 802, 'double', 7031, 7028, '[[6, 2], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-04 16:30:33+00', 802, 'double', 7032, 7037, '[[6, 3], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-20 18:27:25+00', 802, 'double', 7033, 7046, '[[6, 1], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-14 00:03:51+00', 802, 'double', 7034, 7005, '[[6, 1], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-07 01:53:51+00', 802, 'double', 7035, 7014, '[[7, 5], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-20 06:42:19+00', 802, 'double', 7036, 7023, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-25 21:54:33+00', 802, 'double', 7037, 7032, '[[6, 3], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-13 18:02:51+00', 802, 'double', 7038, 7041, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-23 04:33:26+00', 802, 'double', 7039, 7050, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-07 18:49:17+00', 802, 'double', 7040, 7009, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-03 19:19:27+00', 802, 'double', 7041, 7018, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-12 08:22:48+00', 802, 'double', 7042, 7027, '[[7, 5], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-26 22:29:14+00', 802, 'double', 7043, 7036, '[[6, 4], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-06 05:12:19+00', 802, 'double', 7044, 7045, '[[6, 2], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-04 11:54:17+00', 802, 'double', 7045, 7004, '[[6, 2], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-11 02:19:57+00', 802, 'double', 7046, 7013, '[[6, 0], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-22 15:57:26+00', 802, 'double', 7047, 7022, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-11 22:52:52+00', 802, 'double', 7048, 7031, '[[6, 0], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-11 14:11:28+00', 802, 'double', 7049, 7040, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-23 02:46:18+00', 802, 'double', 7050, 7049, '[[6, 0], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-25 05:28:33+00', 802, 'double', 7001, 7008, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-10 00:47:39+00', 802, 'double', 7002, 7017, '[[6, 4], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-09 19:26:23+00', 802, 'double', 7003, 7026, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-19 18:25:19+00', 802, 'double', 7004, 7035, '[[6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-14 03:01:40+00', 802, 'double', 7005, 7044, '[[6, 2], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-06 17:21:46+00', 802, 'double', 7006, 7003, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-29 00:56:52+00', 802, 'double', 7007, 7012, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-24 05:48:22+00', 802, 'double', 7008, 7021, '[[6, 2], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-13 07:47:51+00', 802, 'double', 7009, 7030, '[[6, 4], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-28 09:43:21+00', 802, 'double', 7010, 7039, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-15 22:23:00+00', 802, 'double', 7011, 7048, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-28 08:13:42+00', 802, 'double', 7012, 7007, '[[7, 5], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-05 11:08:56+00', 802, 'double', 7013, 7016, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-16 23:15:02+00', 802, 'double', 7014, 7025, '[[6, 4], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-15 21:46:28+00', 802, 'double', 7015, 7034, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-28 18:13:43+00', 802, 'double', 7016, 7043, '[[6, 4], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-12 08:41:00+00', 802, 'double', 7017, 7002, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-04 05:51:21+00', 802, 'double', 7018, 7011, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-18 13:35:32+00', 802, 'double', 7019, 7020, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-07 05:15:25+00', 802, 'double', 7020, 7029, '[[6, 1], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-09 13:13:21+00', 802, 'double', 7021, 7038, '[[6, 0], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-12 15:58:51+00', 802, 'double', 7022, 7047, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-28 20:40:45+00', 802, 'double', 7023, 7006, '[[6, 0], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-15 10:17:27+00', 802, 'double', 7024, 7015, '[[6, 0], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-15 01:16:56+00', 802, 'double', 7025, 7024, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-27 02:33:49+00', 802, 'double', 7026, 7033, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-15 21:15:00+00', 802, 'double', 7027, 7042, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-28 10:38:07+00', 802, 'double', 7028, 7001, '[[6, 3], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-06 02:58:17+00', 802, 'double', 7029, 7010, '[[6, 2], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-02 09:31:43+00', 802, 'double', 7030, 7019, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-07 17:43:56+00', 802, 'double', 7031, 7028, '[[6, 4], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-08 03:12:48+00', 802, 'double', 7032, 7037, '[[6, 0], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-22 05:42:48+00', 802, 'double', 7033, 7046, '[[6, 0], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-17 11:19:47+00', 802, 'double', 7034, 7005, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-21 10:28:11+00', 802, 'double', 7035, 7014, '[[6, 1], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-08 23:28:44+00', 802, 'double', 7036, 7023, '[[7, 5], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-07 10:30:01+00', 802, 'double', 7037, 7032, '[[6, 0], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-11 13:03:38+00', 802, 'double', 7038, 7041, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-06 09:07:47+00', 802, 'double', 7039, 7050, '[[7, 5], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-15 09:19:37+00', 802, 'double', 7040, 7009, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-29 09:56:22+00', 802, 'double', 7041, 7018, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-09 07:21:54+00', 802, 'double', 7042, 7027, '[[6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-24 11:17:10+00', 802, 'double', 7043, 7036, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-21 12:38:04+00', 802, 'double', 7044, 7045, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-12 05:40:53+00', 802, 'double', 7045, 7004, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-26 20:04:38+00', 802, 'double', 7046, 7013, '[[6, 2], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-14 13:00:32+00', 802, 'double', 7047, 7022, '[[7, 5], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-29 16:14:00+00', 802, 'double', 7048, 7031, '[[6, 1], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-15 02:32:26+00', 802, 'double', 7049, 7040, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-30 07:41:31+00', 802, 'double', 7050, 7049, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-24 03:52:48+00', 802, 'double', 7001, 7008, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-17 01:16:37+00', 802, 'double', 7002, 7017, '[[7, 5], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-03 04:56:10+00', 802, 'double', 7003, 7026, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-17 03:35:24+00', 802, 'double', 7004, 7035, '[[6, 4], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-28 02:26:24+00', 802, 'double', 7005, 7044, '[[6, 4], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-14 00:53:46+00', 802, 'double', 7006, 7003, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-22 16:29:47+00', 802, 'double', 7007, 7012, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-06 03:55:01+00', 802, 'double', 7008, 7021, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-10 13:24:43+00', 802, 'double', 7009, 7030, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-06 05:06:25+00', 802, 'double', 7010, 7039, '[[7, 5], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-24 01:28:12+00', 802, 'double', 7011, 7048, '[[6, 0], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-24 19:40:19+00', 802, 'double', 7012, 7007, '[[6, 2], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-29 04:36:37+00', 802, 'double', 7013, 7016, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-28 19:12:32+00', 802, 'double', 7014, 7025, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-16 03:00:43+00', 802, 'double', 7015, 7034, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-17 11:42:34+00', 802, 'double', 7016, 7043, '[[7, 5], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-30 21:14:03+00', 802, 'double', 7017, 7002, '[[6, 0], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-18 09:26:23+00', 802, 'double', 7018, 7011, '[[6, 2], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-06 11:02:39+00', 802, 'double', 7019, 7020, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-15 03:00:43+00', 802, 'double', 7020, 7029, '[[6, 2], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-20 23:49:10+00', 802, 'double', 7021, 7038, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-14 08:47:36+00', 802, 'double', 7022, 7047, '[[6, 1], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-24 22:04:37+00', 802, 'double', 7023, 7006, '[[6, 1], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-06 01:43:38+00', 802, 'double', 7024, 7015, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-01 11:57:24+00', 802, 'double', 7025, 7024, '[[6, 4], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-24 08:35:22+00', 802, 'double', 7026, 7033, '[[6, 2], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-22 18:02:20+00', 802, 'double', 7027, 7042, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-19 06:17:14+00', 802, 'double', 7028, 7001, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-27 01:23:16+00', 802, 'double', 7029, 7010, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-05 23:08:32+00', 802, 'double', 7030, 7019, '[[6, 3], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-02 14:12:07+00', 802, 'double', 7031, 7028, '[[6, 2], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-27 04:58:53+00', 802, 'double', 7032, 7037, '[[6, 3], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-23 14:54:29+00', 802, 'double', 7033, 7046, '[[6, 1], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-04 09:07:02+00', 802, 'double', 7034, 7005, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-25 00:37:29+00', 802, 'double', 7035, 7014, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-27 05:20:24+00', 802, 'double', 7036, 7023, '[[6, 2], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-09 11:13:35+00', 802, 'double', 7037, 7032, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-27 10:17:40+00', 802, 'double', 7038, 7041, '[[6, 4], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-14 11:47:15+00', 802, 'double', 7039, 7050, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-25 13:37:34+00', 802, 'double', 7040, 7009, '[[6, 1], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-09 23:33:49+00', 802, 'double', 7041, 7018, '[[7, 5], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-20 15:14:39+00', 802, 'double', 7042, 7027, '[[6, 3], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-22 18:02:50+00', 802, 'double', 7043, 7036, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-11 21:29:58+00', 802, 'double', 7044, 7045, '[[6, 0], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-01 07:57:04+00', 802, 'double', 7045, 7004, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-29 10:38:25+00', 802, 'double', 7046, 7013, '[[6, 2], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-16 12:48:13+00', 802, 'double', 7047, 7022, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-03 14:08:04+00', 802, 'double', 7048, 7031, '[[7, 5], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-29 04:12:15+00', 802, 'double', 7049, 7040, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-08 05:25:58+00', 802, 'double', 7050, 7049, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-05 16:44:01+00', 802, 'double', 7001, 7008, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-26 19:35:13+00', 802, 'double', 7002, 7017, '[[6, 2], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-24 10:10:17+00', 802, 'double', 7003, 7026, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-13 05:41:58+00', 802, 'double', 7004, 7035, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-21 18:05:52+00', 802, 'double', 7005, 7044, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-21 00:51:21+00', 802, 'double', 7006, 7003, '[[6, 0], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-07 02:37:23+00', 802, 'double', 7007, 7012, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-28 12:45:45+00', 802, 'double', 7008, 7021, '[[6, 1], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-23 15:02:35+00', 802, 'double', 7009, 7030, '[[6, 0], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-08 20:43:28+00', 802, 'double', 7010, 7039, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-21 12:57:32+00', 802, 'double', 7011, 7048, '[[6, 0], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-27 12:26:04+00', 802, 'double', 7012, 7007, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-19 08:56:54+00', 802, 'double', 7013, 7016, '[[6, 0], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-27 08:15:16+00', 802, 'double', 7014, 7025, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-11 12:02:36+00', 802, 'double', 7015, 7034, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-07 13:27:58+00', 802, 'double', 7016, 7043, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-17 11:13:09+00', 802, 'double', 7017, 7002, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-03 15:41:05+00', 802, 'double', 7018, 7011, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-25 06:55:04+00', 802, 'double', 7019, 7020, '[[6, 0], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-02 02:42:22+00', 802, 'double', 7020, 7029, '[[7, 5], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-18 13:52:39+00', 802, 'double', 7021, 7038, '[[6, 4], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-21 00:10:36+00', 802, 'double', 7022, 7047, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-14 08:20:10+00', 802, 'double', 7023, 7006, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-26 08:38:23+00', 802, 'double', 7024, 7015, '[[6, 1], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-21 04:27:00+00', 802, 'double', 7025, 7024, '[[7, 5], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-11 10:09:14+00', 802, 'double', 7026, 7033, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-21 17:15:10+00', 802, 'double', 7027, 7042, '[[6, 0], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-02 17:27:05+00', 802, 'double', 7028, 7001, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-23 08:00:33+00', 802, 'double', 7029, 7010, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-01 07:39:22+00', 802, 'double', 7030, 7019, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-22 16:22:04+00', 802, 'double', 7031, 7028, '[[7, 5], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-04 02:51:46+00', 802, 'double', 7032, 7037, '[[6, 4], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-09 21:10:18+00', 802, 'double', 7033, 7046, '[[6, 4], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-23 20:28:43+00', 802, 'double', 7034, 7005, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-17 13:00:48+00', 802, 'double', 7035, 7014, '[[6, 1], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-29 02:09:26+00', 802, 'double', 7036, 7023, '[[7, 5], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-20 20:28:21+00', 802, 'double', 7037, 7032, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-17 11:23:12+00', 802, 'double', 7038, 7041, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-15 10:31:06+00', 802, 'double', 7039, 7050, '[[6, 0], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-16 01:18:41+00', 802, 'double', 7040, 7009, '[[6, 1], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-01 12:18:12+00', 802, 'double', 7041, 7018, '[[6, 4], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-11 11:38:20+00', 802, 'double', 7042, 7027, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-21 19:25:36+00', 802, 'double', 7043, 7036, '[[7, 5], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-28 02:53:26+00', 802, 'double', 7044, 7045, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-12 04:15:22+00', 802, 'double', 7045, 7004, '[[6, 0], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-03 04:07:09+00', 802, 'double', 7046, 7013, '[[6, 2], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-20 10:09:59+00', 802, 'double', 7047, 7022, '[[6, 4], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-18 16:27:49+00', 802, 'double', 7048, 7031, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-03 09:00:27+00', 802, 'double', 7049, 7040, '[[7, 5], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-26 21:42:03+00', 802, 'double', 7050, 7049, '[[6, 4], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-16 19:26:01+00', 802, 'double', 7001, 7008, '[[6, 2], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-30 13:52:35+00', 802, 'double', 7002, 7017, '[[7, 5], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-19 16:50:14+00', 802, 'double', 7003, 7026, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-09 23:27:44+00', 802, 'double', 7004, 7035, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-13 15:14:26+00', 802, 'double', 7005, 7044, '[[6, 2], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-09 19:33:58+00', 802, 'double', 7006, 7003, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-11 04:49:55+00', 802, 'double', 7007, 7012, '[[6, 1], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-29 16:35:01+00', 802, 'double', 7008, 7021, '[[6, 1], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-28 07:09:02+00', 802, 'double', 7009, 7030, '[[6, 0], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-13 04:40:18+00', 802, 'double', 7010, 7039, '[[6, 4], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-29 05:12:22+00', 802, 'double', 7011, 7048, '[[6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-04 09:44:28+00', 802, 'double', 7012, 7007, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-11 06:29:30+00', 802, 'double', 7013, 7016, '[[6, 0], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-18 22:05:09+00', 802, 'double', 7014, 7025, '[[6, 0], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-10 11:46:17+00', 802, 'double', 7015, 7034, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-11 15:41:32+00', 802, 'double', 7016, 7043, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-03 05:13:13+00', 802, 'double', 7017, 7002, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-20 17:38:17+00', 802, 'double', 7018, 7011, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-01 03:14:12+00', 802, 'double', 7019, 7020, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-06 02:22:06+00', 802, 'double', 7020, 7029, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-03 21:43:37+00', 802, 'double', 7021, 7038, '[[6, 0], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-07 08:54:24+00', 802, 'double', 7022, 7047, '[[6, 3], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-10 23:17:56+00', 802, 'double', 7023, 7006, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-31 23:33:02+00', 802, 'double', 7024, 7015, '[[6, 4], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-31 23:11:16+00', 802, 'double', 7025, 7024, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-08 12:46:17+00', 802, 'double', 7026, 7033, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-08 19:57:13+00', 802, 'double', 7027, 7042, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-02 08:18:59+00', 802, 'double', 7028, 7001, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-08 13:01:01+00', 802, 'double', 7029, 7010, '[[7, 5], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-31 19:20:23+00', 802, 'double', 7030, 7019, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-23 21:56:05+00', 802, 'double', 7031, 7028, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-01 21:20:46+00', 802, 'double', 7032, 7037, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-22 20:51:27+00', 802, 'double', 7033, 7046, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-07 01:39:53+00', 802, 'double', 7034, 7005, '[[6, 3], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-22 10:37:31+00', 802, 'double', 7035, 7014, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-07 05:24:57+00', 802, 'double', 7036, 7023, '[[6, 1], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-22 04:52:04+00', 802, 'double', 7037, 7032, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-01 15:03:57+00', 802, 'double', 7038, 7041, '[[6, 2], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-30 04:33:50+00', 802, 'double', 7039, 7050, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-04 12:49:38+00', 802, 'double', 7040, 7009, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-14 05:01:51+00', 802, 'double', 7041, 7018, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-21 03:24:18+00', 802, 'double', 7042, 7027, '[[6, 3], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-28 22:38:33+00', 802, 'double', 7043, 7036, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-29 08:25:11+00', 802, 'double', 7044, 7045, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-24 04:23:37+00', 802, 'double', 7045, 7004, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-14 07:02:41+00', 802, 'double', 7046, 7013, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-28 09:57:08+00', 802, 'double', 7047, 7022, '[[6, 1], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-02 11:30:05+00', 802, 'double', 7048, 7031, '[[6, 0], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-23 08:11:22+00', 802, 'double', 7049, 7040, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-16 15:42:33+00', 802, 'double', 7050, 7049, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-21 09:41:28+00', 802, 'double', 7001, 7008, '[[6, 2], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-01 02:34:30+00', 802, 'double', 7002, 7017, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-03 13:15:12+00', 802, 'double', 7003, 7026, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-29 15:45:47+00', 802, 'double', 7004, 7035, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-25 18:35:42+00', 802, 'double', 7005, 7044, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-27 01:09:45+00', 802, 'double', 7006, 7003, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-28 23:49:12+00', 802, 'double', 7007, 7012, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-26 04:36:52+00', 802, 'double', 7008, 7021, '[[6, 2], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-21 10:27:14+00', 802, 'double', 7009, 7030, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-31 10:53:55+00', 802, 'double', 7010, 7039, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-21 03:43:47+00', 802, 'double', 7011, 7048, '[[7, 5], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-07 10:20:23+00', 802, 'double', 7012, 7007, '[[6, 0], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-13 17:42:24+00', 802, 'double', 7013, 7016, '[[7, 5], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-17 06:22:44+00', 802, 'double', 7014, 7025, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-24 13:11:52+00', 802, 'double', 7015, 7034, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-27 10:08:36+00', 802, 'double', 7016, 7043, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-23 18:38:45+00', 802, 'double', 7017, 7002, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-14 02:30:45+00', 802, 'double', 7018, 7011, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-15 06:21:26+00', 802, 'double', 7019, 7020, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-28 13:31:57+00', 802, 'double', 7020, 7029, '[[6, 4], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-09 04:10:05+00', 802, 'double', 7021, 7038, '[[6, 2], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-02 07:16:04+00', 802, 'double', 7022, 7047, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-07 17:20:28+00', 802, 'double', 7023, 7006, '[[7, 5], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-14 19:59:44+00', 802, 'double', 7024, 7015, '[[6, 1], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-23 11:00:47+00', 802, 'double', 7025, 7024, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-16 23:56:32+00', 802, 'double', 7026, 7033, '[[7, 5], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-18 12:21:12+00', 802, 'double', 7027, 7042, '[[7, 5], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-26 15:11:26+00', 802, 'double', 7028, 7001, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-28 16:24:14+00', 802, 'double', 7029, 7010, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-18 10:13:31+00', 802, 'double', 7030, 7019, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-27 09:41:04+00', 802, 'double', 7031, 7028, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-23 18:58:08+00', 802, 'double', 7032, 7037, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-01 00:01:18+00', 802, 'double', 7033, 7046, '[[6, 0], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-04 16:39:29+00', 802, 'double', 7034, 7005, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-20 14:43:29+00', 802, 'double', 7035, 7014, '[[7, 5], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-14 20:20:59+00', 802, 'double', 7036, 7023, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-24 13:26:15+00', 802, 'double', 7037, 7032, '[[7, 5], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-25 07:08:55+00', 802, 'double', 7038, 7041, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-20 18:41:15+00', 802, 'double', 7039, 7050, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-10-01 10:36:54+00', 802, 'double', 7040, 7009, '[[7, 5], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-16 17:54:00+00', 802, 'double', 7041, 7018, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-12 16:05:53+00', 802, 'double', 7042, 7027, '[[6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-14 01:21:46+00', 802, 'double', 7043, 7036, '[[6, 2], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-02 12:34:11+00', 802, 'double', 7044, 7045, '[[6, 2], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-14 20:59:55+00', 802, 'double', 7045, 7004, '[[7, 5], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-15 11:57:59+00', 802, 'double', 7046, 7013, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-28 09:51:24+00', 802, 'double', 7047, 7022, '[[6, 0], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-25 12:16:37+00', 802, 'double', 7048, 7031, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-12 04:35:07+00', 802, 'double', 7049, 7040, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-25 23:30:32+00', 802, 'double', 7050, 7049, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-22 09:41:17+00', 802, 'double', 7001, 7008, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-21 19:34:47+00', 802, 'double', 7002, 7017, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-11 14:50:03+00', 802, 'double', 7003, 7026, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-02 01:22:57+00', 802, 'double', 7004, 7035, '[[7, 5], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-09 15:18:25+00', 802, 'double', 7005, 7044, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-09 06:13:51+00', 802, 'double', 7006, 7003, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-25 03:48:37+00', 802, 'double', 7007, 7012, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-22 23:43:23+00', 802, 'double', 7008, 7021, '[[6, 4], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-15 11:21:29+00', 802, 'double', 7009, 7030, '[[6, 4], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-01 18:02:24+00', 802, 'double', 7010, 7039, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-29 20:44:24+00', 802, 'double', 7011, 7048, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-16 18:59:45+00', 802, 'double', 7012, 7007, '[[6, 2], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-18 06:48:16+00', 802, 'double', 7013, 7016, '[[7, 5], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-24 20:10:17+00', 802, 'double', 7014, 7025, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-05 00:47:19+00', 802, 'double', 7015, 7034, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-01 02:35:03+00', 802, 'double', 7016, 7043, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-24 13:51:46+00', 802, 'double', 7017, 7002, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-06 19:28:37+00', 802, 'double', 7018, 7011, '[[6, 2], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-30 15:21:43+00', 802, 'double', 7019, 7020, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-22 21:42:41+00', 802, 'double', 7020, 7029, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-26 00:16:52+00', 802, 'double', 7021, 7038, '[[6, 1], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-23 12:58:11+00', 802, 'double', 7022, 7047, '[[6, 2], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-31 20:26:45+00', 802, 'double', 7023, 7006, '[[7, 5], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-11 14:55:01+00', 802, 'double', 7024, 7015, '[[6, 1], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-07 02:00:13+00', 802, 'double', 7025, 7024, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-09 11:53:01+00', 802, 'double', 7026, 7033, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-11 07:45:08+00', 802, 'double', 7027, 7042, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-27 18:10:13+00', 802, 'double', 7028, 7001, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-02 10:26:55+00', 802, 'double', 7029, 7010, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-04 16:23:53+00', 802, 'double', 7030, 7019, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-10 23:01:35+00', 802, 'double', 7031, 7028, '[[6, 0], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-02 15:43:21+00', 802, 'double', 7032, 7037, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-14 12:34:15+00', 802, 'double', 7033, 7046, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-21 21:44:09+00', 802, 'double', 7034, 7005, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-20 11:05:07+00', 802, 'double', 7035, 7014, '[[6, 4], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-25 19:07:52+00', 802, 'double', 7036, 7023, '[[6, 0], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-10 06:35:31+00', 802, 'double', 7037, 7032, '[[6, 3], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-29 04:55:59+00', 802, 'double', 7038, 7041, '[[6, 2], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-17 00:11:58+00', 802, 'double', 7039, 7050, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-12 22:53:42+00', 802, 'double', 7040, 7009, '[[6, 2], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-28 20:10:29+00', 802, 'double', 7041, 7018, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-25 07:48:25+00', 802, 'double', 7042, 7027, '[[6, 3], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-22 04:10:48+00', 802, 'double', 7043, 7036, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-05 06:32:48+00', 802, 'double', 7044, 7045, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-29 06:44:44+00', 802, 'double', 7045, 7004, '[[6, 3], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-06 23:07:54+00', 802, 'double', 7046, 7013, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-10 21:46:02+00', 802, 'double', 7047, 7022, '[[6, 4], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-29 01:49:17+00', 802, 'double', 7048, 7031, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-11 06:26:28+00', 802, 'double', 7049, 7040, '[[6, 0], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-07 11:47:42+00', 802, 'double', 7050, 7049, '[[6, 3], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-18 07:46:42+00', 803, 'single', 2001, 2002, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-11 14:17:31+00', 803, 'single', 2001, 2003, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-11 04:22:10+00', 803, 'single', 2001, 2004, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-21 08:41:33+00', 803, 'single', 2001, 2005, '[[6, 1], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-09 12:50:14+00', 803, 'single', 2001, 2006, '[[6, 2], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-18 10:03:50+00', 803, 'single', 2001, 2007, '[[6, 3], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-11 13:46:43+00', 803, 'single', 2001, 2008, '[[6, 2], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-27 14:02:39+00', 803, 'single', 2001, 2009, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-21 17:45:17+00', 803, 'single', 2001, 2010, '[[6, 0], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-16 17:44:49+00', 803, 'single', 2001, 2011, '[[7, 5], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-28 16:00:17+00', 803, 'single', 2001, 2012, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-15 15:05:13+00', 803, 'single', 2001, 2013, '[[6, 2], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-01 17:56:07+00', 803, 'single', 2001, 2014, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-28 20:08:33+00', 803, 'single', 2001, 2015, '[[6, 3], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-09 01:39:06+00', 803, 'single', 2001, 2016, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-04 18:52:07+00', 803, 'single', 2002, 2003, '[[6, 4], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-25 22:21:52+00', 803, 'single', 2002, 2004, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-21 14:54:59+00', 803, 'single', 2002, 2005, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-28 09:15:40+00', 803, 'single', 2002, 2006, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-20 16:08:21+00', 803, 'single', 2002, 2007, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-26 03:34:52+00', 803, 'single', 2002, 2008, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-07 23:32:15+00', 803, 'single', 2002, 2009, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-14 10:46:55+00', 803, 'single', 2002, 2010, '[[7, 5], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-03 01:25:31+00', 803, 'single', 2002, 2011, '[[6, 2], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-04 07:10:37+00', 803, 'single', 2002, 2012, '[[6, 4], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-22 03:22:34+00', 803, 'single', 2002, 2013, '[[6, 4], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-22 21:58:48+00', 803, 'single', 2002, 2014, '[[6, 4], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-10 02:42:41+00', 803, 'single', 2002, 2015, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-03 23:17:07+00', 803, 'single', 2002, 2016, '[[6, 4], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-05 18:06:59+00', 803, 'single', 2003, 2004, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-15 21:14:11+00', 803, 'single', 2003, 2005, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-21 02:07:49+00', 803, 'single', 2003, 2006, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-22 05:13:26+00', 803, 'single', 2003, 2007, '[[6, 3], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-20 22:54:50+00', 803, 'single', 2003, 2008, '[[7, 5], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-07 01:28:21+00', 803, 'single', 2003, 2009, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-16 13:48:45+00', 803, 'single', 2003, 2010, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-28 09:12:22+00', 803, 'single', 2003, 2011, '[[6, 0], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-22 01:40:14+00', 803, 'single', 2003, 2012, '[[6, 2], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-15 22:02:59+00', 803, 'single', 2003, 2013, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-27 01:13:09+00', 803, 'single', 2003, 2014, '[[6, 0], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-20 00:18:30+00', 803, 'single', 2003, 2015, '[[6, 1], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-24 10:52:21+00', 803, 'single', 2003, 2016, '[[6, 2], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-05 01:24:25+00', 803, 'single', 2004, 2005, '[[6, 4], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-18 18:10:01+00', 803, 'single', 2004, 2006, '[[6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-27 00:51:18+00', 803, 'single', 2004, 2007, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-02 18:31:37+00', 803, 'single', 2004, 2008, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-05 01:22:17+00', 803, 'single', 2004, 2009, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-23 08:15:22+00', 803, 'single', 2004, 2010, '[[6, 4], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-05 10:56:09+00', 803, 'single', 2004, 2011, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-17 14:39:38+00', 803, 'single', 2004, 2012, '[[6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-12 12:00:00+00', 803, 'single', 2004, 2013, '[[6, 0], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-06 16:05:26+00', 803, 'single', 2004, 2014, '[[6, 4], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-23 16:30:57+00', 803, 'single', 2004, 2015, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-01 17:31:28+00', 803, 'single', 2004, 2016, '[[7, 5], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-22 00:41:01+00', 803, 'single', 2005, 2006, '[[6, 4], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-13 18:45:23+00', 803, 'single', 2005, 2007, '[[6, 1], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-15 11:26:30+00', 803, 'single', 2005, 2008, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-26 21:46:02+00', 803, 'single', 2005, 2009, '[[7, 5], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-12 19:34:04+00', 803, 'single', 2005, 2010, '[[6, 0], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-22 15:26:27+00', 803, 'single', 2005, 2011, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-03 19:58:26+00', 803, 'single', 2005, 2012, '[[6, 0], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-14 05:47:17+00', 803, 'single', 2005, 2013, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-15 08:45:28+00', 803, 'single', 2005, 2014, '[[6, 3], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-14 00:17:04+00', 803, 'single', 2005, 2015, '[[6, 3], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-28 13:43:18+00', 803, 'single', 2005, 2016, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-24 23:08:00+00', 803, 'single', 2006, 2007, '[[6, 3], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-06 01:55:39+00', 803, 'single', 2006, 2008, '[[6, 1], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-05 06:59:17+00', 803, 'single', 2006, 2009, '[[7, 5], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-12 14:44:20+00', 803, 'single', 2006, 2010, '[[7, 5], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-04 09:22:21+00', 803, 'single', 2006, 2011, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-23 14:40:59+00', 803, 'single', 2006, 2012, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-16 13:53:36+00', 803, 'single', 2006, 2013, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-16 00:42:29+00', 803, 'single', 2006, 2014, '[[6, 4], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-23 15:24:59+00', 803, 'single', 2006, 2015, '[[6, 4], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-06 12:32:57+00', 803, 'single', 2006, 2016, '[[7, 5], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-06 14:46:49+00', 803, 'single', 2007, 2008, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-25 15:37:09+00', 803, 'single', 2007, 2009, '[[6, 3], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-24 12:14:11+00', 803, 'single', 2007, 2010, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-18 07:07:28+00', 803, 'single', 2007, 2011, '[[6, 0], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-01 02:12:59+00', 803, 'single', 2007, 2012, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-07 03:10:55+00', 803, 'single', 2007, 2013, '[[7, 5], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-13 21:25:58+00', 803, 'single', 2007, 2014, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-03 03:29:14+00', 803, 'single', 2007, 2015, '[[7, 5], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-17 15:58:24+00', 803, 'single', 2007, 2016, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-17 00:07:16+00', 803, 'single', 2008, 2009, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-16 15:09:43+00', 803, 'single', 2008, 2010, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-09 04:30:17+00', 803, 'single', 2008, 2011, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-05 12:21:53+00', 803, 'single', 2008, 2012, '[[6, 0], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-02 22:09:27+00', 803, 'single', 2008, 2013, '[[7, 5], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-11 14:50:46+00', 803, 'single', 2008, 2014, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-10-01 17:16:28+00', 803, 'single', 2008, 2015, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-28 02:31:06+00', 803, 'single', 2008, 2016, '[[6, 1], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-26 14:13:36+00', 803, 'single', 2009, 2010, '[[6, 4], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-19 05:26:49+00', 803, 'single', 2009, 2011, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-02 02:28:39+00', 803, 'single', 2009, 2012, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-31 13:41:00+00', 803, 'single', 2009, 2013, '[[6, 3], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-21 09:40:18+00', 803, 'single', 2009, 2014, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-20 10:30:17+00', 803, 'single', 2009, 2015, '[[6, 1], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-16 12:22:40+00', 803, 'single', 2009, 2016, '[[6, 1], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-29 11:30:09+00', 803, 'single', 2010, 2011, '[[6, 4], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-11 03:09:06+00', 803, 'single', 2010, 2012, '[[6, 1], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-14 13:36:35+00', 803, 'single', 2010, 2013, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-09 19:37:19+00', 803, 'single', 2010, 2014, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-14 00:00:59+00', 803, 'single', 2010, 2015, '[[6, 4], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-01 04:32:16+00', 803, 'single', 2010, 2016, '[[6, 0], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-02 12:49:46+00', 803, 'single', 2011, 2012, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-20 20:00:46+00', 803, 'single', 2011, 2013, '[[7, 5], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-12 13:10:43+00', 803, 'single', 2011, 2014, '[[6, 3], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-15 18:09:57+00', 803, 'single', 2011, 2015, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-01 04:24:42+00', 803, 'single', 2011, 2016, '[[7, 5], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-04 06:52:04+00', 803, 'single', 2012, 2013, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-12 18:56:52+00', 803, 'single', 2012, 2014, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-27 16:10:03+00', 803, 'single', 2012, 2015, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-11 19:26:22+00', 803, 'single', 2012, 2016, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-19 11:41:35+00', 803, 'single', 2013, 2014, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-09 23:10:27+00', 803, 'single', 2013, 2015, '[[6, 1], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-30 19:21:57+00', 803, 'single', 2013, 2016, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-27 23:29:41+00', 803, 'single', 2014, 2015, '[[6, 0], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-29 03:21:29+00', 803, 'single', 2014, 2016, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-09 15:50:51+00', 803, 'single', 2015, 2016, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-31 22:18:18+00', 804, 'double', 7051, 7052, '[[6, 4], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-07 17:03:12+00', 804, 'double', 7051, 7053, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-08 18:25:53+00', 804, 'double', 7051, 7054, '[[6, 1], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-26 03:58:19+00', 804, 'double', 7051, 7055, '[[6, 0], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-15 19:52:15+00', 804, 'double', 7051, 7056, '[[6, 4], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-05 08:27:16+00', 804, 'double', 7051, 7057, '[[6, 1], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-05 22:57:54+00', 804, 'double', 7051, 7058, '[[6, 1], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-26 20:51:47+00', 804, 'double', 7051, 7059, '[[6, 3], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-24 08:58:46+00', 804, 'double', 7051, 7060, '[[6, 4], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-13 23:39:44+00', 804, 'double', 7051, 7061, '[[6, 2], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-15 08:21:11+00', 804, 'double', 7051, 7062, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-15 09:01:24+00', 804, 'double', 7051, 7063, '[[6, 0], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-11 04:19:03+00', 804, 'double', 7051, 7064, '[[6, 4], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-30 01:44:05+00', 804, 'double', 7051, 7065, '[[6, 0], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-01 01:41:40+00', 804, 'double', 7051, 7066, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-10-02 16:27:16+00', 804, 'double', 7052, 7053, '[[6, 0], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-02 04:10:00+00', 804, 'double', 7052, 7054, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-14 17:39:37+00', 804, 'double', 7052, 7055, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-24 10:33:51+00', 804, 'double', 7052, 7056, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-04 04:35:17+00', 804, 'double', 7052, 7057, '[[6, 4], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-06 11:24:08+00', 804, 'double', 7052, 7058, '[[6, 2], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-25 05:15:54+00', 804, 'double', 7052, 7059, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-11 14:49:03+00', 804, 'double', 7052, 7060, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-12 03:00:50+00', 804, 'double', 7052, 7061, '[[6, 3], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-06 10:55:19+00', 804, 'double', 7052, 7062, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-29 22:35:17+00', 804, 'double', 7052, 7063, '[[6, 0], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-30 05:34:42+00', 804, 'double', 7052, 7064, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-06 20:12:20+00', 804, 'double', 7052, 7065, '[[7, 5], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-04 04:48:30+00', 804, 'double', 7052, 7066, '[[6, 1], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-21 09:04:57+00', 804, 'double', 7053, 7054, '[[6, 1], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-28 00:10:52+00', 804, 'double', 7053, 7055, '[[6, 2], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-30 03:49:21+00', 804, 'double', 7053, 7056, '[[6, 2], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-24 00:06:20+00', 804, 'double', 7053, 7057, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-06 18:19:11+00', 804, 'double', 7053, 7058, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-17 13:55:42+00', 804, 'double', 7053, 7059, '[[6, 4], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-18 18:13:40+00', 804, 'double', 7053, 7060, '[[6, 1], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-19 05:04:37+00', 804, 'double', 7053, 7061, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-25 08:37:45+00', 804, 'double', 7053, 7062, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-29 12:23:23+00', 804, 'double', 7053, 7063, '[[7, 5], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-10-02 17:55:27+00', 804, 'double', 7053, 7064, '[[6, 1], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-06 19:56:22+00', 804, 'double', 7053, 7065, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-09 14:46:25+00', 804, 'double', 7053, 7066, '[[7, 5], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-16 17:21:44+00', 804, 'double', 7054, 7055, '[[6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-18 10:08:28+00', 804, 'double', 7054, 7056, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-30 22:28:08+00', 804, 'double', 7054, 7057, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-12 08:28:11+00', 804, 'double', 7054, 7058, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-27 14:36:07+00', 804, 'double', 7054, 7059, '[[6, 3], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-31 07:10:55+00', 804, 'double', 7054, 7060, '[[6, 3], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-23 11:16:25+00', 804, 'double', 7054, 7061, '[[6, 4], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-01 11:18:07+00', 804, 'double', 7054, 7062, '[[6, 0], [6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-27 01:14:26+00', 804, 'double', 7054, 7063, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-15 10:48:13+00', 804, 'double', 7054, 7064, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-13 20:17:47+00', 804, 'double', 7054, 7065, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-04 02:30:27+00', 804, 'double', 7054, 7066, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-20 12:08:03+00', 804, 'double', 7055, 7056, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-23 11:06:34+00', 804, 'double', 7055, 7057, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-20 09:46:09+00', 804, 'double', 7055, 7058, '[[6, 1], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-10 06:32:07+00', 804, 'double', 7055, 7059, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-08 20:08:22+00', 804, 'double', 7055, 7060, '[[6, 2], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-11 09:55:53+00', 804, 'double', 7055, 7061, '[[6, 2], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-20 02:41:49+00', 804, 'double', 7055, 7062, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-23 20:14:34+00', 804, 'double', 7055, 7063, '[[7, 5], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-09 20:10:05+00', 804, 'double', 7055, 7064, '[[7, 5], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-12 14:11:11+00', 804, 'double', 7055, 7065, '[[6, 4], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-28 15:18:29+00', 804, 'double', 7055, 7066, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-23 22:10:16+00', 804, 'double', 7056, 7057, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-02 23:56:18+00', 804, 'double', 7056, 7058, '[[7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-03 17:49:43+00', 804, 'double', 7056, 7059, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-30 05:53:54+00', 804, 'double', 7056, 7060, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-06 04:32:33+00', 804, 'double', 7056, 7061, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-25 16:13:01+00', 804, 'double', 7056, 7062, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-13 14:48:59+00', 804, 'double', 7056, 7063, '[[6, 3], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-11 10:33:09+00', 804, 'double', 7056, 7064, '[[6, 3], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-11 19:03:58+00', 804, 'double', 7056, 7065, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-08 00:00:18+00', 804, 'double', 7056, 7066, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-01 10:22:51+00', 804, 'double', 7057, 7058, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-31 15:58:55+00', 804, 'double', 7057, 7059, '[[6, 4], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-04 02:24:50+00', 804, 'double', 7057, 7060, '[[6, 1], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-05 18:15:57+00', 804, 'double', 7057, 7061, '[[6, 1], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-22 18:15:06+00', 804, 'double', 7057, 7062, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-23 21:53:39+00', 804, 'double', 7057, 7063, '[[6, 4], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-10-01 09:12:31+00', 804, 'double', 7057, 7064, '[[7, 5], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-07 13:48:26+00', 804, 'double', 7057, 7065, '[[6, 4], [6, 2], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-15 01:04:15+00', 804, 'double', 7057, 7066, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-16 10:50:47+00', 804, 'double', 7058, 7059, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-26 05:20:47+00', 804, 'double', 7058, 7060, '[[6, 4], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-03 17:11:29+00', 804, 'double', 7058, 7061, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-13 10:35:19+00', 804, 'double', 7058, 7062, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-10 06:49:15+00', 804, 'double', 7058, 7063, '[[6, 0], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-29 01:09:29+00', 804, 'double', 7058, 7064, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-14 22:59:00+00', 804, 'double', 7058, 7065, '[[6, 0], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-21 03:32:38+00', 804, 'double', 7058, 7066, '[[6, 3], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-19 03:41:45+00', 804, 'double', 7059, 7060, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-07 10:31:11+00', 804, 'double', 7059, 7061, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-26 11:11:33+00', 804, 'double', 7059, 7062, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-23 23:48:09+00', 804, 'double', 7059, 7063, '[[6, 3], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-30 02:53:40+00', 804, 'double', 7059, 7064, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-29 15:43:12+00', 804, 'double', 7059, 7065, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-14 04:04:50+00', 804, 'double', 7059, 7066, '[[6, 3], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-03 16:51:19+00', 804, 'double', 7060, 7061, '[[6, 3], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-09 05:42:51+00', 804, 'double', 7060, 7062, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-13 22:44:10+00', 804, 'double', 7060, 7063, '[[6, 0], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-08 07:33:01+00', 804, 'double', 7060, 7064, '[[7, 5], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-28 09:06:30+00', 804, 'double', 7060, 7065, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-12 11:43:08+00', 804, 'double', 7060, 7066, '[[7, 5], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-01 22:43:19+00', 804, 'double', 7061, 7062, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-01 15:22:25+00', 804, 'double', 7061, 7063, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-04 05:35:38+00', 804, 'double', 7061, 7064, '[[6, 4], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-16 17:28:35+00', 804, 'double', 7061, 7065, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-10 06:41:42+00', 804, 'double', 7061, 7066, '[[6, 3], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-19 14:44:10+00', 804, 'double', 7062, 7063, '[[6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-01 02:32:02+00', 804, 'double', 7062, 7064, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-23 22:17:24+00', 804, 'double', 7062, 7065, '[[6, 2], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-06 06:36:22+00', 804, 'double', 7062, 7066, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-07 16:12:34+00', 804, 'double', 7063, 7064, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-16 12:03:44+00', 804, 'double', 7063, 7065, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-09 10:14:35+00', 804, 'double', 7063, 7066, '[[6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-02 07:51:35+00', 804, 'double', 7064, 7065, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-14 13:04:07+00', 804, 'double', 7064, 7066, '[[7, 5], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-09 01:05:10+00', 804, 'double', 7065, 7066, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-01 19:40:39+00', 805, 'single', 2017, 2020, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-13 11:40:22+00', 805, 'single', 2018, 2025, '[[6, 3], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-19 19:22:09+00', 805, 'single', 2019, 2030, '[[6, 0], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-13 08:01:18+00', 805, 'single', 2020, 2019, '[[6, 2], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-13 21:32:08+00', 805, 'single', 2021, 2024, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-11 14:22:39+00', 805, 'single', 2022, 2029, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-15 09:47:12+00', 805, 'single', 2023, 2018, '[[6, 3], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-29 16:14:49+00', 805, 'single', 2024, 2023, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-13 23:17:04+00', 805, 'single', 2025, 2028, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-12 10:23:46+00', 805, 'single', 2026, 2017, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-25 21:09:09+00', 805, 'single', 2027, 2022, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-11 18:59:43+00', 805, 'single', 2028, 2027, '[[7, 5], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-13 03:02:53+00', 805, 'single', 2029, 2032, '[[6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-24 04:14:00+00', 805, 'single', 2030, 2021, '[[6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-03 19:28:42+00', 805, 'single', 2031, 2026, '[[7, 5], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-31 21:34:24+00', 806, 'double', 7067, 7070, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-17 22:53:08+00', 806, 'double', 7068, 7075, '[[7, 5], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-09 22:07:55+00', 806, 'double', 7069, 7080, '[[6, 1], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-18 16:24:12+00', 806, 'double', 7070, 7069, '[[6, 0], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-17 23:57:19+00', 806, 'double', 7071, 7074, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-03 14:37:44+00', 806, 'double', 7072, 7079, '[[6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-15 07:04:50+00', 806, 'double', 7073, 7068, '[[6, 0], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-03 02:01:36+00', 806, 'double', 7074, 7073, '[[6, 0], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-08 12:06:07+00', 806, 'double', 7075, 7078, '[[7, 5], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-16 20:41:16+00', 806, 'double', 7076, 7067, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-05 04:51:48+00', 806, 'double', 7077, 7072, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-25 21:18:52+00', 806, 'double', 7078, 7077, '[[6, 3], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-14 01:34:23+00', 806, 'double', 7079, 7082, '[[6, 0], [6, 4], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-14 20:36:16+00', 806, 'double', 7080, 7071, '[[6, 1], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-16 02:10:46+00', 806, 'double', 7081, 7076, '[[7, 5], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-27 21:37:22+00', 807, 'single', 2033, 2036, '[[6, 1], [6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-29 22:41:01+00', 807, 'single', 2034, 2041, '[[7, 5], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-31 19:27:52+00', 807, 'single', 2035, 2046, '[[6, 4], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-12 00:40:24+00', 807, 'single', 2036, 2035, '[[6, 3], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-09 00:39:23+00', 807, 'single', 2037, 2040, '[[6, 4], [6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-11 18:22:55+00', 807, 'single', 2038, 2045, '[[6, 1], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-05 12:30:59+00', 807, 'single', 2039, 2034, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-31 07:09:02+00', 807, 'single', 2040, 2039, '[[7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-17 03:49:47+00', 807, 'single', 2041, 2044, '[[7, 5], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-09 16:41:42+00', 807, 'single', 2042, 2033, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-15 02:30:10+00', 807, 'single', 2043, 2038, '[[6, 0], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-11 06:14:32+00', 807, 'single', 2044, 2043, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-29 12:19:59+00', 807, 'single', 2045, 2048, '[[6, 3], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-15 21:26:45+00', 807, 'single', 2046, 2037, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-24 23:12:02+00', 807, 'single', 2047, 2042, '[[6, 2], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-10 15:45:42+00', 807, 'single', 2048, 2047, '[[6, 0], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-19 00:39:55+00', 807, 'single', 2033, 2036, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-12 22:49:07+00', 807, 'single', 2034, 2041, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-04 13:13:12+00', 807, 'single', 2035, 2046, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-07 01:40:39+00', 807, 'single', 2036, 2035, '[[7, 5], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-24 06:04:00+00', 807, 'single', 2037, 2040, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-20 21:19:59+00', 807, 'single', 2038, 2045, '[[6, 0], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-07 10:14:31+00', 807, 'single', 2039, 2034, '[[7, 5], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-17 18:20:53+00', 807, 'single', 2040, 2039, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-17 23:11:01+00', 807, 'single', 2041, 2044, '[[7, 5], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-07 13:51:27+00', 807, 'single', 2042, 2033, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-15 04:55:46+00', 807, 'single', 2043, 2038, '[[6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-18 12:21:45+00', 807, 'single', 2044, 2043, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-24 16:20:51+00', 807, 'single', 2045, 2048, '[[6, 4], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-05 04:56:13+00', 807, 'single', 2046, 2037, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-03 13:46:55+00', 808, 'double', 7083, 7086, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-16 11:00:55+00', 808, 'double', 7084, 7091, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-19 04:02:06+00', 808, 'double', 7085, 7096, '[[7, 5], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-09 20:18:18+00', 808, 'double', 7086, 7085, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-13 04:30:10+00', 808, 'double', 7087, 7090, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-07 15:30:12+00', 808, 'double', 7088, 7095, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-21 22:51:54+00', 808, 'double', 7089, 7084, '[[6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-12 02:27:50+00', 808, 'double', 7090, 7089, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-02 13:44:04+00', 808, 'double', 7091, 7094, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-05 10:43:35+00', 808, 'double', 7092, 7083, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-20 16:45:01+00', 808, 'double', 7093, 7088, '[[6, 4], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-11 11:20:43+00', 808, 'double', 7094, 7093, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-10 03:01:22+00', 808, 'double', 7095, 7098, '[[6, 1], [6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-13 13:43:22+00', 808, 'double', 7096, 7087, '[[6, 3], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-13 21:13:12+00', 808, 'double', 7097, 7092, '[[7, 5], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-27 00:34:54+00', 808, 'double', 7098, 7097, '[[6, 4], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-26 08:35:56+00', 808, 'double', 7083, 7086, '[[6, 2], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-24 00:42:52+00', 808, 'double', 7084, 7091, '[[6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-10-01 05:21:55+00', 808, 'double', 7085, 7096, '[[6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-12 01:47:33+00', 808, 'double', 7086, 7085, '[[6, 4], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-24 16:17:21+00', 808, 'double', 7087, 7090, '[[7, 5], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-17 17:42:23+00', 808, 'double', 7088, 7095, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-11 07:28:09+00', 808, 'double', 7089, 7084, '[[6, 0], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-28 10:19:48+00', 808, 'double', 7090, 7089, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-28 15:34:55+00', 808, 'double', 7091, 7094, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-13 10:23:40+00', 808, 'double', 7092, 7083, '[[7, 5], [6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-20 19:22:19+00', 808, 'double', 7093, 7088, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-03 01:51:36+00', 808, 'double', 7094, 7093, '[[6, 0], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-30 03:09:03+00', 808, 'double', 7095, 7098, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-07 13:54:04+00', 808, 'double', 7096, 7087, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-06-08 14:02:06+00', 809, 'single', 2049, 2052, '[[6, 1], [6, 2]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-07-08 07:14:15+00', 809, 'single', 2050, 2057, '[[6, 3], [7, 5], [6, 0]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-09-29 09:54:37+00', 809, 'single', 2051, 2062, '[[6, 4], [7, 5]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-06-09 18:53:37+00', 809, 'single', 2052, 2051, '[[6, 4], [6, 4]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-06-06 11:02:19+00', 809, 'single', 2053, 2056, '[[7, 5], [7, 5], [6, 1]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-05-18 13:56:19+00', 809, 'single', 2054, 2061, '[[6, 3], [6, 4], [6, 1]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-07-23 23:12:59+00', 809, 'single', 2055, 2050, '[[6, 1], [6, 4], [6, 4]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-09-18 01:52:20+00', 809, 'single', 2056, 2055, '[[6, 2], [7, 5], [6, 4]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-07-31 08:56:43+00', 809, 'single', 2057, 2060, '[[6, 4], [6, 3], [6, 4]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-05-03 19:54:11+00', 809, 'single', 2058, 2049, '[[6, 3], [6, 2], [6, 0]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-09-24 22:55:48+00', 809, 'single', 2059, 2054, '[[6, 2], [6, 4], [6, 0]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-05-23 01:48:09+00', 809, 'single', 2060, 2059, '[[6, 1], [7, 5]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-05-17 23:38:56+00', 809, 'single', 2061, 2064, '[[6, 2], [7, 5], [6, 2]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-08-26 15:52:55+00', 809, 'single', 2062, 2053, '[[6, 4], [6, 3], [6, 2]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-05-11 04:05:16+00', 809, 'single', 2063, 2058, '[[6, 0], [6, 1]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-09-28 17:57:26+00', 809, 'single', 2064, 2063, '[[6, 1], [6, 3]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-06-30 17:41:17+00', 809, 'single', 2049, 2052, '[[6, 2], [6, 3]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-06-28 18:57:01+00', 809, 'single', 2050, 2057, '[[6, 2], [6, 2]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-09-30 00:22:02+00', 809, 'single', 2051, 2062, '[[7, 5], [6, 2], [7, 5]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-09-05 08:10:59+00', 809, 'single', 2052, 2051, '[[6, 4], [6, 4]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-07-17 18:07:10+00', 809, 'single', 2053, 2056, '[[6, 4], [6, 1]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-05-26 17:05:42+00', 809, 'single', 2054, 2061, '[[6, 3], [6, 3], [6, 4]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-08-16 17:07:13+00', 809, 'single', 2055, 2050, '[[6, 3], [6, 3]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-09-04 08:26:46+00', 809, 'single', 2056, 2055, '[[6, 2], [6, 4], [6, 3]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-06-01 02:31:30+00', 809, 'single', 2057, 2060, '[[6, 3], [6, 2]]', 'playoff');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-08-06 14:14:50+00', 809, 'single', 2058, 2049, '[[7, 5], [7, 5], [6, 3]]', 'playoff');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-07-12 14:04:51+00', 809, 'single', 2059, 2054, '[[7, 5], [6, 1], [6, 0]]', 'playoff');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES ('2025-05-13 14:02:24+00', 809, 'single', 2060, 2059, '[[6, 3], [7, 5]]', 'playoff');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-09-17 18:52:24+00', 810, 'double', 7099, 7102, '[[6, 3], [6, 2], [6, 3]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-06-17 03:43:46+00', 810, 'double', 7100, 7107, '[[6, 3], [6, 4], [6, 2]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-08-04 03:44:08+00', 810, 'double', 7101, 7112, '[[6, 3], [6, 0], [6, 2]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-09-29 12:20:26+00', 810, 'double', 7102, 7101, '[[6, 0], [6, 3], [6, 2]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-09-12 11:26:35+00', 810, 'double', 7103, 7106, '[[6, 2], [6, 4], [6, 1]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-05-08 14:28:36+00', 810, 'double', 7104, 7111, '[[6, 3], [6, 3], [6, 0]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-05-23 08:54:15+00', 810, 'double', 7105, 7100, '[[6, 2], [6, 4]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-06-30 05:28:21+00', 810, 'double', 7106, 7105, '[[6, 1], [6, 3]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-07-02 12:54:29+00', 810, 'double', 7107, 7110, '[[6, 2], [6, 0]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-09-05 13:08:23+00', 810, 'double', 7108, 7099, '[[6, 3], [6, 2], [6, 2]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-09-26 06:10:00+00', 810, 'double', 7109, 7104, '[[6, 3], [6, 4]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-05-20 13:42:17+00', 810, 'double', 7110, 7109, '[[6, 0], [6, 3]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-08-02 03:59:29+00', 810, 'double', 7111, 7114, '[[6, 2], [7, 5]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-09-04 00:35:05+00', 810, 'double', 7112, 7103, '[[7, 5], [6, 1], [6, 3]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-06-26 22:13:25+00', 810, 'double', 7113, 7108, '[[6, 2], [6, 1]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-07-07 12:20:50+00', 810, 'double', 7114, 7113, '[[6, 0], [6, 0]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-08-19 23:38:58+00', 810, 'double', 7099, 7102, '[[6, 3], [6, 1]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-08-14 17:07:53+00', 810, 'double', 7100, 7107, '[[6, 3], [6, 1]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-09-24 04:00:57+00', 810, 'double', 7101, 7112, '[[6, 1], [6, 1], [6, 2]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-08-02 09:04:12+00', 810, 'double', 7102, 7101, '[[6, 3], [7, 5]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-08-28 21:28:24+00', 810, 'double', 7103, 7106, '[[7, 5], [6, 0]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-09-22 15:30:42+00', 810, 'double', 7104, 7111, '[[6, 3], [6, 0], [6, 2]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-08-11 09:34:58+00', 810, 'double', 7105, 7100, '[[6, 4], [6, 2]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-05-30 05:35:45+00', 810, 'double', 7106, 7105, '[[6, 2], [6, 4], [7, 5]]', 'group');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-05-20 04:41:28+00', 810, 'double', 7107, 7110, '[[6, 0], [6, 4]]', 'playoff');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-07-18 10:32:17+00', 810, 'double', 7108, 7099, '[[6, 4], [6, 4], [6, 2]]', 'playoff');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-07-21 04:01:13+00', 810, 'double', 7109, 7104, '[[6, 3], [6, 4], [6, 3]]', 'playoff');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES ('2025-07-24 07:07:33+00', 810, 'double', 7110, 7109, '[[6, 3], [6, 1]]', 'playoff');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-08 08:36:38+00', 811, 'single', 2065, 2066, '[[6, 0], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-31 21:39:56+00', 811, 'single', 2067, 2068, '[[6, 3], [6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-16 12:06:00+00', 811, 'single', 2069, 2070, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-22 10:00:32+00', 811, 'single', 2071, 2072, '[[6, 0], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-25 10:40:27+00', 811, 'single', 2073, 2074, '[[6, 4], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-26 18:13:34+00', 811, 'single', 2075, 2076, '[[6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-30 18:47:09+00', 811, 'single', 2077, 2078, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-02 21:48:48+00', 811, 'single', 2079, 2080, '[[6, 0], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-12 22:56:04+00', 811, 'single', 2066, 2067, '[[6, 2], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-08 05:34:44+00', 811, 'single', 2068, 2069, '[[6, 4], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-18 03:54:38+00', 811, 'single', 2070, 2071, '[[6, 4], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-20 21:07:38+00', 811, 'single', 2072, 2073, '[[6, 0], [6, 0], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-21 17:21:12+00', 811, 'single', 2074, 2075, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-06 23:09:39+00', 811, 'single', 2076, 2077, '[[6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-15 09:02:12+00', 811, 'single', 2078, 2079, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-17 22:00:23+00', 811, 'single', 2080, 2065, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-14 17:13:24+00', 811, 'single', 2067, 2068, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-24 07:15:13+00', 811, 'single', 2069, 2070, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-09 04:20:44+00', 811, 'single', 2071, 2072, '[[6, 3], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-30 05:10:43+00', 811, 'single', 2073, 2074, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-12 06:07:06+00', 811, 'single', 2075, 2076, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-04 13:56:04+00', 811, 'single', 2077, 2078, '[[6, 3], [6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-02 22:37:44+00', 811, 'single', 2079, 2080, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-04 05:48:54+00', 811, 'single', 2065, 2066, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-13 18:06:54+00', 811, 'single', 2068, 2069, '[[6, 3], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-03 09:31:24+00', 811, 'single', 2070, 2071, '[[6, 0], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-07 15:17:24+00', 811, 'single', 2072, 2073, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-23 12:56:39+00', 811, 'single', 2074, 2075, '[[6, 4], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-18 04:31:12+00', 811, 'single', 2076, 2077, '[[6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-12 09:24:39+00', 811, 'single', 2078, 2079, '[[6, 0], [6, 4], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-22 14:23:08+00', 811, 'single', 2080, 2065, '[[6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-30 17:52:59+00', 811, 'single', 2066, 2067, '[[7, 5], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-09 23:37:28+00', 812, 'double', 7115, 7116, '[[6, 4], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-26 19:21:26+00', 812, 'double', 7117, 7118, '[[6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-17 15:06:08+00', 812, 'double', 7119, 7120, '[[6, 3], [6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-12 06:17:42+00', 812, 'double', 7121, 7122, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-27 22:40:24+00', 812, 'double', 7123, 7124, '[[6, 1], [6, 1], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-02 02:03:52+00', 812, 'double', 7125, 7126, '[[6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-29 21:03:24+00', 812, 'double', 7127, 7128, '[[6, 2], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-31 18:37:23+00', 812, 'double', 7129, 7130, '[[6, 4], [6, 4], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-11 17:22:16+00', 812, 'double', 7116, 7117, '[[6, 1], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-05 15:50:22+00', 812, 'double', 7118, 7119, '[[6, 3], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-21 09:04:52+00', 812, 'double', 7120, 7121, '[[6, 3], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-10-01 05:31:17+00', 812, 'double', 7122, 7123, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-28 05:28:35+00', 812, 'double', 7124, 7125, '[[7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-12 20:58:43+00', 812, 'double', 7126, 7127, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-21 06:20:47+00', 812, 'double', 7128, 7129, '[[6, 0], [6, 2], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-19 04:29:19+00', 812, 'double', 7130, 7115, '[[6, 2], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-28 12:59:00+00', 812, 'double', 7117, 7118, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-14 20:49:50+00', 812, 'double', 7119, 7120, '[[6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-09 03:55:09+00', 812, 'double', 7121, 7122, '[[6, 3], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-29 10:26:17+00', 812, 'double', 7123, 7124, '[[7, 5], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-04 03:17:35+00', 812, 'double', 7125, 7126, '[[6, 1], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-19 18:31:05+00', 812, 'double', 7127, 7128, '[[6, 3], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-10 15:46:02+00', 812, 'double', 7129, 7130, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-23 11:13:55+00', 812, 'double', 7115, 7116, '[[6, 2], [6, 1], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-17 17:48:54+00', 812, 'double', 7118, 7119, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-06 16:16:23+00', 812, 'double', 7120, 7121, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-19 11:04:51+00', 812, 'double', 7122, 7123, '[[6, 2], [6, 2], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-13 01:35:55+00', 812, 'double', 7124, 7125, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-27 21:12:14+00', 812, 'double', 7126, 7127, '[[6, 1], [6, 2], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-06 13:49:13+00', 812, 'double', 7128, 7129, '[[7, 5], [6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-28 01:36:31+00', 812, 'double', 7130, 7115, '[[7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-09 02:20:01+00', 812, 'double', 7116, 7117, '[[7, 5], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-25 02:27:13+00', 813, 'single', 2081, 2084, '[[6, 2], [6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-22 22:35:56+00', 813, 'single', 2082, 2089, '[[6, 2], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-06 06:46:57+00', 813, 'single', 2083, 2094, '[[7, 5], [6, 1], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-20 13:03:35+00', 813, 'single', 2084, 2083, '[[6, 0], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-02 01:27:24+00', 813, 'single', 2085, 2088, '[[6, 3], [6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-24 23:18:42+00', 813, 'single', 2086, 2093, '[[6, 3], [7, 5], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-31 15:25:00+00', 813, 'single', 2087, 2082, '[[6, 3], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-29 09:20:36+00', 813, 'single', 2088, 2087, '[[6, 4], [6, 1], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-27 01:34:09+00', 813, 'single', 2089, 2092, '[[6, 4], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-14 08:56:19+00', 813, 'single', 2090, 2081, '[[6, 3], [6, 0], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-06-15 22:58:36+00', 813, 'single', 2091, 2086, '[[6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-09-03 02:48:00+00', 813, 'single', 2092, 2091, '[[6, 0], [6, 3], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-04 20:46:59+00', 813, 'single', 2093, 2096, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-05-08 03:37:15+00', 813, 'single', 2094, 2085, '[[6, 1], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-07-26 11:14:01+00', 813, 'single', 2095, 2090, '[[6, 1], [6, 0], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, player1_id, player2_id, scores) VALUES ('2025-08-15 16:52:24+00', 813, 'single', 2096, 2095, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-06 12:52:54+00', 814, 'double', 7131, 7134, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-30 13:20:02+00', 814, 'double', 7132, 7139, '[[7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-28 03:04:50+00', 814, 'double', 7133, 7144, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-30 09:12:39+00', 814, 'double', 7134, 7133, '[[6, 2], [7, 5], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-25 22:04:38+00', 814, 'double', 7135, 7138, '[[7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-03 10:33:10+00', 814, 'double', 7136, 7143, '[[6, 1], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-08-22 22:55:37+00', 814, 'double', 7137, 7132, '[[7, 5], [7, 5], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-27 03:50:36+00', 814, 'double', 7138, 7137, '[[6, 0], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-05-23 00:10:22+00', 814, 'double', 7139, 7142, '[[7, 5], [7, 5], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-12 06:11:39+00', 814, 'double', 7140, 7131, '[[6, 0], [7, 5], [7, 5]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-08 06:16:52+00', 814, 'double', 7141, 7136, '[[6, 3], [6, 3]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-09 08:38:19+00', 814, 'double', 7142, 7141, '[[6, 0], [6, 3], [6, 0]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-06-27 05:57:25+00', 814, 'double', 7143, 7146, '[[6, 0], [6, 1]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-31 08:28:21+00', 814, 'double', 7144, 7135, '[[6, 0], [6, 4]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-07-11 11:49:19+00', 814, 'double', 7145, 7140, '[[6, 2], [7, 5], [6, 2]]');
INSERT INTO matches (date, tournament_id, match_type, team1_id, team2_id, scores) VALUES ('2025-09-01 12:23:14+00', 814, 'double', 7146, 7145, '[[6, 0], [6, 2], [6, 2]]');

COMMIT;
