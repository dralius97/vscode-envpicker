import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
export function activate(context: vscode.ExtensionContext) {
	const usersFolder = vscode.workspace.workspaceFolders;
	if(!usersFolder) {
		vscode.window.showErrorMessage('Please open the folder or workspace before init');
		return;
	}
	const userBasePath = usersFolder[0].uri.fsPath;
	const libsPath = path.join(userBasePath, '.env-libs');
	
	const activeEnv = context.workspaceState.get<string>('activeEnv');

	const statusBar = vscode.window.createStatusBarItem(
	    vscode.StatusBarAlignment.Left,
	    100
	);
	statusBar.text = '$(server) env: none';
	statusBar.command = 'envpicker.pickenv';
	statusBar.show();
    if (activeEnv) {
		const activeEnvPath = path.join(libsPath, `.env.${activeEnv}`);
		if(!fs.existsSync(activeEnvPath)){
		    vscode.window.showWarningMessage(`Environment file ".env.${activeEnv}" is missing from .env-libs.`);
		}

		if (activeEnv === 'production') {
			statusBar.text = `$(warning)$(gear~spin) ENV: ${activeEnv}`;
		}else{
			statusBar.text = `$(gear~spin) ENV: ${activeEnv}`;;
		}
    }
	context.subscriptions.push(statusBar);

	const init = vscode.commands.registerCommand('envpicker.envinit', async () => {
		const templateFile = ['production', 'development', 'staging'];
		const gitIgnorePath = path.join(userBasePath, '.gitignore');
		const isLibsExist = fs.existsSync(libsPath);
		if(!isLibsExist){
			fs.mkdirSync(libsPath);
		}
		const existingFile = fs.readdirSync(libsPath);
		templateFile.map((v)=>{;
			const templateFilePath = path.join(libsPath, `.env.${v}`);
			if(!existingFile.includes(`.env.${v}`)){
				fs.writeFileSync(templateFilePath, `TYPE_ENV=${v.toUpperCase()}`);
			}
		});
		const isGitIgnoreExist = fs.existsSync(gitIgnorePath);
		if(!isGitIgnoreExist){
            const newGitIgnoreFile = [`.env-libs`, '.env', '.gitignore'];
			fs.writeFileSync(gitIgnorePath, newGitIgnoreFile.join('\n'));
		}else{
	        const gitIgnoreFile = fs.readFileSync(gitIgnorePath,'utf-8');
	        const ignoredList = gitIgnoreFile.split('\n');

			const regexEnvLibs = /^\.env\-libs\r?$/m;
			const regexEnv = /^\.env\r?$/m;

	        if(!ignoredList.some(v=>regexEnvLibs.test(v))){
	            ignoredList.push('.env-libs');
	        }
            if(!ignoredList.some(v=>regexEnv.test(v))) {
                ignoredList.push('.env');
            }
            const editedFile = ignoredList.join('\n');
            fs.writeFileSync(gitIgnorePath, editedFile);
	    }


		vscode.window.showInformationMessage('EPicker: Initialized successfully!');
	});

	context.subscriptions.push(init);

	const pickenv = vscode.commands.registerCommand('envpicker.pickenv', async () => {
        if (!fs.existsSync(libsPath)) {
            vscode.window.showErrorMessage('Run EPicker: Init first');
            return;
        }
		const envFileList = fs.readdirSync(libsPath);
        const envSelection:string[] = [];
        const envDict: Record<string, string> = {};

        for(const file of envFileList){
			const match = file.match(/^\.env\.(.+)$/);
            if(match && match[1]){
				const key = match[1];
                envSelection.push(key);
                envDict[key] = file;
            }
        }

		if(envSelection.length === 0) {
		    vscode.window.showErrorMessage('No environment files found in .env-libs');
		    return;
		}

		const selected = await vscode.window.showQuickPick(
	        envSelection,
	        { placeHolder: 'Select environment' }
	    );

        
		if(selected){
			try {
				fs.copyFileSync(path.join(libsPath, envDict[selected]),path.join(userBasePath,'.env'));
				context.workspaceState.update('activeEnv', selected);
			}catch(e){
				vscode.window.showErrorMessage(`Failed to activate environment: ${e}`);
    			return;
			}
            
			if (selected === 'production') {
				statusBar.text = `$(warning)$(gear~spin) ENV: ${selected}`;
			}else{
				statusBar.text = `$(gear~spin) ENV: ${selected}`;;
			}
		}
	});
	context.subscriptions.push(pickenv);
}

// This method is called when your extension is deactivated
export function deactivate() {}
