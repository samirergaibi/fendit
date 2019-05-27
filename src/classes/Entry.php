<?php



    class Entry extends Connect{
        public function getLatestEntries(){
            $statement = $this->db->prepare("SELECT * FROM entries INNER JOIN users ON entries.createdBy = users.userID ORDER BY createdAt DESC LIMIT 20");
            $statement->execute();

            return $statement->fetchAll(PDO::FETCH_ASSOC);
        }
        public function allEntries(){
            $statement = $this->db->prepare("SELECT * FROM entries INNER JOIN users ON entries.createdBy = users.userID ORDER BY createdAt DESC LIMIT 100 OFFSET 20");
            $statement->execute();

            return $statement->fetchAll(PDO::FETCH_ASSOC);
        }

        public function getUserEntries($userID){
            $statement = $this->db->prepare("SELECT * FROM entries INNER JOIN users ON entries.createdBy = users.userID WHERE createdBy = :userID ORDER BY createdAt DESC");
            $statement->execute([
                ":userID" => $userID
            ]);
            return $statement->fetchAll(PDO::FETCH_ASSOC);
        }

        public function fullEntry($entryID){
            $statement = $this->db->prepare("SELECT * FROM entries INNER JOIN users ON entries.createdBy = users.userID WHERE entryID = :entryID");
            $statement->execute([
                ':entryID' => $entryID
            ]);
            return $statement->fetch(PDO::FETCH_ASSOC);
        }
        
        public function createEntry($title, $content, $userID){
            $statement = $this->db->prepare("INSERT INTO entries(title, content, createdBy, createdAt) VALUES (:title, :content, :createdBy, NOW())");
            $statement->execute([
                ":title" => $title ,
                ":content" => $content,
                ":createdBy" => $userID
            ]);
        }

        public function deleteEntry($entryID){
            $statement = $this->db->prepare("DELETE FROM entries WHERE entryID = :entryID");
            $statement->execute([
                ":entryID" => $entryID
            ]);
        }

        public function updateEntry($title, $content, $entryID){
            $statement = $this->db->prepare("UPDATE entries SET title = :title, content = :content WHERE entryID = :entryID");
            $statement->execute([
                ":title" => $title,
                ":content" => $content,
                ":entryID" => $entryID
            ]);

            $getNewEntry = $this->db->prepare("SELECT * FROM entries WHERE entryID = :entryID");
            $getNewEntry->execute([
                ":entryID" => $entryID
            ]);
            return $getNewEntry->fetch(PDO::FETCH_ASSOC);
        }

        public function registerLike($entryID){
            $statement = $this->db->prepare("UPDATE entries SET likes = COALESCE(likes, 0) + 1 WHERE entryID = :entryID");
            $statement->execute([
                ":entryID" => $entryID
            ]);

            $getLikes = $this->db->prepare("SELECT likes FROM entries WHERE entryID = :entryID");
            $getLikes->execute([
                ":entryID" => $entryID
            ]);
            return $getLikes->fetch(PDO::FETCH_ASSOC);
        }

        public function search($searchQuery){
            $searchQuery = '%' . $searchQuery . '%';
            $statement = $this->db->prepare("SELECT DISTINCT * FROM entries INNER JOIN users ON entries.createdBy = users.userID WHERE entries.content LIKE :searchQuery OR entries.title LIKE :searchQuery");
            $statement->bindparam(':searchQuery', $searchQuery, PDO::PARAM_STR);
            $statement->execute();
            return $statement->fetchAll(PDO::FETCH_ASSOC);

        }
        public function trending(){
            $statement= $this->db->prepare("SELECT * FROM entries INNER JOIN users ON entries.createdBy = users.userID where likes > 0 ORDER BY likes DESC");
            $statement->execute();
            return $statement->fetchAll(PDO::FETCH_ASSOC);
        }
    }








?>