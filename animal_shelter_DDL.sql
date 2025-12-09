SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Animals;
CREATE TABLE `Animals` (
    `animalID` int NOT NULL AUTO_INCREMENT,
    `species` varchar(10),
    `animalName` varchar(20) NOT NULL,
    `age` varchar(10) NOT NULL,
    `gender` varchar(1),
    `breed` varchar(20),
    `pictureURL` varchar(256),
    PRIMARY KEY (`animalID`)
);

DROP TABLE IF EXISTS Vaccines;
CREATE TABLE `Vaccines` (
    `vaccineID` int NOT NULL AUTO_INCREMENT,
    `name` varchar(50) UNIQUE NOT NULL,
    `doses` int,
    `species` varchar(20),
    PRIMARY KEY (`vaccineID`)
);

DROP TABLE IF EXISTS VaccinesAdministered;
CREATE TABLE `VaccinesAdministered` (
    `animalID` int NOT NULL,
    `vaccineName` varchar(50),
    `vaccineID` int,
    `dateGiven` date,
    `dateExpires` date,
    PRIMARY KEY (`animalID`, `vaccineName`),
    FOREIGN KEY (`animalID`) REFERENCES Animals(animalID) ON DELETE CASCADE,
    FOREIGN KEY (`vaccineID`) REFERENCES Vaccines(vaccineID) ON DELETE SET NULL
);

DROP TABLE IF EXISTS Prescriptions;
CREATE TABLE `Prescriptions` (
    `animalID` int NOT NULL,
    `name` varchar(20),
    `frequency` varchar(255),
    PRIMARY KEY (`animalID`, `name`),
    FOREIGN KEY (`animalID`) REFERENCES Animals(`animalID`) ON DELETE CASCADE
);

DROP TABLE IF EXISTS Patrons;
CREATE TABLE `Patrons` (
    `patronID` int NOT NULL AUTO_INCREMENT,
    `firstName` varchar(15),
    `lastName` varchar(15),
    `phoneNumber` varchar(12),
    `address` varchar(50),
    PRIMARY KEY (`patronID`)
);

DROP TABLE IF EXISTS FostersAndAdoptions;
CREATE TABLE `FostersAndAdoptions` (
    `animalID` int NOT NULL,
    `patronID` int,
    `fosteredOrAdopted` varchar(1),
    `date` date,
    PRIMARY KEY (`animalID`),
    FOREIGN KEY (`animalID`) REFERENCES Animals(animalID) ON DELETE CASCADE,
    FOREIGN KEY (`patronID`) REFERENCES Patrons(patronID)
);

DROP TABLE IF EXISTS Adoptable;
CREATE TABLE `Adoptable` (
    `animalID` int NOT NULL,
    `restrictions` text,
    PRIMARY KEY (`animalID`),
    FOREIGN KEY (`animalID`) REFERENCES Animals(animalID) ON DELETE CASCADE
);

-- ==========================================
-- 2. 触发器与存储过程 (Triggers & Procedures)
-- ==========================================

-- 删除可能存在的旧触发器和存储过程，防止报错
DROP TRIGGER IF EXISTS After_Adoption_Insert;
DROP PROCEDURE IF EXISTS GetAnimalVaccineHistory;

DELIMITER //

-- [触发器] 当动物被领养(状态为'A')时，自动从"待领养列表"中删除
CREATE TRIGGER After_Adoption_Insert
AFTER INSERT ON FostersAndAdoptions
FOR EACH ROW
BEGIN
    IF NEW.fosteredOrAdopted = 'A' THEN
        DELETE FROM Adoptable WHERE animalID = NEW.animalID;
    END IF;
END;
//

-- [存储过程] 查询指定动物的疫苗接种历史
CREATE PROCEDURE GetAnimalVaccineHistory(IN target_animal_id INT)
BEGIN
    SELECT 
        A.animalName AS '动物名称', 
        V.vaccineName AS '疫苗名称', 
        V.dateGiven AS '接种日期', 
        V.dateExpires AS '过期日期'
    FROM VaccinesAdministered V
    JOIN Animals A ON V.animalID = A.animalID
    WHERE A.animalID = target_animal_id;
END;
//

DELIMITER ;

-- ==========================================
-- 3. 初始化数据 (中文版)
-- ==========================================

-- 插入动物数据
INSERT INTO Animals (species, animalName, age, gender, breed, pictureURL)
VALUES 
('Canine','旺财', '3岁', 'M', '斗牛梗', 'https://images.unsplash.com/photo-1620001796685-adf7110fe1a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80'),
('Canine','乐乐', '2岁', 'M', '比格犬', 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'),
('Feline','不爽猫', '12岁', 'F', '三花猫', 'https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80'),
('Feline','煤球', '6岁', 'M', '暹罗猫', 'https://images.unsplash.com/photo-1592652426689-4e4f12c4aef5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'),
('Canine', '史酷比', '4岁', 'M', '大丹犬', 'https://images.unsplash.com/photo-1592424701959-07bd1a04dc47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80'),
('Canine', '香蕉', '7个月', 'F', '西施犬', 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cHVwcHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60');

-- 插入疫苗库存数据
INSERT INTO Vaccines (name, doses, species)
VALUES 
('狂犬疫苗', '8', 'D'),
('犬瘟热疫苗', '21', 'D'),
('细小病毒疫苗', '16', 'D'),
('杯状病毒疫苗', '12', 'C'),
('猫瘟疫苗', '34', 'C');

-- 插入疫苗接种记录 (注意：使用子查询确保名称匹配)
INSERT INTO VaccinesAdministered(animalID, vaccineID, vaccineName, dateGiven, dateExpires)
VALUES 
('1', 1, (SELECT name FROM Vaccines WHERE vaccineID = 1), '2022-12-1', '2023-10-12'),
('1', 2, (SELECT name FROM Vaccines WHERE vaccineID = 2), '2022-12-1', '2023-10-12'),
('2', 2, (SELECT name FROM Vaccines WHERE vaccineID = 2), '2022-12-1', '2023-10-12'),
('2', 1, (SELECT name FROM Vaccines WHERE vaccineID = 1), '2022-12-10', '2023-10-12'),
('3', 4, (SELECT name FROM Vaccines WHERE vaccineID = 4), '2022-03-10', '2023-03-12'),
('6', 2, (SELECT name FROM Vaccines WHERE vaccineID = 2), '2022-12-1', '2023-01-12'),
('5', 1, (SELECT name FROM Vaccines WHERE vaccineID = 1), '2022-12-1', '2023-10-12'),
('5', 2, (SELECT name FROM Vaccines WHERE vaccineID = 2), '2021-12-1', '2023-10-12');

-- 插入处方记录
INSERT INTO Prescriptions(animalID, name, frequency)
VALUES 
('1', '乙酰丙嗪', '每8小时一次'),
('1', '伊维菌素', '每月一次'),
('3', '氯胺酮', '每8小时一次，直到2023-07-21'),
('2', '芬苯达唑', '每天一次');

-- 插入爱心人士数据
INSERT INTO Patrons(firstName, lastName, phoneNumber, address)
VALUES 
('小明', '王', '138-747-9876','北京市朝阳区幸福路1号'),
('美丽', '张', '139-646-9797','上海市浦东新区世纪大道88号'),
('建国', '李', '137-669-5543','广州市天河区体育西路'),
('亚瑟', '摩根', '154-768-4996', '西部荒野大镖客营地'),
('小红', '陈', '142-223-3355', '深圳市南山区科技园');

-- 插入寄养与领养记录
INSERT INTO FostersAndAdoptions(animalID, patronID, fosteredOrAdopted, date)
VALUES 
('1', '3', 'F', '2023-7-16'),
('2', '2', 'A', '2022-6-15'),
('4', '3', 'F', '2023-7-16'),
('3', '1', 'F', '2022-6-15');

-- 插入待领养信息
INSERT INTO Adoptable(animalID, restrictions)
VALUES 
('1', "不能吃硬质食物"),
('4', "仅限室内饲养"),
('3', "不能与狗或小孩相处"),
('5', "只吃特定的零食");

SET FOREIGN_KEY_CHECKS = 1;