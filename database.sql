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
    batch VARCHAR(10) ,
    messNo INT,
    PRIMARY KEY (studentId),
    FOREIGN KEY (messNo) REFERENCES Mess(messNo) ON DELETE SET NULL,
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
    messNo INT ,
    PRIMARY KEY (issueId),
    FOREIGN KEY (userId) REFERENCES User(userId),
    FOREIGN KEY (messNo) REFERENCES Mess(messNo) ON DELETE CASCADE
);

-- Create the Upvote table
CREATE TABLE Upvote (
    issueId INT NOT NULL,
    userId INT NOT NULL,
    PRIMARY KEY (issueId, userId),
    FOREIGN KEY (issueId) REFERENCES Issues(issueId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
);

-- Insert data into User table for remaining roles
INSERT INTO User (email, password, role) VALUES
('supervisor1@university.com', 'password123', 'mess_supervisor'),
('supervisor2@university.com', 'password123', 'mess_supervisor'),
('supervisor3@university.com', 'password123', 'mess_supervisor'),
('supervisor4@university.com', 'password123', 'mess_supervisor'),
('supervisor5@university.com', 'password123', 'mess_supervisor'),
('supervisor6@university.com', 'password123', 'mess_supervisor'),
('supervisor7@university.com', 'password123', 'mess_supervisor'),
('supervisor8@university.com', 'password123', 'mess_supervisor'),
('faculty1@university.com', 'password123', 'faculty'),
('faculty2@university.com', 'password123', 'faculty'),
('faculty3@university.com', 'password123', 'faculty'),
('admin1@gmail.com', 'password', 'admin'),
('admin2@gmail.com', 'password', 'admin'),
('r20cs001@rguktrkv.ac.in', 'password', 'student'),
('r21me002@rguktrkv.ac.in', 'password', 'student'),
('r22ec003@rguktrkv.ac.in', 'password', 'student'),
('r23cs004@rguktrkv.ac.in', 'password', 'student'),
('r20ee005@rguktrkv.ac.in', 'password', 'student'),
('r20cs006@rguktrkv.ac.in', 'password', 'mess_rep'),
('r21me007@rguktrkv.ac.in', 'password', 'mess_rep'),
('r22ec008@rguktrkv.ac.in', 'password', 'mess_rep'),
('r23cs009@rguktrkv.ac.in', 'password', 'mess_rep'),
('r20ee010@rguktrkv.ac.in', 'password', 'mess_rep');

-- Insert data into the Admin table
-- Note: The userId values must match the IDs generated in the User table.
INSERT INTO Admin (userId, email, name) VALUES
(12, 'admin1@gmail.com', 'admin'),
(13, 'admin2@gmail.com', 'admin');

-- Insert data into MessSupervisor table
INSERT INTO MessSupervisor (userId, email, name) VALUES
(1, 'supervisor1@university.com', 'Supervisor One'),
(2, 'supervisor2@university.com', 'Supervisor Two'),
(3, 'supervisor3@university.com', 'Supervisor Three'),
(4, 'supervisor4@university.com', 'Supervisor Four'),
(5, 'supervisor5@university.com', 'Supervisor Five'),
(6, 'supervisor6@university.com', 'Supervisor Six'),
(7, 'supervisor7@university.com', 'Supervisor Seven'),
(8, 'supervisor8@university.com', 'Supervisor Eight');

-- Insert data into Mess table
INSERT INTO Mess (name, capacity, location, supervisorId) VALUES
('Ganga', 500, 'North Wing', 3),
('Yamuna', 450, 'South Wing', 5),
('Godavari', 400, 'East Wing', 6),
('Krishna', 600, 'West Wing', 7),
('Kaveri', 550, 'Central Block', 8),
('Brahmaputra', 500, 'Hostel 1', 4),
('Narmada', 400, 'Hostel 2', 1),
('Tapti', 350, 'Hostel 3', 2);

-- Insert data into Faculty table
INSERT INTO Faculty (userId, email, name) VALUES
(9, 'faculty1@university.com', 'Faculty One'),
(10, 'faculty2@university.com', 'Faculty Two'),
(11, 'faculty3@university.com', 'Faculty Three');

-- Insert data into Student table
INSERT INTO Student (userId, email, name, batch, messNo) VALUES
(14, 'r20cs001@rguktrkv.ac.in', 'Student One', 'r20', 1),
(15, 'r21me002@rguktrkv.ac.in', 'Student Two', 'r21', 2),
(16, 'r22ec003@rguktrkv.ac.in', 'Student Three', 'r22', 3),
(17, 'r23cs004@rguktrkv.ac.in', 'Student Four', 'r23', 4),
(18, 'r20ee005@rguktrkv.ac.in', 'Student Five', 'r20', 5);

-- Insert data into MessRepresentative table
INSERT INTO MessRepresentative (userId, email, name, messNo) VALUES
(19, 'r20cs006@rguktrkv.ac.in', 'MessRep One', 1),
(20, 'r21me007@rguktrkv.ac.in', 'MessRep Two', 2),
(21, 'r22ec008@rguktrkv.ac.in', 'MessRep Three', 3),
(22, 'r23cs009@rguktrkv.ac.in', 'MessRep Four', 4),
(23, 'r20ee010@rguktrkv.ac.in', 'MessRep Five', 5);

-- Insert data into Mess_MessRepresentative table
INSERT INTO Mess_MessRepresentative (messNo, mrId) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Insert data into Feedback table
INSERT INTO Feedback (userId, messNo, TimelinessOfService, CleanlinessOfDiningHall, FoodQuality, 
QuantityOfFood, CourtesyOfStaff, StaffHygiene, MenuAdherence, WashAreaCleanliness, Comments, FeedbackDuration) VALUES
(15, 1, 4, 5, 3, 4, 5, 4, 3, 4, 'Good service overall', 'Week 1'),
(16, 2, 5, 4, 4, 5, 4, 5, 4, 4, 'Satisfied with the cleanliness', 'Week 1'),
(17, 3, 3, 3, 2, 4, 3, 3, 3, 3, 'Needs improvement', 'Week 1'),
(18, 4, 4, 4, 4, 4, 4, 4, 4, 4, 'Good experience', 'Week 1'),
(14, 5, 3, 4, 4, 3, 4, 4, 3, 4, 'Can be better', 'Week 1');

-- Insert data into Inspection table
INSERT INTO Inspection (messNo, mrId, QualityAndExpiry, StandardsOfMaterials, StaffAndFoodAdequacy, 
MenuDiscrepancies, SupervisorUpdates, FoodTasteAndQuality, KitchenHygiene, UtensilCleanliness, ServiceTimingsAdherence, Comments) VALUES
(1, 1, 4, 4, 5, 3, 4, 5, 4, 4, 4, 'Inspection completed successfully'),
(2, 2, 3, 4, 4, 4, 3, 4, 3, 4, 3, 'Minor issues noted'),
(3, 3, 4, 5, 4, 4, 4, 5, 4, 5, 5, 'Satisfactory'),
(4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 'Average inspection'),
(5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 'Good overall');

-- Insert data into Issues table
INSERT INTO Issues (description, category, status, userId, messNo) VALUES
('Food quality is poor', 'Food', 'pending', 14, 1),
('Cleanliness of dining area', 'Cleanliness', 'in_progress', 15, 2),
('Late service timings', 'Service', 'resolved', 16, 3),
('Staff not courteous', 'Staff', 'pending', 17, 4),
('Low food quantity', 'Quantity', 'in_progress', 18, 5);

-- Insert data into Upvote table
INSERT INTO Upvote (issueId, userId) VALUES
(1, 14),
(1, 15),
(2, 16),
(2, 17),
(3, 18);