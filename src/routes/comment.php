<?php

return function($app){

    $app->get("/api/comments/{entryID}", function($req, $resp, $args){
        $comment = new Comment($this->db);
        $entryID = $args["entryID"];
        $data = $comment->getComments($entryID);
        
        if( isset($_SESSION["userID"]) ){
            return $resp->withJson([
                "data" => $comment->getComments($entryID),
                "currentUser" => $_SESSION["userID"]
            ]);
        }else{
            return $resp->withJson([
                "data" => $comment->getComments($entryID),
                "currentUser" => false
            ]);
        };
    });

    $app->post('/api/comment/{entryID}', function($req, $resp, $args){
        $comment = new Comment($this->db);
        $entryID = $args['entryID'];
        $userID = $_SESSION["userID"];
        $data = $req->getParsedBody();
        $comment->createComment($entryID, $data['content'], $userID ); 
        return $resp->withJson([
            "message" => "Comment has been succefully created."
        ]);
    });

    $app->post('/api/edit-comment/{commentID}', function($req, $resp, $args){
        $data = $req->getParsedBody();
        $commentID = $args["commentID"];
        $comment = new Comment($this->db);

        return $resp->withJson($comment->editComment($data["content"], $commentID));
    });

    $app->delete('/api/comment/{commentID}', function($req, $resp, $args){
        $commentID = $args["commentID"];
        $comment = new Comment($this->db);
        $comment->deleteComment($commentID);

        return $resp->withJson([
          "message" =>  'Comment successfully deleted.'
        ]);
    });

}










?>