const chalk = require('chalk');
const fs = require('fs');
const path = require('path')

const zipyConfig = path.join((process.env.appData || process.env.HOME), '.zipyconfig')
const version = '0.1.0'

module.exports = {

    validateCname(filePath){
        const data = fs.readFileSync(filePath)
        return data.toString('UTF-8') != ''
    },

    printError(message) {
        const errTag = chalk.red('[Error]')
        console.log(`${errTag} ${message}`)
    },

    getVersion(){
        return version
    },

    getConfig(){
        let data = { version}
        if(fs.existsSync(zipyConfig)){
            data = fs.readFileSync(zipyConfig).toString('UTF-8')
        } else {
            this.saveConfig(data)
        }
        return JSON.parse(data)
    },

    saveConfig(data){
        fs.writeFileSync(zipyConfig, JSON.stringify(data))
    }

}