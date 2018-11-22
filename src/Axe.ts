import * as fs from 'fs'
import * as path from 'path';
import Logger from '@beardedframework/logger'
/*
 * @class Axe
 * */
export default class Axe {

  /*
   * @var { Array } the arguments
   * */
  private args : Array<any> = [];
  
  /*
   * @var { string } the app folder
   * */
  private appDir : string ;
  /*
   * @var { string } the template folder
   * */
  private templatesFolder : string;

  /*
   * class constructor
   *
   */
  constructor(appDir, templateDir){

    this.templatesFolder = templateDir 
    this.appDir = appDir;
  }
  /*
   * show the arguments
   * @return { void }
   * */
  public showArgs() : void {

    for(let key in this.args){
      console.log(key, this.args[key]);
    }
  }

  /*
   * get the arguments passed
   * @return { Array }
   * */
  public getArgs() : Array<any>{

    let args = process.argv.splice(process.execArgv.length + 2);

    this.args = args;
    return args;
  }

  /*
   * dispatch the selected action
   * @return { void }
   * */
  public dispatch() : void {

    let cmd = this.args[0];
    let name = this.args[1];

    if(cmd == '-h' || cmd === '--help'){
      this.usage();
    }

    if(cmd === undefined || cmd === ''){
      Logger.error('An argument needs to be provided');
      this.usage();
      return;
    }

    if(name === undefined || name === ''){
      Logger.error('The file name cannot to be created cannot be null');
      this.usage();
      return;
    }

    switch(cmd){
      case 'make:model':
        this.createModel(name);
        break;
      case 'make:controller':
        this.createController(name);
        break;
    }
  }

  /*
   * how to use this tool
   *
   * @return { void }
   * */
  private usage() : void {
    
    console.log('Usage: In order to create controller run "node make:controller <name of controller>" ');
    console.log('Usage: In order to create mode run "node make:model <name of model>" ');
    process.exit(1);
  }

  /*
   * method to create a controller
   *
   * @param { string } name
   *
   * @return { void } 
   * */
  private createController(name : string) : void {
    let fromm = `${this.templatesFolder}/sourceController.tpl`;
    let to = `${this.appDir}/controllers/${name}.ts`;
    
    if (!fs.existsSync(fromm) || fs.existsSync(to)) {
      Logger.error('there is no file to be copy ir the file already exists');
      return;
    }
    this.copy(fromm, to, name);
  }

  /*
   * method to create a model
   *
   * @param { string } name
   *
   * @return { void } 
   * */
  private createModel(name : string) : void {
    let fromm = `${this.templatesFolder}/sourceModel.tpl`;
    let to = `${this.appDir}/models/${name}.ts`;
    
    if (!fs.existsSync(fromm) || fs.existsSync(to)) {
      Logger.error('there is no file to be copy ir the file already exists');
      return;
    }
    this.copy(fromm, to, name);
  }

  /*
   * copy the template to the actual element
   *
   * @param { string } fromm
   * @param { string } to
   * @param { string } name
   *
   * @return { void } 
   * */
  private copy(fromm : string, to : string, name : string) : void {

    fs.createReadStream(fromm).pipe(fs.createWriteStream(to));

    if(!fs.existsSync(to)){
      Logger.warning('file not copied yet');
    }

    fs.readFile(to, "utf8", function(err, data) {
      
      if(err){
        Logger.error(err);
        process.exit(1);
      }

      let tableName = `${name}s`;
      data = data.replace('{{name}}', name);
      data = data.replace('{{tableName}}', tableName.toLowerCase());
      fs.writeFile(to, data, function(err) {

        if(err){
          Logger.error(err);
          process.exit(1);
        }
        console.log('Element was created \n');
        process.exit(1);
      });
    });
  }
}
