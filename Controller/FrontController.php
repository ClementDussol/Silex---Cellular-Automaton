<?php namespace Controller;

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Model\CellularAutomaton as CellularAutomaton;

class FrontController {
	public function __construct($app) {
		$this->app = $app;
	}

	public function index(){
		return $this->app['twig']->render('front/home.twig');
	}

	public function config(){

		$prepare = $this->app['pdo']->prepare('SELECT * from configs WHERE name=?');
		$prepare->bindValue(1, 'default', \PDO::PARAM_INT);
		$prepare->execute();
		$data = $prepare->fetchAll();
		$config = json_decode($data[0]->content);
		
		echo '<pre>';
		print_r($config);
		echo '</pre>';
		
		return $this->app['twig']->render('front/config.twig', ['config' => $config]);
	}

	public function generate(Request $request){
		
		$config = [
			'width'  => $request->get('width'),
			'height' => $request->get('height'),
			'symmetryx' => $request->get('symmetryx') == "on" ? 1 : 0,
			'symmetryy' => $request->get('symmetryy') == "on" ? 1 : 0,
			'palette' => [
				$request->get('color1'),$request->get('color2'),$request->get('color3')
			]
		];
		echo '<pre>';
		print_r($config);
		echo '</pre>';
		$ca = new CellularAutomaton($config);
		
		$array = $ca->generateRandomArray();
		
		$rule = function($c, $n){
			
			$nc =& $c;
			
			if ($n > 7) {
				$nc =& $c > 0 ? $c-- : 0;
			} else if ($n < 7) {
				$nc =& $c < 2 ? $c++ : 2;
			}

			return $nc;
		};

		$array = $ca->applyRules($array, $rule);
		$array = $ca->applyRules($array, $rule);


		return $this->app['twig']->render('front/generate.twig', [
			'automaton' => $ca,
			'array' => $array
		]);
	}
}