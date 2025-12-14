# 🤖 Python Self-Healing Agent

A professional CLI tool that automatically detects and fixes common Python syntax errors.

## ✨ Features

The agent can detect and fix:

1. **Print Without Parentheses** - Python 2 style print statements
   - `print "hello"` → `print("hello")`

2. **Missing Colons** - After control structures and function definitions
   - `if x > 5` → `if x > 5:`
   - `def foo()` → `def foo():`

3. **Assignment in Conditionals** - Using `=` instead of `==`
   - `if x = 5:` → `if x == 5:`

4. **Missing Commas** - In lists and tuples
   - `[1 2 3]` → `[1, 2, 3]`

5. **Bracket Matching** - Detects unmatched `()`, `[]`, `{}`

## 🚀 Usage

```bash
node self_healing_agent.js <python_file.py>
```

### Examples:

```bash
# Fix a broken Python file
node self_healing_agent.js test_multiple_errors.py

# Check a file for errors
node self_healing_agent.js hello.py

# Works with any Python file
node self_healing_agent.js my_script.py
```

## 📋 Output

The agent provides professional CLI output with:
- 🤖 **AGENT**: Analysis and detection messages
- ℹ️ **INFO**: File information and backup creation
- ❌ **ERROR**: Error messages
- 🛠️ **FIXING**: Fix application status
- ✅ **DONE**: Success messages

## 🔒 Safety Features

- **Automatic Backup**: Creates a `.backup` file before making any changes
- **Validation**: Only works on `.py` files
- **Error Detection**: Shows detailed report of all issues found
- **Non-destructive**: Original file is preserved as backup

## 📊 Example Output

```
╔═══════════════════════════════════════╗
║   🤖 Python Self-Healing Agent 🛠️    ║
╚═══════════════════════════════════════╝

🤖 AGENT: Analyzing test_multiple_errors.py...
ℹ️ INFO: File size: 1283 bytes
🤖 AGENT: DETECTED ERRORS - Found 23 issue(s) across 4 categories

  ● Print Without Parentheses - Python 2 style print statements
    Found 10 occurrence(s)
    Line 3: print "Starting calculation..."
    ...

🛠️ FIXING: Applying 23 fix(es)...
ℹ️ INFO: Backup created: test_multiple_errors.py.backup
✅ DONE: Fixed 23 error(s) in test_multiple_errors.py
✅ DONE: File has been healed! 🎉
```

## 🔧 Technical Details

- Built with Node.js
- Uses regex-based pattern matching
- Implements multiple error detectors
- Professional ANSI color output
- No external dependencies (uses standard Node.js modules)

## 📝 Notes

- The agent is designed for **Python files only**
- Creates a backup with `.backup` extension
- Works on any Python file, not just specific files
- Focuses on common syntax errors that prevent code execution
