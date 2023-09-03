# Sqwerl Web Client

This application allows users to view and manage the things that make them smart.

The Sqwerl Web Client is a JavaScript application that runs in a web browser.
It allows us to share and keep track of the things that make us smart.

Sqwerl servers provide access to libraries of things, where a library is a named collection
of things. Every thing stored within a library of things must have:

1. A type
2. A name
3. A unique identifier

## 1. Type

All things stored within a library must have a type. Books, people, web pages, articles, and videos are all types of
things.

A thing's type defines the properties those types of things may have.
For example, books are a type of thing, and all things that are books have the
following properties:

- They must have a title
- They can have one or more authors
- They may have a collection of people who have read the book
- They may have a collection of people who are currently reading the book

## 2. Name
All things must have a name. Names are not unique, so more than one thing
can have the same name. For example, a book's name may be the same as the
name for the book's corresponding website or a book's picture.

## 3. ID
Each thing stored within a library has its own unique identifier.

For example, the unique identifier for the book "The Inmates are Running the Asylum"
by Alan Cooper is:

    </types/books/The Inmates are Running the Asylum>

A thing's identifier includes the identifier of the thing's type. For example, the identifier for the
book "The Inmates are Running the Asylum" includes the identifier for the thing's
type: '/types/books', indicating that the thing is a book.

A thing's identifier is a unique path to a file that defines the thing. That file specifies
the thing's properties and the values of those properties.

# Project scripts

This project provides the following scripts that you can run.

Using Yarn, you can run a script the following command.

    yarn <script-name>

Or with NPM, you can run a script with the following command.

    npm run <script-name>

where <script-name> can be one of the following:

* analyze-bundle
* build
* build:ci
* build:production
* build-css
* build-doc
* build-translations
* prepare
* standard
* start
* test
* test-all
* watch-css

### analyze-bundle
Shows where code in this project's bundle comes from. Runs the
[source map explorer](https://www.npmjs.com/package/source-map-explorer)
against this project's code.  

### build
Builds this project for execution during development.

### build:ci
Builds this project within a continuous integration environment. 

### build:production
Creates an optimized build of this project targeted to a production execution environment.

### build-css
Builds this project's CSS style sheets.

### build-doc
Generates documentation of this project's code.

### build-translations
Generates mapping between language- and locale-independent identifiers
to locale- and language-specific text.

### prepare
Uses the [Husky library](https://typicode.github.io/husky/) to install
[Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).
Which allows us to execute code when interacting with Git. For example, running scripts
that validate code before committing it to a Git repository.

### standard
Evaluates this project's code against the
[StandardJS Style Guide](https://standardjs.com/).

### start
Runs the Sqwerl Web Client application.

### test
Runs this project's automated unit and integration tests.

### test-all
Evaluates this project's source code before running unit and integration tests.

### watch-css
Runs an application that rebuilds CSS stylesheets whenever style rules change.

# Developer Guidelines
The following subsections provide guidelines for developers who want to better
understand or contribute to this project.

## Package Management Guidelines
We use the [Yarn Package Manager](https://yarnpkg.com/) to manage this project's dependencies.

You can use the [Node Package Manager](https://www.npmjs.com/) (NPM) instead. Please tell us if you have any issues
using NPM--Preferably by sending [pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
for any fixes you have made.

## Coding Style Guidelines

### TypeScript
This project's TypeScript code conforms to the [JavaScript Standard Style](https://standardjs.com/).

This project's **package.json** file contains scripts that allow developers to
evaluate this project's code compliance to JavaScript Standard Style.

To test this project's compliance to the JavaScript Standard Style, you can run the
following commands:

* For Yarn:
        
        yarn standard

* For NPM:
     
        npm run standard  

### CSS

We use [SASS](https://sass-lang.com/) to construct the Sqwerl client application's CSS style sheets.

This project's **package.json** file contains scripts to build CSS stylesheets from SASS content.
To generate CSS stylesheets, you can run the following commands:

* To build using Yarn: 

        yarn build-css

* To build using NPM:

        npm run build-css

This project stores a component's source code within individual folders. A component's
folder may contain that component's TypeScript code (stored within files whose names end with a **.ts** or **.tsx**).

A component's folder may&mdash;optionally&mdash;contain a file with a **scss** extension that contains the SASS
style rules. A component's style rules should be limited to applying only to that component's HTML and not globally to
all of an application's HTML. To do this, all rules in a component's style should be nested within a CSS selector that
applies only to that component. For example:

    /* Selector that selects particular components. */
    .parent-component {
       /* Selectors that apply to HTML within parent components. */
       & .child-component {
            /* ... */
       }
    }

The goal is to limit the scope of CSS changes, so that making changes to a single SCSS file,
doesn't cause unintended changes throughout an application's user interface. For more guidelines on managing CSS, see
[CSS for Large Projects and Large Teams](https://www.c-sharpcorner.com/article/css-for-large-projects-and-large-teams/)

This project does rely on global CSS rules to implement things like light and dark color
themes. If you need to add global style rules just remember that _with great power comes
great responsibility_.

For all identifiers, class names, and variables in CSS styles, use lower case only with hyphens replacing spaces.
For example:
* Correct
  ```
  .application-content-area {
    .left-pane {
      /* ... */
    }
  };
  ```

* Incorrect
  ```
  .ApplicationContentArea {
    .leftPane {
      /* ... */
    }
  }
  ```

## File Naming Guidelines

* The names of TypeScript source code files that contain TSX must end with **.tsx**
  
* The names of TypeScript source files that do not contain TSX must end with **.ts**

* The names of SASS source code files must end with **.scss**
  
* Source code file names should be in lower case only, with hyphens used instead of spaces to separate words.
  For example:
    * Correct:
        ```
        application-content-area.jsx
        application-content-area.scss
        application-utilities.js
        ```

    * Incorrect
        ```
        ApplicationContentArea.jsx
        ApplicationContentArea.scss
        ApplicationUtilities.js
        ```

## Branching Guidelines

This project follows the branching strategy outlined in [An Efficient Git Branching Strategy Every
Developer Should
Know](https://medium.com/better-programming/efficient-git-branching-strategy-every-developer-should-know-f1034b1ba041)

* The **main** branch--often called the **master** branch in many projects--is the branch that
is released to production.
    * The **main** branch should always be ready to be released to production.

* The **develop** branch contains code targeted for the next release.
    * Developers create new feature branches from the **develop** branch for the features they are currently working on.
    * Developers will merge changes in the **develop** branch onto the **main** branch before releasing to production.

* Developers create *feature* branches to hold their work.
    * Once a developer has finished working on a *feature* branch,
    the developer will create a merge request.
    * Once someone approves the merge request, the developer will merge the *feature* branch
    to the **develop** branch.
