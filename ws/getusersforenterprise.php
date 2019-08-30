<?php

header("Content-Type: application/json; charset=UTF-8");

$enterprise = intval($_GET['enterprise']);

$sellers = file_get_contents('http://keu.webhop.org:8991/getusersforenterprise?enterprise=' . $enterprise . '&tracking=1');

echo $sellers;