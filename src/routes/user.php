<?php

    return function($app){

        $app->post("/api/register", function($req, $resp){
            $user = new User($this->db);
            $data = $req->getParsedBody();

            $userTaken = $user->getUser($data["username"]);
            if( $userTaken || strlen($data["username"]) < 1 || strlen($data["password"]) < 1 ){
                return $resp->withStatus(409);
            }else{
                $user->registerUser($data["username"], $data["password"]);
            }
        });

        $app->get("/api/users", function($req, $resp){
            $user = new User($this->db);
            return $resp->withJson($user->getAllUsernames());
        });

    }











?>