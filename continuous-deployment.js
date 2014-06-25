var hookshot = require('hookshot');
hookshot('refs/heads/dist', 'git fetch origin dist && git checkout origin/dist -f').listen(3000);
