<?php

    return function($app){

        $app->post("/register", function($req, $resp){
            $user = new User($this->db);
            $data = $req->getParsedBody();

            return $user->registerUser($data["username"], $data["password"]);
        });

    }











?>