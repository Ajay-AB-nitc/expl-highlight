// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "expl-highlight" is now active!');

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

	context.subscriptions.push(disposable, completionProvider);
}

// This method is called when your extension is deactivated
export function deactivate() {}
