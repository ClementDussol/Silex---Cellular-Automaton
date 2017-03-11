<?php

require_once __DIR__.'/../vendor/autoload.php';

const DB_HOST = 'localhost';
const DB_DATABASE = 'cellular_automaton';

use Silex\Application;
use Silex\Provider\TwigServiceProvider as Twig;
use Silex\Provider\SessionServiceProvider as Session;
use Silex\Provider\ServiceControllerServiceProvider as Controller;

$app = new Application();

$app['debug'] = true;

$app['database.config'] = [
    'dsn'      => 'mysql:host=' . DB_HOST . ';dbname=' . DB_DATABASE,
    'username' => 'root',
    'password' => '',
    'options'  => [
   	    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8", // flux en utf8
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,  // mysql erreurs remontées sous forme d'exception
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ, // tous les fetch en objets
    ]
];

$app['pdo'] = function($app){
	$options = $app['database.config'];
	return new \PDO($options['dsn'],$options['username'], $options['password'], $options['options']);
};

$app->register(new Twig(), [
	'twig.path' => __DIR__.'/../view/'
]);

$app->register(new Session());

$app->register(new Controller());

$app['front.controller'] = function () use ($app) {
	return new \Controller\FrontController($app);
};

$app->get('/', 'front.controller:index');

$app->get('/config', 'front.controller:config');
$app->get('/generate', 'front.controller:generate');

$app->run();