var hookshot = require('hookshot');
hookshot('refs/heads/dist', './scripts/continuous-deployment.sh').listen(3000);
