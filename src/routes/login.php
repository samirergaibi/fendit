<?php

return function ($app) {
  // Register auth middleware
  $auth = require __DIR__ . '/../middlewares/auth.php';

  // Add a login route
  $app->post('/login', function ($request, $response) {
    $data = $request->getParsedBody();
    if ($data['username'] && $data['password']) {
        $user = new User($this->db);
        $userFromDb = $user->getUser($data["username"]);
        if( $userFromDb ){
            if( password_verify($data["password"], $userFromDb["password"]) ){
                $_SESSION['loggedIn'] = true;
                $_SESSION['username'] = $userFromDb['username'];
                return $response->withJson($userFromDb);
            }else{
                return $response->withJson([
                    "message" => "Wrong password."
                ]);
            }
        }else{
            return $response->withJson([
                "message" => "user does not exist."
            ]);
        }
    }else {
      return $response->withJson([
          "message" => "You must fill out both fields stupid.."
      ]);
    }
  });

  // Add a ping route
  $app->get('/api/ping', function ($request, $response, $args) {
    return $response->withJson(['loggedIn' => true]);
  })->add($auth);
};



?>