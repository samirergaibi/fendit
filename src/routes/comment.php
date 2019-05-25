<?php

return function($app){

    $app->get("/api/comments/{entryID}", function($req, $resp, $args){
        $comment = new Comment($this->db);
        $entryID = $args["entryID"];
        
        return $resp->withJson($comment->getComments($entryID));
    });

    $app->post('/api/comment/{entryID}', function($req, $res, $args){
        $comment = new Comment($this->db);
        $entryID = $args['entryID'];
        $userID = $_SESSION["userID"];
        $data = $req->getParsedBody();
        $comment->createComment($entryID, $data['content'], $userID ); 
        return $res->withJson([
            "message" => "Comment has been succefully created."
        ]);
    });

    $app->post('/api/edit-comment/{commentID}', function($req, $res, $args){
        $data = $req->getParsedBody();
        $commentID = $args["commentID"];
        $comment = new Comment($this->db);
        $comment->editComment($data['content'], $commentID);

        return $res->withJson([
            "message" => 'Edit was successful.'
        ]);
    });

    $app->delete('/api/comment', function($req, $res){
        $comment = new Comment($this->db);
        $comment->deleteComment($commentID);

        return $res->withJson([
          $message =>  'Comment successfully deleted'
        ]);
    });

}










?>