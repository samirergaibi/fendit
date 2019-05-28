<?php


    return function($app){

        $app->get("/api/entries", function($req, $resp){
            $entry = new Entry($this->db);
            
            return $resp->withJson($entry->getLatestEntries());
        });
        $app->get("/api/allentries", function($req, $resp){
            $entry = new Entry($this->db);
            
            return $resp->withJson($entry->allEntries());
        });

        $app->get("/api/user-entries",function($req, $resp, $args){
            $entry = new Entry($this->db);
            $userID = $_SESSION["userID"];

            return $resp->withJson($entry->getUserEntries($userID));
        });

        $app->get("/api/fullentry/{entryID}", function($req, $resp, $args){
            $entryID = $args['entryID'];
            $entry = new Entry($this->db);

            return $resp->withJson($entry->fullEntry($entryID));
        });

        $app->post("/api/entry", function($req, $resp){
            $entry = new Entry($this->db);
            $userID = $_SESSION["userID"];
            $data = $req->getParsedBody();
            $entry->createEntry($data['title'], $data['content'], $userID);

            return $resp->withJson([
                "message" => "Entry has been succefully created."
            ]);
         });
         
         $app->delete("/api/entry/{entryID}",function($req, $resp, $args){
            $entry = new Entry($this->db);
            $entryID = $args['entryID'];
            $entry->deleteEntry($entryID);

            return $resp->withJSON([
                "message" => "Entry successfully deleted."
            ]);
         });

         $app->post("/api/edit-entry/{entryID}",function($req, $resp, $args){
           $entry = new Entry($this->db);
           $entryID = $args['entryID'];
           $data = $req->getParsedBody();
        //    $entry->updateEntry($data['title'], $data['content'], $entryID);
           
           return $resp->withJson($entry->updateEntry($data["title"], $data["content"], $entryID));
         });

         $app->get("/api/like/{entryID}", function($req, $resp, $args){
            $entry =  new Entry($this->db);
            $entryID = $args["entryID"];

            return $resp->withJson($entry->registerLike($entryID));
         });

         $app->get('/api/search/{searchQuery}', function($req, $resp, $args){
            $entry = new Entry($this->db);
            $searchQuery = $args['searchQuery'];
            if( isset($_SESSION["loggedIn"]) ){
                return $resp->withJson([
                    "data" => $entry->search($searchQuery),
                    "loggedIn" => $_SESSION["loggedIn"]
                ]);
            }else{
                return $resp->withJson([
                    "data" => $entry->search($searchQuery),
                    "loggedIn" => false
                ]);
            }
         });
         
         $app->get('/api/trending', function($req, $resp){
             $entry = new Entry($this->db);
             return $resp->withJson($entry->trending());
         });

    }



    









?>