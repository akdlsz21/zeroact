# zeroact

# Functions

## createElement

akes in a type (a string representing the element type), props (an object of
element properties), and children (an array of child elements or text nodes). It
returns an object representing the element. If the child is not an element, it
is converted to a text node using the createTextElement function.

## render

The render function takes an element and a container as arguments and sets up
the Fiber tree with a wipRoot object that holds the root element, its
properties, and its children. It also sets the nextUnitOfWork to the wipRoot,
which will start the rendering process.

## performUnitOfWork

The performUnitOfWork function takes a fiber and either updates its properties
or creates new elements if it's the first time the fiber is being processed. It
then returns the next fiber to be processed, starting from the first child, then
the next sibling, and finally the parent.

## workLoop

The workLoop function runs continuously until there are no more units of work to
perform. It uses requestIdleCallback to schedule itself to run when the browser
is idle. Each iteration of the loop processes a single fiber using the
performUnitOfWork function, which updates the DOM by creating new elements,
updating existing ones, and deleting old ones. When the loop is finished, it
commits the changes to the DOM with the commitRoot function.

## reconcileChildren

The reconcileChildren function takes a wipFiber and an array of elements as
arguments and iterates over them, comparing the old fiber to the new element and
updating it if they have the same type. If the old fiber doesn't exist or has a
different type, it creates a new fiber with the element and sets its effectTag
to PLACEMENT. If the old fiber exists but has a different type, it sets its
effectTag to DELETION, which will be handled by the commitWork function. If the
old fiber exists and has the same type, it updates its properties and sets its
effectTag to UPDATE.

## updateFunctionComponent

The updateFunctionComponent function calls the function component with its props
and returns the next fiber to be processed, starting with the first child.

# Example

An example usage of the Zeroact library is provided at the end of the file.
