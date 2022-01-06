const { join } = require('path')

module.exports = {
    apps: [
        {
            name: 'Front Cafepay En',
            script          : "./node_modules/nuxt-start/bin/nuxt-start.js",
            exec_mode       : "cluster",
            watch           : false,
            instances       : "4",
            merge_logs      : true,
            log_type        : "raw",
                cwd: "./",
                args: `-c ${join(__dirname, 'nuxt.config.js')}`
        }
    ]
}
