/**
 * skillContent.js
 * Detailed curricula for specific skills mentioned in the "About" sections.
 */

export const subSkillContent = {
  "python": {
    name: "Python Mastery",
    icon: "🐍",
    description: `
#### The Genesis and Philosophy of Python
Python was conceived in the late 1980s by Guido van Rossum at Centrum Wiskunde & Informatica (CWI) in the Netherlands as a successor to the ABC language. Since its initial release in 1991, Python has evolved into one of the most widely used and influential programming languages in the world. Its core philosophy is summarized in the "Zen of Python" (PEP 20), which includes aphorisms such as "Beautiful is better than ugly," "Simple is better than complex," and "Readability counts."

#### Why Readability Matters in Python
Unlike many other languages that use curly braces or keywords to define blocks of code, Python uses indentation. This design choice forces a clean, uniform coding style across all Python projects. Readability is not just about aesthetics; it reduces the cost of program maintenance and makes it easier for teams to collaborate on complex codebases.

#### Versatility Across Domains
One of Python's greatest strengths is its versatility. It is not limited to a single domain. From building web servers with Django and Flask to performing complex scientific calculations with NumPy and SciPy, Python provides a unified platform. In recent years, it has become the de facto language for Artificial Intelligence and Machine Learning, thanks to deep-learning frameworks like TensorFlow and PyTorch.

#### The Ecosystem: Libraries and Frameworks
Python’s power is multiplied by its massive ecosystem of third-party libraries. The Python Package Index (PyPI) hosts hundreds of thousands of packages. This means that for almost any task—be it scraping a website, automating a spreadsheet, or encrypting a file—there is already a proven library available, allowing developers to avoid reinventing the wheel.

#### Python in Data Science and Analysis
Data scientists prefer Python for its ease of use and its powerful data manipulation libraries like Pandas. It allows them to transform raw, messy data into structured insights with just a few lines of code. The integration with visualization tools like Matplotlib and Seaborn makes it an all-in-one tool for data storytelling.

#### Automation and Scripting
For many, Python is the ultimate tool for automation. System administrators use it for managing servers, while office workers use it to automate repetitive tasks like moving files or generating reports. Its "batteries included" philosophy means it comes with a robust standard library that can handle file I/O, networking, and system calls out of the box.

#### The Evolution: Python 2 vs. Python 3
A significant milestone in Python's history was the transition from Python 2 to Python 3. Python 3 introduced major improvements and cleaned up the language, although it was not backwards compatible. Today, Python 3 is the standard, and the community has successfully migrated, bringing more performance and consistency to the language.

#### Interpretation vs. Execution
Python is an interpreted, high-level, general-purpose programming language. Interpretation means the code is executed line by line, which simplifies debugging and experimentation. While this can make it slower than compiled languages like C++ for some tasks, the developer productivity gains often far outweigh the performance hit for most applications.

#### Scaling Python for Enterprise
While Python is often called a "scripting language," it powers some of the largest enterprises in the world. Instagram, Dropbox, and Spotify are built heavily on Python. It scales through effective use of microservices, asynchronous programming (using library features like asyncio), and integration with high-performance C-extensions.

#### The Global Community and Open Source
Python’s growth is sustained by its vibrant, inclusive community. The Python Software Foundation (PSF) oversees the language, but thousands of volunteers contribute to its documentation, libraries, and core development. Events like PyCon bring developers together to share knowledge and shape the future of the language.

#### Starting Your Journey
Learning Python is about more than just syntax; it’s about learning to think algorithmically. Because the language stays out of your way, you can focus on solving the logic of the problem rather than fighting the nuances of the compiler. Whether you are a hobbyist or a professional developer, Python provides the tools to build your vision.
    `,
    roadmap: [
      { step: "Step 1: Introduction", detail: "What is Python & Environment Setup" },
      { step: "Step 2: Variables & Memory", detail: "Dynamic Typing, Pointers & References" },
      { step: "Step 3: Data Types", detail: "Primitives (Int, Float, Bool, String)" },
      { step: "Step 4: Operators", detail: "Arithmetic, Logical, and Bitwise" },
      { step: "Step 5: Control Flow", detail: "If/Else Statements and Boolean Logic" },
      { step: "Step 6: Loops", detail: "While Loops and For Loops" },
      { step: "Step 7: Lists (Arrays)", detail: "Mutable Sequences, Indexing & Slicing" },
      { step: "Step 8: Tuples & Sets", detail: "Immutable Sequences & Unique Collections" },
      { step: "Step 9: Dictionaries", detail: "Hash Maps & Key-Value Pairs" },
      { step: "Step 10: Functions", detail: "Def, Scope, Args, and Kwargs" },
      { step: "Step 11: File Handling", detail: "Open, Read, Write, Context Managers (With)" },
      { step: "Step 12: Error Handling", detail: "Try, Except, Finally, and Custom Exceptions" },
      { step: "Step 13: OOP Classes", detail: "Classes, Objects, and __init__" },
      { step: "Step 14: OOP Inheritance", detail: "Parent/Child Classes & Polymorphism" },
      { step: "Step 15: Magic Methods", detail: "Operator Overloading (__str__, __add__)" },
      { step: "Step 16: List Comprehensions", detail: "Functional generation of lists" },
      { step: "Step 17: Lambdas", detail: "Anonymous Functions, Map, Filter, Reduce" },
      { step: "Step 18: Generators", detail: "Yield keyword and Memory Efficiency" },
      { step: "Step 19: Decorators", detail: "Function Wrappers and Meta-programming" },
      { step: "Step 20: Modules & Packages", detail: "Imports, PyPI, and Virtual Environments" },
      { step: "Step 21: Regular Expressions", detail: "Pattern Matching with 're' module" },
      { step: "Step 22: Asyncio", detail: "Asynchronous programming (async/await)" },
      { step: "Step 23: Production APIs", detail: "Flask/FastAPI & Web Architecture" }
    ],
    resources: [
      { title: "Official Documentation", url: "https://docs.python.org/3/", type: "Docs" },
      { title: "Python for Beginners", url: "https://www.youtube.com/watch?v=kqtD5dpn9C8", type: "Video" }
    ],
    levels: [
      {
        title: "Foundations",
        topics: [
          {
            id: "py_vars",
            title: "Variables & Calculations",
            readingTime: "5 min",
            content: `
#### Introduction to Variables
Variables are the most basic building blocks of any Python program. Think of them as containers that hold information. In Python, you don't need to declare what *type* of data a variable holds; Python figures it out for you!

#### Key Concepts:
* **Assignment**: Use the \`=\` operator. Example: \`name = "Alice"\`
* **Dynamic Typing**: A variable can change from a number to a string easily.
* **Basic Math**: Python supports \`+\`, \`-\`, \`*\`, \`/\`, and even \`**\` for exponents.

\`\`\`python
# Example Code
age = 25
name = "Dev"
pi = 3.14159

# Calculations
result = (10 + 5) * 2 / 3
print(f"Hi {name}, the result is {result}")
\`\`\`
            `,
            quiz: {
              title: "Variables Quiz",
              questions: [
                {
                  id: 1,
                  question: "How do you assign the value 10 to a variable named 'x'?",
                  options: ["x == 10", "let x = 10", "x = 10", "10 -> x"],
                  answer: 2,
                  explanation: "In Python, the single '=' is the assignment operator."
                },
                {
                  id: 2,
                  question: "Which operator is used for exponents (powers) in Python?",
                  options: ["^", "**", "*", "pow"],
                  answer: 1,
                  explanation: "The ** operator is used for powers, e.g., 2 ** 3 = 8."
                }
              ]
            }
          },
          {
            id: "py_lists",
            title: "Lists & Collections",
            readingTime: "8 min",
            content: `
#### Working with Lists
Lists are ordered collections of items. They are extremely versatile and allow you to store multiple items in a single variable.

#### Operations:
* **Appending**: Adding to the end using \`.append()\`
* **Slicing**: Taking a part of a list using \`[:] \`
* **Indexing**: Accessing items by position (starting at 0).

\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits.append("date")

# Accessing the second item
print(fruits[1]) # Outputs: banana

# Slicing the first two
print(fruits[0:2])
\`\`\`
            `,
            quiz: {
              title: "Lists Quiz",
              questions: [
                {
                  id: 1,
                  question: "What is the index of the first item in a Python list?",
                  options: ["1", "-1", "0", "None"],
                  answer: 2,
                  explanation: "Python lists are zero-indexed."
                }
              ]
            }
          }
        ]
      },
      {
        title: "Advanced Concepts",
        topics: [
          {
            id: "py_oop",
            title: "Object Oriented Programming",
            readingTime: "12 min",
            content: `
#### Classes & Objects
OOP is a paradigm based on 'objects', which can contain data and code. Python is heavily object-oriented.

* **Class**: A blueprint for an object.
* **Init**: The constructor method \`__init__\`.
* **Self**: Refers to the current instance of the class.

\`\`\`python
class Robot:
    def __init__(self, name):
        self.name = name
    
    def greet(self):
        print(f"I am {self.name}, beep boop!")

my_bot = Robot("Antigravity")
my_bot.greet()
\`\`\`
            `,
            quiz: {
              title: "OOP Quiz",
              questions: [
                {
                  id: 1,
                  question: "What does 'self' represent in a class method?",
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "javascript": {
    name: "JavaScript Ecosystem",
    icon: "🟨",
    description: `
#### The Language of the Web
JavaScript (JS) is a lightweight, interpreted programming language. Initially created in 10 days in 1995 to add simple interactivity to web pages, it has grown into one of the most powerful and ubiquitous programming languages in the world. Today, JavaScript runs the modern web, powering everything from interactive UI components to complex server-side architectures.

#### The DOM and Interactivity
The true power of JavaScript in the browser lies in its ability to manipulate the Document Object Model (DOM). By treating an HTML document as a node tree, JavaScript can dynamically change content, styles, and structure in real-time without requiring a page reload, fundamentally enabling the "Web 2.0" revolution.

#### Single-Threaded but Asynchronous
JavaScript was designed to be single-threaded, meaning it can only execute one command at a time. However, it manages to handle complex, long-running tasks like fetching data from a server through an ingenious mechanism called the Event Loop. By using Callbacks, Promises, and Async/Await, developers can write non-blocking code that keeps the interface responsive.

#### ES6 and The Syntax Evolution
The release of ECMAScript 2015 (ES6) marked a massive shift in JavaScript's capabilities, introducing block-scoped variables (let/const), arrow functions, classes, template literals, and destructuring. These additions transformed JS from a scripting tool into a robust language suited for massive enterprise applications.

#### The Node.js Revolution
In 2009, Node.js liberated JavaScript from the browser by utilizing Google Chrome's V8 Javascript Engine. This allowed developers to use JavaScript to write server-side code, read/write to the file system, and build scalable APIs.

#### The Rise of Frameworks
Managing complex state and DOM updates with "Vanilla" JavaScript becomes unmanageable at scale. This led to the creation of frameworks and libraries like Angular, React, and Vue, which abstract away direct DOM manipulation and introduce component-based architecture.

#### Essential Modern Tooling
Modern JavaScript development relies heavily on a sophisticated toolchain. Package managers (NPM, Yarn) handle dependencies, Module Bundlers (Webpack, Vite) package code for production, and Transpilers (Babel) ensure modern syntax runs on older browsers.

#### The TypeScript Factor
While JavaScript is dynamically typed, the enterprise industry is heavily shifting towards TypeScript—a strict syntactical superset of JS that adds optional static typing. Mastering TypeScript is now a baseline requirement for senior JavaScript roles.

#### A Career in JavaScript
Choosing the JavaScript path guarantees you will never run out of things to learn. Whether you specialize as a Frontend UI engineer, a Backend API developer, or a Full-Stack architect, JavaScript provides a continuous, highly-compensated career trajectory.
    `,
    roadmap: [
      { step: "Step 1: Introduction", detail: "What is JavaScript? Engine execution basics." },
      { step: "Step 2: Variables", detail: "var, let, const & Memory Allocation" },
      { step: "Step 3: Primitives", detail: "Strings, Numbers, Booleans, Null, Undefined" },
      { step: "Step 4: Operators", detail: "Arithmetic, Logical, and Equality (== vs ===)" },
      { step: "Step 5: Control Flow", detail: "if/else, switch statements, and ternary operators" },
      { step: "Step 6: Loops", detail: "while, for, do/while, and break/continue" },
      { step: "Step 7: Arrays", detail: "Matrix data, indexes, and length properties" },
      { step: "Step 8: Array Methods", detail: "Push, pop, unshift, shift, splice, slice" },
      { step: "Step 9: Functions", detail: "Function declarations, expressions, & parameters" },
      { step: "Step 10: Scope & Closures", detail: "Lexical Scope & Persistent Variable Memory" },
      { step: "Step 11: Objects", detail: "Key-value pair dictionaries, properties, and the 'this' keyword" },
      { step: "Step 12: Object Iteration", detail: "for...in loops, Object.keys(), Object.values()" },
      { step: "Step 13: DOM Parsing", detail: "Document Object Model tree and window object" },
      { step: "Step 14: DOM Selection", detail: "getElementById, querySelector, and NodeLists" },
      { step: "Step 15: Event Listeners", detail: "Click, Change, Input events and Event Bubbling" },
      { step: "Step 16: ES6 Features", detail: "Arrow functions, template literals, destructuring" },
      { step: "Step 17: Functional Array Methods", detail: "map, filter, reduce, and forEach" },
      { step: "Step 18: Asynchronous Basics", detail: "Callbacks, The Event Loop, and Timers (setTimeout)" },
      { step: "Step 19: Promises", detail: "Then, catch, finally, and Promise chaining" },
      { step: "Step 20: Async/Await", detail: "Syntactical sugar for non-blocking asynchronous logic" },
      { step: "Step 21: Fetch API", detail: "Making HTTP requests (GET, POST) to external APIs" },
      { step: "Step 22: ES Modules", detail: "Import/Export logic and splitting code architectures" }
    ],
    resources: [
      { title: "MDN Web Docs: JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", type: "Docs" },
      { title: "JavaScript.info", url: "https://javascript.info/", type: "Textbook" },
      { title: "Eloquent JavaScript", url: "https://eloquentjavascript.net/", type: "Book" }
    ],
    levels: [
      {
        title: "JS Foundations",
        topics: [
          {
            id: "js_basics",
            title: "Variables & Types",
            readingTime: "5 min",
            content: "Learn how to store data using let, const, and var. Understand primitives like Strings, Numbers, and Booleans versus reference types like Objects and Arrays.",
            quiz: {
               title: "JS Variables Quiz",
               questions: [{ id: 1, question: "Which keyword is used to declare a variable that cannot be reassigned?", options: ["let", "var", "const", "static"], answer: 2, explanation: "'const' creates a read-only reference to a value." }]
            }
          }
        ]
      }
    ]
  },
  "react": {
    name: "React Architecture",
    icon: "⚛️",
    description: `
#### The Component Revolution
Developed by Facebook and released in 2013, React fundamentally changed how we build user interfaces. Instead of building monolithic pages, React introduced the concept of Component-Based Architecture—breaking down complex UIs into small, isolated, and reusable pieces of code.

#### Declarative vs Imperative
React is declarative. You design simple views for each state in your application, and React efficiently updates and renders just the right components when your data changes. This is a massive shift from imperative programming (like jQuery), where you manually find elements and mutate them.

#### The Virtual DOM
Direct DOM manipulation is slow. React solves this by maintaining a 'Virtual DOM' in memory. When state changes, React computes the difference (the "diff") between the new Virtual DOM and the old one, and then batches all the necessary updates to the real DOM in one highly optimized pass.

#### JSX: JavaScript XML
React popularized JSX, a syntax extension that allows developers to write HTML-like structures directly inside JavaScript files. While initially controversial, it has become the standard for describing what the UI should look like.

#### State and Props
Components communicate via "Props" (properties passed down from parent to child) and manage their own internal data using "State". Understanding the one-way data flow from top to bottom is the key to mastering React.

#### The Hooks Era
Introduced in React 16.8, Hooks allowed developers to use state and lifecycle features without writing ES6 Classes. Hooks like \`useState\` and \`useEffect\` lead to cleaner, more functional code and easier logic sharing across components.

#### Advanced State Management
For massive applications, passing props down 10 levels deep ("prop drilling") is inefficient. Developers turn to advanced data management tools like React Context API, Redux, or Zustand to manage global application state.

#### The Meta-Frameworks
React is technically just a UI library, not a full framework. For production applications, the industry relies on Meta-Frameworks like Next.js or Remix, which provide Routing, Server-Side Rendering (SSR), and Static Site Generation (SSG) out of the box.

#### Mastery
To conquer React is to understand immutability, render cycles, and optimization techniques (like useMemo). It is the most in-demand frontend skill globally, favored by startups and tech giants alike.
    `,
    roadmap: [
      { step: "Step 1: Introduction", detail: "What is React? The Virtual DOM & Reconciliation." },
      { step: "Step 2: Environment", detail: "Node, NPM, Vite, & Create React App" },
      { step: "Step 3: JSX", detail: "Writing HTML within JavaScript logic" },
      { step: "Step 4: Components", detail: "Functional vs Class Components (Legacy)" },
      { step: "Step 5: Props", detail: "Passing read-only data downward globally" },
      { step: "Step 6: State", detail: "Component memory via the useState Hook" },
      { step: "Step 7: Event Handling", detail: "onClick, onChange, and component interaction" },
      { step: "Step 8: Conditional Rendering", detail: "Ternary operators & Logical && rendering" },
      { step: "Step 9: Lists & Keys", detail: "Mapping arrays to JSX elements with unique Keys" },
      { step: "Step 10: Lifecycle & useEffect", detail: "Mounting, Updating, Unmounting phase handling" },
      { step: "Step 11: Forms & Controlled Inputs", detail: "Binding value to state dynamically" },
      { step: "Step 12: Context API", detail: "Avoiding prop-drilling with global contexts" },
      { step: "Step 13: Advanced Hooks", detail: "useReducer, useMemo, useCallback optimizations" },
      { step: "Step 14: Custom Hooks", detail: "Extracting reusable logic outside components" },
      { step: "Step 15: React Router", detail: "Client-side routing (SPAs) and dynamic URL params" },
      { step: "Step 16: Async Data Fetching", detail: "Fetch, Axios, and suspense mechanisms" },
      { step: "Step 17: Global State Libraries", detail: "Redux Toolkit, Zustand, or MobX" },
      { step: "Step 18: Form Libraries", detail: "React Hook Form for massive scaling validation" },
      { step: "Step 19: Component Libraries", detail: "Integrating Tailwind, MUI, or Chakra UI" },
      { step: "Step 20: Performance Tuning", detail: "React.memo, lazy loading, and code splitting" },
      { step: "Step 21: Next.js Ecosystem", detail: "Server-side rendering (SSR) & Static Generation" },
      { step: "Step 22: Deployment", detail: "Vercel, Netlify, and CI/CD for React apps" }
    ],
    resources: [
      { title: "React Dev (New Docs)", url: "https://react.dev/", type: "Docs" },
      { title: "Frontend Masters: React", url: "https://frontendmasters.com/courses/complete-react-v8/", type: "Course" },
      { title: "Josh W. Comeau JS", url: "https://www.joshwcomeau.com/react/", type: "Blog" }
    ],
    levels: [
      {
        title: "React Fundamentals",
        topics: [
          {
            id: "react_components",
            title: "Components & Props",
            readingTime: "8 min",
            content: "Components are the building blocks of React. Props let you pass data to them like arguments to a function.",
            quiz: {
               title: "React Props Quiz",
               questions: [{ id: 1, question: "Can a component mutate its own props?", options: ["Yes", "No"], answer: 1, explanation: "Props are read-only. A component must never modify its own props." }]
            }
          }
        ]
      }
    ]
  },
  "node.js": {
    name: "Node.js Backend Systems",
    icon: "🟢",
    description: `
#### JavaScript on the Server
Before 2009, JavaScript was strictly confined to the browser. Ryan Dahl created Node.js by taking the V8 JavaScript engine out of Chrome and providing it with system wrappers (like file access and networking). This allowed developers to build entire full-stack applications using a single language.

#### The Event-Driven, Non-Blocking Architecture
Node.js is famous for being incredibly fast for I/O-heavy workloads (like web servers or chat applications). It achieves this using a single-threaded, event-driven, non-blocking I/O model. Instead of waiting for a database query to finish, Node fires off the request and continues executing other code, handling the response via a callback or promise when it's ready.

#### NPM: The Largest Ecosystem
Node's success was supercharged by NPM (Node Package Manager). It is the largest ecosystem of open-source libraries in the world, containing over a million packages ranging from utility functions to massive web frameworks, enabling rapid development.

#### Building APIs with Express
While Node has a native 'http' module, almost all web servers in Node are built using Express.js or similar frameworks (like Fastify or NestJS). Express provides a minimal interface for defining routes, handling requests, and managing middleware.

#### Middleware and Security
Middleware functions are the backbone of a Node server. They are functions that have access to the request and response objects, allowing you to intercept traffic to perform tasks like Logging, Authentication (JWT), or CORS management before the route finishes executing.

#### The Monolith vs Microservices
Node is excellent for building monolithic REST APIs, but its lightweight nature makes it the premier choice for building Microservices—small, independent services that communicate over a network, often deployed via Docker containers.

#### Scaling Node
Because it is single-threaded, Node requires specific strategies to scale across multi-core systems, such as using the native \`cluster\` module, or deploying multiple instances behind a reverse proxy or load balancer like Nginx.

#### Becoming a Backend Engineer
Mastering Node requires more than just JavaScript syntax. It demands a deep understanding of HTTP protocols, RESTful architecture, database integration (SQL and NoSQL), and system security.
    `,
    roadmap: [
      { step: "Phase 1: Node Core", detail: "V8, Event Loop, File System & Modules" },
      { step: "Phase 2: The Server", detail: "Express, Routing, Middleware & REST" },
      { step: "Phase 3: Database Integrations", detail: "MongoDB, PostgreSQL & ORMs" },
      { step: "Phase 4: Production", detail: "Security, WebSockets, Docker & Scaling" }
    ],
    resources: [
      { title: "Node.js Official", url: "https://nodejs.org/en/docs/", type: "Docs" },
      { title: "Node Best Practices", url: "https://github.com/goldbergyoni/nodebestpractices", type: "GitHub Github" },
      { title: "Express.js Routing", url: "https://expressjs.com/en/guide/routing.html", type: "Docs" }
    ],
    levels: [
      {
        title: "Server Basics",
        topics: [
          {
            id: "node_express",
            title: "Intro to Express.js",
            readingTime: "10 min",
            content: "Express is a fast, unopinionated web framework for Node.js. It helps manage servers and routes.",
            quiz: {
               title: "Express Quiz",
               questions: [{ id: 1, question: "What is middleware in Express?", options: ["A database", "A function that has access to the request and response objects", "A frontend library", "A specific type of server"], answer: 1, explanation: "Middleware functions execute during the request-response cycle and can modify the req/res objects." }]
            }
          }
        ]
      }
    ]
  },
  "figma": {
    name: "Figma for Pros",
    icon: "🎨",
    description: `
#### The Paradigm of Modern Interface Design
Figma has revolutionized the way product teams design, prototype, and collaborate. Launched in 2016, it was the first major professional design tool to be entirely browser-based, a decision that fundamentally changed the speed and accessibility of the design process.

#### Vectors and the Canvas
At its core, Figma is a vector graphics editor. Unlike raster tools that work with pixels, vectors use mathematical formulas to define shapes, ensuring that your designs stay crisp and infinitely scalable, whether they are displayed on a smartwatch or a billboard.

#### Real-time Collaboration: The Game Changer
Figma is often called the "Google Docs of Design." It allows multiple designers to work in the same file simultaneously. This eliminates the need for manual versioning and "Final_v2_really_final" naming conventions, creating a single source of truth for the entire product team.

#### The Power of Components and Variants
Professional Figma users leverage Components to create reusable UI elements. When you change the master component, every instance across your project updates automatically. Variants allow you to group related components—like different states of a button (Hover, Pressed, Disabled)—into a single, organized unit.

#### Auto Layout and Responsive Design
Auto Layout is Figma’s most powerful layout engine. It allows you to create frames that grow or shrink as you add content. This mimics how developers write CSS (Flexbox), making the handoff from design to code significantly more accurate and intuitive.

#### Prototyping and Interaction
Beyond static screens, Figma allows you to build high-fidelity interactive prototypes. You can define transitions, animations, and complex user flows, allowing stakeholders to "feel" the product before any code is written.

#### Design Systems at Scale
For large organizations, Figma is the home of the Design System. It allows teams to publish libraries of styles and components, ensuring visual consistency across dozens of different products and platforms.

#### The Plugin and Widget Ecosystem
The Figma community has built thousands of plugins that automate repetitive tasks, from fetching real data to checking accessibility contrast ratios. This extensibility makes Figma a platform that can be tailored to any unique workflow.

#### From Design to Developer Handoff
Figma Bridge and Dev Mode have streamlined the gap between design and engineering. Developers can inspect properties, export assets, and even see snippets of CSS, Compose, or SwiftUI code directly from the design file.

#### Mastering the Craft
Becoming a pro in Figma is about more than knowing the shortcuts. It’s about understanding hierarchy, proximity, and visual communication. As the primary tool for UI/UX designers globally, mastering Figma is the first step toward a career in digital product design.
    `,
    roadmap: [
      { step: "Phase 1: Visual Base", detail: "Shapes, Layers, and Boolean Ops" },
      { step: "Phase 2: UI Systems", detail: "Components, Styles, and Libraries" },
      { step: "Phase 3: Logic & Flow", detail: "Auto Layout & Prototyping" },
      { step: "Phase 4: Design Ops", detail: "Tokens, Variables, and Dev Handoff" }
    ],
    resources: [
      { title: "Figma Community", url: "https://www.figma.com/community", type: "Community" },
      { title: "Figma Crash Course", url: "https://www.youtube.com/watch?v=jwNmEqJ05C4", type: "Video" }
    ],
    levels: [
      {
        title: "Interface Basics",
        topics: [
          {
            id: "f_layers",
            title: "Layers & Groups",
            readingTime: "4 min",
            content: "Learn how to organize your design canvas using layers, groups, and frames which are the foundation of Figma.",
            quiz: {
               title: "Layers Quiz",
               questions: [{ 
                 id: 1, 
                 question: "What is the shortcut to group elements?", 
                 options: ["Ctrl+G", "Ctrl+L", "Ctrl+B", "Ctrl+P"], 
                 answer: 0, 
                 explanation: "Use Group Selection (Ctrl/Cmd + G) to keep related layers together." 
                }]
            }
          }
        ]
      }
    ]
  },
  "seo": {
    name: "Search Engine Optimization",
    icon: "🔍",
    description: `
#### The Philosophy of Digital Discoverability
Search Engine Optimization (SEO) is the art and science of ensuring that digital content is discoverable by those searching for it. In a world with billions of web pages, SEO is what separates a visible brand from an invisible one.

#### How Search Engines Work
Search engines like Google use sophisticated spiders (crawlers) to index the web. They don't just look at keywords; they look at intent, authority, and user experience. Understanding how these algorithms "read" your site is the first step toward optimization.

#### On-Page vs. Off-Page SEO
On-Page SEO involves optimizing elements directly on your website, like titles, tags, and content. Off-Page SEO is about building authority through backlinks and social signals. A professional SEO strategy must balance both to achieve long-term success.

#### Technical SEO: The Silent Foundation
Technical SEO is about the "plumbing" of your site. Sitemaps, robots.txt, site speed, and mobile responsiveness are critical. If a search engine cannot crawl your site efficiently, even the best content in the world will remain hidden.

#### The Role of Content and Keywords
Keywords are the bridge between what people are searching for and the content you provide. Modern SEO has moved away from "keyword stuffing" toward semantic search—understanding the context and meaning behind a search query.

#### Analytics and Data-Driven Decisions
You cannot improve what you cannot measure. Tools like Google Search Console and Ahrefs provide data on how users find you. An SEO expert must be part analyst, interpreting this data to pivot strategies as algorithms evolve.

#### The Ever-Changing Landscape
Algorithm updates like "Core Web Vitals" keep SEOs on their toes. Staying relevant requires a commitment to continuous learning and an ability to adapt to changes in how AI and search engines interact with the web.
    `,
    roadmap: [
      { step: "Phase 1: Foundations", detail: "Keywords and On-Page Basics" },
      { step: "Phase 2: Tech SEO", detail: "Indexing, Crawling, and Speed" },
      { step: "Phase 3: Authority", detail: "Link Building and PR" },
      { step: "Phase 4: Analytics", detail: "Auditing and Strategy Scaling" }
    ],
    resources: [
      { title: "Google Search Central", url: "https://developers.google.com/search/docs", type: "Docs" },
      { title: "Ahrefs SEO Course", url: "https://ahrefs.com/academy/seo-training-course", type: "Academy" }
    ],
    levels: [
      {
        title: "On-Page SEO",
        topics: [
          {
            id: "seo_meta",
            title: "Meta Titles & Descriptions",
            readingTime: "6 min",
            content: "Meta tags are snippets of text that describe a page's content; they don't appear on the page itself, but only in the page's source code.",
            quiz: {
               title: "Meta Quiz",
               questions: [{ id: 1, question: "Where do meta tags appear?", options: ["In the body", "In the footer", "In the head section", "Only in Google Ads"], answer: 2, explanation: "Meta tags reside in the <head> of an HTML document." }]
            }
          }
        ]
      }
    ]
  },
  "network security": {
    name: "Network Security Architecture",
    icon: "🌐",
    description: `
#### The Perimeter has Dissolved
In the modern digital landscape, the concept of a traditional "secure perimeter" is obsolete. Network security today is about understanding the flow of packets, the nuances of protocols, and the persistent reality of the "Zero Trust" model.

#### The OSI Model: The Blueprint of Communication
To secure a network, one must first understand how it talks. The 7-layer OSI model provides the framework for understanding everything from physical cables (Layer 1) to high-level applications (Layer 7). 

#### Firewalls: The Gatekeepers
A firewall is the first line of defense. Modern Next-Generation Firewalls (NGFWs) perform Deep Packet Inspection (DPI) to identify malicious patterns within otherwise normal traffic.

#### The Art of Traffic Analysis
Security analysts use tools like Wireshark to perform packet captures, spotting unauthorized data exfiltration and diagnosing complex latency issues in real-time.
    `,
    roadmap: [
      { step: "Phase 1: Net-Plus", detail: "TCP/IP and Routing Basics" },
      { step: "Phase 2: Defender", detail: "Firewalls and ACLs" },
      { step: "Phase 3: Cryptologist", detail: "VPNs and Encryption" },
      { step: "Phase 4: Architect", detail: "Zero Trust Frameworks" }
    ],
    resources: [
      { title: "Wireshark University", url: "https://www.wireshark.org/docs/", type: "Tooling" },
      { title: "NetworkChuck Intro", url: "https://www.youtube.com/c/NetworkChuck", type: "Video" }
    ],
    levels: [
      {
        title: "Defending the Perimeter",
        topics: [
          {
            id: "net_firewall",
            title: "Firewalls & Rulesets",
            readingTime: "7 min",
            content: `#### What is a Firewall?
A firewall is a network security device that monitors incoming and outgoing network traffic and decides whether to allow or block specific traffic based on a defined set of security rules.

#### Rule Configuration:
* **Allow**: Permits traffic that matches specific criteria.
* **Deny/Drop**: Blocks traffic. 'Drop' sends no response, 'Deny' sends an 'unreachable' message.
* **Stateful Inspection**: Modern firewalls track the state of active connections.`,
            quiz: {
               title: "Firewall Quiz",
               questions: [{ id: 1, question: "Which firewall action provides the least information to a potential attacker?", options: ["Allow", "Deny", "Drop", "Forward"], answer: 2, explanation: "The 'Drop' command simply ignores the packet without sending a rejection notice, making it harder for scanners." }]
            }
          }
        ]
      }
    ]
  },
  "cryptography": {
    name: "Applied Cryptography",
    icon: "🔑",
    levels: [
      {
        title: "Encryption Fundamentals",
        topics: [
          {
            id: "crypto_rsa",
            title: "Public Key (RSA) Basics",
            readingTime: "10 min",
            content: `#### Asymmetric Encryption
Unlike symmetric encryption (one key), asymmetric encryption uses a **Key Pair**: a Public Key and a Private Key.

#### How it works:
1. **Public Key**: Shared with everyone. Used to *encrypt* data.
2. **Private Key**: Kept secret by the owner. Used to *decrypt* data.`,
            quiz: {
               title: "RSA Quiz",
               questions: [{ id: 1, question: "Which key is used to decrypt data in an asymmetric system?", options: ["Shared Key", "Public Key", "Private Key", "Master Key"], answer: 2, explanation: "The Private Key must remain secret and is used to decrypt data that was encrypted with the matching Public Key." }]
            }
          }
        ]
      }
    ]
  },
  "aws": {
    name: "AWS Infrastructure Mastery",
    icon: "☁️",
    description: `
#### The Cloud Revolution
AWS (Amazon Web Services) started in 2006 with just a few services, but it fundamentally changed how businesses operate. It moved IT from a "Capital Expense" (buying servers) to an "Operating Expense" (renting capacity), allowing startups to compete with giants.

#### Shared Responsibility Model
One of the most important concepts in AWS is the Shared Responsibility Model. AWS handles the "Security OF the Cloud" (physical data centers, hardware), while you are responsible for "Security IN the Cloud" (config, encryption, user access).

#### Global Infrastructure: Regions and Zones
AWS is divided into physical Regions around the world. Each Region has multiple Availability Zones (AZs). Designing for "High Availability" means spreading your application across these AZs so that even if a whole data center fails, your app stays online.

#### Compute: From Servers to Serverless
AWS offers a spectrum of compute power. EC2 gives you full control over virtual servers, while Lambda (Serverless) allows you to run code without managing any servers at all, scaling automatically to handle thousands of requests.

#### Storage: The Persistence Layer
S3 (Simple Storage Service) is the backbone of the internet, providing virtually unlimited object storage. For databases, RDS automates the heavy lifting of managing SQL engines, while DynamoDB provides lightning-fast NoSQL performance for global-scale apps.

#### Networking: The Virtual Private Cloud (VPC)
Your VPC is your private slice of the AWS cloud. Mastering Subnets, Route Tables, and Gateway configurations is essential for building secure, isolated environments for your applications.

#### Identity and Access Management (IAM)
IAM is the most critical service in AWS. It controls who can do what. The "Principle of Least Privilege"—giving people only the bare minimum access they need—is the golden rule for cloud security.

#### Cost Optimization and Scaling
Cloud isn't always cheaper unless it's optimized. Mastering Auto Scaling ensures you have exactly the power you need when you need it, while tools like AWS Cost Explorer help you spot and eliminate waste.

#### CloudFormation and IaC
Infrastructure as Code (IaC) allows you to define your entire server setup in a text file. Using AWS CloudFormation or Terraform, you can rebuild your entire global infrastructure in minutes with 100% consistency.

#### The Architect's Path
Becoming an AWS Certified Solutions Architect means learning to bridge the gap between business requirements and technical implementation. It’s about building systems that are not just functional, but resilient, secure, and cost-effective.
    `,
    roadmap: [
      { step: "Phase 1: Practitioner", detail: "Global Infrastructure & Core Services" },
      { step: "Phase 2: Associate", detail: "Scalability, S3, and VPC Networking" },
      { step: "Phase 3: Professional", detail: "Automation, DR, and Advanced Security" },
      { step: "Phase 4: Specialty", detail: "Deep-dives into Security, Data, or AI" }
    ],
    resources: [
      { title: "AWS Documentation", url: "https://docs.aws.amazon.com/", type: "Docs" },
      { title: "AWS Certified Cloud Course", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", type: "Video" }
    ],
    levels: [
      {
        title: "Compute & Storage",
        topics: [
          {
            id: "aws_ec2",
            title: "EC2 & S3 Fundamentals",
            readingTime: "15 min",
            content: `
#### Amazon EC2: The Virtual Server
Elastic Compute Cloud (EC2) provides resizable compute capacity in the cloud. It's the most widely used AWS service, allowing you to launch virtual servers (instances) in minutes.

#### Key Features:
* **Instances**: Choose from various types (t3.micro, m5.large) based on CPU/RAM needs.
* **AMI**: Amazon Machine Images are blueprints for your servers (e.g., Ubuntu, Amazon Linux).
* **Security Groups**: Virtual firewalls controlling traffic to your instances.

#### Amazon S3: Scalable Storage
Simple Storage Service (S3) is an object storage service offering industry-leading scalability, data availability, security, and performance.

#### S3 Concepts:
* **Buckets**: Containers for your data (objects). Names must be globally unique.
* **Objects**: Files and metadata.
* **Storage Classes**: Standard, IA (Infrequent Access), and Glacier for archiving.

Implementing these services correctly is the first step toward becoming a cloud architect. Most modern web apps use S3 for assets and EC2/Lambda for logic.
            `,
            quiz: {
              title: "AWS Basics Quiz",
              questions: [
                {
                  id: 1,
                  question: "Which AWS service is used for object storage?",
                  options: ["EC2", "RDS", "S3", "Lambda"],
                  answer: 2,
                  explanation: "S3 stands for Simple Storage Service and is used for object storage."
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "solidity": {
    name: "Solidity Smart Contract Dev",
    icon: "🔗",
    levels: [
      {
        title: "Contract Basics",
        topics: [
          {
            id: "sol_intro",
            title: "Solidity Syntax & Deployment",
            readingTime: "12 min",
            content: `
#### Writing Your First Smart Contract
Solidity is an object-oriented, high-level language for implementing smart contracts. It is influenced by C++, Python, and JavaScript and is designed to target the Ethereum Virtual Machine (EVM).

#### Core Concepts:
* **Pragma**: Defines the compiler version.
* **Contract**: Similar to a 'class' in other languages.
* **State Variables**: Variables whose values are permanently stored in contract storage.
* **Functions**: Executable units of code within a contract.

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public storedData;

    function set(uint256 x) public {
        storedData = x;
    }
}
\`\`\`

When you deploy this, it becomes immutable—the code cannot be changed once it's on the blockchain. This is why security auditing is critical in Web3.
            `,
            quiz: {
              title: "Solidity Quiz",
              questions: [
                {
                  id: 1,
                  question: "What does 'immutable' mean in the context of smart contracts?",
                  options: ["Can be changed easily", "Cannot be changed after deployment", "Can only be read", "Requires a password"],
                  answer: 1,
                  explanation: "Once a contract is deployed to the blockchain, its code is permanent and cannot be altered."
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "docker": {
    name: "Docker & Containerization",
    icon: "🐳",
    levels: [
      {
        title: "Container Basics",
        topics: [
          {
            id: "doc_intro",
            title: "Images, Containers, and Dockerfiles",
            readingTime: "10 min",
            content: `
#### Why Containers?
Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and ship it all out as one package.

#### The Big Three:
1. **Dockerfile**: A text document that contains all the commands a user could call on the command line to assemble an image.
2. **Image**: An executable package that includes everything needed to run an application—the code, a runtime, libraries, environment variables, and config files.
3. **Container**: A runtime instance of an image—what the image becomes in memory when actually executed.

#### Basic Commands:
* \`docker build -t my-app .\` : Build an image
* \`docker run my-app\` : Run the container
* \`docker ps\` : List running containers

Docker ensures that your app runs the same way on every machine, solving the "it works on my machine" problem.
            `,
            quiz: {
              title: "Docker Quiz",
              questions: [
                {
                  id: 1,
                  question: "What is the relationship between an image and a container?",
                  options: ["They are the same", "Container is a running instance of an image", "Image is a running instance of a container", "An image is a text file"],
                  answer: 1,
                  explanation: "An image is the blueprint, while a container is the actual running environment."
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "sql": {
    name: "SQL & Databases",
    icon: "🛢️",
    description: `
#### The Language of Data
Structured Query Language (SQL) is the standard language for dealing with Relational Databases. Since its inception in the 1970s, it has become the undeniable bedrock of data storage, retrieval, and analysis across the globe.

#### Relational Algebra
At its core, SQL is based on relational algebra and tuple relational calculus. Data is stored in tables (relations) consisting of rows (records) and columns (attributes). Understanding how to logically join these tables together is the essence of SQL mastery.

#### CRUD Operations
The foundation of backend engineering relies on CRUD: Create, Read, Update, and Delete. In SQL, this translates to the INSERT, SELECT, UPDATE, and DELETE commands. A developer must know how to execute these securely to prevent data corruption.

#### The Power of SELECT
While inserting data is straightforward, querying it is an art. Complex SELECT statements involving aggregations (GROUP BY), filtering (HAVING), and subqueries allow data scientists and engineers to pull highly specific insights from millions of rows in milliseconds.

#### Database Normalization
Designing a database requires normalization—organizing tables to reduce redundancy and improve data integrity. Knowing when to use 1NF, 2NF, and 3NF separates a junior developer from a data architect.

#### ACID Properties
Enterprise databases must guarantee ACID properties: Atomicity, Consistency, Isolation, and Durability. This ensures that even in the event of a power failure or system crash midway through a transaction, the database remains in a valid state.

#### Indexes and Performance
As tables grow to billions of rows, simple queries can severely slow down an application. Creating the right Indexes (B-Trees) and understanding Query Execution Plans ensures that data retrieval remains lightning fast.

#### Relational vs NoSQL
While NoSQL databases (like MongoDB) offer flexible schemas for unstructured data, SQL remains the gold standard for structured, transactional data where relationships and integrity are paramount (e.g., financial systems, HR records).

#### The Data Professional
Whether you are a Backend Engineer designing schemas, a Data Analyst plotting trends, or a DBA optimizing server performance, SQL is a mandatory, non-negotiable skill.
    `,
    roadmap: [
      { step: "Step 1: Introduction", detail: "Relational Theory and RDBMS concepts." },
      { step: "Step 2: Database Setup", detail: "Installing PostgreSQL, MySQL, or SQLite" },
      { step: "Step 3: Basic Querying", detail: "SELECT statements, AS aliases, and DISTINCT" },
      { step: "Step 4: Filtering Data", detail: "WHERE clauses with logical operators (AND, OR, NOT)" },
      { step: "Step 5: Sorting Results", detail: "ORDER BY ascending and descending logic" },
      { step: "Step 6: Limiting Scope", detail: "LIMIT, OFFSET, and TOP for paging" },
      { step: "Step 7: Aggregation Intro", detail: "COUNT, SUM, AVG, MIN, MAX functions" },
      { step: "Step 8: Grouping Data", detail: "GROUP BY clauses and HAVING for aggregated filters" },
      { step: "Step 9: Table Joins Intro", detail: "INNER JOIN syntax and foreign key logic" },
      { step: "Step 10: Outer Joins", detail: "LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN" },
      { step: "Step 11: Set Operations", detail: "UNION, INTERSECT, and EXCEPT combinations" },
      { step: "Step 12: Subqueries", detail: "Nested SELECT statements inside WHERE/SELECT" },
      { step: "Step 13: CTEs (Common Table Expressions)", detail: "WITH clauses for recursive and clean queries" },
      { step: "Step 14: Data Modification (DML)", detail: "INSERT INTO, UPDATE SET, and DELETE FROM" },
      { step: "Step 15: Schema Definition (DDL)", detail: "CREATE TABLE, DROP TABLE, ALTER TABLE" },
      { step: "Step 16: Data Types", detail: "VARCHAR, INT, DATE, BOOLEAN memory constraints" },
      { step: "Step 17: Constraints", detail: "PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK" },
      { step: "Step 18: Normalization", detail: "1NF, 2NF, 3NF to avoid redundancy" },
      { step: "Step 19: Indexing", detail: "B-Trees, CREATE INDEX, and query execution plans" },
      { step: "Step 20: Window Functions", detail: "OVER(), PARTITION BY, ROW_NUMBER(), RANK()" },
      { step: "Step 21: Transactions", detail: "ACID properties, BEGIN, COMMIT, ROLLBACK" },
      { step: "Step 22: Stored Procedures", detail: "Triggers, User-Defined Functions, and Admin logic" }
    ],
    resources: [
      { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", type: "Docs" },
      { title: "SQLBolt Interactive", url: "https://sqlbolt.com/", type: "Practice" },
      { title: "Database Design Course", url: "https://www.youtube.com/watch?v=ztHopE5Wnpc", type: "Video" }
    ],
    levels: [
      {
        title: "SQL Basics",
        topics: [
          {
            id: "sql_select",
            title: "The SELECT Statement",
            readingTime: "5 min",
            content: "The SELECT statement is used to select data from a database. The data returned is stored in a result table, called the result-set.",
            quiz: {
               title: "SELECT Quiz",
               questions: [{ id: 1, question: "Which SQL statement is used to extract data from a database?", options: ["EXTRACT", "GET", "OPEN", "SELECT"], answer: 3, explanation: "SELECT is the fundamental command for retrieving data." }]
            }
          }
        ]
      }
    ]
  }
};
