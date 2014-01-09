# NWMatcher

A fast CSS selector engine and matcher.


## Install

To include NWMatcher in a standard web page:

    <script type="text/javascript" src="nwmatcher.js"></script>

In nodeJS:

$ npm install nwmatcher.js


## Notes

NWMatcher currently supports browsers and headless environments.


# Supported selectors

Here is a list of all the CSS2/CSS3 [Supported selectors](https://github.com/dperini/nwmatcher/wiki/CSS-supported-selectors).

# Features and compliance

You can read more about NWMatcher [Features and compliance](https://github.com/dperini/nwmatcher/wiki/Features-and-compliance).


# DOM Selection API

*first( selector, context )*
>return a reference to the first element matching the selector starting at context

*match( element, selector, context )*
>return true if the element matches the selector, return false otherwise, starting at context

*select( selector, context, callback )*
>return an array of all the elements matching the selector starting at context, if available invoke the callback for each element


# DOM Helpers API

*byId( id, from )*
>return a reference to the first element matching the ID

*byTag( tag, from )*
>return an array of element having the specified tag name

*byClass( class, from )*
>return an array of element having the specified class name

*byName( name, from )*
>return an array of element having the specified name attribute

*getAttribute( element, attribute )*
>return the value read from the element attribute as a string

*hasAttribute( element, attribute )*
>return true if the element has the attribute set, return false otherwise


# Engine Configuration

*configure( options )*

>the following 'flags' exists and can be set to true/false:

* CACHING: enable/disable caching of results
* SHORTCUTS: allow accepting mangled selectors
* SIMPLENOT: allow nested complex :not() selectors
* UNIQUE_ID: allow multiple elements with same ID
* USE_QSAPI: enable native querySelectorAll if available
* USE_HTML5: enable/disable special HTML5 rules (checked/selected)
* VERBOSITY: enable/disable throwing of errors or just console warnings

>Example: configure( { USE_QSAPI: false, VERBOSITY: false } );


*registerOperator( symbol, resolver )*

>register a new symbol and its matching resolver in the Operators table

>Example: NW.Dom.registerOperator( '!=', 'n!="%m"' );

*registerSelector( name, rexp, func )*

>register a new selector, the matching RegExp and the appropriate resolver function in the Selectors table


