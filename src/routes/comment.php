<?php

return function($app){

    $app->get("/api/comments/{entryID}", function($req, $resp, $args){
        $comment = new Comment($this->db);
        $entryID = $args["entryID"];
        
        return $resp->withJson($comment->getComments($entryID));
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
        $comment->editComment($data['content'], $commentID);

        return $resp->withJson([
            "message" => 'Edit was successful.'
        ]);
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