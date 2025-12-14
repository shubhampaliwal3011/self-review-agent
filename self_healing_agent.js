#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// ANSI color codes for professional CLI output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Professional logging functions
function log(emoji, label, message, color = colors.cyan) {
  console.log(`${color}${colors.bright}${emoji} ${label}:${colors.reset} ${message}`);
}

function logAgent(message) {
  log('🤖', 'AGENT', message, colors.cyan);
}

function logError(message) {
  log('❌', 'ERROR', message, colors.red);
}

function logFixing(message) {
  log('🛠️', 'FIXING', message, colors.yellow);
}

function logSuccess(message) {
  log('✅', 'DONE', message, colors.green);
}

function logInfo(message) {
  log('ℹ️', 'INFO', message, colors.blue);
}

// Error detector definitions
const errorDetectors = [
  {
    name: 'Print Without Parentheses',
    description: 'Python 2 style print statements',
    regex: /^(\s*)print\s+(?!.*\()(.*?)(\s*#.*)?$/gm,
    fix: (match, indent, statement, comment) => {
      const trimmedStatement = statement.trim();
      return `${indent}print(${trimmedStatement})${comment || ''}`;
    }
  },
  {
    name: 'Missing Colon',
    description: 'Missing colon after if/else/for/while/def/class/try/except',
    regex: /^(\s*)(if|elif|else|for|while|def|class|try|except|finally|with)\s+([^:]+?)(\s*)(?<!:)(\s*#.*)?$/gm,
    fix: (match, indent, keyword, condition, space, comment) => {
      // Skip if it already has a colon
      if (match.includes(':')) return match;
      // Handle 'else' separately (no condition)
      if (keyword === 'else') {
        return `${indent}${keyword}:${comment || ''}`;
      }
      // Place colon BEFORE comment
      return `${indent}${keyword} ${condition.trim()}:${comment || ''}`;
    }
  },
  {
    name: 'Assignment in Conditional',
    description: 'Using = instead of == in if statements',
    regex: /^(\s*)(if|elif|while)\s+(.+?)\s+=\s+([^=]+?)(\s*)(:?)(\s*#.*)?$/gm,
    fix: (match, indent, keyword, left, right, space, colon, comment) => {
      // Check if it's already == (skip if so)
      if (match.includes('==')) return match;
      // Replace single = with ==
      return `${indent}${keyword} ${left.trim()} == ${right.trim()}${colon}${comment || ''}`;
    }
  },
  {
    name: 'Missing Comma in List/Tuple',
    description: 'Missing comma between list or tuple elements',
    regex: /([\[,(]\s*)("[^"]*"|'[^']*'|\d+|\w+)\s+("[^"]*"|'[^']*'|\d+|\w+)/g,
    fix: (match, prefix, item1, item2) => {
      return `${prefix}${item1}, ${item2}`;
    }
  }
];

// Main self-healing function
function healPythonFile(filePath) {
  try {
    // Validate file exists
    if (!fs.existsSync(filePath)) {
      logError(`File not found: ${filePath}`);
      process.exit(1);
    }

    // Validate it's a Python file
    if (!filePath.endsWith('.py')) {
      logError('Only Python (.py) files are supported');
      process.exit(1);
    }

    logAgent(`Analyzing ${path.basename(filePath)}...`);
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    logInfo(`File size: ${content.length} bytes`);

    let fixedContent = content;
    const allErrors = [];
    let totalErrorsFound = 0;

    // Run each error detector
    errorDetectors.forEach(detector => {
      const matches = [];
      let match;
      const regex = new RegExp(detector.regex.source, detector.regex.flags);
      
      while ((match = regex.exec(fixedContent)) !== null) {
        matches.push({
          type: detector.name,
          match: match[0],
          line: fixedContent.substring(0, match.index).split('\n').length
        });
      }

      if (matches.length > 0) {
        allErrors.push({
          detector: detector.name,
          description: detector.description,
          count: matches.length,
          matches: matches
        });
        totalErrorsFound += matches.length;

        // Apply fixes - for comma fixes, apply iteratively until no more matches
        if (detector.name === 'Missing Comma in List/Tuple') {
          let previousContent;
          do {
            previousContent = fixedContent;
            fixedContent = fixedContent.replace(
              new RegExp(detector.regex.source, detector.regex.flags),
              detector.fix
            );
          } while (previousContent !== fixedContent);
        } else {
          // Apply fixes normally for other detectors
          fixedContent = fixedContent.replace(
            new RegExp(detector.regex.source, detector.regex.flags),
            detector.fix
          );
        }
      }
    });

    // Check for unmatched brackets/parentheses
    const bracketErrors = checkBracketMatching(fixedContent);
    let bracketErrorCount = 0;
    if (bracketErrors.length > 0) {
      allErrors.push({
        detector: 'Bracket Matching',
        description: 'Unmatched brackets, parentheses, or braces (detection only, cannot auto-fix)',
        count: bracketErrors.length,
        matches: bracketErrors
      });
      bracketErrorCount = bracketErrors.length;
      totalErrorsFound += bracketErrors.length;
    }

    if (totalErrorsFound === 0) {
      logSuccess('No syntax errors detected! Code looks good. 👍');
      return;
    }

    // Report findings
    logAgent(`DETECTED ERRORS - Found ${totalErrorsFound} issue(s) across ${allErrors.length} categories`);
    console.log('');
    
    allErrors.forEach(error => {
      console.log(`  ${colors.red}● ${error.detector}${colors.reset} - ${error.description}`);
      console.log(`    ${colors.yellow}Found ${error.count} occurrence(s)${colors.reset}`);
      error.matches.slice(0, 3).forEach(m => {
        const preview = m.match.substring(0, 60) + (m.match.length > 60 ? '...' : '');
        console.log(`    ${colors.cyan}Line ${m.line}:${colors.reset} ${preview}`);
      });
      if (error.matches.length > 3) {
        console.log(`    ${colors.dim}... and ${error.matches.length - 3} more${colors.reset}`);
      }
      console.log('');
    });

    // Calculate fixable errors (exclude bracket errors)
    const fixableErrorsCount = totalErrorsFound - bracketErrorCount;
    
    if (fixableErrorsCount > 0) {
      // Fix the issues
      logFixing(`Applying ${fixableErrorsCount} fix(es)...`);
      
      // Create backup
      const backupPath = `${filePath}.backup`;
      fs.writeFileSync(backupPath, content, 'utf8');
      logInfo(`Backup created: ${path.basename(backupPath)}`);

      // Write the fixed content
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      
      logSuccess(`Fixed ${fixableErrorsCount} error(s) in ${path.basename(filePath)}`);
      logSuccess('File has been healed! 🎉');
    }
    
    if (bracketErrorCount > 0) {
      console.log(`\n${colors.yellow}⚠️  WARNING: ${bracketErrorCount} bracket/quote error(s) detected but NOT fixed.${colors.reset}`);
      console.log(`${colors.yellow}    These require manual correction.${colors.reset}\n`);
    }

  } catch (error) {
    logError(`An error occurred: ${error.message}`);
    process.exit(1);
  }
}

// Check for unmatched brackets, parentheses, and braces
function checkBracketMatching(content) {
  const errors = [];
  const stack = [];
  const brackets = {
    '(': ')',
    '[': ']',
    '{': '}'
  };
  const lines = content.split('\n');
  
  lines.forEach((line, lineNum) => {
    // Skip comments and strings (simple approach)
    let inString = false;
    let stringChar = null;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      // Handle strings
      if ((char === '"' || char === "'") && (i === 0 || line[i-1] !== '\\')) {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = null;
        }
        continue;
      }
      
      if (inString) continue;
      
      // Check brackets
      if (brackets[char]) {
        stack.push({ char, line: lineNum + 1, col: i + 1 });
      } else if (Object.values(brackets).includes(char)) {
        if (stack.length === 0) {
          errors.push({
            match: line.trim(),
            line: lineNum + 1,
            type: `Unexpected closing '${char}'`
          });
        } else {
          const last = stack.pop();
          if (brackets[last.char] !== char) {
            errors.push({
              match: line.trim(),
              line: lineNum + 1,
              type: `Mismatched brackets: '${last.char}' and '${char}'`
            });
          }
        }
      }
    }
  });
  
  // Check for unclosed brackets
  stack.forEach(item => {
    errors.push({
      match: lines[item.line - 1].trim(),
      line: item.line,
      type: `Unclosed '${item.char}'`
    });
  });
  
  return errors;
}

// CLI Interface
function main() {
  console.log(`\n${colors.bright}${colors.magenta}╔═══════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}║   🤖 Python Self-Healing Agent 🛠️    ║${colors.reset}`);
  console.log(`${colors.bright}${colors.magenta}╚═══════════════════════════════════════╝${colors.reset}\n`);

  // Get file path from command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    logError('No file specified');
    console.log(`\n${colors.cyan}Usage:${colors.reset} node self_healing_agent.js <python_file.py>`);
    console.log(`${colors.cyan}Example:${colors.reset} node self_healing_agent.js hello.py\n`);
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  healPythonFile(filePath);
  
  console.log(''); // Empty line for clean output
}

// Run the agent
main();
