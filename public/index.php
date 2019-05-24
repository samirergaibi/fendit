<?php
  // Load everything needed
  require __DIR__ . '/../vendor/autoload.php';

  // Start a session here
  session_start();

  // Get settings and instantiate the app
  $settings = require __DIR__ . '/../src/settings.php';
  $app = new \Slim\App($settings);

  // Register our dependencies through our container
  $dependencies = require __DIR__ . '/../src/container.php';
  $dependencies($app);
  
  $view = require __DIR__ . '/../src/routes/view.php';
  $view($app);

  $entries = require __DIR__ . "/../src/routes/entries.php";
  $entries($app);

  $user = require __DIR__ . "/../src/routes/user.php";
  $user($app);

  $login = require __DIR__ . "/../src/routes/login.php";
  $login($app);

  $logout = require __DIR__ . "/../src/routes/logout.php";
  $logout($app);

  $comment = require __DIR__ . "/../src/routes/comment.php";
  $comment($app);

  

  // Run app
  $app->run();

?>