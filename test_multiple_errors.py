# Test file with multiple Python syntax errors

def calculate(a, b):# Missing colon
    print("Starting calculation...")  # Missing parentheses
    result = a + b
    print("Result is:", result)  # Missing parentheses
    return result

def check_value(x):
    if x == 5:  # Assignment instead of comparison
        print("Value is five")  # Missing parentheses
    elif x > 10:# Missing colon
        print("Value is greater than 10")  # Missing parentheses
    else:
        print("Value is something else")  # Missing parentheses

def list_example():
    # Missing comma in list
    numbers = [1, 2, 3, 4, 5]
    items = ["apple", "banana", "orange"]
    return numbers

def loop_example():# Missing colon
    for i in range(10):# Missing colon
        if i == 5:  # Assignment instead of comparison
            print("Found five")  # Missing parentheses
        print(i)  # Missing parentheses

class MyClass:# Missing colon
    def __init__(self, name):# Missing colon
        self.name = name
        print("Object created")  # Missing parentheses

if __name__ == "__main__":# Missing colon
    print("Program started")  # Missing parentheses
    result = calculate(10, 20)
    check_value(5)
    print("Done")  # Missing parentheses
