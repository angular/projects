var hookshot = require('hookshot');
hookshot('refs/heads/master', 'git pull --rebase').listen(3000);
