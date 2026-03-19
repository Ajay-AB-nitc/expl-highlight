// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "expl-highlight" is now active!');

	// Load system calls from syscalls.json
	let syscalls: any[] = [];
	const syscallsPath = path.join(context.extensionPath, 'syscalls.json');
	try {
		const syscallsContent = fs.readFileSync(syscallsPath, 'utf8');
		syscalls = JSON.parse(syscallsContent);
	} catch (err) {
		console.error('Failed to load syscalls.json', err);
	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('expl-highlight.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Expl-Highlight!');
	});

	const completionProvider = vscode.languages.registerCompletionItemProvider('expl', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			const completionItems: vscode.CompletionItem[] = [];
			const linePrefix = document.lineAt(position).text.substr(0, position.character);
			const isInsideExposcallFirstArg = linePrefix.match(/exposcall\s*\(\s*[^,]*$/);

			if (isInsideExposcallFirstArg) {
				return undefined;
			}

			// 1. Types
			const types = ['int', 'str'];
			types.forEach(t => {
				const item = new vscode.CompletionItem(t, vscode.CompletionItemKind.TypeParameter);
				item.detail = 'ExpL Type';
				completionItems.push(item);
			});

			// 2. Constants
			const constNull = new vscode.CompletionItem('NULL', vscode.CompletionItemKind.Constant);
			constNull.detail = 'ExpL Null Constant';
			completionItems.push(constNull);

			// 3. Keywords
			const keywords = [
				'if', 'then', 'else', 'endif',
				'while', 'do', 'endwhile',
				'break', 'continue', 'return',
				'begin', 'end',
				'decl', 'enddecl', 'type', 'endtype',
				'main', 'AND', 'OR', 'NOT', 'breakpoint'
			];
			keywords.forEach(kw => {
				const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
				item.detail = 'ExpL Keyword';
				completionItems.push(item);
			});

			// 4. Built-in functions
			const functions = ['read', 'write', 'initialize', 'alloc', 'free', 'exposcall'];
			functions.forEach(fn => {
				const item = new vscode.CompletionItem(fn, vscode.CompletionItemKind.Function);
				item.detail = 'ExpL Built-in Function';
				if (fn === 'initialize' || fn === 'alloc' || fn === 'free') {
					item.insertText = new vscode.SnippetString(`${fn}();`);
				} else {
					item.insertText = new vscode.SnippetString(`${fn}($1);`);
					if (fn === 'exposcall') {
						item.command = { command: 'editor.action.triggerSuggest', title: 'Trigger Suggest' };
					}
				}
				completionItems.push(item);
			});

			// 5. Snippets for blocks and common constructs
			const ifSnippet = new vscode.CompletionItem('if', vscode.CompletionItemKind.Snippet);
			ifSnippet.insertText = new vscode.SnippetString('if (${1:condition}) then\n\t$0\nendif;');
			ifSnippet.detail = 'if block';
			ifSnippet.sortText = '0if1'; // Prioritize over keyword 'if'
			ifSnippet.preselect = true;
			completionItems.push(ifSnippet);

			const ifElseSnippet = new vscode.CompletionItem('if-else', vscode.CompletionItemKind.Snippet);
			ifElseSnippet.insertText = new vscode.SnippetString('if (${1:condition}) then\n\t$2\nelse\n\t$0\nendif;');
			ifElseSnippet.detail = 'if-else block';
			ifElseSnippet.sortText = '0if2'; // Next priority after 'if' block
			completionItems.push(ifElseSnippet);

			const whileSnippet = new vscode.CompletionItem('while', vscode.CompletionItemKind.Snippet);
			whileSnippet.insertText = new vscode.SnippetString('while (${1:condition}) do\n\t$0\nendwhile;');
			whileSnippet.detail = 'while block';
			whileSnippet.sortText = '0while'; // Prioritize over keyword 'while'
			whileSnippet.preselect = true;
			completionItems.push(whileSnippet);

			const typeSnippet = new vscode.CompletionItem('type', vscode.CompletionItemKind.Snippet);
			typeSnippet.insertText = new vscode.SnippetString('type\n\t${1:TypeName} {\n\t\t$0\n\t}\nendtype');
			typeSnippet.detail = 'type declaration';
			typeSnippet.sortText = '0type'; // Prioritize over keyword 'type'
			typeSnippet.preselect = true;
			completionItems.push(typeSnippet);

			const declSnippet = new vscode.CompletionItem('decl', vscode.CompletionItemKind.Snippet);
			declSnippet.insertText = new vscode.SnippetString('decl\n\t$0\nenddecl');
			declSnippet.detail = 'decl block';
			declSnippet.sortText = '0decl'; // Prioritize over keyword 'decl'
			declSnippet.preselect = true;
			completionItems.push(declSnippet);

			const mainSnippet = new vscode.CompletionItem('main', vscode.CompletionItemKind.Snippet);
			mainSnippet.insertText = new vscode.SnippetString('int main() {\n\tdecl\n\t\t$1\n\tenddecl\n\tbegin\n\t\t$0\n\t\treturn 0;\n\tend\n}');
			mainSnippet.detail = 'main function';
			mainSnippet.sortText = '0main'; // Prioritize over keyword 'main'
			mainSnippet.preselect = true;
			completionItems.push(mainSnippet);


			const breakSnippet = new vscode.CompletionItem('break', vscode.CompletionItemKind.Snippet);
			breakSnippet.insertText = new vscode.SnippetString('break;');
			breakSnippet.detail = 'break statement';
			// breakpointSnippet.sortText = '0breakpoint'; // Prioritize over keyword 'breakpoint'
			breakSnippet.preselect = true;
			completionItems.push(breakSnippet);

			const breakpointSnippet = new vscode.CompletionItem('breakpoint', vscode.CompletionItemKind.Snippet);
			breakpointSnippet.insertText = new vscode.SnippetString('breakpoint;');
			breakpointSnippet.detail = 'breakpoint statement';
			// breakpointSnippet.sortText = '0breakpoint'; // Prioritize over keyword 'breakpoint'
			breakpointSnippet.preselect = true;
			completionItems.push(breakpointSnippet);

			return completionItems;
		}
	});

	const exposcallCompletionProvider = vscode.languages.registerCompletionItemProvider('expl', {
		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
			const linePrefix = document.lineAt(position).text.substr(0, position.character);
			// Check if we are right after exposcall( or inside its first string argument
			const matchNoQuote = linePrefix.match(/exposcall\s*\(\s*[a-zA-Z]*$/);
			const matchOpenQuote = linePrefix.match(/exposcall\s*\(\s*"[^"]*$/);
			
			if (matchNoQuote || matchOpenQuote) {
				return syscalls.map((sys: any) => {
					// Display with quotes in suggestion list only if the user hasn't typed a quote yet
					const label = matchNoQuote ? `"${sys.name}"` : sys.name;
					const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Value);
					item.detail = `System Call: ${sys.name}`;
					let doc = `**${sys.name}**\n\nArguments:\n`;
					if (sys.arg1) { doc += `- arg1: ${sys.arg1}\n`; }
					if (sys.arg2) { doc += `- arg2: ${sys.arg2}\n`; }
					if (sys.arg3) { doc += `- arg3: ${sys.arg3}\n`; }
					item.documentation = new vscode.MarkdownString(doc);
					
					// Insert bare name if inside quotes, otherwise insert with quotes
					if (matchOpenQuote) {
						item.insertText = sys.name;
					} else {
						item.insertText = `"${sys.name}"`;
					}
					return item;
				});
			}
			return undefined;
		}
	}, '(', '"');

	const signatureHelpProvider = vscode.languages.registerSignatureHelpProvider('expl', {
		provideSignatureHelp(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.SignatureHelpContext) {
			const linePrefix = document.lineAt(position).text.substr(0, position.character);
			const match = linePrefix.match(/exposcall\s*\((.*)$/);
			if (!match) { return undefined; }

			const argsString = match[1];
			let commas = 0;
			let quoted = false;
			for (let i = 0; i < argsString.length; i++) {
				if (argsString[i] === '"') { quoted = !quoted; }
				if (argsString[i] === ',' && !quoted) { commas++; }
			}
			
			const activeParameter = commas;
			const signatureHelp = new vscode.SignatureHelp();
			
			const firstArgMatch = argsString.match(/^\s*"([^"]+)"/);
			let syscallName = null;
			if (firstArgMatch) {
				syscallName = firstArgMatch[1];
			}

			if (syscallName) {
				const sysInfo = syscalls.find((s: any) => s.name === syscallName);
				if (sysInfo) {
					const params = [];
					params.push(new vscode.ParameterInformation('fun_code: str', `System Call: ${sysInfo.name}`));
					if (sysInfo.arg1) { params.push(new vscode.ParameterInformation('arg1', sysInfo.arg1)); }
					if (sysInfo.arg2) { params.push(new vscode.ParameterInformation('arg2', sysInfo.arg2)); }
					if (sysInfo.arg3) { params.push(new vscode.ParameterInformation('arg3', sysInfo.arg3)); }
					
					const sigParamsStr = params.map((p: any) => p.label).join(', ');
					const signature = new vscode.SignatureInformation(`exposcall(${sigParamsStr})`, `Signature for ${sysInfo.name}`);
					signature.parameters = params;
					
					signatureHelp.signatures = [signature];
					signatureHelp.activeSignature = 0;
					signatureHelp.activeParameter = activeParameter;
					return signatureHelp;
				}
			}
			
			// Fallback signature
			const fallbackSig = new vscode.SignatureInformation('exposcall(fun_code, arg1, arg2, arg3)', 'Executes a system call');
			fallbackSig.parameters = [
				new vscode.ParameterInformation('fun_code', 'The system call name (e.g., "Write")'),
				new vscode.ParameterInformation('arg1', 'First argument'),
				new vscode.ParameterInformation('arg2', 'Second argument'),
				new vscode.ParameterInformation('arg3', 'Third argument')
			];
			signatureHelp.signatures = [fallbackSig];
			signatureHelp.activeSignature = 0;
			signatureHelp.activeParameter = activeParameter;
			
			return signatureHelp;
		}
	}, '(', ',');

	context.subscriptions.push(disposable, completionProvider, exposcallCompletionProvider, signatureHelpProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
