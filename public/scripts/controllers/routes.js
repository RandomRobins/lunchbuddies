'use strict';

var app = app || {};

// page('/', app.splashController);
page('/', app.rosterController);
page('/roster', app.rosterController);
page('/about', app.aboutController);
page('/matches', app.matchesController);

page();
