#Ways of declaring functions in Python

##The traditional way
This is the traditional function declaration in Python:

    def x():
        return 5

And, of course, it can be paramaterized:

    def square(x):
        return x**2

Sometimes, though, it just doesn't suit your needs.

##Lambda functions
Functions can also be declared like this:

    x = lambda: 5 * 2
    
They can be paramaterized with:

    square = lambda x: x**2
    
This can be invoked as normally:

    print(square(5)) # Returns 25

This is both valid Python 2 and valid Python 3.