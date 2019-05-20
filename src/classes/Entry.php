<?php



    class Entry extends Connect{
        public function getLatestEntries(){
            $statement = $this->db->prepare("SELECT * FROM entries ORDER BY createdAt DESC LIMIT 20");
            $statement->execute();

            return $statement->fetchAll(PDO::FETCH_ASSOC);
        }
    }






?>