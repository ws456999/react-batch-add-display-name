const fs = require('fs');
const path = require('path');
const trans = require('./loader/index2');

const readDir = (entry)=>{
  const dirInfo = fs.readdirSync(entry);
  dirInfo.forEach(item => {
      const location = path.join(entry,item)
      const info = fs.statSync(location)
      if(info.isDirectory()){
          // console.log(`dir: ${location}`)
          readDir(location)
      }else{
        var data = fs.readFileSync(location, 'utf8');
        if (location.indexOf('.ts') > -1 || location.indexOf('.tsx') > -1) {
          try {
            trans(data, {
              resourcePath: location,
              fileName: item
            })
            // exec(`./node_modules/.bin/organize-imports-cli ${location}`)

          } catch (error) {
            console.log(error, 'error', location)
          }
        }
      }
  })
}

readDir('./demo/src');
