-- Create the User table first since it is referenced by many other tables
CREATE TABLE User (
    userId INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'mess_rep', 'mess_supervisor', 'faculty', 'admin') NOT NULL,
    PRIMARY KEY (userId)
);

-- Create the Admin table
CREATE TABLE Admin (
    adminId INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (adminId),
    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- Create the Faculty table
CREATE TABLE Faculty (
    facultyId INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (facultyId),
    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- Create the MessSupervisor table
CREATE TABLE MessSupervisor (
    messSupervisorId INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (messSupervisorId),
    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- Create the Mess table
CREATE TABLE Mess (
    messNo INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    supervisorId INT NOT NULL,
    PRIMARY KEY (messNo),
    FOREIGN KEY (supervisorId) REFERENCES MessSupervisor(messSupervisorId)
);

-- Create the MessRepresentative table
CREATE TABLE MessRepresentative (
    mrId INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    messNo INT NOT NULL,
    PRIMARY KEY (mrId),
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (messNo) REFERENCES Mess(messNo)
);

-- Create the Mess_MessRepresentative table
CREATE TABLE Mess_MessRepresentative (
    messNo INT NOT NULL,
    mrId INT NOT NULL,
    PRIMARY KEY (messNo, mrId),
    FOREIGN KEY (messNo) REFERENCES Mess(messNo),
    FOREIGN KEY (mrId) REFERENCES MessRepresentative(mrId)
);

-- Create the Student table
CREATE TABLE Student (
    studentId INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (studentId),
    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- Create the Feedback table
CREATE TABLE Feedback (
    FeedbackID INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    messNo INT NOT NULL,
    TimelinessOfService INT,
    CleanlinessOfDiningHall INT,
    FoodQuality INT,
    QuantityOfFood INT,
    CourtesyOfStaff INT,
    StaffHygiene INT,
    MenuAdherence INT,
    WashAreaCleanliness INT,
    Comments TEXT,
    FeedbackDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FeedbackDuration VARCHAR(50),
    PRIMARY KEY (FeedbackID),
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (messNo) REFERENCES Mess(messNo)
);

-- Create the Inspection table
CREATE TABLE Inspection (
    InspectionID INT NOT NULL AUTO_INCREMENT,
    messNo INT NOT NULL,
    mrId INT NOT NULL,
    InspectionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    QualityAndExpiry INT,
    StandardsOfMaterials INT,
    StaffAndFoodAdequacy INT,
    MenuDiscrepancies INT,
    SupervisorUpdates INT,
    FoodTasteAndQuality INT,
    KitchenHygiene INT,
    UtensilCleanliness INT,
    ServiceTimingsAdherence INT,
    Comments TEXT,
    PRIMARY KEY (InspectionID),
    FOREIGN KEY (messNo) REFERENCES Mess(messNo),
    FOREIGN KEY (mrId) REFERENCES MessRepresentative(mrId)
);

-- Create the Issues table
CREATE TABLE Issues (
    issueId INT NOT NULL AUTO_INCREMENT,
    description TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    image LONGBLOB,
    status ENUM('pending', 'in_progress', 'resolved') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    userId INT,
    count INT DEFAULT 1,
    PRIMARY KEY (issueId),
    FOREIGN KEY (userId) REFERENCES User(userId)
);

-- Insert data into the User table for admins
INSERT INTO User (email, password, role) VALUES
('admin1@gmail.com', 'password', 'admin'),
('admin2@gmail.com', 'password', 'admin');

-- Insert data into the Admin table
-- Note: The userId values must match the IDs generated in the User table.
INSERT INTO Admin (userId, email, name) VALUES
(1, 'admin1@gmail.com', 'admin'),
(2, 'admin2@gmail.com', 'admin');


