<?php

header("Content-Type: application/json; charset=UTF-8");

$enterprise = intval($_GET['enterprise']);
$seller = intval($_GET['seller']);
$date = $_GET['date'];

$sellers = file_get_contents('http://keu.webhop.org:8991/sellerroute?enterprise=' . $enterprise . '&seller=' . $seller . '&date=' . $date);

echo $sellers;