DROP DATABASE IF EXISTS cellular_automaton;

CREATE DATABASE cellular_automaton DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;

use cellular_automaton;

CREATE TABLE configs (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100),
    content TEXT,
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
                        
INSERT INTO configs (name, content)
VALUES
('default', '{ 
	"width" : "64", 
	"height" : "64", 
	"symmetryx" : "1" , 
	"symmetryy" : "1" , 
	"palette" : [ 
		"#000000", 
		"#777777", 
		"#CCCCCC" 
	] 
}');
