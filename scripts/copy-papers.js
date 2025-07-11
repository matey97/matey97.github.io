'use strict';
const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');

function copyPapers() {
    const sourcePath = upath.resolve(upath.dirname(__filename), '../src/papers.json');
    const destPath = upath.resolve(upath.dirname(__filename), '../dist/.');

    sh.cp('-R', sourcePath, destPath)
};

copyPapers();
