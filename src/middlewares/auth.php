<?php


// AUTHENTICATE USER

return function ($request, $response, $next) {
  if( isset($_SESSION['loggedIn']) ){
    if($_SESSION['loggedIn'] == true) {
      return $next($request, $response);
    }
  }
  
  return $response->withStatus(401);
};



?>
