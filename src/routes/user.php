<?php

    return function($app){

        $app->post("/register", function($req, $resp){
            $user = new User($this->db);
            $data = $req->getParsedBody();

            $userTaken = $user->checkIfUsernameIsTaken($data["username"]);
            if( $userTaken || strlen($data["username"]) < 1 || strlen($data["password"]) < 1 ){
                return $resp->withStatus(409);
            }else{
                $user->registerUser($data["username"], $data["password"]);
            }
        });

    }











?>