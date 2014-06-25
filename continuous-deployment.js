var hookshot = require('hookshot');
hookshot('refs/heads/master', './scripts/continuous-deplyment.sh').listen(3000);
