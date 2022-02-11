# pytestersuits README

VSCode extension to make testing much more simple and intuitive.

<a href='https://ko-fi.com/e_jacques' target='_blank' title='support: https://ko-fi.com/e_jacques'>
  <img height='24' style='border:0px;height:20px;' src='https://az743702.vo.msecnd.net/cdn/kofi3.png?v=2' alt='https://ko-fi.com/e_jacques' /></a>

## Features

### Test adder
You can add some tests to your python files. They will be automatically marked as todo.
Select a file and a name to create this test.

### Coverage report UI
You can vizualise your tests coverage reports inside Vscode. <br>
You can also directly open the untested lines by click on the button taht appear when hovering the item inside the side menu.

## Language support

### Add Test to File command
- Pytest (Python) ✅
- Vscode Extension Test Suit (Typescript) ✅
- Jest (Javascript) ✅
- JUnit (Java) ✅

### Coverage Report UI
- Pytest (Python) ✅
- Vscode Extension Test Suit (Typescript) ❌
- Jest (Javascript) ❌
- JUnit (Java) ❌

## Configuration

### Language default library

To add test you have two possible options:
- First one, you set the default language library to `Choose each time`. This way you will be able to select the library you want to use each time you run the command.
- Seconde choice, you select a specific library and, in this case, you won't be able to change it. 
<br>
<br>
Keep in mind that if you select `Choose each time`, you won't be able to have the coverage report UI.

### Delimiter

You can set your own delimiter to split the different tests the using `Add Test to File`.

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

### 2.2.2

You can now add multiple test at once by passing a delimiter.

### 2.2.3

You can now customize the delimiter used to add multiple tests at once.

### 2.3.0

Jest (Javascript) is now handled by pytestersuits.

### 2.4.0

JUnit (Java) is now handled by pytestersuits.

### 2.4.1

Solving issues concerning JUnit (Java) with package and overriding import from different path.<br>
Default JUnit path for import is now more common.