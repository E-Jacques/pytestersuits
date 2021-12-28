# pytestersuits README

pytestersuits is an extension that should be used to perform python test drivent development. It should mainly work for pytest.

## Features

### Test adder
You can add some tests to your python files. They will be automatically marked as todo.
Select a file and a name to create this test.

## Requirements

Pytest need to be used to perform the different tests.

## Release Notes

Users appreciate release notes as you update your extension.

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

