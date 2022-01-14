# pytestersuits README

pytestersuits is an extension that should be used to perform python test drivent development. It should mainly work for pytest.

## Features

### Test adder
You can add some tests to your python files. They will be automatically marked as todo.
Select a file and a name to create this test.

## Language support

### Add Test to File command
- Pytest (Python) ✅
- Vscode Extension Test Suit (Typescript) ✅

### Coverage Report UI
- Pytest (Python) ✅
- Vscode Extension Test Suit (Typescript) ❌

## Release Notes

### 1.0.0

Initial release of `pytestersuits`.
Adding command to add some tests

### 1.2.0

Fixing some issues on `Add Test to File` and adding a system to automaticlly create file.
Now, `Add Test to File` also auto import `pytest` (`import pytest`) when the module isn't already imported in python script.
<br>
Implmentation of a embeded UI to show you code test coverage with auto update on save.

### 1.2.2

Fixing an issue concerning `Add Test to File`.
New you can provide any type of name (with or without '.py', even with part of it), it will correctly add the file extension at the end.

### 2.0.0

Refactoring the hole app the develop the extension for multiple languages.
For the moment only python is handle (with pytest). But more will come ;)

### 2.1.0

Pytestersuits can now handle Typescript for 'Add Test to File'.

### 2.1.1

Fix test issue with file.

### 2.2.0

Refactor the code to handle multiple libraries instead of only one per language. <br>
Implement `pytest` for python and `vscode extension test suit` for typescript.

### 2.2.1

Changing file will now also change the displayed coverage report UI. <br>
If the used library don't handle coverage report UI, it will show an empty one.