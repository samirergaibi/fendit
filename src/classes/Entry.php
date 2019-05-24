<?php



    class Entry extends Connect{
        public function getLatestEntries(){
            $statement = $this->db->prepare("SELECT * FROM entries INNER JOIN users ON entries.createdBy = users.userID ORDER BY createdAt DESC LIMIT 20");
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
            $statement = $this->db->prepare("SELECT entries.entryID, entries.title, entries.content as entryContent, users.username as entryCreatedBy,entries.createdAt as entryCreatedAt, comments.commentID, comments.content as commentContent, comments.createdBy as commentCreatedBy, comments.createdAt as commentCreatedAt FROM entries INNER JOIN comments ON entries.entryID = comments.entryID INNER JOIN users ON entries.createdBy = users.userID WHERE entries.entryID = :entryID");
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
        }
    }








?>