# Expl-Highlight

A simple VS Code extension for providing syntax highlighting and code snippets for the **ExpL (Experimental Language)**.

## Features

- **Syntax Highlighting**: Comprehensive coloring for keywords, types, identifiers, and literals in `.expl` files.
- **IntelliSense Snippets**: Smart completions for common ExpL constructs:
  - **Blocks**: `if-then-endif`, `while-do-endwhile`, `decl-enddecl`, and `type-endtype`.
  - **Main Function**: Quick generator for the `int main()` skeleton.
  - **Built-in Functions**: Autocomplete for `read()`, `write()`, `initialize()`, `alloc()`, and `free()` (including automatic semicolon and bracket handling).

> [!NOTE]
> This extension is primarily a **highlighter and snippet provider**. It does **not** include Language Server Protocol (LSP) features such as "Go to Definition", "Find References", or type checking.

## Installation

### Option 1: Install from VSIX (Recommended)

1. **Download**: Obtain the latest `.vsix` file from the **Releases** section of the repository.
2. **Install**:
   - **Via GUI**:
     - Open VS Code.
     - Go to the **Extensions** view (`Ctrl+Shift+X`).
     - Click on the **"..."** (Views and More Actions) menu in the top right of the Extensions sidebar.
     - Select **"Install from VSIX..."**.
     - Browse and select the downloaded `.vsix` file.
   - **Via Command Line**:
     - Run the following command:
       ```bash
       code --install-extension path/to/expl-highlight-x.x.x.vsix
       ```

### Option 2: Manual Installation

If you prefer to install from source:

1. **Clone**: Clone this repository to your local machine.
2. **Copy**: Copy the cloned folder to the VS Code extensions directory:
   - **Linux**: `~/.vscode/extensions/`
   - **Windows**: `C:\Users\USER_NAME\.vscode\extensions\`
   - **macOS**: `~/.vscode/extensions/`
3. **Restart**: Restart VS Code to activate the extension.

## Usage

Simply open any file with the `.expl` extension, and the highlighting and snippets will be active automatically. You can trigger snippets by typing keywords like `if`, `if-else`, `while`, `decl`, `type`, or `main` and selecting the snippet from the autocomplete list.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
