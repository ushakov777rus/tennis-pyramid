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
  (801, 'Демо Пирамида (одиночная)', 'pyramid', 'single', 'ongoing', true, 'demo-pyramid-single', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (802, 'Демо Пирамида (парная)', 'pyramid', 'double', 'ongoing', true, 'demo-pyramid-double', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (803, 'Демо Круговой (одиночная)', 'round_robin', 'single', 'ongoing', true, 'demo-rr-single', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (804, 'Демо Круговой (парная)', 'round_robin', 'double', 'ongoing', true, 'demo-rr-double', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (805, 'Демо Олимпийка (одиночная)', 'single_elimination', 'single', 'ongoing', true, 'demo-se-single', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (806, 'Демо Олимпийка (парная)', 'single_elimination', 'double', 'ongoing', true, 'demo-se-double', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (807, 'Демо Двойная сетка (одиночная)', 'double_elimination', 'single', 'ongoing', true, 'demo-de-single', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (808, 'Демо Двойная сетка (парная)', 'double_elimination', 'double', 'ongoing', true, 'demo-de-double', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (809, 'Демо Группы+ПО (одиночная)', 'groups_playoff', 'single', 'ongoing', true, 'demo-gp-single', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (810, 'Демо Группы+ПО (парная)', 'groups_playoff', 'double', 'ongoing', true, 'demo-gp-double', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (811, 'Демо Швейцарка (одиночная)', 'swiss', 'single', 'ongoing', true, 'demo-swiss-single', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (812, 'Демо Швейцарка (парная)', 'swiss', 'double', 'ongoing', true, 'demo-swiss-double', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (813, 'Демо Произвольный (одиночная)', 'custom', 'single', 'ongoing', true, 'demo-custom-single', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb),
  (814, 'Демо Произвольный (парная)', 'custom', 'double', 'ongoing', true, 'demo-custom-double', 601, '2024-01-01', '2024-12-31', 40, '{}'::jsonb);

INSERT INTO tournament_participants (tournament_id, player_id) VALUES
  (801, 2001),
  (801, 2002),
  (801, 2003),
  (801, 2004),
  (801, 2005),
  (801, 2006),
  (801, 2007),
  (801, 2008),
  (801, 2009),
  (801, 2010),
  (801, 2011),
  (801, 2012),
  (801, 2013),
  (801, 2014),
  (801, 2015),
  (801, 2016),
  (801, 2017),
  (801, 2018),
  (801, 2019),
  (801, 2020),
  (801, 2021),
  (801, 2022),
  (801, 2023),
  (801, 2024),
  (801, 2025),
  (801, 2026),
  (801, 2027),
  (801, 2028),
  (801, 2029),
  (801, 2030),
  (801, 2031),
  (801, 2032),
  (801, 2033),
  (801, 2034),
  (801, 2035),
  (801, 2036),
  (801, 2037),
  (801, 2038),
  (801, 2039),
  (801, 2040),
  (801, 2041),
  (801, 2042),
  (801, 2043),
  (801, 2044),
  (801, 2045),
  (801, 2046),
  (801, 2047),
  (801, 2048),
  (801, 2049),
  (801, 2050),
  (801, 2051),
  (801, 2052),
  (801, 2053),
  (801, 2054),
  (801, 2055),
  (801, 2056),
  (801, 2057),
  (801, 2058),
  (801, 2059),
  (801, 2060),
  (801, 2061),
  (801, 2062),
  (801, 2063),
  (801, 2064),
  (801, 2065),
  (801, 2066),
  (801, 2067),
  (801, 2068),
  (801, 2069),
  (801, 2070),
  (801, 2071),
  (801, 2072),
  (801, 2073),
  (801, 2074),
  (801, 2075),
  (801, 2076),
  (801, 2077),
  (801, 2078),
  (801, 2079),
  (801, 2080),
  (801, 2081),
  (801, 2082),
  (801, 2083),
  (801, 2084),
  (801, 2085),
  (801, 2086),
  (801, 2087),
  (801, 2088),
  (801, 2089),
  (801, 2090),
  (801, 2091),
  (801, 2092),
  (801, 2093),
  (801, 2094),
  (801, 2095),
  (801, 2096),
  (801, 2097),
  (801, 2098),
  (801, 2099),
  (801, 2100);

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

INSERT INTO tournament_participants (tournament_id, team_id) VALUES
  (802, 7001),
  (802, 7002),
  (802, 7003),
  (802, 7004),
  (802, 7005),
  (802, 7006),
  (802, 7007),
  (802, 7008),
  (802, 7009),
  (802, 7010),
  (802, 7011),
  (802, 7012),
  (802, 7013),
  (802, 7014),
  (802, 7015),
  (802, 7016),
  (802, 7017),
  (802, 7018),
  (802, 7019),
  (802, 7020),
  (802, 7021),
  (802, 7022),
  (802, 7023),
  (802, 7024),
  (802, 7025),
  (802, 7026),
  (802, 7027),
  (802, 7028),
  (802, 7029),
  (802, 7030),
  (802, 7031),
  (802, 7032),
  (802, 7033),
  (802, 7034),
  (802, 7035),
  (802, 7036),
  (802, 7037),
  (802, 7038),
  (802, 7039),
  (802, 7040),
  (802, 7041),
  (802, 7042),
  (802, 7043),
  (802, 7044),
  (802, 7045),
  (802, 7046),
  (802, 7047),
  (802, 7048),
  (802, 7049),
  (802, 7050);

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

INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2001, 2006, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2002, 2013, '[[6, 1], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2003, 2020, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2004, 2027, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2005, 2034, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2006, 2041, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2007, 2048, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2008, 2055, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2009, 2062, '[[6, 0], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2010, 2069, '[[6, 2], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2011, 2076, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2012, 2083, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2013, 2090, '[[6, 2], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2014, 2097, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2015, 2004, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2016, 2011, '[[7, 5], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2017, 2018, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2018, 2025, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2019, 2032, '[[6, 0], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2020, 2039, '[[6, 2], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2021, 2046, '[[6, 1], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2022, 2053, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2023, 2060, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2024, 2067, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2025, 2074, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2026, 2081, '[[6, 2], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2027, 2088, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2028, 2095, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2029, 2002, '[[6, 3], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2030, 2009, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2031, 2016, '[[6, 1], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2032, 2023, '[[7, 5], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2033, 2030, '[[6, 1], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2034, 2037, '[[7, 5], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2035, 2044, '[[6, 2], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2036, 2051, '[[6, 0], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2037, 2058, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2038, 2065, '[[6, 4], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2039, 2072, '[[6, 4], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2040, 2079, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2041, 2086, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2042, 2093, '[[7, 5], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2043, 2100, '[[6, 3], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2044, 2007, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2045, 2014, '[[6, 4], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2046, 2021, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2047, 2028, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2048, 2035, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2049, 2042, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2050, 2049, '[[6, 0], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2051, 2056, '[[6, 1], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2052, 2063, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2053, 2070, '[[6, 0], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2054, 2077, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2055, 2084, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2056, 2091, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2057, 2098, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2058, 2005, '[[7, 5], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2059, 2012, '[[6, 4], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2060, 2019, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2061, 2026, '[[6, 0], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2062, 2033, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2063, 2040, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2064, 2047, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2065, 2054, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2066, 2061, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2067, 2068, '[[6, 1], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2068, 2075, '[[6, 1], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2069, 2082, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2070, 2089, '[[6, 2], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2071, 2096, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2072, 2003, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2073, 2010, '[[6, 0], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2074, 2017, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2075, 2024, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2076, 2031, '[[6, 3], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2077, 2038, '[[6, 4], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2078, 2045, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2079, 2052, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2080, 2059, '[[6, 1], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2081, 2066, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2082, 2073, '[[6, 2], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2083, 2080, '[[7, 5], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2084, 2087, '[[6, 1], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2085, 2094, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2086, 2001, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2087, 2008, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2088, 2015, '[[6, 4], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2089, 2022, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2090, 2029, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2091, 2036, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2092, 2043, '[[6, 0], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2093, 2050, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2094, 2057, '[[7, 5], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2095, 2064, '[[6, 2], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2096, 2071, '[[6, 1], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2097, 2078, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2098, 2085, '[[6, 3], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2099, 2092, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2100, 2099, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2001, 2006, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2002, 2013, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2003, 2020, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2004, 2027, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2005, 2034, '[[6, 4], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2006, 2041, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2007, 2048, '[[7, 5], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2008, 2055, '[[6, 0], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2009, 2062, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2010, 2069, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2011, 2076, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2012, 2083, '[[6, 4], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2013, 2090, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2014, 2097, '[[6, 2], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2015, 2004, '[[6, 1], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2016, 2011, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2017, 2018, '[[6, 4], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2018, 2025, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2019, 2032, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2020, 2039, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2021, 2046, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2022, 2053, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2023, 2060, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2024, 2067, '[[6, 4], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2025, 2074, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2026, 2081, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2027, 2088, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2028, 2095, '[[7, 5], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2029, 2002, '[[6, 1], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2030, 2009, '[[6, 0], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2031, 2016, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2032, 2023, '[[6, 1], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2033, 2030, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2034, 2037, '[[6, 0], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2035, 2044, '[[7, 5], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2036, 2051, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2037, 2058, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2038, 2065, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2039, 2072, '[[6, 2], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2040, 2079, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2041, 2086, '[[6, 4], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2042, 2093, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2043, 2100, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2044, 2007, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2045, 2014, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2046, 2021, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2047, 2028, '[[6, 4], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2048, 2035, '[[6, 2], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2049, 2042, '[[6, 4], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2050, 2049, '[[7, 5], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2051, 2056, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2052, 2063, '[[6, 3], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2053, 2070, '[[6, 2], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2054, 2077, '[[6, 3], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2055, 2084, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2056, 2091, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2057, 2098, '[[6, 4], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2058, 2005, '[[6, 0], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2059, 2012, '[[6, 1], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2060, 2019, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2061, 2026, '[[6, 4], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2062, 2033, '[[7, 5], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2063, 2040, '[[6, 3], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2064, 2047, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2065, 2054, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2066, 2061, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2067, 2068, '[[6, 0], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2068, 2075, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2069, 2082, '[[7, 5], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2070, 2089, '[[6, 3], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2071, 2096, '[[6, 4], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2072, 2003, '[[6, 3], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2073, 2010, '[[6, 4], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2074, 2017, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2075, 2024, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2076, 2031, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2077, 2038, '[[6, 4], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2078, 2045, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2079, 2052, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2080, 2059, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2081, 2066, '[[6, 4], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2082, 2073, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2083, 2080, '[[6, 4], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2084, 2087, '[[6, 3], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2085, 2094, '[[6, 3], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2086, 2001, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2087, 2008, '[[6, 3], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2088, 2015, '[[6, 2], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2089, 2022, '[[7, 5], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2090, 2029, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2091, 2036, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2092, 2043, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2093, 2050, '[[6, 1], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2094, 2057, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2095, 2064, '[[6, 1], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2096, 2071, '[[6, 3], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2097, 2078, '[[6, 0], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2098, 2085, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2099, 2092, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2100, 2099, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2001, 2006, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2002, 2013, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2003, 2020, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2004, 2027, '[[7, 5], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2005, 2034, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2006, 2041, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2007, 2048, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2008, 2055, '[[6, 4], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2009, 2062, '[[7, 5], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2010, 2069, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2011, 2076, '[[7, 5], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2012, 2083, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2013, 2090, '[[7, 5], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2014, 2097, '[[6, 0], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2015, 2004, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2016, 2011, '[[7, 5], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2017, 2018, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2018, 2025, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2019, 2032, '[[6, 3], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2020, 2039, '[[6, 2], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2021, 2046, '[[6, 3], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2022, 2053, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2023, 2060, '[[6, 1], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2024, 2067, '[[6, 2], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2025, 2074, '[[6, 4], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2026, 2081, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2027, 2088, '[[6, 3], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2028, 2095, '[[7, 5], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2029, 2002, '[[6, 0], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2030, 2009, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2031, 2016, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2032, 2023, '[[6, 3], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2033, 2030, '[[6, 3], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2034, 2037, '[[6, 2], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2035, 2044, '[[6, 2], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2036, 2051, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2037, 2058, '[[6, 0], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2038, 2065, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2039, 2072, '[[6, 2], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2040, 2079, '[[6, 0], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2041, 2086, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2042, 2093, '[[6, 0], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2043, 2100, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2044, 2007, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2045, 2014, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2046, 2021, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2047, 2028, '[[6, 3], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2048, 2035, '[[6, 1], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2049, 2042, '[[6, 0], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2050, 2049, '[[6, 0], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2051, 2056, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2052, 2063, '[[6, 0], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2053, 2070, '[[6, 4], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2054, 2077, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2055, 2084, '[[6, 3], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2056, 2091, '[[6, 2], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2057, 2098, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2058, 2005, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2059, 2012, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2060, 2019, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2061, 2026, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2062, 2033, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2063, 2040, '[[7, 5], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2064, 2047, '[[6, 0], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2065, 2054, '[[7, 5], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2066, 2061, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2067, 2068, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2068, 2075, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2069, 2082, '[[6, 1], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2070, 2089, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2071, 2096, '[[6, 3], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2072, 2003, '[[7, 5], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2073, 2010, '[[6, 3], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2074, 2017, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2075, 2024, '[[6, 4], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2076, 2031, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2077, 2038, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2078, 2045, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2079, 2052, '[[6, 2], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2080, 2059, '[[7, 5], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2081, 2066, '[[6, 2], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2082, 2073, '[[7, 5], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2083, 2080, '[[6, 3], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2084, 2087, '[[7, 5], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2085, 2094, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2086, 2001, '[[6, 2], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2087, 2008, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2088, 2015, '[[6, 3], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2089, 2022, '[[6, 4], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2090, 2029, '[[6, 0], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2091, 2036, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2092, 2043, '[[6, 0], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2093, 2050, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2094, 2057, '[[6, 4], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2095, 2064, '[[6, 0], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2096, 2071, '[[6, 0], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2097, 2078, '[[7, 5], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2098, 2085, '[[6, 3], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2099, 2092, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2100, 2099, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2001, 2006, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2002, 2013, '[[6, 2], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2003, 2020, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2004, 2027, '[[6, 4], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2005, 2034, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2006, 2041, '[[6, 2], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2007, 2048, '[[6, 3], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2008, 2055, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2009, 2062, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2010, 2069, '[[7, 5], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2011, 2076, '[[6, 3], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2012, 2083, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2013, 2090, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2014, 2097, '[[6, 0], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2015, 2004, '[[6, 0], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2016, 2011, '[[7, 5], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2017, 2018, '[[6, 2], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2018, 2025, '[[7, 5], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2019, 2032, '[[6, 2], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2020, 2039, '[[6, 4], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2021, 2046, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2022, 2053, '[[6, 1], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2023, 2060, '[[6, 0], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2024, 2067, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2025, 2074, '[[6, 0], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2026, 2081, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2027, 2088, '[[6, 3], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2028, 2095, '[[6, 4], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2029, 2002, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2030, 2009, '[[6, 4], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2031, 2016, '[[6, 4], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2032, 2023, '[[7, 5], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2033, 2030, '[[7, 5], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2034, 2037, '[[7, 5], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2035, 2044, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2036, 2051, '[[7, 5], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2037, 2058, '[[6, 3], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2038, 2065, '[[6, 3], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2039, 2072, '[[6, 4], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2040, 2079, '[[7, 5], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2041, 2086, '[[6, 2], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2042, 2093, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2043, 2100, '[[6, 2], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2044, 2007, '[[6, 1], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2045, 2014, '[[7, 5], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2046, 2021, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2047, 2028, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2048, 2035, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2049, 2042, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2050, 2049, '[[7, 5], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2051, 2056, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2052, 2063, '[[6, 4], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2053, 2070, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2054, 2077, '[[7, 5], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2055, 2084, '[[6, 0], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2056, 2091, '[[6, 4], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2057, 2098, '[[6, 0], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2058, 2005, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2059, 2012, '[[6, 4], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2060, 2019, '[[6, 0], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2061, 2026, '[[6, 0], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2062, 2033, '[[6, 4], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2063, 2040, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2064, 2047, '[[7, 5], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2065, 2054, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2066, 2061, '[[6, 3], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2067, 2068, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2068, 2075, '[[6, 3], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2069, 2082, '[[6, 4], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2070, 2089, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2071, 2096, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2072, 2003, '[[6, 2], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2073, 2010, '[[6, 1], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2074, 2017, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2075, 2024, '[[6, 4], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2076, 2031, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2077, 2038, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2078, 2045, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2079, 2052, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2080, 2059, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2081, 2066, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2082, 2073, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2083, 2080, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2084, 2087, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2085, 2094, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2086, 2001, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2087, 2008, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2088, 2015, '[[6, 1], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2089, 2022, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2090, 2029, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2091, 2036, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2092, 2043, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2093, 2050, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2094, 2057, '[[6, 4], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2095, 2064, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2096, 2071, '[[6, 3], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2097, 2078, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2098, 2085, '[[7, 5], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2099, 2092, '[[6, 0], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2100, 2099, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2001, 2006, '[[6, 4], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2002, 2013, '[[6, 3], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2003, 2020, '[[6, 3], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2004, 2027, '[[6, 0], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2005, 2034, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2006, 2041, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2007, 2048, '[[6, 3], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2008, 2055, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2009, 2062, '[[7, 5], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2010, 2069, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2011, 2076, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2012, 2083, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2013, 2090, '[[6, 1], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2014, 2097, '[[7, 5], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2015, 2004, '[[7, 5], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2016, 2011, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2017, 2018, '[[6, 2], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2018, 2025, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2019, 2032, '[[6, 1], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2020, 2039, '[[6, 0], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2021, 2046, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2022, 2053, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2023, 2060, '[[6, 0], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2024, 2067, '[[6, 2], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2025, 2074, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2026, 2081, '[[6, 0], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2027, 2088, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2028, 2095, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2029, 2002, '[[6, 2], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2030, 2009, '[[7, 5], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2031, 2016, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2032, 2023, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2033, 2030, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2034, 2037, '[[6, 3], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2035, 2044, '[[6, 2], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2036, 2051, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2037, 2058, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2038, 2065, '[[6, 4], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2039, 2072, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2040, 2079, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2041, 2086, '[[6, 1], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2042, 2093, '[[6, 2], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2043, 2100, '[[7, 5], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2044, 2007, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2045, 2014, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2046, 2021, '[[6, 0], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2047, 2028, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2048, 2035, '[[6, 0], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2049, 2042, '[[6, 4], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2050, 2049, '[[6, 2], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2051, 2056, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2052, 2063, '[[7, 5], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2053, 2070, '[[6, 0], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2054, 2077, '[[6, 4], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2055, 2084, '[[7, 5], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2056, 2091, '[[6, 1], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2057, 2098, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2058, 2005, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2059, 2012, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2060, 2019, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2061, 2026, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2062, 2033, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2063, 2040, '[[6, 3], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2064, 2047, '[[7, 5], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2065, 2054, '[[7, 5], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2066, 2061, '[[6, 0], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2067, 2068, '[[6, 2], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2068, 2075, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2069, 2082, '[[6, 3], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2070, 2089, '[[6, 2], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2071, 2096, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2072, 2003, '[[6, 3], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2073, 2010, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2074, 2017, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2075, 2024, '[[6, 4], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2076, 2031, '[[6, 0], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2077, 2038, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2078, 2045, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2079, 2052, '[[6, 3], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2080, 2059, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2081, 2066, '[[6, 3], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2082, 2073, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2083, 2080, '[[6, 0], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2084, 2087, '[[6, 2], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2085, 2094, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2086, 2001, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2087, 2008, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2088, 2015, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2089, 2022, '[[7, 5], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2090, 2029, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2091, 2036, '[[6, 4], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2092, 2043, '[[6, 2], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2093, 2050, '[[6, 3], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2094, 2057, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2095, 2064, '[[6, 0], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2096, 2071, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2097, 2078, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2098, 2085, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2099, 2092, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (801, 'single', 2100, 2099, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7001, 7008, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7002, 7017, '[[7, 5], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7003, 7026, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7004, 7035, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7005, 7044, '[[6, 3], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7006, 7003, '[[6, 1], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7007, 7012, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7008, 7021, '[[6, 2], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7009, 7030, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7010, 7039, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7011, 7048, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7012, 7007, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7013, 7016, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7014, 7025, '[[6, 4], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7015, 7034, '[[6, 0], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7016, 7043, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7017, 7002, '[[6, 1], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7018, 7011, '[[6, 3], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7019, 7020, '[[6, 3], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7020, 7029, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7021, 7038, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7022, 7047, '[[6, 0], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7023, 7006, '[[6, 0], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7024, 7015, '[[7, 5], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7025, 7024, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7026, 7033, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7027, 7042, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7028, 7001, '[[6, 3], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7029, 7010, '[[6, 1], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7030, 7019, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7031, 7028, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7032, 7037, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7033, 7046, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7034, 7005, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7035, 7014, '[[6, 2], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7036, 7023, '[[6, 0], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7037, 7032, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7038, 7041, '[[6, 1], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7039, 7050, '[[7, 5], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7040, 7009, '[[7, 5], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7041, 7018, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7042, 7027, '[[6, 0], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7043, 7036, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7044, 7045, '[[6, 2], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7045, 7004, '[[6, 2], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7046, 7013, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7047, 7022, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7048, 7031, '[[6, 0], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7049, 7040, '[[7, 5], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7050, 7049, '[[6, 1], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7001, 7008, '[[6, 2], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7002, 7017, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7003, 7026, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7004, 7035, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7005, 7044, '[[6, 0], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7006, 7003, '[[6, 2], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7007, 7012, '[[6, 1], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7008, 7021, '[[6, 3], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7009, 7030, '[[6, 4], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7010, 7039, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7011, 7048, '[[6, 2], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7012, 7007, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7013, 7016, '[[6, 0], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7014, 7025, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7015, 7034, '[[6, 3], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7016, 7043, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7017, 7002, '[[6, 2], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7018, 7011, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7019, 7020, '[[6, 2], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7020, 7029, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7021, 7038, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7022, 7047, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7023, 7006, '[[7, 5], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7024, 7015, '[[7, 5], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7025, 7024, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7026, 7033, '[[6, 1], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7027, 7042, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7028, 7001, '[[7, 5], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7029, 7010, '[[6, 2], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7030, 7019, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7031, 7028, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7032, 7037, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7033, 7046, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7034, 7005, '[[6, 3], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7035, 7014, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7036, 7023, '[[7, 5], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7037, 7032, '[[6, 3], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7038, 7041, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7039, 7050, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7040, 7009, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7041, 7018, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7042, 7027, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7043, 7036, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7044, 7045, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7045, 7004, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7046, 7013, '[[6, 0], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7047, 7022, '[[6, 1], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7048, 7031, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7049, 7040, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7050, 7049, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7001, 7008, '[[6, 4], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7002, 7017, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7003, 7026, '[[7, 5], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7004, 7035, '[[6, 4], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7005, 7044, '[[7, 5], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7006, 7003, '[[6, 3], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7007, 7012, '[[6, 2], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7008, 7021, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7009, 7030, '[[6, 3], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7010, 7039, '[[6, 4], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7011, 7048, '[[7, 5], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7012, 7007, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7013, 7016, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7014, 7025, '[[6, 0], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7015, 7034, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7016, 7043, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7017, 7002, '[[6, 1], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7018, 7011, '[[6, 1], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7019, 7020, '[[6, 3], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7020, 7029, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7021, 7038, '[[6, 1], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7022, 7047, '[[6, 0], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7023, 7006, '[[6, 4], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7024, 7015, '[[6, 2], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7025, 7024, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7026, 7033, '[[7, 5], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7027, 7042, '[[6, 0], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7028, 7001, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7029, 7010, '[[6, 0], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7030, 7019, '[[6, 4], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7031, 7028, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7032, 7037, '[[6, 2], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7033, 7046, '[[6, 1], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7034, 7005, '[[6, 4], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7035, 7014, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7036, 7023, '[[6, 3], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7037, 7032, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7038, 7041, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7039, 7050, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7040, 7009, '[[6, 4], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7041, 7018, '[[7, 5], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7042, 7027, '[[6, 0], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7043, 7036, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7044, 7045, '[[7, 5], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7045, 7004, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7046, 7013, '[[7, 5], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7047, 7022, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7048, 7031, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7049, 7040, '[[6, 1], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7050, 7049, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7001, 7008, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7002, 7017, '[[6, 2], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7003, 7026, '[[7, 5], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7004, 7035, '[[7, 5], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7005, 7044, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7006, 7003, '[[7, 5], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7007, 7012, '[[6, 2], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7008, 7021, '[[6, 4], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7009, 7030, '[[6, 4], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7010, 7039, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7011, 7048, '[[6, 1], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7012, 7007, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7013, 7016, '[[6, 2], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7014, 7025, '[[6, 2], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7015, 7034, '[[6, 3], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7016, 7043, '[[6, 0], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7017, 7002, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7018, 7011, '[[7, 5], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7019, 7020, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7020, 7029, '[[6, 1], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7021, 7038, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7022, 7047, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7023, 7006, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7024, 7015, '[[7, 5], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7025, 7024, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7026, 7033, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7027, 7042, '[[6, 3], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7028, 7001, '[[6, 2], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7029, 7010, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7030, 7019, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7031, 7028, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7032, 7037, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7033, 7046, '[[6, 1], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7034, 7005, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7035, 7014, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7036, 7023, '[[7, 5], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7037, 7032, '[[6, 1], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7038, 7041, '[[6, 1], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7039, 7050, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7040, 7009, '[[7, 5], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7041, 7018, '[[6, 2], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7042, 7027, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7043, 7036, '[[6, 3], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7044, 7045, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7045, 7004, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7046, 7013, '[[6, 2], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7047, 7022, '[[6, 3], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7048, 7031, '[[6, 2], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7049, 7040, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7050, 7049, '[[7, 5], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7001, 7008, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7002, 7017, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7003, 7026, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7004, 7035, '[[6, 2], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7005, 7044, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7006, 7003, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7007, 7012, '[[6, 3], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7008, 7021, '[[6, 4], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7009, 7030, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7010, 7039, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7011, 7048, '[[6, 0], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7012, 7007, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7013, 7016, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7014, 7025, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7015, 7034, '[[6, 0], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7016, 7043, '[[6, 0], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7017, 7002, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7018, 7011, '[[6, 3], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7019, 7020, '[[7, 5], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7020, 7029, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7021, 7038, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7022, 7047, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7023, 7006, '[[7, 5], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7024, 7015, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7025, 7024, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7026, 7033, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7027, 7042, '[[6, 2], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7028, 7001, '[[6, 3], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7029, 7010, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7030, 7019, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7031, 7028, '[[6, 4], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7032, 7037, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7033, 7046, '[[6, 3], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7034, 7005, '[[6, 4], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7035, 7014, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7036, 7023, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7037, 7032, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7038, 7041, '[[6, 4], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7039, 7050, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7040, 7009, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7041, 7018, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7042, 7027, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7043, 7036, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7044, 7045, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7045, 7004, '[[6, 1], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7046, 7013, '[[6, 4], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7047, 7022, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7048, 7031, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7049, 7040, '[[6, 0], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7050, 7049, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7001, 7008, '[[6, 4], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7002, 7017, '[[7, 5], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7003, 7026, '[[7, 5], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7004, 7035, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7005, 7044, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7006, 7003, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7007, 7012, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7008, 7021, '[[6, 3], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7009, 7030, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7010, 7039, '[[6, 1], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7011, 7048, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7012, 7007, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7013, 7016, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7014, 7025, '[[7, 5], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7015, 7034, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7016, 7043, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7017, 7002, '[[6, 2], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7018, 7011, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7019, 7020, '[[6, 1], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7020, 7029, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7021, 7038, '[[6, 2], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7022, 7047, '[[6, 2], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7023, 7006, '[[6, 3], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7024, 7015, '[[6, 2], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7025, 7024, '[[6, 3], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7026, 7033, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7027, 7042, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7028, 7001, '[[6, 2], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7029, 7010, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7030, 7019, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7031, 7028, '[[6, 2], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7032, 7037, '[[6, 3], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7033, 7046, '[[6, 1], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7034, 7005, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7035, 7014, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7036, 7023, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7037, 7032, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7038, 7041, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7039, 7050, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7040, 7009, '[[6, 2], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7041, 7018, '[[7, 5], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7042, 7027, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7043, 7036, '[[6, 0], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7044, 7045, '[[6, 4], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7045, 7004, '[[6, 1], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7046, 7013, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7047, 7022, '[[6, 2], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7048, 7031, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7049, 7040, '[[6, 4], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7050, 7049, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7001, 7008, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7002, 7017, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7003, 7026, '[[6, 3], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7004, 7035, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7005, 7044, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7006, 7003, '[[7, 5], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7007, 7012, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7008, 7021, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7009, 7030, '[[6, 2], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7010, 7039, '[[6, 4], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7011, 7048, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7012, 7007, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7013, 7016, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7014, 7025, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7015, 7034, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7016, 7043, '[[6, 3], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7017, 7002, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7018, 7011, '[[6, 0], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7019, 7020, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7020, 7029, '[[6, 2], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7021, 7038, '[[6, 3], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7022, 7047, '[[6, 4], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7023, 7006, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7024, 7015, '[[6, 0], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7025, 7024, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7026, 7033, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7027, 7042, '[[7, 5], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7028, 7001, '[[6, 2], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7029, 7010, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7030, 7019, '[[6, 2], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7031, 7028, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7032, 7037, '[[6, 3], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7033, 7046, '[[6, 0], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7034, 7005, '[[6, 4], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7035, 7014, '[[6, 3], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7036, 7023, '[[6, 3], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7037, 7032, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7038, 7041, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7039, 7050, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7040, 7009, '[[6, 2], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7041, 7018, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7042, 7027, '[[6, 3], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7043, 7036, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7044, 7045, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7045, 7004, '[[6, 4], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7046, 7013, '[[6, 0], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7047, 7022, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7048, 7031, '[[6, 2], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7049, 7040, '[[7, 5], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7050, 7049, '[[6, 2], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7001, 7008, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7002, 7017, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7003, 7026, '[[7, 5], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7004, 7035, '[[6, 4], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7005, 7044, '[[6, 2], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7006, 7003, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7007, 7012, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7008, 7021, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7009, 7030, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7010, 7039, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7011, 7048, '[[6, 1], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7012, 7007, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7013, 7016, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7014, 7025, '[[6, 0], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7015, 7034, '[[6, 4], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7016, 7043, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7017, 7002, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7018, 7011, '[[6, 1], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7019, 7020, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7020, 7029, '[[6, 2], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7021, 7038, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7022, 7047, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7023, 7006, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7024, 7015, '[[6, 3], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7025, 7024, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7026, 7033, '[[6, 0], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7027, 7042, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7028, 7001, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7029, 7010, '[[6, 3], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7030, 7019, '[[6, 2], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7031, 7028, '[[7, 5], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7032, 7037, '[[6, 0], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7033, 7046, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7034, 7005, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7035, 7014, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7036, 7023, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7037, 7032, '[[6, 3], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7038, 7041, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7039, 7050, '[[6, 3], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7040, 7009, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7041, 7018, '[[6, 3], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7042, 7027, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7043, 7036, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7044, 7045, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7045, 7004, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7046, 7013, '[[7, 5], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7047, 7022, '[[6, 4], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7048, 7031, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7049, 7040, '[[6, 3], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7050, 7049, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7001, 7008, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7002, 7017, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7003, 7026, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7004, 7035, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7005, 7044, '[[6, 4], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7006, 7003, '[[6, 3], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7007, 7012, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7008, 7021, '[[6, 2], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7009, 7030, '[[6, 3], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7010, 7039, '[[6, 0], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7011, 7048, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7012, 7007, '[[6, 3], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7013, 7016, '[[7, 5], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7014, 7025, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7015, 7034, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7016, 7043, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7017, 7002, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7018, 7011, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7019, 7020, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7020, 7029, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7021, 7038, '[[6, 4], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7022, 7047, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7023, 7006, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7024, 7015, '[[6, 2], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7025, 7024, '[[6, 0], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7026, 7033, '[[7, 5], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7027, 7042, '[[6, 1], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7028, 7001, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7029, 7010, '[[6, 4], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7030, 7019, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7031, 7028, '[[6, 2], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7032, 7037, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7033, 7046, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7034, 7005, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7035, 7014, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7036, 7023, '[[6, 1], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7037, 7032, '[[6, 1], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7038, 7041, '[[7, 5], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7039, 7050, '[[6, 0], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7040, 7009, '[[6, 4], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7041, 7018, '[[6, 3], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7042, 7027, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7043, 7036, '[[7, 5], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7044, 7045, '[[6, 0], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7045, 7004, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7046, 7013, '[[6, 2], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7047, 7022, '[[6, 4], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7048, 7031, '[[6, 2], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7049, 7040, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7050, 7049, '[[6, 0], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7001, 7008, '[[6, 3], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7002, 7017, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7003, 7026, '[[6, 1], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7004, 7035, '[[6, 2], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7005, 7044, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7006, 7003, '[[7, 5], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7007, 7012, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7008, 7021, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7009, 7030, '[[6, 0], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7010, 7039, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7011, 7048, '[[6, 0], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7012, 7007, '[[6, 0], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7013, 7016, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7014, 7025, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7015, 7034, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7016, 7043, '[[6, 2], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7017, 7002, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7018, 7011, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7019, 7020, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7020, 7029, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7021, 7038, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7022, 7047, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7023, 7006, '[[6, 1], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7024, 7015, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7025, 7024, '[[6, 2], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7026, 7033, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7027, 7042, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7028, 7001, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7029, 7010, '[[6, 1], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7030, 7019, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7031, 7028, '[[7, 5], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7032, 7037, '[[6, 3], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7033, 7046, '[[7, 5], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7034, 7005, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7035, 7014, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7036, 7023, '[[6, 2], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7037, 7032, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7038, 7041, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7039, 7050, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7040, 7009, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7041, 7018, '[[7, 5], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7042, 7027, '[[6, 3], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7043, 7036, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7044, 7045, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7045, 7004, '[[6, 0], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7046, 7013, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7047, 7022, '[[6, 4], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7048, 7031, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7049, 7040, '[[7, 5], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (802, 'double', 7050, 7049, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2002, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2003, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2004, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2005, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2006, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2007, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2008, '[[7, 5], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2009, '[[6, 3], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2010, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2011, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2012, '[[6, 0], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2013, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2014, '[[6, 0], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2015, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2001, 2016, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2003, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2004, '[[6, 3], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2005, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2006, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2007, '[[7, 5], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2008, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2009, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2010, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2011, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2012, '[[6, 2], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2013, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2014, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2015, '[[6, 4], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2002, 2016, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2004, '[[6, 1], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2005, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2006, '[[6, 0], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2007, '[[7, 5], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2008, '[[6, 0], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2009, '[[6, 0], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2010, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2011, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2012, '[[6, 0], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2013, '[[7, 5], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2014, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2015, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2003, 2016, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2005, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2006, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2007, '[[6, 2], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2008, '[[6, 2], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2009, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2010, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2011, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2012, '[[6, 3], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2013, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2014, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2015, '[[6, 2], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2004, 2016, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2005, 2006, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2005, 2007, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2005, 2008, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2005, 2009, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2005, 2010, '[[6, 1], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2005, 2011, '[[6, 4], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2005, 2012, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2005, 2013, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2005, 2014, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2005, 2015, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2005, 2016, '[[7, 5], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2006, 2007, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2006, 2008, '[[6, 0], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2006, 2009, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2006, 2010, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2006, 2011, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2006, 2012, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2006, 2013, '[[7, 5], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2006, 2014, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2006, 2015, '[[6, 1], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2006, 2016, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2007, 2008, '[[6, 1], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2007, 2009, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2007, 2010, '[[6, 3], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2007, 2011, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2007, 2012, '[[6, 1], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2007, 2013, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2007, 2014, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2007, 2015, '[[6, 3], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2007, 2016, '[[6, 4], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2008, 2009, '[[6, 2], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2008, 2010, '[[6, 4], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2008, 2011, '[[6, 0], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2008, 2012, '[[6, 4], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2008, 2013, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2008, 2014, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2008, 2015, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2008, 2016, '[[6, 2], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2009, 2010, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2009, 2011, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2009, 2012, '[[6, 4], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2009, 2013, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2009, 2014, '[[6, 1], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2009, 2015, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2009, 2016, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2010, 2011, '[[6, 0], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2010, 2012, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2010, 2013, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2010, 2014, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2010, 2015, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2010, 2016, '[[6, 0], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2011, 2012, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2011, 2013, '[[6, 2], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2011, 2014, '[[7, 5], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2011, 2015, '[[6, 1], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2011, 2016, '[[6, 1], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2012, 2013, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2012, 2014, '[[6, 1], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2012, 2015, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2012, 2016, '[[6, 4], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2013, 2014, '[[6, 4], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2013, 2015, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2013, 2016, '[[7, 5], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2014, 2015, '[[6, 2], [6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2014, 2016, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (803, 'single', 2015, 2016, '[[6, 3], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7052, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7053, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7054, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7055, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7056, '[[6, 1], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7057, '[[6, 2], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7058, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7059, '[[6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7060, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7061, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7062, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7063, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7064, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7065, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7051, 7066, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7053, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7054, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7055, '[[6, 1], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7056, '[[7, 5], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7057, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7058, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7059, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7060, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7061, '[[7, 5], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7062, '[[6, 1], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7063, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7064, '[[6, 0], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7065, '[[6, 3], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7052, 7066, '[[6, 0], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7054, '[[6, 1], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7055, '[[6, 1], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7056, '[[6, 3], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7057, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7058, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7059, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7060, '[[6, 4], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7061, '[[6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7062, '[[6, 4], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7063, '[[6, 4], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7064, '[[6, 0], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7065, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7053, 7066, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7055, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7056, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7057, '[[6, 0], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7058, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7059, '[[6, 2], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7060, '[[6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7061, '[[6, 4], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7062, '[[6, 0], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7063, '[[6, 0], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7064, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7065, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7054, 7066, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7055, 7056, '[[6, 3], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7055, 7057, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7055, 7058, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7055, 7059, '[[6, 1], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7055, 7060, '[[6, 0], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7055, 7061, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7055, 7062, '[[6, 2], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7055, 7063, '[[6, 2], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7055, 7064, '[[7, 5], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7055, 7065, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7055, 7066, '[[6, 2], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7056, 7057, '[[6, 4], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7056, 7058, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7056, 7059, '[[7, 5], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7056, 7060, '[[6, 0], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7056, 7061, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7056, 7062, '[[6, 1], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7056, 7063, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7056, 7064, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7056, 7065, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7056, 7066, '[[7, 5], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7057, 7058, '[[6, 3], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7057, 7059, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7057, 7060, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7057, 7061, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7057, 7062, '[[6, 2], [6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7057, 7063, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7057, 7064, '[[6, 0], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7057, 7065, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7057, 7066, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7058, 7059, '[[7, 5], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7058, 7060, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7058, 7061, '[[6, 1], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7058, 7062, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7058, 7063, '[[7, 5], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7058, 7064, '[[6, 3], [6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7058, 7065, '[[6, 2], [6, 1], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7058, 7066, '[[7, 5], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7059, 7060, '[[6, 4], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7059, 7061, '[[6, 4], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7059, 7062, '[[6, 2], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7059, 7063, '[[6, 0], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7059, 7064, '[[6, 2], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7059, 7065, '[[6, 1], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7059, 7066, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7060, 7061, '[[7, 5], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7060, 7062, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7060, 7063, '[[6, 2], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7060, 7064, '[[6, 3], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7060, 7065, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7060, 7066, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7061, 7062, '[[7, 5], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7061, 7063, '[[6, 1], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7061, 7064, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7061, 7065, '[[6, 1], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7061, 7066, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7062, 7063, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7062, 7064, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7062, 7065, '[[6, 2], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7062, 7066, '[[6, 3], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7063, 7064, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7063, 7065, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7063, 7066, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7064, 7065, '[[6, 3], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7064, 7066, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (804, 'double', 7065, 7066, '[[6, 4], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2017, 2020, '[[7, 5], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2018, 2025, '[[6, 2], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2019, 2030, '[[7, 5], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2020, 2019, '[[6, 2], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2021, 2024, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2022, 2029, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2023, 2018, '[[6, 3], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2024, 2023, '[[6, 0], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2025, 2028, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2026, 2017, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2027, 2022, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2028, 2027, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2029, 2032, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2030, 2021, '[[6, 2], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (805, 'single', 2031, 2026, '[[6, 4], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7067, 7070, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7068, 7075, '[[6, 2], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7069, 7080, '[[6, 3], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7070, 7069, '[[6, 3], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7071, 7074, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7072, 7079, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7073, 7068, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7074, 7073, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7075, 7078, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7076, 7067, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7077, 7072, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7078, 7077, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7079, 7082, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7080, 7071, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (806, 'double', 7081, 7076, '[[6, 0], [6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2033, 2036, '[[7, 5], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2034, 2041, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2035, 2046, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2036, 2035, '[[6, 4], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2037, 2040, '[[6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2038, 2045, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2039, 2034, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2040, 2039, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2041, 2044, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2042, 2033, '[[6, 2], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2043, 2038, '[[6, 1], [7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2044, 2043, '[[6, 1], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2045, 2048, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2046, 2037, '[[6, 1], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2047, 2042, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2048, 2047, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2033, 2036, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2034, 2041, '[[6, 3], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2035, 2046, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2036, 2035, '[[7, 5], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2037, 2040, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2038, 2045, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2039, 2034, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2040, 2039, '[[6, 4], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2041, 2044, '[[6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2042, 2033, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2043, 2038, '[[6, 3], [6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2044, 2043, '[[6, 3], [7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2045, 2048, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (807, 'single', 2046, 2037, '[[6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7083, 7086, '[[6, 4], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7084, 7091, '[[6, 1], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7085, 7096, '[[6, 4], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7086, 7085, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7087, 7090, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7088, 7095, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7089, 7084, '[[6, 0], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7090, 7089, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7091, 7094, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7092, 7083, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7093, 7088, '[[6, 1], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7094, 7093, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7095, 7098, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7096, 7087, '[[6, 1], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7097, 7092, '[[6, 1], [6, 2], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7098, 7097, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7083, 7086, '[[6, 3], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7084, 7091, '[[6, 3], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7085, 7096, '[[6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7086, 7085, '[[6, 0], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7087, 7090, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7088, 7095, '[[6, 0], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7089, 7084, '[[6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7090, 7089, '[[6, 4], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7091, 7094, '[[6, 2], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7092, 7083, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7093, 7088, '[[7, 5], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7094, 7093, '[[6, 0], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7095, 7098, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (808, 'double', 7096, 7087, '[[7, 5], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2049, 2052, '[[7, 5], [6, 0], [6, 0]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2050, 2057, '[[6, 3], [6, 1]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2051, 2062, '[[6, 0], [6, 2], [6, 4]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2052, 2051, '[[6, 1], [6, 0]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2053, 2056, '[[6, 1], [6, 3], [6, 1]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2054, 2061, '[[6, 0], [6, 3], [6, 0]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2055, 2050, '[[6, 3], [6, 3]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2056, 2055, '[[6, 3], [6, 0]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2057, 2060, '[[6, 4], [6, 3]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2058, 2049, '[[6, 4], [6, 1], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2059, 2054, '[[7, 5], [6, 1]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2060, 2059, '[[6, 3], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2061, 2064, '[[6, 4], [6, 3], [6, 3]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2062, 2053, '[[6, 2], [6, 3]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2063, 2058, '[[6, 2], [6, 3], [6, 1]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2064, 2063, '[[6, 3], [6, 4]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2049, 2052, '[[7, 5], [6, 4], [6, 2]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2050, 2057, '[[6, 1], [6, 1]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2051, 2062, '[[7, 5], [6, 2], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2052, 2051, '[[7, 5], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2053, 2056, '[[6, 4], [6, 4]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2054, 2061, '[[7, 5], [6, 0], [6, 2]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2055, 2050, '[[6, 4], [6, 4], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2056, 2055, '[[7, 5], [7, 5], [6, 4]]', 'group');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2057, 2060, '[[6, 3], [6, 0], [6, 4]]', 'playoff');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2058, 2049, '[[6, 0], [6, 3]]', 'playoff');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2059, 2054, '[[6, 0], [7, 5]]', 'playoff');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores, phase) VALUES (809, 'single', 2060, 2059, '[[6, 1], [6, 2]]', 'playoff');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7099, 7102, '[[6, 2], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7100, 7107, '[[6, 1], [6, 0], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7101, 7112, '[[6, 1], [6, 4], [6, 0]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7102, 7101, '[[6, 3], [6, 0], [6, 4]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7103, 7106, '[[7, 5], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7104, 7111, '[[6, 1], [6, 4], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7105, 7100, '[[7, 5], [7, 5], [6, 0]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7106, 7105, '[[6, 3], [6, 3], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7107, 7110, '[[6, 4], [6, 0], [6, 0]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7108, 7099, '[[6, 1], [6, 4], [6, 3]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7109, 7104, '[[7, 5], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7110, 7109, '[[6, 4], [6, 4], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7111, 7114, '[[7, 5], [6, 1]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7112, 7103, '[[6, 3], [6, 1], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7113, 7108, '[[6, 1], [6, 1]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7114, 7113, '[[6, 3], [6, 0]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7099, 7102, '[[6, 2], [6, 4], [6, 2]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7100, 7107, '[[6, 1], [6, 4]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7101, 7112, '[[6, 0], [6, 2], [6, 3]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7102, 7101, '[[6, 0], [6, 1]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7103, 7106, '[[6, 4], [6, 0], [7, 5]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7104, 7111, '[[6, 3], [6, 4], [6, 4]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7105, 7100, '[[6, 0], [7, 5], [6, 2]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7106, 7105, '[[6, 1], [6, 4]]', 'group');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7107, 7110, '[[6, 4], [6, 1]]', 'playoff');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7108, 7099, '[[6, 4], [6, 4], [6, 3]]', 'playoff');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7109, 7104, '[[6, 2], [6, 1]]', 'playoff');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores, phase) VALUES (810, 'double', 7110, 7109, '[[7, 5], [6, 2]]', 'playoff');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2065, 2066, '[[6, 2], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2067, 2068, '[[6, 4], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2069, 2070, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2071, 2072, '[[6, 1], [7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2073, 2074, '[[6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2075, 2076, '[[6, 3], [6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2077, 2078, '[[6, 4], [7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2079, 2080, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2066, 2067, '[[6, 3], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2068, 2069, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2070, 2071, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2072, 2073, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2074, 2075, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2076, 2077, '[[7, 5], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2078, 2079, '[[6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2080, 2065, '[[7, 5], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2067, 2068, '[[6, 0], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2069, 2070, '[[6, 0], [6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2071, 2072, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2073, 2074, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2075, 2076, '[[6, 3], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2077, 2078, '[[6, 3], [6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2079, 2080, '[[7, 5], [6, 0], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2065, 2066, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2068, 2069, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2070, 2071, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2072, 2073, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2074, 2075, '[[6, 4], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2076, 2077, '[[6, 3], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2078, 2079, '[[6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2080, 2065, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (811, 'single', 2066, 2067, '[[6, 4], [6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7115, 7116, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7117, 7118, '[[6, 0], [6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7119, 7120, '[[6, 0], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7121, 7122, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7123, 7124, '[[6, 4], [6, 4], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7125, 7126, '[[6, 1], [7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7127, 7128, '[[6, 1], [6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7129, 7130, '[[6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7116, 7117, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7118, 7119, '[[6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7120, 7121, '[[6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7122, 7123, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7124, 7125, '[[6, 2], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7126, 7127, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7128, 7129, '[[6, 2], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7130, 7115, '[[6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7117, 7118, '[[6, 1], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7119, 7120, '[[6, 3], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7121, 7122, '[[7, 5], [6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7123, 7124, '[[6, 2], [6, 3], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7125, 7126, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7127, 7128, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7129, 7130, '[[6, 2], [6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7115, 7116, '[[6, 3], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7118, 7119, '[[6, 2], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7120, 7121, '[[6, 1], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7122, 7123, '[[6, 2], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7124, 7125, '[[6, 2], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7126, 7127, '[[7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7128, 7129, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7130, 7115, '[[6, 4], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (812, 'double', 7116, 7117, '[[6, 4], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2081, 2084, '[[6, 4], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2082, 2089, '[[6, 2], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2083, 2094, '[[6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2084, 2083, '[[6, 1], [6, 3], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2085, 2088, '[[6, 3], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2086, 2093, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2087, 2082, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2088, 2087, '[[6, 1], [6, 1], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2089, 2092, '[[7, 5], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2090, 2081, '[[6, 2], [6, 0], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2091, 2086, '[[6, 1], [6, 0], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2092, 2091, '[[6, 1], [6, 0], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2093, 2096, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2094, 2085, '[[6, 3], [6, 3], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2095, 2090, '[[7, 5], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, player1_id, player2_id, scores) VALUES (813, 'single', 2096, 2095, '[[7, 5], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7131, 7134, '[[7, 5], [6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7132, 7139, '[[6, 3], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7133, 7144, '[[6, 2], [6, 4], [7, 5]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7134, 7133, '[[6, 4], [6, 2]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7135, 7138, '[[6, 1], [6, 4], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7136, 7143, '[[6, 2], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7137, 7132, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7138, 7137, '[[6, 1], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7139, 7142, '[[6, 1], [6, 1], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7140, 7131, '[[6, 2], [6, 4]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7141, 7136, '[[7, 5], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7142, 7141, '[[6, 2], [7, 5], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7143, 7146, '[[7, 5], [6, 3], [6, 3]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7144, 7135, '[[6, 4], [6, 1]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7145, 7140, '[[6, 0], [6, 1], [6, 0]]');
INSERT INTO matches (tournament_id, match_type, team1_id, team2_id, scores) VALUES (814, 'double', 7146, 7145, '[[6, 4], [6, 4]]');

COMMIT;
