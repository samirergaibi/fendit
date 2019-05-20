<?php


    return function($app){

        $app->get("/get-latest-entries", function($req, $resp){
            $entry = new Entry($this->db);

            return $resp->withJson($entry->getLatestEntries());
        });

    }

    









?>