<?php


    return function($app){
        $app->get("/api/logout", function($req, $resp){
            session_unset();
            session_destroy();
            return $resp->withJson(["loggedIn" => false]);
        });
    }







?>