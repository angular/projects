var hookshot = require('hookshot');
hookshot('refs/heads/dist', 'git fetch origin master && git checkout origin/master -f && ./scripts/continuous-deployment.sh').listen(3000);
