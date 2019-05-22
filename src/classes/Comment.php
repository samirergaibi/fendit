<?php 


class Comment extends Connect{

    public function createComment($entryID, $content, $createdBy){
        $statement = $this->db->prepare("INSERT INTO comments (entryID, content, createdBy, createdAt) VALUES (:entryID, :content, :createdBy, :createdAt)");
        date_default_timezone_set('europe/stockholm');
        $createdAt = date('Y-m-d H:i');
        $statement->execute([
            ':entryID' => $entryID,
            ':content' => $content,
            ':createdBy' => $createdBy,
            ':createdAt' => $createdAt
        ]);
    }

    public function editComment($content,$commentID){
        $statement = $this->db->prepare("UPDATE comments SET content = :content WHERE commentID = :commentID");
        
        $statement->execute([
            ':content' => $content,
            ':commentID' => $commentID
        ]);

    }
    public function deleteComment($commentID){
        $statement=  $this->db->prepare("DELETE from comments WHERE commentID = :commentID");
        $statement->execute([
            ':commentID' => $commentID
            ]);
    }

}