const utils = require('../utils')
const path = require('path')
const fs = require('fs');

const validExpiry = ["2H", "8H", "24H", "4D", "7D", "never"]

function getCNAMEContent(workingDir){
    const cnameFilePath = path.join(workingDir, 'CNAME')
    if(fs.existsSync(cnameFilePath) && utils.validateCname(cnameFilePath)) {
        return fs.readFileSync(cnameFilePath).toString('UTF-8')
    } else {
        return null;
    }
}

function publish(_, params) {
    const options = params.opts();
    const workingDir = options.source || process.cwd()
    const cname = getCNAMEContent(workingDir)

    if(!fs.existsSync(path.join(workingDir)))
        return utils.printError(`Directory doesn't exist, check the provided path.`)

    if(!fs.existsSync(path.join(workingDir, 'index.html')))
        return utils.printError('Directory must contain index.html file.')
    
    if(options.domain && options.domain.trim() != '') {
        if(cname && cname !== options.domain.trim()){
            return console.log(`[Warning] Project is already configured to use '${cname}' domain. Please modify the CNAME file content in project directory to change domain.`)
        }
    }

    if(!cname) {
        if(options.domain && options.domain.trim() != '') {
            // create cname file
            fs.writeFileSync(path.join(workingDir, 'CNAME'), options.domain.trim())
        } else {
            return utils.printError('CNAME file in project root or domain name must be provided.')
        }
    }
    
    console.log("Actual publish code")
}

module.exports = (program) => {
    program.command("publish")
        .description("Publish current directory files as site on zipy.page")
        .option('-d, --domain <domain>', 'Domain name where the site will be published.')
        .option('-s, --source <source path>', 'Directory path of site source code. Must contain index.html file. (Default: Present directory path)')
        .option('-e, --expiry <expiry>', 'Expiry for the published site. Choices [' + validExpiry.join() + ']', 'never')
        .action(publish)
}