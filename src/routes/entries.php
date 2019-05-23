<?php


    return function($app){

        $app->get("/api/entries", function($req, $resp){
            $entry = new Entry($this->db);
            return $resp->withJson($entry->getLatestEntries());
        });

        $app->get("/api/entries/{userID}",function($req,$resp,$args){
            $entry = new Entry($this->db);
            $userID = $args['userID'];
            return $resp->withJson($entry->getUserEntries($userID));
        });
        $app->get("/api/fullentry/{entryID}", function($req, $resp, $args){
            $entryID = $args['entryID'];
            $entry = new Entry($this->db);
            return $resp->withJson($entry->fullEntry($entryID));
        });

        $app->post("/api/entry/{userID}", function($req,$resp,$args){
            $entry = new Entry($this->db);
            $userID = $args['userID'];
            $data = $req->getParsedBody();
            $entry->createEntry($data['title'],$data['content'],$userID);
         });
         
         $app->delete("/api/entry/{entryID}",function($req,$resp,$args){
            $entry = new Entry($this->db);
            $entryID = $args['entryID'];
            $entry->deleteEntry($entryID);
         });

         $app->put("/api/entry/{entryID}",function($req,$resp,$args){
           $entry = new Entry($this->db);
           $entryID = $args['entryID'];
           $data = $req->getParsedBody();
           $entry->updateEntry($data['title'],$data['content'],$entryID);
          
         });

    }



    









?>