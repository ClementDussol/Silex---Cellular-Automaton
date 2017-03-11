<?php namespace Model;

class CellularAutomaton {
	
	public function __construct($config){
		$this->config = $config;
	}

	public function getWidth()  { return $this->config['width'];  }
	public function getHeight() { return $this->config['height']; }
	
	public function getSymmetry($axis = false) { 
		return gettype($axis) == 'string' ? $this->config['symmetry'.$axis] : [
			'x' => $this->config['symmetryx'],
			'y' => $this->config['symmetryy'],
		];
	}
	public function getPalette($index = false) {
		return gettype($index) == 'integer' ? $this->config['palette'][$index] : $this->config['palette'];
	}

	public function generateRandomArray(){

		$array = [];
		
		$w = $this->getWidth();
		$h = $this->getHeight();

		$sx = $this->getSymmetry('x');
		$sy = $this->getSymmetry('y');

		for ($y=0; $y < $h / (1+$sy) ; $y++) {
			for ($x=0; $x < $w / (1+$sx) ; $x++) {

				$rand = mt_rand(0, 2); 
				$array[$y][$x] = $rand;
				if ($sx && !$sy) $array[$y][$this->getWidth()-1-$x] = $rand;
				if (!$sy && $sy) $array[$this->getHeight()-1-$y][$x] = $rand;
				if ($sx && $sy) {
					$array[$y][$this->getWidth()-1-$x] = $rand;
					$array[$this->getHeight()-1-$y][$x] = $rand;
					$array[$this->getHeight()-1-$y][$this->getWidth()-1-$x] = $rand;
				}
			}
		}

		return $array;
	}

	public function applyRules($array, $rule = null){

		$newArray = [];

		$w = $this->getWidth();
		$h = $this->getHeight();

		for ($y=0; $y < $h; $y++) {
			for ($x=0; $x < $w; $x++) {
				
				$c =& $array[$y][$x];
				$n = $this->checkNeighbourhood($array, $x, $y);
				$nc = $rule($c, $n);
				$newArray[$y][$x] = $nc;
			}
		}

		return $newArray;
	}

	public function checkNeighbourhood($array, $x, $y){

		$r = 0;

		for ($ny = $y-1; $ny <= $y+1; $ny++){
			for ($nx = $x-1; $nx <= $x+1; $nx++){
				
				if ($ny < 0 || $ny >= $this->getHeight() || $nx < 0 || $nx >= $this->getWidth()) {
					$r += 1;
					continue;
				}

				$val = $array[$ny][$nx];
				$r += $val;
			}
		}

		return $r;
	}
}