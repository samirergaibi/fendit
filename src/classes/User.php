<?php


    class User extends Connect{
        public function registerUser($username, $password){
            $statement = $this->db->prepare("INSERT INTO users(username, password) VALUES(:username, :password)");
            $statement->execute([
                ":username" => $username,
                ":password" => password_hash($password, PASSWORD_BCRYPT)
            ]);
        }
        public function checkIfUsernameIsTaken($username){
            $statement = $this->db->prepare("SELECT * FROM users WHERE username = :username");
            $statement->execute([
                ":username" => $username
            ]);
            return $statement->fetch(PDO::FETCH_ASSOC);
        }
    }







?>