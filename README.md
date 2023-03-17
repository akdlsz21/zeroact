# zeroact

# Functions

## createElement

akes in a type (a string representing the element type), props (an object of
element properties), and children (an array of child elements or text nodes). It
returns an object representing the element. If the child is not an element, it
is converted to a text node using the createTextElement function.

## render

The render function takes in an element and a container, and it renders the
element into the container using a recursive algorithm. It also uses the
performUnitOfWork and workLoop functions to handle updates in a non-blocking
way.

## performUnitOfWork

This function is not implemented yet, but it is supposed to do something with
the nextUnitOfWork.

# Example

An example usage of the Zeroact library is provided at the end of the file.
![image](https://user-images.githubusercontent.com/81629070/225825432-73e6d930-22b5-42d2-b307-832c26d30ba5.png)

