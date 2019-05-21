<?php


    return function($app){

        $app->get("/entries", function($req, $resp){
            $entry = new Entry($this->db);

            return $resp->withJson($entry->getLatestEntries());
        });

    }

    









?>