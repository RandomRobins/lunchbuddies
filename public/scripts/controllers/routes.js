'use strict';

var app = app || {};

page('/', app.splashController);
page('/roster/', app.rosterController);

page();
